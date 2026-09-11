import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Standard API Rate Limiter (20 requests/sec with burst buffer)
export const standardLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later.',
  },
});

// Strict Rate Limiter for sensitive endpoints: Login, Password Reset, Magic Links, Public Lead forms
export const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response) => {
    res.status(429).json({
      status: 'error',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      message: 'Too many attempts. Please wait 15 minutes before trying again.',
    });
  },
});

// Public Leads / Project Request Submission Limiter
export const leadSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 project inquiries per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    code: 'LEAD_SUBMISSION_LIMIT_EXCEEDED',
    message: 'Submission limit reached. If urgent, contact us directly at hello@cyberstyle.net.',
  },
});
