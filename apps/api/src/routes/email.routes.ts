import { Router, Response, NextFunction } from 'express';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.middleware';
import { EmailService, AGENCY_EMAIL_TEMPLATES } from '../services/email.service';
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
      createdAt: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      transportMode: mode,
      configuredFrom: process.env.EMAIL_FROM || 'contact@cyberstyle.net',
      accounts,
      smtpConfigured: Boolean(process.env.GMAIL_USER || process.env.SMTP_USER),
      gmailApiConfigured: Boolean(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_REFRESH_TOKEN),
    },
  });
});

/**
 * @route   GET /api/admin/email/templates
 * @desc    Get high-converting agency email templates
 */
router.get('/templates', async (_req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: { templates: AGENCY_EMAIL_TEMPLATES },
  });
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
        toEmail: z.string().email().default('contact@cyberstyle.net'),
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

export default router;
