import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { UserRole } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware enforcing valid session token (HttpOnly cookie or Bearer token)
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.headers.cookie) {
      // Parse cookie
      const cookies = req.headers.cookie.split(';').reduce((acc, c) => {
        const [k, v] = c.trim().split('=');
        if (k && v) acc[k] = decodeURIComponent(v);
        return acc;
      }, {} as Record<string, string>);
      token = cookies['cyberstyle_session'];
    }

    if (!token) {
      res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication session required',
      });
      return;
    }

    const user = await AuthService.validateSession(token);
    if (!user) {
      res.status(401).json({
        status: 'error',
        code: 'SESSION_EXPIRED',
        message: 'Your session has expired. Please sign in again.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware restricting access to specified roles
 */
export function requireRole(allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: `Insufficient permissions. Required: [${allowedRoles.join(', ')}]`,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware ensuring Client role can only access their own organization's records
 */
export function requireOrgBoundary(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const user = req.user;
  if (!user) {
    res.status(401).json({ status: 'error', code: 'UNAUTHORIZED' });
    return;
  }

  // Super Admins & Admins bypass organization partitioning
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    next();
    return;
  }

  const requestedOrgId = req.params.orgId || req.query.orgId || req.body.orgId;
  const userOrgId = user.clientProfile?.organizationId;

  if (!userOrgId || (requestedOrgId && requestedOrgId !== userOrgId)) {
    res.status(403).json({
      status: 'error',
      code: 'TENANT_ACCESS_DENIED',
      message: 'You cannot access data outside your assigned organization.',
    });
    return;
  }

  next();
}
