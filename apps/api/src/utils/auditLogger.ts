import { prisma } from '../config/db';
import { Request } from 'express';

export interface AuditLogOptions {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  req?: Request;
}

export async function logAudit({
  userId,
  action,
  entityType,
  entityId,
  changes,
  req,
}: AuditLogOptions): Promise<void> {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress : undefined;
    const userAgent = req ? req.headers['user-agent'] || 'Unknown' : undefined;

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        changes: changes || {},
        ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
        userAgent,
      },
    });
  } catch (error) {
    console.error('❌ Failed to write audit log:', error);
  }
}
