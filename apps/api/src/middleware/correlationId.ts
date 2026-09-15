import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

// Extend Express Request interface to include correlationId
declare global {
  namespace Express {
    interface Request {
      correlationId: string;
    }
  }
}

/**
 * Middleware that assigns or forwards a unique Correlation ID for every incoming HTTP request.
 * Correlation IDs allow tracing logs across microservices and async worker boundaries.
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  // Read incoming header or generate fresh UUID v4
  const existingId =
    (req.headers['x-correlation-id'] as string) ||
    (req.headers['x-request-id'] as string);

  const correlationId = existingId && /^[a-zA-Z0-9_\-]+$/.test(existingId)
    ? existingId
    : crypto.randomUUID();

  // Attach to request object
  req.correlationId = correlationId;

  // Echo back in response header for frontend / client debugging
  res.setHeader('x-correlation-id', correlationId);

  next();
}
