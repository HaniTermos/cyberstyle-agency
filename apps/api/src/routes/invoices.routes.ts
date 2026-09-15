import { Router, Request, Response, NextFunction } from 'express';
import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../config/db';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { StripeService } from '../services/stripe.service';
import { logAudit } from '../utils/auditLogger';
import { UserRole, InvoiceStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock_stripe_key', {
  apiVersion: '2025-01-27.acacia' as any,
});

// ==============================================================================
// 1. STRIPE WEBHOOK (Raw Body - Must be before standard JSON parsers if scoped)
// ==============================================================================

router.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';

    let event: Stripe.Event;

    try {
      if (typeof sig !== 'string') {
        throw new Error('Missing stripe-signature header');
      }
      // Verify Stripe signature
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error('❌ Stripe webhook signature verification failed:', err.message);
      res.status(400).json({ error: 'Webhook signature verification failed' });
      return;
    }

    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        await StripeService.handleCheckoutSessionCompleted(session);
      }

      res.status(200).json({ received: true });
    } catch (error: any) {
      console.error('❌ Error handling Stripe webhook event:', error);
      res.status(500).json({ error: 'Webhook processing error' });
    }
  }
);

// ==============================================================================
// 2. INVOICE MANAGEMENT & CHECKOUT ENDPOINTS
// ==============================================================================

const CreateInvoiceSchema = z.object({
  organizationId: z.string(),
  projectId: z.string().optional(),
  currency: z.string().default('USD'),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.number().int().positive().default(1),
      unitPrice: z.number().positive(),
    })
  ).min(1),
  taxRate: z.number().min(0).max(100).default(0),
  discountAmount: z.number().min(0).default(0),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  paymentTerms: z.string().default('NET30'),
  notes: z.string().optional(),
});

/**
 * @route   POST /api/invoices
 * @desc    Admin: Create new invoice with line items
 */
