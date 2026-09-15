import { prisma } from '../config/db';
import { Request } from 'express';
import crypto from 'crypto';

export interface AuditLogOptions {
  userId?: string;
  organizationId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: Record<string, any>;
  metadata?: Record<string, any>;
  req?: Request;
}

const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

/**
 * Computes a SHA-256 hash for an audit log entry in the forward chain.
 */
export function computeAuditHash(
  previousHash: string,
  action: string,
  entityType: string,
  entityId: string | null | undefined,
  timestamp: Date,
  changes: any
): string {
  const payload = [
    previousHash,
    action,
    entityType,
    entityId || 'NONE',
    timestamp.toISOString(),
    JSON.stringify(changes || {}),
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Writes an append-only, tamper-evident audit log with cryptographic hash chaining.
 */
export async function logAudit({
  userId,
  organizationId,
  action,
  entityType,
  entityId,
  changes,
  metadata,
  req,
}: AuditLogOptions): Promise<any> {
  try {
    const ipAddress = req ? (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress : undefined;
    const userAgent = req ? req.headers['user-agent'] || 'Unknown' : undefined;
    const resolvedChanges = changes || metadata || {};
    const timestamp = new Date();

    // 1. Fetch the previous audit log to link the cryptographic chain
    const lastEntry = await prisma.auditLog.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { currentHash: true },
    });

    const previousHash = lastEntry?.currentHash || GENESIS_HASH;
    const currentHash = computeAuditHash(
      previousHash,
      action,
      entityType,
      entityId,
      timestamp,
      resolvedChanges
    );

    return await prisma.auditLog.create({
      data: {
        userId,
        organizationId,
        action,
        entityType,
        entityId,
        changes: resolvedChanges,
        ipAddress: typeof ipAddress === 'string' ? ipAddress : undefined,
        userAgent,
        previousHash,
        currentHash,
        createdAt: timestamp,
      },
    });
  } catch (error) {
    console.error('❌ Failed to write tamper-evident audit log:', error);
    return null;
  }
}

/**
 * Verifies the mathematical cryptographic integrity of an audit trail.
 */
export function verifyAuditChain(
  logs: Array<{
    action: string;
    entityType: string;
    entityId: string | null;
    createdAt: Date;
    changes: any;
    previousHash: string | null;
    currentHash: string | null;
  }>
): { isValid: boolean; verifiedCount: number; corruptedIndex?: number } {
  for (let i = 0; i < logs.length; i++) {
    const current = logs[i];
    if (!current) continue;

    // First log in chain should either match genesis or have valid currentHash
    const prevHash = i === 0 ? current.previousHash || GENESIS_HASH : logs[i - 1]?.currentHash || GENESIS_HASH;

    if (current.previousHash && current.previousHash !== prevHash) {
      return { isValid: false, verifiedCount: i, corruptedIndex: i };
    }

    const expectedHash = computeAuditHash(
      prevHash,
      current.action,
      current.entityType,
      current.entityId,
      new Date(current.createdAt),
      current.changes
    );

    if (current.currentHash && current.currentHash !== expectedHash) {
      return { isValid: false, verifiedCount: i, corruptedIndex: i };
    }
  }

  return { isValid: true, verifiedCount: logs.length };
}

/**
 * Formats an array of audit logs into CSV format for compliance exports.
 */
export function exportAuditLogsToCsv(logs: any[]): string {
  const headers = ['Timestamp', 'Action', 'EntityType', 'EntityId', 'UserId', 'OrganizationId', 'IPAddress', 'CurrentHash'];
  const rows = logs.map((log) => [
    new Date(log.createdAt).toISOString(),
    `"${(log.action || '').replace(/"/g, '""')}"`,
    `"${(log.entityType || '').replace(/"/g, '""')}"`,
    `"${(log.entityId || '').replace(/"/g, '""')}"`,
    `"${(log.userId || '').replace(/"/g, '""')}"`,
    `"${(log.organizationId || '').replace(/"/g, '""')}"`,
    `"${(log.ipAddress || '').replace(/"/g, '""')}"`,
    `"${(log.currentHash || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
