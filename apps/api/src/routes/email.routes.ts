import { Router, Response, NextFunction } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { EmailService, AGENCY_EMAIL_TEMPLATES } from '../services/email.service';
import { EmailGovernanceService } from '../services/email-governance.service';
import { prisma } from '../config/db';
import { UserRole } from '@prisma/client';
import { logAudit } from '../utils/auditLogger';
import { z } from 'zod';

const router = Router();

// Guard email administration with ADMIN/SUPER_ADMIN
router.use(requireAuth);
router.use(requireRole([UserRole.SUPER_ADMIN, UserRole.ADMIN]));

/**
 * @route   GET /api/admin/email/status
 * @desc    Get email service transport mode and active accounts
 */
router.get('/status', async (req: AuthenticatedRequest, res: Response) => {
  const mode = EmailService.getTransportMode();
  const accounts = await prisma.emailAccount.findMany({
    where: { userId: req.user.id },
    select: {
      id: true,
      email: true,
      provider: true,
      isActive: true,
      lastSyncedAt: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      transportMode: mode,
      configuredFrom: process.env.EMAIL_FROM || 'info@cyberstyle.net',
      accounts,
      smtpConfigured: Boolean(process.env.GMAIL_USER || process.env.SMTP_USER),
      gmailApiConfigured: Boolean(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN),
    },
  });
});

/**
 * @route   GET /api/admin/email/templates
 * @desc    Get email templates with versioning and approval metadata
 */
