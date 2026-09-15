/**
 * Phase 2 Integration Test Suite: Tenant Isolation & Authorization
 * 
 * Verifies:
 * 1. Multi-tenant boundary isolation between organizations.
 * 2. Role-based capability policy helper (can()).
 * 3. Client user isolation from internal staff notes and restricted messages.
 * 4. Canonical invoice state machine & minor units calculation.
 * 5. Cryptographic forward-hash chain verification and tamper detection.
 */

import assert from 'assert';
import { UserRole, OrganizationRole, InvoiceStatus, MessageVisibility } from '@prisma/client';
import { can } from '../middleware/policy';
import { resolveAuthorizedOrgId, tenantWhereClause, TenantAccessError } from '../middleware/tenantScope';
import { InvoiceService } from '../services/invoice.service';
import { computeAuditHash, verifyAuditChain } from '../utils/auditLogger';

console.log('================================================================');
console.log('RUNNING PHASE 2 TENANT ISOLATION & AUTHORIZATION TEST SUITE');
console.log('================================================================\n');

// ------------------------------------------------------------------------------
// Test Setup: Fixtures for Two Distinct Organizations
// ------------------------------------------------------------------------------

const orgAlphaId = 'org-alpha-101';
const orgBetaId = 'org-beta-202';

const clientOwnerAlpha = {
  id: 'user-alpha-owner',
  email: 'owner@alpha.corp',
  role: UserRole.CLIENT,
  clientProfile: { organizationId: orgAlphaId },
  memberships: [
    { organizationId: orgAlphaId, role: OrganizationRole.CLIENT_OWNER, status: 'ACTIVE' },
  ],
};

const clientBillingAlpha = {
  id: 'user-alpha-billing',
  email: 'billing@alpha.corp',
  role: UserRole.CLIENT,
  clientProfile: { organizationId: orgAlphaId },
  memberships: [
    { organizationId: orgAlphaId, role: OrganizationRole.CLIENT_BILLING_CONTACT, status: 'ACTIVE' },
  ],
};

const clientMemberAlpha = {
  id: 'user-alpha-member',
  email: 'dev@alpha.corp',
  role: UserRole.CLIENT,
  clientProfile: { organizationId: orgAlphaId },
  memberships: [
    { organizationId: orgAlphaId, role: OrganizationRole.CLIENT_MEMBER, status: 'ACTIVE' },
  ],
};

const clientOwnerBeta = {
  id: 'user-beta-owner',
  email: 'founder@beta.tech',
  role: UserRole.CLIENT,
  clientProfile: { organizationId: orgBetaId },
  memberships: [
    { organizationId: orgBetaId, role: OrganizationRole.CLIENT_OWNER, status: 'ACTIVE' },
  ],
};

const agencyStaff = {
  id: 'user-agency-staff',
  email: 'engineer@cyberstyle.net',
  role: UserRole.STAFF,
};

const agencyFinance = {
  id: 'user-agency-finance',
  email: 'finance@cyberstyle.net',
  role: UserRole.FINANCE,
};

const agencySuperAdmin = {
  id: 'user-super-admin',
  email: 'admin@cyberstyle.net',
  role: UserRole.SUPER_ADMIN,
};

// ------------------------------------------------------------------------------
// TEST 1: Cross-Organization Access Boundary (IDOR Prevention)
// ------------------------------------------------------------------------------
console.log('▶ Test 1: Cross-Organization Tenant Boundary Enforcement');

// Alpha Owner accessing Alpha: allowed
assert.strictEqual(
  can(clientOwnerAlpha, 'project:view', orgAlphaId),
  true,
  'Client Owner Alpha must access own organization projects'
);

// Alpha Owner accessing Beta: STRICTLY FORBIDDEN
assert.strictEqual(
  can(clientOwnerAlpha, 'project:view', orgBetaId),
  false,
  'Client Owner Alpha MUST NOT access Organization Beta projects'
);

// Beta Owner accessing Alpha invoices: STRICTLY FORBIDDEN
assert.strictEqual(
  can(clientOwnerBeta, 'invoice:view', orgAlphaId),
  false,
  'Client Owner Beta MUST NOT access Organization Alpha invoices'
);

// Resolution helper throws on unauthorized tenant access
assert.throws(
  () => resolveAuthorizedOrgId(clientOwnerAlpha, orgBetaId),
  TenantAccessError,
  'resolveAuthorizedOrgId must throw TenantAccessError when accessing foreign tenant'
);

