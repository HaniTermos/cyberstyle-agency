import { Router, Request, Response, NextFunction } from 'express';
import { prisma } from '../config/db';
import { AuthService } from '../services/auth.service';
import { logAudit } from '../utils/auditLogger';
import { strictAuthLimiter } from '../middleware/rateLimiter';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware';
import {
  RegisterRequestSchema,
  LoginRequestSchema,
} from '@cyberstyle/config/src/schemas';
import { UserRole, UserStatus } from '@prisma/client';
import { z } from 'zod';
import { EmailService } from '../services/email.service';

const router = Router();

// Helper for consistent cookie options
const getCookieOptions = (expires: Date) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? '.cyberstyle.net' : undefined,
  expires,
});

/**
 * @route   POST /api/auth/register
 */
router.post('/register', strictAuthLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = RegisterRequestSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      res.status(409).json({
        status: 'error',
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'An account with this email already exists.',
      });
      return;
    }

    const passwordHash = await AuthService.hashPassword(data.password);

    const user = await prisma.$transaction(async (tx) => {
      let organizationId: string | undefined;
      if (data.companyName) {
        const org = await tx.clientOrganization.create({
          data: {
            name: data.companyName,
          },
        });
        organizationId = org.id;
      }

      const newUser = await tx.user.create({
        data: {
          email: data.email,
          name: data.name,
          passwordHash,
          role: UserRole.CLIENT,
          status: UserStatus.ACTIVE,
        },
      });

      if (organizationId) {
        await tx.clientProfile.create({
          data: {
            userId: newUser.id,
            organizationId,
          },
        });
      }

      return newUser;
    });

    const session = await AuthService.createSession(user.id, req.ip, req.headers['user-agent']);
    res.cookie('cyberstyle_session', session.sessionToken, getCookieOptions(session.expires));

    await logAudit({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: user.id,
      req,
    });

    res.status(201).json({
      status: 'success',
      message: 'Registration successful.',
      data: {
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/login
 * @desc    Informational response when opened in browser
 */
router.get('/login', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'info',
    endpoint: 'POST /api/auth/login',
    service: 'CYBERSTYLE Authentication API',
    methodRequired: 'POST',
    message: 'Login requires a POST request with { email, password } payload. To log in via the web interface, visit http://localhost:3000/admin/login',
  });
});

/**
 * @route   POST /api/auth/login
 */
