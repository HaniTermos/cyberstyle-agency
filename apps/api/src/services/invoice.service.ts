import { InvoiceStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/db';
import { logAudit } from '../utils/auditLogger';

export class InvalidInvoiceStateTransitionError extends Error {
  constructor(public currentStatus: InvoiceStatus, public targetStatus: InvoiceStatus) {
    super(`Cannot transition invoice from ${currentStatus} to ${targetStatus}.`);
    this.name = 'InvalidInvoiceStateTransitionError';
  }
}

/**
 * Valid state transitions matrix for invoices.
 */
export const ALLOWED_INVOICE_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  [InvoiceStatus.DRAFT]: [
    InvoiceStatus.SENT,
    InvoiceStatus.VOID,
  ],
  [InvoiceStatus.SENT]: [
    InvoiceStatus.DUE,
    InvoiceStatus.PAID,
    InvoiceStatus.PARTIALLY_PAID,
    InvoiceStatus.OVERDUE,
    InvoiceStatus.VOID,
  ],
  [InvoiceStatus.DUE]: [
    InvoiceStatus.PAID,
    InvoiceStatus.PARTIALLY_PAID,
    InvoiceStatus.OVERDUE,
    InvoiceStatus.VOID,
    InvoiceStatus.DISPUTED,
  ],
  [InvoiceStatus.OVERDUE]: [
    InvoiceStatus.PAID,
    InvoiceStatus.PARTIALLY_PAID,
    InvoiceStatus.VOID,
    InvoiceStatus.DISPUTED,
  ],
  [InvoiceStatus.PARTIALLY_PAID]: [
    InvoiceStatus.PAID,
    InvoiceStatus.OVERDUE,
    InvoiceStatus.DISPUTED,
    InvoiceStatus.VOID,
  ],
  [InvoiceStatus.PAID]: [
    InvoiceStatus.REFUNDED,
    InvoiceStatus.REFUNDED_CREDITED,
    InvoiceStatus.DISPUTED,
  ],
  [InvoiceStatus.DISPUTED]: [
    InvoiceStatus.PAID,
    InvoiceStatus.REFUNDED,
    InvoiceStatus.REFUNDED_CREDITED,
    InvoiceStatus.VOID,
  ],
  [InvoiceStatus.VOID]: [], // Terminal state
  [InvoiceStatus.REFUNDED]: [], // Terminal state
  [InvoiceStatus.REFUNDED_CREDITED]: [], // Terminal state
};

export class InvoiceService {
  /**
   * Converts decimal currency amount to integer minor units (cents)
   */
  static toCents(amount: number | Prisma.Decimal | string): number {
    const num = typeof amount === 'number' ? amount : Number(amount);
    return Math.round(num * 100);
  }

  /**
   * Converts integer minor units (cents) to standard decimal currency amount
   */
  static fromCents(cents: number): number {
    return cents / 100;
  }

  /**
   * Validates if a state transition is legal
   */
  static canTransition(current: InvoiceStatus, target: InvoiceStatus): boolean {
    if (current === target) return true;
    const allowed = ALLOWED_INVOICE_TRANSITIONS[current] || [];
    return allowed.includes(target);
  }

  /**
   * Transitions an invoice to a new status with validation and audit logging
   */
  static async transitionStatus(
    invoiceId: string,
    targetStatus: InvoiceStatus,
    actorId?: string,
    reason?: string
  ) {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found.`);
    }

    if (!this.canTransition(invoice.status, targetStatus)) {
      throw new InvalidInvoiceStateTransitionError(invoice.status, targetStatus);
    }

    const updateData: Prisma.InvoiceUpdateInput = {
      status: targetStatus,
    };

    if (targetStatus === InvoiceStatus.SENT && !invoice.sentAt) {
      updateData.sentAt = new Date();
    } else if (targetStatus === InvoiceStatus.PAID) {
      updateData.paidAt = new Date();
      updateData.amountDue = 0.0;
    } else if (targetStatus === InvoiceStatus.VOID) {
      updateData.voidedAt = new Date();
    }

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
    });

    await logAudit({
      userId: actorId,
      organizationId: invoice.organizationId,
      action: 'INVOICE_STATUS_TRANSITION',
      entityType: 'Invoice',
      entityId: invoiceId,
      changes: {
        fromStatus: invoice.status,
        toStatus: targetStatus,
        reason: reason || 'Manual transition',
      },
    });

    return updated;
  }

  /**
   * Persists and verifies Stripe Webhook idempotency
   */
  static async recordWebhookEvent(eventId: string, eventType: string, payload: any) {
    // Check if event already exists
    const existing = await prisma.stripeWebhookEvent.findUnique({
      where: { eventId },
    });

    if (existing) {
      return { isDuplicate: true, event: existing };
    }

    const event = await prisma.stripeWebhookEvent.create({
      data: {
        eventId,
        eventType,
        status: 'RECEIVED',
        payload,
      },
    });

    return { isDuplicate: false, event };
  }
}