// Resolution helper succeeds on authorized tenant
assert.strictEqual(
  resolveAuthorizedOrgId(clientOwnerAlpha, orgAlphaId),
  orgAlphaId,
  'resolveAuthorizedOrgId must return authorized organization ID'
);

// Query builder attaches authorized organizationId
const scopedQuery = tenantWhereClause(clientOwnerAlpha, undefined, { status: 'ACTIVE' });
assert.strictEqual(scopedQuery.organizationId, orgAlphaId, 'tenantWhereClause must attach authorized organizationId');

console.log('  ✓ PASS: Tenant boundary enforcement (Zero Cross-Org Leakage)\n');

// ------------------------------------------------------------------------------
// TEST 2: Role Separation (Client vs Platform Roles)
// ------------------------------------------------------------------------------
console.log('▶ Test 2: Platform and Organization Role Policy Isolation');

// Clients can NEVER access internal settings, audit logs, or manage platform users
assert.strictEqual(can(clientOwnerAlpha, 'system:settings'), false);
assert.strictEqual(can(clientOwnerAlpha, 'audit:read'), false);
assert.strictEqual(can(clientOwnerAlpha, 'users:manage'), false);

// Client Billing Contact can view/pay invoices, but CANNOT manage projects or members
assert.strictEqual(can(clientBillingAlpha, 'invoice:view', orgAlphaId), true);
assert.strictEqual(can(clientBillingAlpha, 'invoice:pay', orgAlphaId), true);
assert.strictEqual(can(clientBillingAlpha, 'project:view', orgAlphaId), false);
assert.strictEqual(can(clientBillingAlpha, 'org:manage_members', orgAlphaId), false);

// Client Member can view projects, but CANNOT accept proposals or pay invoices
assert.strictEqual(can(clientMemberAlpha, 'project:view', orgAlphaId), true);
assert.strictEqual(can(clientMemberAlpha, 'invoice:view', orgAlphaId), false);
assert.strictEqual(can(clientMemberAlpha, 'proposal:accept', orgAlphaId), false);

// Finance role can view invoices, but cannot edit projects
assert.strictEqual(can(agencyFinance, 'invoice:view'), true);
assert.strictEqual(can(agencyFinance, 'project:edit'), false);

// Super admin has universal permissions
assert.strictEqual(can(agencySuperAdmin, 'system:settings'), true);
assert.strictEqual(can(agencySuperAdmin, 'audit:read'), true);
assert.strictEqual(can(agencySuperAdmin, 'project:delete'), true);

console.log('  ✓ PASS: Role separation (Client roles vs Agency roles)\n');

// ------------------------------------------------------------------------------
// TEST 3: Internal Message & Staff Note Protection
// ------------------------------------------------------------------------------
console.log('▶ Test 3: Internal Notes & Message Visibility Isolation');

// Client users can NEVER view or send internal staff messages
assert.strictEqual(
  can(clientOwnerAlpha, 'message:view_internal'),
  false,
  'Client Owner MUST NOT view internal messages'
);
assert.strictEqual(
  can(clientOwnerAlpha, 'message:send_internal'),
  false,
  'Client Owner MUST NOT post internal notes'
);

// Agency staff CAN view and post internal messages
assert.strictEqual(
  can(agencyStaff, 'message:view_internal'),
  true,
  'Agency Staff must have access to internal discussions'
);
assert.strictEqual(
  can(agencyStaff, 'message:send_internal'),
  true,
  'Agency Staff must be allowed to post internal notes'
);

// Simulated message query filter verification
const messages = [
  { id: 'm1', content: 'Client-visible project update', visibility: MessageVisibility.CLIENT_VISIBLE, isInternal: false },
  { id: 'm2', content: 'Internal staff margin note', visibility: MessageVisibility.INTERNAL_STAFF_ONLY, isInternal: true },
  { id: 'm3', content: 'Restricted security review', visibility: MessageVisibility.RESTRICTED, isInternal: true },
];

const filterForClient = messages.filter(
  (m) => m.visibility === MessageVisibility.CLIENT_VISIBLE && !m.isInternal
);
assert.strictEqual(filterForClient.length, 1);
assert.strictEqual(filterForClient[0]!.id, 'm1');

console.log('  ✓ PASS: Internal notes strictly blocked from client exposure\n');

// ------------------------------------------------------------------------------
// TEST 4: Invoice State Transitions & Minor Units
// ------------------------------------------------------------------------------
console.log('▶ Test 4: Canonical Invoice State Machine & Minor Units Calculation');