router.post('/login', strictAuthLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = LoginRequestSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { clientProfile: true, adminProfile: true },
    });

    if (!user || !user.passwordHash) {
      await logAudit({
        action: 'LOGIN_FAILED',
        entityType: 'User',
        changes: { email: data.email, reason: 'Invalid credentials' },
        req,
      });
      res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      });
      return;
    }

    if (user.status !== UserStatus.ACTIVE) {
      res.status(403).json({
        status: 'error',
        code: 'ACCOUNT_SUSPENDED',
        message: 'Your account is suspended or pending activation. Please contact operations.',
      });
      return;
    }

    const isPasswordValid = await AuthService.verifyPassword(user.passwordHash, data.password);
    if (!isPasswordValid) {
      await logAudit({
        userId: user.id,
        action: 'LOGIN_PASSWORD_FAILED',
        entityType: 'User',
        entityId: user.id,
        req,
      });
      res.status(401).json({
        status: 'error',
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      });
      return;
    }

    // 2FA Enforcement Check
    const requires2FA = user.twoFactorEnabled || user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

    if (requires2FA && user.twoFactorEnabled) {
      const tempToken = await AuthService.createVerificationToken(user.email, '2FA_TEMP', 10);
      res.status(200).json({
        status: 'success',
        requires2FA: true,
        tempToken,
        message: 'Two-factor authentication required. Submit 6-digit TOTP code.',
      });
      return;
    }

    // Standard session login
    const session = await AuthService.createSession(user.id, req.ip, req.headers['user-agent']);
    res.cookie('cyberstyle_session', session.sessionToken, getCookieOptions(session.expires));

    await logAudit({
      userId: user.id,
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user.id,
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token: session.sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.clientProfile?.organizationId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/2fa/verify
 */
router.post('/2fa/verify', strictAuthLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, tempToken, code } = z
      .object({
        email: z.string().email(),
        tempToken: z.string(),
        code: z.string().min(6),
      })
      .parse(req.body);

    const isTempValid = await AuthService.consumeToken(email, tempToken, '2FA_TEMP');
    if (!isTempValid) {
      res.status(401).json({
        status: 'error',
        code: 'INVALID_2FA_SESSION',
        message: '2FA session expired. Please log in again.',
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { clientProfile: true, adminProfile: true },
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    // Check TOTP code or Backup recovery codes
    const isCodeValid =
      (user.twoFactorSecret && AuthService.verifyTOTP(user.twoFactorSecret, code)) ||
      user.twoFactorBackupCodes.includes(code.toUpperCase());

    if (!isCodeValid) {
      await logAudit({
        userId: user.id,
        action: '2FA_VERIFICATION_FAILED',
        entityType: 'User',
        req,
      });
      res.status(401).json({
        status: 'error',
        code: 'INVALID_2FA_CODE',
        message: 'Invalid two-factor authentication code.',
      });
      return;
    }

    // If backup code used, remove it
    if (user.twoFactorBackupCodes.includes(code.toUpperCase())) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorBackupCodes: user.twoFactorBackupCodes.filter((c) => c !== code.toUpperCase()),
        },
      });
    }

    const session = await AuthService.createSession(user.id, req.ip, req.headers['user-agent']);
    res.cookie('cyberstyle_session', session.sessionToken, getCookieOptions(session.expires));

    await logAudit({
      userId: user.id,
      action: '2FA_LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user.id,
      req,
    });

    res.status(200).json({
      status: 'success',
      message: 'Two-factor authentication verified',
      data: {
        token: session.sessionToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          organizationId: user.clientProfile?.organizationId,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/2fa/setup
 */
router.post('/2fa/setup', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { secret, uri } = AuthService.generate2FASecret();
    const backupCodes = AuthService.generateBackupCodes(8);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        twoFactorSecret: secret,
        twoFactorBackupCodes: backupCodes,
      },
    });

    res.status(200).json({
      status: 'success',
      data: {
        secret,
        uri,
        backupCodes,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/2fa/confirm
 */
router.post('/2fa/confirm', requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { code } = z.object({ code: z.string().min(6) }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !user.twoFactorSecret) {
      res.status(400).json({ status: 'error', message: '2FA setup not initiated.' });
      return;
    }

    const isValid = AuthService.verifyTOTP(user.twoFactorSecret, code);
    if (!isValid) {
      res.status(400).json({ status: 'error', message: 'Invalid confirmation code.' });
      return;
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { twoFactorEnabled: true },
    });

    await logAudit({
      userId: req.user.id,
      action: '2FA_ENABLED',
      entityType: 'User',
      entityId: req.user.id,
      req,
    });

    res.status(200).json({
      status: 'success',
      message: '2FA enabled successfully.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 */
router.get('/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        twoFactorEnabled: req.user.twoFactorEnabled,
        organizationId: req.user.clientProfile?.organizationId,
        department: req.user.adminProfile?.department,
        permissions: req.user.adminProfile?.permissions || [],
      },
    },
  });
});

/**
 * @route   POST /api/auth/logout
 */
router.post('/logout', async (req: Request, res: Response) => {
  const sessionToken = req.cookies?.cyberstyle_session;
  if (sessionToken) {
    await AuthService.invalidateSession(sessionToken);
  }
  res.clearCookie('cyberstyle_session', { path: '/' });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset instructions for client or admin
 */
router.post('/forgot-password', strictAuthLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (user) {
      // Generate 6-digit numeric recovery code and 32-byte secure token
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      await AuthService.createVerificationToken(user.email, 'PASSWORD_RESET', 60);

      // Store the numeric code as a verification token too for easy typing
      await prisma.verificationToken.create({
        data: {
          identifier: user.email,
          token: resetCode,
          type: 'PASSWORD_RESET_CODE',
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      const resetUrl = `http://localhost:3000/portal/login?action=reset&email=${encodeURIComponent(user.email)}`;

      // Dispatch branded executive email
      await EmailService.sendMail({
        to: user.email,
        subject: '🔐 CYBERSTYLE Account Security: Password Reset Verification Code',
        html: `
          <p>Hello ${user.name || 'Client'},</p>
          <p>We received an authorized request to reset the password for your CYBERSTYLE workspace account (<strong>${user.email}</strong>).</p>
          
          <div style="margin: 28px 0; padding: 20px; background-color: rgba(0, 240, 255, 0.06); border: 1px solid rgba(0, 240, 255, 0.3); border-radius: 12px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 11px; font-family: monospace; text-transform: uppercase; color: #00F0FF; letter-spacing: 2px;">Your 6-Digit Verification Code</p>
            <span style="font-family: monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #FFFFFF;">${resetCode}</span>
            <p style="margin: 8px 0 0 0; font-size: 11px; color: #94A3B8;">Expires in 60 minutes. Do not share this code with anyone.</p>
          </div>

          <p>If you did not request this password reset, please disregard this email or notify <a href="mailto:security@cyberstyle.net" style="color: #00F0FF;">security@cyberstyle.net</a> immediately. Your password remains securely unchanged.</p>
        `,
      });

      await logAudit({
        userId: user.id,
        action: 'PASSWORD_RESET_REQUESTED',
        entityType: 'User',
        entityId: user.id,
        req,
      });
    }

    // Always respond with success to prevent user enumeration
    res.status(200).json({
      status: 'success',
      message: 'If an account exists with this email, password reset instructions have been dispatched.',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Submit verification code and new password
 */
router.post('/reset-password', strictAuthLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, code, newPassword } = z
      .object({
        email: z.string().email(),
        code: z.string().min(6),
        newPassword: z.string().min(8),
      })
      .parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      res.status(400).json({ status: 'error', message: 'Invalid or expired verification code.' });
      return;
    }

    // Check verification code
    const validToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: user.email,
        token: code.trim(),
        type: 'PASSWORD_RESET_CODE',
        expires: { gt: new Date() },
      },
    });

    if (!validToken) {
      res.status(400).json({ status: 'error', message: 'Invalid or expired verification code.' });
      return;
    }

    // Hash new password and update user
    const passwordHash = await AuthService.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    // Invalidate the consumed token and all user sessions
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email, type: 'PASSWORD_RESET_CODE' },
    });
    await AuthService.invalidateAllUserSessions(user.id);

    await logAudit({
      userId: user.id,
      action: 'PASSWORD_RESET_SUCCESS',
      entityType: 'User',
      entityId: user.id,
      req,
    });

    // Send confirmation email
    await EmailService.sendMail({
      to: user.email,
      subject: '✅ CYBERSTYLE Account Security: Password Changed Successfully',
      html: `
        <p>Hello ${user.name || 'Client'},</p>
        <p>This is confirmation that the password for your CYBERSTYLE workspace account (<strong>${user.email}</strong>) has been successfully updated.</p>
        <p>If you made this change, no further action is required. If you did not make this change, please contact <a href="mailto:security@cyberstyle.net" style="color: #00F0FF;">security@cyberstyle.net</a> immediately to secure your enclave.</p>
      `,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password has been successfully updated. You may now log in.',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