router.get('/templates', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let dbTemplates = await prisma.emailTemplate.findMany({
      include: {
        approvedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: [{ slug: 'asc' }, { version: 'desc' }],
    });

    // Seed default agency templates into database if empty
    if (dbTemplates.length === 0) {
      for (const t of AGENCY_EMAIL_TEMPLATES) {
        await prisma.emailTemplate.create({
          data: {
            name: t.name,
            slug: t.id.toLowerCase(),
            version: 1,
            subject: t.subject,
            bodyHtml: t.body.replace(/\n/g, '<br/>'),
            bodyText: t.body,
            variables: ['prospect_name', 'project_name', 'calendly_link'],
            isApproved: true, // Default agency templates pre-approved
          },
        }).catch(() => {});
      }

      dbTemplates = await prisma.emailTemplate.findMany({
        include: {
          approvedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: [{ slug: 'asc' }, { version: 'desc' }],
      });
    }

    res.status(200).json({
      status: 'success',
      data: { templates: dbTemplates },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/email/threads
 * @desc    Get conversation threads
 */
router.get('/threads', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status ? String(req.query.status) : undefined;
    const threads = await EmailService.listThreads(status);

    res.status(200).json({
      status: 'success',
      data: { threads, total: threads.length },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/email/threads/:id
 * @desc    Get single thread with all messages
 */
router.get('/threads/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const thread = await EmailService.getThread(id);

    if (!thread) {
      res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: 'Thread not found' });
      return;
    }

    res.status(200).json({
      status: 'success',
      data: { thread },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/email/threads/:id/reply
 * @desc    Send a reply inside an existing thread
 */
router.post('/threads/:id/reply', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const { to, subject, body } = z
      .object({
        to: z.string().email(),
        subject: z.string().optional(),
        body: z.string().min(1, 'Body is required'),
      })
      .parse(req.body);

    const result = await EmailService.replyToThread(id, { to, subject, body });

    await logAudit({
      userId: req.user.id,
      action: 'THREAD_REPLY_SENT',
      entityType: 'EmailThread',
      entityId: id,
      changes: { to, success: result.success },
      req,
    });

    res.status(200).json({
      status: result.success ? 'success' : 'error',
      message: result.success ? 'Reply sent successfully' : result.error,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/email/send-test
 * @desc    Send live test email to recipient
 */
router.post('/send-test', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { toEmail, message } = z
      .object({
        toEmail: z.string().email().default('info@cyberstyle.net'),
        message: z.string().optional(),
      })
      .parse(req.body);

    const result = await EmailService.sendTestEmail(toEmail, message);

    await logAudit({
      userId: req.user.id,
      action: 'EMAIL_TEST_SENT',
      entityType: 'System',
      changes: { toEmail, success: result.success, messageId: result.messageId },
      req,
    });

    if (!result.success) {
      res.status(500).json({
        status: 'error',
        message: result.error || 'Failed to dispatch test email.',
      });
      return;
    }

    res.status(200).json({
      status: 'success',
      message: `Test email successfully dispatched to ${toEmail}!`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/admin/email/send-custom
 * @desc    Send custom email (with optional leadId / projectId linking)
 */
router.post('/send-custom', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { to, subject, html, text, relatedType, relatedId } = z
      .object({
        to: z.string().email(),
        subject: z.string().min(1),
        html: z.string().min(1),
        text: z.string().optional(),
        relatedType: z.enum(['LEAD', 'CLIENT', 'PROJECT', 'INVOICE', 'GENERAL']).optional(),
        relatedId: z.string().optional(),
      })
      .parse(req.body);

    const result = await EmailService.sendMail({
      to,
      subject,
      html,
      text,
      relatedType,
      relatedId,
    });

    await logAudit({
      userId: req.user.id,
      action: 'CUSTOM_EMAIL_SENT',
      entityType: 'System',
      changes: { to, subject, relatedType, relatedId },
      req,
    });

    res.status(200).json({
      status: result.success ? 'success' : 'error',
      message: result.success ? `Email dispatched to ${to}` : result.error,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/email/logs
 * @desc    Get outgoing email dispatch audit logs
 */
router.get('/logs', async (_req: AuthenticatedRequest, res: Response) => {
  const logs = EmailService.getLogs();
  res.status(200).json({
    status: 'success',
    data: { logs },
  });
});

/**
 * @route   POST /api/admin/email/connect-account
 * @desc    Connect or update Gmail OAuth credentials
 */
router.post('/connect-account', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, accessToken, refreshToken, providerAccountId } = z
      .object({
        email: z.string().email(),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
        providerAccountId: z.string().optional(),
      })
      .parse(req.body);

    const account = await prisma.emailAccount.upsert({
      where: { email },
      update: {
        accessToken,
        refreshToken,
        providerAccountId,
        isActive: true,
        lastSyncedAt: new Date(),
      },
      create: {
        userId: req.user.id,
        email,
        accessToken,
        refreshToken,
        providerAccountId,
        isActive: true,
        lastSyncedAt: new Date(),
      },
    });

    await logAudit({
      userId: req.user.id,
      action: 'EMAIL_ACCOUNT_CONNECTED',
      entityType: 'EmailAccount',
      entityId: account.id,
      changes: { email },
      req,
    });

    res.status(200).json({
      status: 'success',
      message: `Email account ${email} connected successfully`,
      data: { account },
    });
  } catch (error) {
    next(error);
  }
});

// ==============================================================================
// PHASE 3 EMAIL GOVERNANCE & DELIVERY HARDENING
// ==============================================================================

/**
 * @route   POST /api/admin/email/templates
 * @desc    Create new email template (requires approval before production send)
 */
router.post('/templates', async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const { name, slug, subject, bodyHtml, bodyText, variables } = req.body;

    if (!name || !slug || !subject || !bodyHtml) {
      res.status(400).json({ status: 'error', code: 'INVALID_PAYLOAD', message: 'Name, slug, subject, and bodyHtml are required.' });
      return;
    }

    const template = await EmailGovernanceService.createTemplate({
      name,
      slug,
      subject,
      bodyHtml,
      bodyText,
      variables,
    });

    res.status(201).json({
      status: 'success',
      data: { template, message: 'Template created in draft state. Human approval required before use.' },
    });
  } catch (error: any) {
    res.status(400).json({ status: 'error', code: 'TEMPLATE_CREATE_FAILED', message: error.message });
  }
});

/**
 * @route   POST /api/admin/email/templates/:id/approve
 * @desc    Approve template for production use (Human Gate)
 */
router.post('/templates/:id/approve', async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const id = String(req.params.id);
    const template = await EmailGovernanceService.approveTemplate(id, req.user.id, req);

    res.status(200).json({
      status: 'success',
      data: { template, message: `Template "${template.name}" approved for production dispatches.` },
    });
  } catch (error: any) {
    res.status(400).json({ status: 'error', code: 'APPROVAL_FAILED', message: error.message });
  }
});

/**
 * @route   POST /api/admin/email/campaign/dispatch
 * @desc    Dispatches outbound campaign email with human approval gate & idempotency
 */
router.post('/campaign/dispatch', async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const {
      recipient,
      templateSlug,
      templateVersion,
      subject,
      bodyHtml,
      variables,
      idempotencyKey,
      campaignId,
      humanApproved,
    } = req.body;

    // Human Approval Gate
    if (!humanApproved) {
      res.status(400).json({
        status: 'error',
        code: 'HUMAN_APPROVAL_REQUIRED',
        message: 'Campaign dispatches require explicit human approval (humanApproved: true). Automated autonomous outreach is blocked.',
      });
      return;
    }

    if (!recipient || !subject) {
      res.status(400).json({ status: 'error', code: 'INVALID_PAYLOAD', message: 'Recipient and subject are required.' });
      return;
    }

    const result = await EmailGovernanceService.dispatchGovernedEmail({
      recipient,
      templateSlug,
      templateVersion: templateVersion ? Number(templateVersion) : undefined,
      subject,
      bodyHtml,
      variables,
      idempotencyKey,
      campaignId,
      actorUserId: req.user.id,
      contextReason: `Campaign [${campaignId || 'manual'}] dispatched by ${req.user.name || req.user.email}`,
    }, req);

    res.status(result.isDuplicate ? 200 : 201).json({
      status: 'success',
      data: {
        message: result.message,
        isDuplicate: result.isDuplicate,
        deliveryStatus: result.status,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      code: 'DISPATCH_BLOCKED',
      message: error.message || 'Email dispatch blocked by governance rules.',
    });
  }
});

/**
 * @route   GET /api/admin/email/telemetry
 * @desc    Live delivery telemetry from real database events (Sent, Delivered, Bounced, Complained)
 */
router.get('/telemetry', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const timeframe = req.query.timeframe ? Number(req.query.timeframe) : 30;
    const telemetry = await EmailGovernanceService.getRealDeliveryTelemetry(timeframe);

    res.status(200).json({
      status: 'success',
      data: telemetry,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/admin/email/suppressions
 * @desc    List active suppressions (hard bounces and complaints)
 */
router.get('/suppressions', async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const suppressions = await prisma.emailSuppression.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    res.status(200).json({
      status: 'success',
      data: { suppressions, count: suppressions.length },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/admin/email/suppressions/:email
 * @desc    Remove an email from suppression list with admin audit log
 */
router.delete('/suppressions/:email', async (req: AuthenticatedRequest, res: Response, _next: NextFunction) => {
  try {
    const email = String(req.params.email);
    await EmailGovernanceService.removeSuppression(email, req.user.id, req);

    res.status(200).json({
      status: 'success',
      message: `Suppression removed for "${email}".`,
    });
  } catch (error: any) {
    res.status(400).json({ status: 'error', code: 'REMOVAL_FAILED', message: error.message });
  }
});

export default router;
