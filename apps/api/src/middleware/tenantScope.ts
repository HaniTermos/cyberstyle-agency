import { UserRole } from '@prisma/client';
import { UserWithMemberships } from './policy';

export class TenantAccessError extends Error {
  constructor(message: string = 'Access denied: Tenant isolation policy violation.') {
    super(message);
    this.name = 'TenantAccessError';
  }
}

/**
 * Resolves the authorized organization ID for a user.
 * - Platform admins (SUPER_ADMIN, ADMIN) can access the requested org or all orgs.
 * - Clients can ONLY access their own authorized organizations.
 */
export function resolveAuthorizedOrgId(
  user: UserWithMemberships | null | undefined,
  requestedOrgId?: string
): string | undefined {
  if (!user) {
    throw new TenantAccessError('Authentication required for tenant-scoped operations.');
  }

  // Super admins and admins have global operational access
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    return requestedOrgId;
  }

  // Staff and Finance can view specified org or all orgs for internal work
  if (user.role === UserRole.STAFF || user.role === UserRole.FINANCE || user.role === UserRole.SUPPORT) {
    return requestedOrgId;
  }

  // Client role: strictly enforce tenant boundaries
  const allowedOrgIds = new Set<string>();

  if (user.clientProfile?.organizationId) {
    allowedOrgIds.add(user.clientProfile.organizationId);
  }

  if (user.memberships) {
    for (const m of user.memberships) {
      if (m.status === 'ACTIVE') {
        allowedOrgIds.add(m.organizationId);
      }
    }
  }

  if (allowedOrgIds.size === 0) {
    throw new TenantAccessError('User has no active organization memberships.');
  }

  if (requestedOrgId) {
    if (!allowedOrgIds.has(requestedOrgId)) {
      throw new TenantAccessError(`Access denied to organization ${requestedOrgId}.`);
    }
    return requestedOrgId;
  }

  // If no org specified, default to the user's primary organization
  return Array.from(allowedOrgIds)[0];
}

/**
 * Builds a Prisma `where` clause fragment ensuring tenant isolation.
 */
export function tenantWhereClause<T extends Record<string, any>>(
  user: UserWithMemberships,
  requestedOrgId?: string,
  baseWhere: T = {} as T
): T & { organizationId?: string } {
  // Platform admins without an explicit org filter can query cross-tenant
  if (
    (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) &&
    !requestedOrgId
  ) {
    return baseWhere;
  }

  const orgId = resolveAuthorizedOrgId(user, requestedOrgId);
  return {
    ...baseWhere,
    organizationId: orgId,
  };
}
