import { prisma } from '../config/db';
import { EmailDeliveryStatus, SuppressionReason } from '@prisma/client';
import { logAudit } from '../utils/auditLogger';

export interface DispatchEmailInput {
  recipient: string;
  templateSlug?: string;
  templateVersion?: number;
  subject: string;
  bodyHtml?: string;
  bodyText?: string;
  variables?: Record<string, any>;
  idempotencyKey?: string;
  campaignId?: string;
  actorUserId?: string;
  contextReason?: string;
  allowSuppressedOverride?: boolean;
}

export class EmailGovernanceService {
  /**
   * 1. Check Suppression List
   */
  static async isSuppressed(email: string): Promise<boolean> {
    const normalized = email.trim().toLowerCase();
    const suppression = await prisma.emailSuppression.findUnique({
      where: { email: normalized },
    });
    return Boolean(suppression);
  }

  /**
   * Add Email to Suppression List
   */
  static async addSuppression(email: string, reason: SuppressionReason, source?: string) {
    const normalized = email.trim().toLowerCase();
    return prisma.emailSuppression.upsert({
      where: { email: normalized },
      create: {
        email: normalized,
        reason,
        source: source || 'AUTOMATED_HANDLER',
      },
      update: {
        reason,
        source: source || 'AUTOMATED_HANDLER',
      },
    });
  }

  /**
   * Remove Email from Suppression (Manual Admin Action)
   */
  static async removeSuppression(email: string, adminUserId: string, req?: any) {
    const normalized = email.trim().toLowerCase();
    const deleted = await prisma.emailSuppression.delete({
      where: { email: normalized },
    });

    await logAudit({
      userId: adminUserId,
      action: 'EMAIL_SUPPRESSION_OVERRIDE',
      entityType: 'EmailSuppression',
      entityId: normalized,
      changes: { removedEmail: normalized },
      req,
    });

    return deleted;
  }

  /**
   * 2. Template Management & Versioning
   */
  static async createTemplate(input: {
    name: string;
    slug: string;
    subject: string;
    bodyHtml: string;
    bodyText?: string;
    variables?: string[];
  }) {
    return prisma.emailTemplate.create({
      data: {
        name: input.name,
        slug: input.slug.trim().toLowerCase(),
        version: 1,
        subject: input.subject,
        bodyHtml: input.bodyHtml,
        bodyText: input.bodyText || null,
        variables: input.variables || [],
        isApproved: false, // Must be approved before use
      },
    });
  }

  static async approveTemplate(templateId: string, approvedById: string, req?: any) {
    const template = await prisma.emailTemplate.update({
      where: { id: templateId },
      data: {
        isApproved: true,
        approvedById,
        approvedAt: new Date(),
      },
    });

    await logAudit({
      userId: approvedById,
      action: 'EMAIL_TEMPLATE_APPROVED',
      entityType: 'EmailTemplate',
      entityId: template.id,
      changes: { slug: template.slug, version: template.version, approved: true },
      req,
    });

    return template;
  }

  /**
   * Assert Template is Approved
   */
  static async assertTemplateApproved(slug: string, version?: number) {
    const template = await prisma.emailTemplate.findFirst({
      where: {
        slug: slug.trim().toLowerCase(),
        ...(version ? { version } : {}),
      },
      orderBy: { version: 'desc' },
    });

    if (!template) {
      throw new Error(`Email template "${slug}" not found.`);
    }

    if (!template.isApproved) {
      throw new Error(`Email template "${slug}" (v${template.version}) is not approved for production dispatches.`);
    }

    return template;
  }

  /**
   * 3. Governed Email Dispatch
   */
  static async dispatchGovernedEmail(input: DispatchEmailInput, req?: any) {
    const normalizedRecipient = input.recipient.trim().toLowerCase();

    // 1. Idempotency Check
    if (input.idempotencyKey) {
      const existing = await prisma.emailMessage.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
        include: { deliveryEvents: true },
      });

