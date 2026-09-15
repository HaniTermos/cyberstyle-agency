import { UserRole, OrganizationRole } from '@prisma/client';
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export type Capability =
  // Platform & Administration
  | 'system:settings'
  | 'audit:read'
  | 'users:manage'
  | 'analytics:view'
  
  // Leads & Pipeline
  | 'lead:view'
  | 'lead:create'
  | 'lead:edit'
  | 'lead:delete'
  
  // Proposals
  | 'proposal:view'
  | 'proposal:create'
  | 'proposal:edit'
  | 'proposal:send'
  | 'proposal:accept'
  
  // Projects & Delivery
  | 'project:view'
  | 'project:create'
  | 'project:edit'
  | 'project:delete'
  | 'milestone:manage'
  | 'task:view_internal'
  | 'task:manage'
  
  // Billing & Invoices
  | 'invoice:view'
  | 'invoice:create'
  | 'invoice:edit'
  | 'invoice:void'
  | 'invoice:pay'
  
  // Messages & Threads
  | 'message:view_client'
  | 'message:view_internal'
  | 'message:send_internal'
  | 'message:send_client'
  
  // Content & Reviews
  | 'content:manage'
  | 'review:approve'
  
  // Organization Management
  | 'org:view'
  | 'org:manage_members';

export interface UserWithMemberships {
  id: string;
  role: UserRole;
  email: string;
  clientProfile?: {
    organizationId: string;
  } | null;
  memberships?: Array<{
    organizationId: string;
    role: OrganizationRole;
    status: string;
  }>;
}

/**
 * Checks if a user has permission to execute a specific capability within an optional organization context.
 */
export function can(
  user: UserWithMemberships | null | undefined,
  capability: Capability,
  organizationId?: string
): boolean {
  if (!user) return false;

  // 1. Super Admins have universal capability access
  if (user.role === UserRole.SUPER_ADMIN) {
    return true;
  }

  // 2. Admins have access to all agency operations
  if (user.role === UserRole.ADMIN) {
    return true;
  }

  // 3. Platform Role Checks
  if (user.role === UserRole.STAFF) {
    switch (capability) {
      case 'lead:view':
      case 'lead:create':
      case 'lead:edit':
      case 'proposal:view':
      case 'project:view':
      case 'project:create':
      case 'project:edit':
      case 'milestone:manage':
      case 'task:view_internal':
      case 'task:manage':
      case 'message:view_client':
      case 'message:view_internal':
      case 'message:send_internal':
      case 'message:send_client':
      case 'content:manage':
      case 'org:view':
        return true;
      default:
        return false;
    }
  }

  if (user.role === UserRole.FINANCE) {
    switch (capability) {
      case 'invoice:view':
      case 'invoice:create':
      case 'invoice:edit':
      case 'invoice:void':
      case 'invoice:pay':
      case 'proposal:view':
      case 'org:view':
      case 'audit:read':
        return true;
      default:
        return false;
    }
  }

  if (user.role === UserRole.CONTENT_EDITOR) {
    switch (capability) {
      case 'content:manage':
      case 'review:approve':
        return true;
      default:
        return false;
    }
  }

  if (user.role === UserRole.SUPPORT) {
    switch (capability) {
      case 'message:view_client':
      case 'message:send_client':
      case 'project:view':
      case 'org:view':
        return true;
      default:
        return false;
    }
  }

  // 4. Client / Tenant-Scoped Role Checks
  if (user.role === UserRole.CLIENT) {
    // Internal-only capabilities are strictly prohibited for client roles
    const internalOnlyCapabilities: Capability[] = [
      'system:settings',
      'audit:read',
      'users:manage',
      'task:view_internal',
      'message:view_internal',
      'message:send_internal',
      'lead:view',
      'lead:create',
      'lead:edit',
      'lead:delete',
      'review:approve',
      'content:manage',
      'invoice:create',
      'invoice:edit',
      'invoice:void',
    ];

    if (internalOnlyCapabilities.includes(capability)) {
      return false;
    }

    // Determine the user's role in the specified organization
    let orgRole: OrganizationRole | null = null;

    if (organizationId) {
      const membership = user.memberships?.find(
        (m) => m.organizationId === organizationId && m.status === 'ACTIVE'
      );
      if (membership) {
        orgRole = membership.role;
      } else if (user.clientProfile?.organizationId === organizationId) {
        // Fallback to primary clientProfile
        orgRole = OrganizationRole.CLIENT_MEMBER;
      } else {
        // Organization specified, but user does not belong to it
        return false;
      }
    } else {
      // General client permission check (e.g. Can this client view projects in general?)
      if (user.clientProfile?.organizationId || (user.memberships && user.memberships.length > 0)) {
        orgRole = OrganizationRole.CLIENT_MEMBER;
      } else {
        return false;
      }
    }

    switch (orgRole) {
      case OrganizationRole.CLIENT_OWNER:
        return [
          'org:view',
          'org:manage_members',
          'proposal:view',
          'proposal:accept',
          'project:view',
          'task:manage',
          'invoice:view',
          'invoice:pay',
          'message:view_client',
          'message:send_client',
        ].includes(capability);

      case OrganizationRole.CLIENT_BILLING_CONTACT:
        return [
          'org:view',
          'invoice:view',
          'invoice:pay',
          'proposal:view',
          'message:view_client',
          'message:send_client',
        ].includes(capability);

      case OrganizationRole.CLIENT_PROJECT_CONTACT:
        return [
          'org:view',
          'project:view',
          'task:manage',
          'message:view_client',
          'message:send_client',
        ].includes(capability);

      case OrganizationRole.CLIENT_MEMBER:
        return [
          'org:view',
          'project:view',
          'message:view_client',
          'message:send_client',
        ].includes(capability);

      default:
        return false;
    }
  }

  return false;
}

/**
 * Express middleware helper to enforce a capability check
 */
export function requireCapability(
  capability: Capability,
  getOrgId?: (req: AuthenticatedRequest) => string | undefined
) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        code: 'UNAUTHORIZED',
        message: 'Authentication session required',
      });
      return;
    }

    const orgId = getOrgId
      ? getOrgId(req)
      : (req.params.orgId || (req.query.orgId as string) || req.body.organizationId || req.body.orgId);

    if (!can(req.user, capability, orgId)) {
      res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: `Action not permitted for your current role or organization scope. Required capability: ${capability}`,
      });
      return;
    }

    next();
  };
}
