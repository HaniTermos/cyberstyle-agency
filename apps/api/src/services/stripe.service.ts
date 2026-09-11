import Stripe from 'stripe';
import { prisma } from '../config/db';
import { emailQueue } from '../queues/email.queue';
import { logAudit } from '../utils/auditLogger';
import { InvoiceStatus, PaymentStatus, PaymentMethod } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key', {
  apiVersion: '2025-01-27.acacia' as any,
});

export class StripeService {
  /**
   * Generates a Stripe Checkout session for a specific invoice
   */
  static async createInvoiceCheckoutSession(
    invoiceId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ checkoutUrl: string; sessionId: string }> {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { organization: true, lineItems: true },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status === InvoiceStatus.PAID) {
      throw new Error('Invoice is already settled');
    }

    // Convert total to cents for Stripe
    const unitAmountCents = Math.round(Number(invoice.totalAmount) * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: invoice.organization.name ? undefined : undefined,
      line_items: [
        {
          price_data: {
            currency: invoice.currency.toLowerCase(),
            product_data: {
              name: `CYBERSTYLE LLC — Invoice ${invoice.invoiceNumber}`,
              description: `Payment for ${invoice.organization.name} deliverables`,
            },
            unit_amount: unitAmountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        organizationId: invoice.organizationId,
      },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    // Save Stripe checkout metadata to invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        stripeHostedUrl: session.url || undefined,
        stripeInvoiceId: session.id,
      },
    });

    return {
      checkoutUrl: session.url || '',
      sessionId: session.id,
    };
  }

  /**
   * Idempotently processes a verified Stripe checkout webhook event
   */
  static async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const invoiceId = session.metadata?.invoiceId;
    if (!invoiceId) {
      console.warn('⚠️ Stripe webhook missing invoiceId metadata:', session.id);
      return;
    }

    // Atomic transaction for payment settlement and invoice status update
    await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({ where: { id: invoiceId } });
      if (!invoice) return;

      // Idempotency check: if already marked paid, skip duplicate processing
      if (invoice.status === InvoiceStatus.PAID) {
        console.log(`ℹ️ Invoice ${invoice.invoiceNumber} is already marked PAID. Skipping duplicate webhook.`);
        return;
      }

      const amountPaidDecimal = (session.amount_total || 0) / 100;

      // 1. Update Invoice to PAID
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          status: InvoiceStatus.PAID,
          amountPaid: amountPaidDecimal,
          amountDue: 0.0,
          paidAt: new Date(),
          stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : undefined,
        },
      });

      // 2. Create Payment Record
      const payment = await tx.payment.create({
        data: {
          invoiceId,
          amount: amountPaidDecimal,
          currency: (session.currency || 'USD').toUpperCase(),
          status: PaymentStatus.SUCCEEDED,
          paymentMethod: PaymentMethod.STRIPE,
          provider: 'stripe',
          transactionId: typeof session.payment_intent === 'string' ? session.payment_intent : session.id,
          notes: session.url || undefined,
        },
      });

      // 3. Log Audit
      await logAudit({
        action: 'INVOICE_PAYMENT_SUCCEEDED',
        entityType: 'Invoice',
        entityId: invoiceId,
        changes: {
          invoiceNumber: invoice.invoiceNumber,
          amountPaid: amountPaidDecimal,
          paymentId: payment.id,
          provider: 'stripe',
        },
      });
    });

    // 4. Queue Receipt Email to Client
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { organization: { include: { members: { include: { user: true } } } } },
    });

    if (invoice && invoice.organization.members.length > 0) {
      const clientEmail = invoice.organization.members[0]?.user.email;
      if (clientEmail) {
        try {
          await emailQueue.add('send-payment-receipt', {
            to: clientEmail,
            subject: `Payment Receipt: CYBERSTYLE LLC Invoice ${invoice.invoiceNumber}`,
            template: 'payment_received',
            variables: {
              invoiceNumber: invoice.invoiceNumber,
              amount: invoice.totalAmount,
              currency: invoice.currency,
              paidAt: new Date().toLocaleDateString(),
            },
          });
        } catch (queueErr) {
          console.warn('⚠️ Could not queue receipt email:', queueErr);
        }
      }
    }
  }
}