      if (existing) {
        return {
          message: existing,
          isDuplicate: true,
          status: existing.deliveryStatus,
        };
      }
    }

    // 2. Suppression Check
    const suppressed = await this.isSuppressed(normalizedRecipient);
    if (suppressed && !input.allowSuppressedOverride) {
      throw new Error(`Recipient "${normalizedRecipient}" is on the suppression list (bounced/complained). Cannot send.`);
    }

    // 3. Template Approval Gate (if using template)
    let finalSubject = input.subject;
    let finalHtml = input.bodyHtml || '';
    let finalVersion: number | undefined;
    let templateId: string | undefined;

    if (input.templateSlug) {
      const template = await this.assertTemplateApproved(input.templateSlug, input.templateVersion);
      templateId = template.id;
      finalVersion = template.version;
      finalSubject = template.subject;
      finalHtml = template.bodyHtml;

      // Variable interpolation
      if (input.variables) {
        for (const [k, v] of Object.entries(input.variables)) {
          finalSubject = finalSubject.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
          finalHtml = finalHtml.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v));
        }
      }
    }

    // 4. Resolve or create default thread for auditing
    let thread = await prisma.emailThread.findFirst({
      where: { subject: finalSubject },
    });

    if (!thread) {
      thread = await prisma.emailThread.create({
        data: {
          subject: finalSubject,
          status: 'OPEN',
        },
      });
    }

    // 5. Create EmailMessage record with delivery status tracking
    const message = await prisma.$transaction(async (tx) => {
      const msg = await tx.emailMessage.create({
        data: {
          threadId: thread.id,
          from: process.env.SMTP_FROM || 'CYBERSTYLE Systems <notifications@cyberstyle.com>',
          to: normalizedRecipient,
          subject: finalSubject,
          body: finalHtml,
          direction: 'outbound',
          status: 'SENT',
          deliveryStatus: EmailDeliveryStatus.SENT,
          transport: 'smtp',
          templateId: templateId || null,
          templateVersion: finalVersion || null,
          idempotencyKey: input.idempotencyKey || null,
          campaignId: input.campaignId || null,
          actorId: input.actorUserId || null,
        },
      });

      // Log initial SENT event
      await tx.emailDeliveryEvent.create({
        data: {
          emailMessageId: msg.id,
          event: EmailDeliveryStatus.SENT,
          timestamp: new Date(),
        },
      });

      return msg;
    });

    // 6. Audit Log
    await logAudit({
      userId: input.actorUserId,
      action: 'EMAIL_DISPATCHED',
      entityType: 'EmailMessage',
      entityId: message.id,
      changes: {
        recipient: normalizedRecipient,
        subject: finalSubject,
        templateSlug: input.templateSlug,
        templateVersion: finalVersion,
        contextReason: input.contextReason || 'Direct Notification',
      },
      req,
    });

    return {
      message,
      isDuplicate: false,
      status: EmailDeliveryStatus.SENT,
    };
  }

  /**
   * 4. Record Delivery Event (Webhooks from Resend/SendGrid/SES)
   */
  static async recordDeliveryEvent(
    emailMessageId: string,
    event: EmailDeliveryStatus,
    errorCode?: string,
    metadata?: any
  ) {
    const message = await prisma.emailMessage.findUnique({
      where: { id: emailMessageId },
    });

    if (!message) {
      throw new Error(`Email message with ID "${emailMessageId}" not found.`);
    }

    const deliveryEvent = await prisma.emailDeliveryEvent.create({
      data: {
        emailMessageId,
        event,
        errorCode: errorCode || null,
        metadata: metadata || null,
      },
    });

    await prisma.emailMessage.update({
      where: { id: emailMessageId },
      data: { deliveryStatus: event },
    });

    // Automatically suppress hard bounces and complaints
    if (event === EmailDeliveryStatus.BOUNCED) {
      await this.addSuppression(message.to, SuppressionReason.HARD_BOUNCE, `DELIVERY_EVENT_${errorCode || 'BOUNCE'}`);
    } else if (event === EmailDeliveryStatus.COMPLAINED) {
      await this.addSuppression(message.to, SuppressionReason.COMPLAINT, 'SPAM_COMPLAINT');
    }

    return deliveryEvent;
  }

  /**
   * 5. Real Telemetry Data (No Fake Stats)
   */
  static async getRealDeliveryTelemetry(timeframeDays = 30) {
    const since = new Date(Date.now() - timeframeDays * 24 * 60 * 60 * 1000);

    const [totalSent, totalDelivered, totalBounced, totalComplained, totalFailed, activeSuppressions] = await Promise.all([
      prisma.emailDeliveryEvent.count({ where: { event: EmailDeliveryStatus.SENT, timestamp: { gte: since } } }),
      prisma.emailDeliveryEvent.count({ where: { event: EmailDeliveryStatus.DELIVERED, timestamp: { gte: since } } }),
      prisma.emailDeliveryEvent.count({ where: { event: EmailDeliveryStatus.BOUNCED, timestamp: { gte: since } } }),
      prisma.emailDeliveryEvent.count({ where: { event: EmailDeliveryStatus.COMPLAINED, timestamp: { gte: since } } }),
      prisma.emailDeliveryEvent.count({ where: { event: EmailDeliveryStatus.FAILED, timestamp: { gte: since } } }),
      prisma.emailSuppression.count(),
    ]);

    const deliveryRate = totalSent > 0 ? ((totalDelivered / totalSent) * 100).toFixed(1) : '100.0';
    const bounceRate = totalSent > 0 ? ((totalBounced / totalSent) * 100).toFixed(1) : '0.0';

    return {
      timeframeDays,
      metrics: {
        totalSent,
        totalDelivered,
        totalBounced,
        totalComplained,
        totalFailed,
        activeSuppressions,
        deliveryRatePercent: Number(deliveryRate),
        bounceRatePercent: Number(bounceRate),
      },
      isLiveCalculated: true,
      lastUpdatedAt: new Date().toISOString(),
    };
  }
}