router.post(
  '/',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const data = CreateInvoiceSchema.parse(req.body);

      const subtotal = data.lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
      const taxAmount = (subtotal * data.taxRate) / 100;
      const totalAmount = Math.max(0, subtotal + taxAmount - data.discountAmount);

      const count = await prisma.invoice.count();
      const invoiceNumber = `CS-INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          organizationId: data.organizationId,
          projectId: data.projectId,
          status: InvoiceStatus.DRAFT,
          currency: data.currency,
          subtotal,
          taxRate: data.taxRate,
          taxAmount,
          discountAmount: data.discountAmount,
          totalAmount,
          amountPaid: 0,
          amountDue: totalAmount,
          issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
          dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          paymentTerms: data.paymentTerms,
          notes: data.notes,
          createdById: req.user.id,
          lineItems: {
            create: data.lineItems.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          lineItems: true,
          organization: true,
        },
      });

      await logAudit({
        userId: req.user.id,
        action: 'INVOICE_CREATED',
        entityType: 'Invoice',
        entityId: invoice.id,
        changes: { invoiceNumber, totalAmount },
        req,
      });

      res.status(201).json({ status: 'success', data: { invoice } });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/invoices/:id/checkout
 * @desc    Client/Admin: Generate Stripe hosted checkout session link
 */
router.post('/:id/checkout', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    const result = await StripeService.createInvoiceCheckoutSession(
      id,
      `${appUrl}/portal/invoices?status=success`,
      `${appUrl}/portal/invoices?status=cancelled`
    );

    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/invoices/:id/manual-payment
 * @desc    Admin: Record wire transfer or manual cash settlement
 */
router.post(
  '/:id/manual-payment',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { amount, transactionId, notes } = z
        .object({
          amount: z.number().positive(),
          transactionId: z.string().optional(),
          notes: z.string().optional(),
        })
        .parse(req.body);

      const invoice = await prisma.invoice.findUnique({ where: { id } });
      if (!invoice) {
        res.status(404).json({ status: 'error', code: 'INVOICE_NOT_FOUND', message: 'Invoice not found' });
        return;
      }

      await prisma.$transaction(async (tx) => {
        await tx.invoice.update({
          where: { id },
          data: {
            status: InvoiceStatus.PAID,
            amountPaid: amount,
            amountDue: 0.0,
            paidAt: new Date(),
          },
        });

        await tx.payment.create({
          data: {
            invoiceId: id,
            amount,
            currency: invoice.currency,
            status: PaymentStatus.SUCCEEDED,
            paymentMethod: PaymentMethod.BANK_TRANSFER,
            provider: 'manual_wire',
            transactionId: transactionId || `MANUAL-${Date.now()}`,
            notes,
          },
        });
      });

      await logAudit({
        userId: req.user.id,
        action: 'INVOICE_MANUAL_PAYMENT_RECORDED',
        entityType: 'Invoice',
        entityId: id,
        changes: { amount, transactionId, notes },
        req,
      });

      res.status(200).json({ status: 'success', message: 'Manual payment recorded successfully' });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/invoices
 * @desc    Get all invoices (Admin: all, Client: only their organization)
 */
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const where: any = {};

    if (user.role === UserRole.CLIENT) {
      const orgId = user.clientProfile?.organizationId;
      if (!orgId) {
        res.status(200).json({ status: 'success', data: { invoices: [] } });
        return;
      }
      where.organizationId = orgId;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true,
        project: true,
        lineItems: true,
      },
    });

    res.status(200).json({ status: 'success', data: { invoices } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/invoices/:id
 * @desc    Get invoice details
 */
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        organization: true,
        project: true,
        lineItems: true,
        payments: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ status: 'error', code: 'INVOICE_NOT_FOUND', message: 'Invoice not found' });
      return;
    }

    if (req.user.role === UserRole.CLIENT && invoice.organizationId !== req.user.clientProfile?.organizationId) {
      res.status(403).json({ status: 'error', code: 'FORBIDDEN', message: 'Unauthorized invoice access' });
      return;
    }

    res.status(200).json({ status: 'success', data: { invoice } });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/invoices/:id/pdf
 * @desc    Download / view invoice PDF
 */
router.get('/:id/pdf', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        organization: true,
        project: true,
        lineItems: true,
      },
    });

    if (!invoice) {
      res.status(404).json({ status: 'error', code: 'INVOICE_NOT_FOUND', message: 'Invoice not found' });
      return;
    }

    const { InvoicePdfService } = await import('../services/invoice-pdf.service');

    const pdfBuffer = await InvoicePdfService.generateInvoiceBuffer({
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.organization?.name || 'Valued Client',
      clientEmail: (invoice.organization as any)?.email || undefined,
      projectName: invoice.project?.name || undefined,
      issueDate: invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString(),
      dueDate: invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : new Date().toLocaleDateString(),
      currency: invoice.currency || 'USD',
      status: invoice.status,
      paymentTerms: invoice.paymentTerms || 'NET 30',
      notes: invoice.notes || undefined,
      lineItems: invoice.lineItems.map((li) => ({
        description: li.description,
        quantity: li.quantity,
        unitPrice: Number(li.unitPrice),
        totalPrice: Number(li.totalPrice),
      })),
      subtotal: Number(invoice.subtotal),
      taxRate: Number(invoice.taxRate),
      taxAmount: Number(invoice.taxAmount),
      discountAmount: Number(invoice.discountAmount),
      totalAmount: Number(invoice.totalAmount),
      amountPaid: Number(invoice.amountPaid),
      amountDue: Number(invoice.amountDue),
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.status(200).send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PATCH /api/invoices/:id
 * @desc    Admin: Update invoice details or status
 */
router.patch(
  '/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { status, notes, dueDate, amountPaid, amountDue } = req.body;

      const invoice = await prisma.invoice.update({
        where: { id },
        data: {
          ...(status ? { status: status as InvoiceStatus } : {}),
          ...(notes !== undefined ? { notes } : {}),
          ...(dueDate ? { dueDate: new Date(dueDate) } : {}),
          ...(amountPaid !== undefined ? { amountPaid: Number(amountPaid) } : {}),
          ...(amountDue !== undefined ? { amountDue: Number(amountDue) } : {}),
        },
      });

      await logAudit({
        userId: req.user.id,
        action: 'INVOICE_UPDATED',
        entityType: 'Invoice',
        entityId: id,
        changes: req.body,
        req,
      });

      res.status(200).json({ status: 'success', data: { invoice } });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   DELETE /api/invoices/:id
 * @desc    Admin: Delete or void invoice
 */
router.delete(
  '/:id',
  requireAuth,
  requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id as string;

      await prisma.$transaction(async (tx) => {
        await tx.invoiceLineItem.deleteMany({ where: { invoiceId: id } });
        await tx.payment.deleteMany({ where: { invoiceId: id } });
        await tx.invoice.delete({ where: { id } });
      });

      await logAudit({
        userId: req.user.id,
        action: 'INVOICE_DELETED',
        entityType: 'Invoice',
        entityId: id,
        req,
      });

      res.status(200).json({ status: 'success', message: 'Invoice removed successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;