// Minor units calculations
assert.strictEqual(InvoiceService.toCents(100), 10000, '$100 converts to 10000 cents');
assert.strictEqual(InvoiceService.toCents('2500.50'), 250050, '$2500.50 converts to 250050 cents');
assert.strictEqual(InvoiceService.fromCents(250050), 2500.5, '250050 cents converts back to $2500.50');

// Legal Transitions
assert.strictEqual(InvoiceService.canTransition(InvoiceStatus.DRAFT, InvoiceStatus.SENT), true);
assert.strictEqual(InvoiceService.canTransition(InvoiceStatus.SENT, InvoiceStatus.DUE), true);
assert.strictEqual(InvoiceService.canTransition(InvoiceStatus.DUE, InvoiceStatus.PAID), true);
assert.strictEqual(InvoiceService.canTransition(InvoiceStatus.DUE, InvoiceStatus.DISPUTED), true);
assert.strictEqual(InvoiceService.canTransition(InvoiceStatus.PAID, InvoiceStatus.REFUNDED_CREDITED), true);

// Illegal Transitions (Enforced Server-Side)
assert.strictEqual(
  InvoiceService.canTransition(InvoiceStatus.PAID, InvoiceStatus.DRAFT),
  false,
  'PAID invoices cannot revert to DRAFT'
);
assert.strictEqual(
  InvoiceService.canTransition(InvoiceStatus.VOID, InvoiceStatus.PAID),
  false,
  'VOID is terminal; cannot transition to PAID'
);
assert.strictEqual(
  InvoiceService.canTransition(InvoiceStatus.REFUNDED_CREDITED, InvoiceStatus.SENT),
  false,
  'REFUNDED is terminal; cannot transition to SENT'
);

console.log('  ✓ PASS: Canonical invoice state machine enforced\n');

// ------------------------------------------------------------------------------
// TEST 5: Cryptographic Forward-Hash Audit Log Chain
// ------------------------------------------------------------------------------
console.log('▶ Test 5: Tamper-Evident Audit Log Cryptographic Hash Chaining');

const genesisHash = '0000000000000000000000000000000000000000000000000000000000000000';
const t1 = new Date('2026-09-13T10:00:00Z');
const t2 = new Date('2026-09-13T10:05:00Z');
const t3 = new Date('2026-09-13T10:10:00Z');

// Entry 1
const hash1 = computeAuditHash(genesisHash, 'USER_LOGIN', 'User', 'u-1', t1, { ip: '127.0.0.1' });
const log1 = {
  action: 'USER_LOGIN',
  entityType: 'User',
  entityId: 'u-1',
  createdAt: t1,
  changes: { ip: '127.0.0.1' },
  previousHash: genesisHash,
  currentHash: hash1,
};

// Entry 2 (chains to hash1)
const hash2 = computeAuditHash(hash1, 'INVOICE_SENT', 'Invoice', 'inv-1', t2, { amount: 5000 });
const log2 = {
  action: 'INVOICE_SENT',
  entityType: 'Invoice',
  entityId: 'inv-1',
  createdAt: t2,
  changes: { amount: 5000 },
  previousHash: hash1,
  currentHash: hash2,
};

// Entry 3 (chains to hash2)
const hash3 = computeAuditHash(hash2, 'PROPOSAL_ACCEPTED', 'Proposal', 'prop-1', t3, { sig: 'Hani' });
const log3 = {
  action: 'PROPOSAL_ACCEPTED',
  entityType: 'Proposal',
  entityId: 'prop-1',
  createdAt: t3,
  changes: { sig: 'Hani' },
  previousHash: hash2,
  currentHash: hash3,
};

const validChain = [log1, log2, log3];
const resultValid = verifyAuditChain(validChain);

assert.strictEqual(resultValid.isValid, true, 'Audit log chain must be cryptographically valid');
assert.strictEqual(resultValid.verifiedCount, 3);
console.log('  ✓ Hash chain sequentially verified (3/3 valid entries)');

// Tamper Simulation: Altering a past log entry (e.g. changing invoice amount from 5000 to 1000)
const tamperedChain = [
  log1,
  {
    ...log2,
    changes: { amount: 1000 }, // Unauthorized tamper
  },
  log3,
];

const resultTampered = verifyAuditChain(tamperedChain);
assert.strictEqual(resultTampered.isValid, false, 'Tampered audit trail must fail verification');
assert.strictEqual(resultTampered.corruptedIndex, 1, 'Corrupted index must point precisely to altered entry');
console.log('  ✓ Tampering detected and flagged at index 1');

console.log('\n================================================================');
console.log('ALL PHASE 2 TENANT ISOLATION & AUTHORIZATION TESTS PASSED (5/5)');
console.log('================================================================');
