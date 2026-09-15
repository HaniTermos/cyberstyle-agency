You are a principal full-stack engineer, application-security engineer, UX product designer, DevOps engineer, and database migration specialist.

You are working inside the CYBERSTYLE monorepo. Your task is to review and improve the currently open Admin Dashboard page and prepare the local development environment for real agency data.

IMPORTANT: Work carefully. Do not claim a feature is secure, real-time, verified, production-ready, cryptographically protected, Stripe-connected, or live unless the actual source code, configuration, and tests prove it.

==================================================
CURRENT PAGE TO REVIEW
==================================================

The current page is:

/admin/dashboard

Current UI language includes terms similar to:
- “Executive Command Center”
- “LIVE DATA”
- “Realtime database telemetry”
- “verified leads”
- “Live projects in production delivery”
- “Milestone execution verified from database tasks and deliveries”
- “Cryptographic hash verification”
- development/sandbox environment banner

The desired product is a premium, calm, practical agency operating system for CYBERSTYLE—not a fictional enterprise control room.

==================================================
PHASE 1 — AUDIT FIRST, NO DESTRUCTIVE ACTIONS
==================================================

Before modifying anything:

1. Inspect the actual implementation of:
   - The admin dashboard route/page
   - Its components
   - Its API endpoints or server actions
   - Data-fetching services
   - Prisma schema and migrations
   - Authentication and authorization middleware
   - User/role models
   - Environment validation
   - Seed scripts
   - Docker / local database setup
   - Existing tests
   - Audit log implementation
   - Any demo-data generation logic

2. Identify which dashboard values are:
   - Real database-backed values
   - Development/demo fixtures
   - Hardcoded values
   - Derived metrics
   - Unsupported UI claims
   - Missing/unfinished

3. Produce a short report before changing code containing:
   - Files inspected
   - Current dashboard data sources
   - Existing user/auth system
   - Existing database reset/seed process
   - Any danger of deleting migrations, schema, production data, or authentication access
   - Required changes
   - Files that will be modified
   - Database migration impact
   - Rollback plan
   - Exact tests to run

4. Stop and wait for my approval after the report.

Do not reset, truncate, drop, migrate, seed, delete, create users, send emails, or modify authentication in Phase 1.

==================================================
TARGET DASHBOARD REQUIREMENTS
==================================================

After approval, redesign and improve /admin/dashboard according to these requirements.

A. Naming and tone
- Replace “Executive Command Center” with one of:
  - “Agency Overview”
  - “Today’s Operations”
  - “CYBERSTYLE Operations”
- Prefer “Current workspace data” over “LIVE DATA.”
- Remove “realtime,” “telemetry,” and “verified” unless a real documented implementation supports those claims.
- Replace “Live projects in production delivery” with “Active projects.”
- Replace “Milestone execution verified from database tasks and deliveries” with:
  “Milestone counts from current project records.”
- Replace “Cryptographic hash verification” with “Audit log” unless an actual tamper-evident audit chain is implemented, tested, and verifiable.
- Keep the interface professional, restrained, clear, and useful.

B. Development/demo banner
- Keep a clear environment banner only when NODE_ENV is development, test, preview, staging, or explicit demo mode.
- Never show the development/sandbox banner in production.
- The production dashboard must not claim simulated data.
- Demo mode must be server-enforced; browser query parameters must not enable or disable it.

C. Dashboard information architecture
The dashboard should prioritize action, not decorative metrics.

Order:
1. Today’s priorities
2. Leads requiring review or follow-up
3. Project/delivery blockers
4. Invoice and payment attention
5. Messages requiring a response
6. System alerts only if real monitoring/jobs exist
7. Compact operational navigation

D. Required cards
Create data-backed cards only:
- New leads: count of real leads created within the selected date range.
- Follow-ups due: real follow-up dates that are today or overdue.
- Active projects: real project records with approved active statuses.
- Invoices needing attention: real due, overdue, disputed, failed, or partially paid invoices.
- Unread/reply-needed client messages: only if message states are actually implemented.
- System health: only if backed by real health checks, job status, or monitoring signals.

E. Truthful metrics
- Never show fake revenue, client totals, conversion rates, success rates, utilization, capacity, uptime, completion percentages, SLA attainment, response time, AI confidence, or “live” labels.
- Project progress must use factual milestone counts:
  “X of Y milestones completed.”
- Show “No data yet” and a helpful next action when tables are empty.
- Empty states must be concise and useful:
  - “No new leads yet — add one manually or connect your contact form.”
  - “No active projects — create a project after accepting a proposal.”
  - “No invoices need attention.”
- Every card should link to its real source route.

F. Accessibility and responsive UX
- Use semantic heading hierarchy.
- Ensure keyboard navigation and visible focus states.
- Do not rely on colour alone for states.
- Use accessible labels for icon-only controls.
- Ensure tables/cards work on mobile.
- Add loading, empty, error, and retry states.
- Respect reduced-motion settings.
- Keep contrast accessible.

G. Security requirements
- Do not expose internal-only notes, audit metadata, secret values, file paths, raw database errors, or records from another organization.
- All API/database queries must enforce server-side authentication and role/capability checks.
- If admin routes can view client-scoped data, require explicit organization context where appropriate.
- Do not trust role, user ID, organization ID, count, status, or finance data from the browser.
- Use validated server-side inputs.

==================================================
DATABASE RESET AND REAL ADMIN SETUP
==================================================

My goal is to remove all demo/business sample data locally and begin entering my own real agency data.

DO NOT blindly “drop all tables.”

Instead, after I approve Phase 1, inspect the schema and implement a SAFE LOCAL DEVELOPMENT RESET workflow.

Requirements:

1. Scope restriction
- It must work only in local development.
- It must refuse to run if:
  - NODE_ENV is production
  - NODE_ENV is staging
  - NODE_ENV is preview
  - DATABASE_URL does not clearly point to an approved local development database
  - ALLOW_DATABASE_RESET is not exactly “true”
- It must print a clear refusal message without leaking database credentials.
- It must not run automatically during normal startup, build, deployment, CI, or migrations.

2. Safe reset behavior
- Preserve Prisma migration history and schema infrastructure.
- Prefer Prisma’s development-safe reset tooling only after confirmation, or delete application demo records in correct foreign-key order.
- Do not delete environment configuration files.
- Do not delete source files.
- Do not delete object storage/files unless there is an explicit local-only storage reset option and confirmation.
- Do not touch production, staging, preview, cloud, shared, or remote databases.
- Never use a destructive database command based only on a browser request.
- Require an interactive typed confirmation phrase when run manually:
  RESET LOCAL CYBERSTYLE DATA
- Make a database backup/export snapshot before destructive local reset if practical.
- Provide a restore instruction.

3. Demo-data removal
- Identify all seed files, demo fixtures, hardcoded dashboard metrics, sample invoices, fake clients, sample leads, mock messages, sample projects, seed user accounts, and demo content.
- Remove or disable demo seeding by default.
- Keep an optional explicit demo seed command for UI testing, such as:
  npm run db:seed:demo
- Never seed demo data automatically in production or staging.
- Clearly label all demo/test records if the optional demo seed is used.

4. First real administrator
- Create exactly one local administrator account:
  - Display name: Hani
  - Email: hani.sites@gmail.com
- Do not hardcode any password in source code, documentation, seed files, terminal output, or Git history.
- Use the existing secure auth architecture if present; otherwise propose the safest minimal implementation before modifying auth.
- The account must use a unique strong password created by me through a secure bootstrap process.
- Do not set a default password.
- Do not reveal password hashes.
- Store passwords only with Argon2id.
- Make the bootstrap command one-time, idempotent, and safe to rerun.
- It must refuse to create an administrator in production unless a separately reviewed production bootstrap process is approved.

5. Email OTP verification for hani.sites@gmail.com
Implement email OTP/MFA only after auditing the existing authentication and email system.

Requirements:
- Use email OTP as a second verification step for the administrator login, if this is the desired temporary MFA method.
- State clearly in the report that email OTP is weaker than TOTP/passkeys because access to the mailbox becomes the security boundary.
- Recommend TOTP or passkeys for the long-term production administrator MFA method.
- OTP must be:
  - Generated with cryptographically secure randomness
  - At least 6 digits or equivalent secure entropy
  - Hashed before storage
  - Single-use
  - Short-lived, preferably 10 minutes or less
  - Bound to user, login attempt, purpose, and session
  - Invalidated after successful use
  - Invalidated when a newer code is requested
  - Limited to a small number of attempts
  - Protected with login, resend, and verification rate limits
  - Never logged, returned from APIs, or exposed in errors
  - Sent only after successful password verification
  - Audited without storing the actual code
- Use a transactional email provider through environment variables. Do not hardcode SMTP credentials.
- In local development, use a safe mail catcher or console-safe development transport that never sends real emails unless I explicitly configure a verified SMTP provider.
- Do not claim “email verified” or “MFA enabled” until a real verification event succeeds.
- Implement account enumeration protection with generic login responses.
- If email delivery fails, show a safe retry flow and do not authenticate the user.
- Add secure logout, server-side session revocation, secure HttpOnly cookies, CSRF protection for cookie-authenticated mutations, and session expiration rules if missing.
- Add TOTP/passkey architecture recommendations for the next security phase.

6. Required commands and documentation
Create documented, safe commands only after approval:
- npm run db:check-target
- npm run db:backup:local
- npm run db:reset:local
- npm run db:seed:demo
- npm run admin:bootstrap:local
- npm run test:auth
- npm run test:tenant-isolation
- npm run test:dashboard

Document:
- Exact prerequisites
- Required environment variables by NAME ONLY, never values
- Confirmation phrase
- What is deleted
- What is preserved
- How to create the Hani admin safely
- How to configure development email safely
- How to migrate to staging and production without destructive resets
- Rollback and restore steps

==================================================
TESTS REQUIRED
==================================================

After approved implementation, add and run tests for:

1. Dashboard
- Dashboard uses real database-backed values.
- Empty states render with no data.
- Unsupported “live,” “verified,” “cryptographic,” and fake-metric claims are removed.
- Counts cannot include unauthorized records.
- Loading/error states work.

2. Database reset
- Reset refuses in production/staging/preview.
- Reset refuses without ALLOW_DATABASE_RESET=true.
- Reset refuses without typed confirmation.
- Reset preserves migrations/schema infrastructure.
- Reset deletes only approved local application data.
- Optional demo seed is never run by default.

3. Administrator bootstrap
- Hani account can be created only through an explicit local bootstrap command.
- Bootstrap is idempotent.
- No default password is introduced.
- Password hash uses Argon2id.
- Script refuses unsafe environments.

4. Email OTP
- Password is required before OTP generation.
- OTP is hashed in storage.
- OTP expires.
- OTP is single-use.
- Latest OTP invalidates prior OTP.
- Attempts are rate-limited.
- Resends are rate-limited.
- OTP is never returned/logged.
- Failed email delivery does not authenticate.
- Session is created only after successful OTP validation.
- Logout/session revocation works.

5. Security
- Unauthorized users cannot access /admin/dashboard.
- Normal client users cannot access admin routes.
- Admin user access is protected.
- Sensitive data is not exposed in errors or logs.
- Typecheck, lint, unit tests, integration tests, and production build pass.

==================================================
REQUIRED RESPONSE FORMAT
==================================================

For the first response, perform Phase 1 audit only and provide:

1. Files inspected
2. Current state of /admin/dashboard
3. Current data source classification
4. Unsupported or misleading claims
5. UX/UI improvement plan
6. Auth and user-system findings
7. Database and seed/reset findings
8. Email/OTP feasibility findings
9. Security risks and P0 blockers
10. Exact files proposed for change
11. Migration plan
12. Safe rollback plan
13. Test plan
14. Questions that require my decision
15. A final line:
   “WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not modify code, reset data, drop tables, create users, or send email during the first response.


ROADMAP PAGE:

You are a senior product engineer, UX designer, security-minded technical lead, and project-management systems architect.

You are working in the CYBERSTYLE repository. Review and improve only this page:

/admin/roadmap

Do not modify authentication, billing, database reset scripts, file storage, deployment configuration, user accounts, email OTP, production infrastructure, or unrelated pages during this task.

==================================================
PHASE 1 — AUDIT ONLY
==================================================

Before changing any file:

1. Inspect:
   - /admin/roadmap route and its components
   - Its data source, API route, server action, database models, seed data, and types
   - Any roadmap/sprint/task models in Prisma
   - Any hardcoded milestones or progress values
   - Existing admin authorization guard
   - Existing tests for this page
   - Existing demo/development environment detection

2. Classify every roadmap card and metric as:
   - Real database record
   - Demo/seed record
   - Hardcoded content
   - Derived metric
   - Unsupported claim
   - Unimplemented feature

3. Do not modify code yet.

Return:
- Files inspected
- Current data model and data source
- Every hardcoded or demo item
- Every unsupported or misleading claim
- Proposed data model changes, if needed
- Exact files that would be changed
- Migration impact
- Required tests
- Rollback plan
- Questions requiring my decision

End with:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

==================================================
TARGET UX AND PRODUCT REQUIREMENTS
==================================================

After approval, turn this into a truthful internal roadmap for CYBERSTYLE operations.

The page should be named:

“Product & Operations Roadmap”

Optional subtitle:

“Plan, prioritize, validate, and release the systems that help CYBERSTYLE operate.”

This is an internal planning page. It must not pretend that unverified architecture, security, AI, payment, or infrastructure systems are completed.

==================================================
REMOVE OR REWRITE MISLEADING LANGUAGE
==================================================

Do not use these labels unless proven by implemented code, operational configuration, and automated tests:

- Executive Command Center
- Live Data
- Realtime database telemetry
- Zero-Trust
- Cryptographic hash verification
- Verified idempotent webhooks
- Real-time threaded communications
- Audit Vault
- Multi-region high availability
- Global database read replicas
- Production delivery
- Enterprise-grade
- Fully automated pentest
- Dependency vulnerability autofix
- Any 100% completion label without evidence

Replace content as follows:

1. “Phase 1: Zero-Trust Admin & Portal Isolation”
   Replace with:
   “Authentication and access-control foundation”

2. “Phase 2: Stripe Billing Engine & PDF Invoicing”
   Replace with:
   “Billing workflow and invoice management”

3. “Phase 3: AI Lead Intelligence & Proposal Workspace”
   Replace with:
   “AI-assisted lead review and proposal workflow”

4. “Phase 4: Real-time Threaded Comms & Audit Vault”
   Replace with:
   “Client communication and activity history”

5. “Multi-Region High-Availability & Edge CDN”
   Move to a Deferred/Future section:
   “Scale infrastructure when real usage requires it”

6. “Automated Codebase Health & Pentest Scanner”
   Replace with:
   “Dependency monitoring and periodic security review”

7. “Native Mobile Client App”
   Move to Deferred:
   “Validate client demand before mobile application development”

==================================================
STATUS MODEL
==================================================

Replace generic “Completed / In Development / Planned” with:

- Backlog
- Planned
- In progress
- In review
- Validated
- Deferred

Never use a percentage progress value unless all of the following are true:
- The work item has an explicit checklist.
- The percentage is calculated from completed checklist items.
- The checklist is visible or accessible from the item.
- The result is not presented as a delivery/security guarantee.

Prefer status badges and acceptance-criteria counts, for example:

- Planned
- In progress — 2 of 6 acceptance checks complete
- In review — tests pending
- Validated — staging checks passed
- Deferred — not justified by current usage

“Validated” must not mean deployed to production. Display a separate environment label:

- Not deployed
- Development
- Staging
- Production

==================================================
ROADMAP ITEM DATA MODEL
==================================================

If a roadmap model is needed, propose or implement it only after approval.

A roadmap item should support:

- id
- title
- description
- category
- priority: P0, P1, P2, P3
- status
- target period/date, optional
- owner, optional
- environment/deployment status
- dependencies
- risks
- decision notes
- acceptance criteria
- completed acceptance criteria count
- implementation evidence links: PR, commit, test run, deployment, runbook
- createdAt
- updatedAt
- completedAt, optional
- archivedAt, optional

Allowed categories:
- Security
- Core workflow
- CRM
- Delivery
- Finance
- Client portal
- Publishing
- AI assistance
- Monitoring
- Infrastructure
- Compliance
- UX/accessibility

Do not create fake owners, fake dates, fake implementation links, fake acceptance criteria, or fake evidence.

==================================================
RECOMMENDED INITIAL ROADMAP
==================================================

Create these as truthful initial records only if the user approves and the database supports them:

P0:
- Remove public/default credentials and rotate any exposed credentials
- Separate development, staging, and production environments
- Audit authentication, sessions, administrator MFA, and authorization
- Enforce organization isolation and add tenant-boundary tests
- Verify Stripe webhook signatures, idempotency, and invoice state transitions
- Secure file upload/download with private storage and authorization
- Configure backups, test restoration, monitoring, and error tracking

P1:
- Lead inbox, qualification, ownership, and follow-up workflow
- Proposal-to-project conversion workflow
- Project milestones, deliverables, and versioned client approvals
- Client-safe message and feedback workflow
- Truthful dashboard based on real operational data
- Simple Field Notes/blog and case-study publishing workflow

P2:
- Search, exports, basic reports, and analytics
- AI-assisted lead summaries and draft content with human approval
- Real monitoring dashboards based on configured probes

Deferred:
- Multi-region infrastructure
- Database read replicas
- Native client mobile app
- Automated security remediation
- Advanced AI autonomy
- Complex enterprise analytics

==================================================
UI/UX REQUIREMENTS
==================================================

- Match CYBERSTYLE’s calm, premium, editorial, restrained visual system.
- Avoid fake terminal visuals, alarm-like colors, excessive glow, decorative progress bars, or artificial “system telemetry.”
- Make priority and status distinguishable without relying only on color.
- Add clear empty states:
  “No roadmap items yet. Add the first operational priority.”
- Add loading, error, and retry states.
- Use semantic HTML, keyboard navigation, visible focus states, accessible labels, and responsive layout.
- Allow sorting/filtering by status, priority, category, period, and deployment state.
- Add search only if backed by a real secure query.
- Ensure ordinary admins can see and manage only the roadmap records allowed by their role.
- Record audit events for create, edit, status change, archive, and delete actions.
- Confirm deletes with a dialog; prefer archive over permanent deletion.
- Never show secret values, raw errors, private audit metadata, or misleading infrastructure/security claims.

==================================================
TEST REQUIREMENTS
==================================================

After approval and implementation, add and run tests for:

1. Access control
- Unauthenticated users cannot access /admin/roadmap.
- Client/portal users cannot access admin roadmap data.
- Authorized roles can view appropriate roadmap items.
- Unauthorized roles cannot mutate roadmap items.

2. Data integrity
- Valid status values only.
- Valid priority values only.
- Dates are valid.
- No fake calculated progress without acceptance criteria.
- Archive behavior works.
- Audit events are created for mutations.

3. UX
- Empty state renders.
- Loading and error states render.
- Filters and search do not expose unauthorized data.
- Mobile layout works.
- Keyboard navigation works.

4. Quality
- Typecheck passes.
- Lint passes.
- Tests pass.
- Production build passes.

At the end of implementation, provide:
- Summary of changes
- Files changed
- Migration details
- Rollback plan
- Test output summary
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

LEADS PAGE:

You are a principal full-stack engineer, CRM product designer, privacy-conscious security engineer, and AI workflow architect.

You are working inside the CYBERSTYLE monorepo.

Review this page only:

/admin/leads

This page is the internal sales lead-management workspace for CYBERSTYLE. Its goal is to help the agency capture, review, qualify, follow up with, and convert real business inquiries into clients and projects.

Do not modify authentication, billing, Stripe, production infrastructure, database reset scripts, email OTP, client portal, file storage, or unrelated pages during this task.

==================================================
PHASE 1 — AUDIT ONLY
==================================================

Before modifying any files:

1. Inspect the real implementation of:
   - /admin/leads route/page
   - All components used by the page
   - API routes, server actions, services, repositories, and validation schemas
   - Prisma Lead, Contact, ClientOrganization, Proposal, Project, Activity, Note, Task, User, and AuditLog models if they exist
   - Database migrations
   - Any seed/demo data
   - Public contact form and Start a Project form integration
   - Authentication and admin authorization guards
   - Existing tests
   - AI-related lead functions
   - Import/export functions
   - Any Google Maps scraper/import integration

2. Classify every visible item and metric as:
   - Real database-backed data
   - Seed/demo data
   - Hardcoded UI data
   - Derived data
   - Unimplemented mock capability
   - Unsupported/misleading claim

3. Identify:
   - Data leaks and authorization gaps
   - Missing server-side validation
   - Missing tenant/organization boundaries where relevant
   - Missing audit logging
   - XSS, CSRF, IDOR/BOLA, mass-assignment, export, import, and CSV-injection risks
   - PII/privacy risks
   - Potential duplicate-data risks
   - Unsafe AI or automated outreach behavior
   - Missing loading, empty, error, and mobile states

4. Return an audit report with:
   - Files inspected
   - Current route/data/API architecture
   - Current database schema findings
   - Current lead lifecycle/statuses
   - Current source and integration findings
   - Current security findings
   - UI/UX findings
   - Unsupported claims or fake data findings
   - Proposed changes
   - Exact files proposed for change
   - Migration impact
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not modify code, database records, seed data, users, or environment files during Phase 1.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, improve the Leads page to become a truthful and practical CRM workflow.

A. Page identity
Use:

Title: “Leads”
Subtitle: “Review new enquiries, manage follow-ups, and move qualified opportunities forward.”

Do not use unsupported terms such as:
- Live verified leads
- AI-certified leads
- Guaranteed conversion
- Realtime revenue pipeline
- Automated outreach engine
- Verified opportunity score

B. Pipeline states
Use a canonical server-enforced enum/state machine:

- NEW
- REVIEWING
- QUALIFIED
- CONTACTED
- DISCOVERY_SCHEDULED
- PROPOSAL_SENT
- WON
- LOST
- NURTURE

Document allowed transitions. Do not allow free-text status values.

C. Lead record
A lead should support only fields that are genuinely useful and safe:

Identity:
- id
- companyName, optional
- website, optional
- industry, optional
- location, optional

Primary contact:
- contactName, optional
- email, optional
- phone, optional
- preferredContactMethod, optional

Opportunity:
- serviceInterests
- projectSummary
- budgetRange, optional
- timeline, optional
- source
- sourceUrl, optional
- consent/permission metadata where needed

Workflow:
- status
- ownerId, optional
- nextFollowUpAt, optional
- lastContactedAt, optional
- lostReason, optional
- internalNotes
- tags
- createdAt
- updatedAt

Governance:
- importedById, optional
- createdById
- convertedAt, optional
- convertedClientOrganizationId, optional
- archivedAt, optional

Do not store unnecessary sensitive personal data.

D. Lead page layout
Build a practical responsive layout:

Header:
- Leads
- New lead button
- Import button only if authorized and genuinely implemented
- Search

Default operational filters:
- Needs attention
- New
- Unassigned
- Follow-ups due today
- Overdue follow-ups
- Qualified
- Proposal sent
- Won
- Lost
- Nurture
- All

Summary cards, only with real records:
- Needs review
- Follow-ups due today
- Overdue
- Unassigned

Main table/list:
- Lead/company
- Contact
- Source
- Service interest
- Pipeline stage
- Owner
- Next follow-up
- Last activity
- Created date
- Actions

Each record should have:
- Detail page or side panel
- Timeline/activity history
- Internal notes
- Assignment
- Status control
- Follow-up scheduling
- Safe conversion workflow
- Archive action

Default sort:
1. Overdue follow-ups
2. Follow-ups due today
3. New/unassigned leads
4. Recently updated leads

E. Empty/loading/error states
Implement clear states:

No leads:
“No leads yet. New enquiries from the contact and Start a Project forms will appear here. You can also add a lead manually.”

No follow-ups:
“No follow-ups are due right now.”

No search result:
“No leads match your search or filters.”

Error:
“We could not load leads. Try again.”

Loading:
Use accessible non-deceptive loading placeholders.

F. Lead creation and intake
- Public contact and Start a Project forms must submit to a secure server-side lead intake endpoint.
- Validate every request with Zod.
- Implement spam protection: honeypot, rate limits, and optional CAPTCHA only if justified.
- Record source and consent metadata.
- Avoid exposing admin API routes directly to public forms without strict validation/rate limiting.
- Send internal notifications only after validating the intake.
- Do not automatically send prospect emails unless there is a separately approved workflow.

G. Duplicate handling
Implement normalized duplicate detection:

- Email: trim + lowercase
- Domain: trim + lowercase + remove protocol + remove www
- Phone: normalize to E.164 where supported

When a possible duplicate is found:
- Show the possible existing lead to authorized admins.
- Allow “Open existing lead” or “Create anyway.”
- Never merge automatically.
- Audit manual merge/archive decisions.
- Add tests for duplicate detection.

H. Conversion workflow
Lead conversion must not silently create uncontrolled records.

When a lead is marked WON:
- Require explicit review/confirmation.
- Optionally create a ClientOrganization, Contact membership, Proposal record, Project, and/or initial task only according to an approved workflow.
- Use a database transaction for multi-record conversion.
- Record a full audit event.
- Preserve the original lead and conversion relationship.
- Never create an invoice, payment request, login account, or client invitation automatically unless explicitly selected and approved.

I. Import/export
- Import must require authorized admin role.
- Support a reviewed CSV mapping workflow.
- Validate, normalize, deduplicate, preview, and confirm before saving.
- Limit import file size and rows.
- Defend against CSV formula injection by safely escaping exported fields that begin with =, +, -, or @.
- Store source, import time, and importing administrator.
- Export must be permission-controlled, rate-limited where appropriate, and audited.
- Never expose lead records via public URLs.

J. AI assistance
AI may assist but must never be autonomous.

Allowed:
- Summarize project brief
- Extract service interests, budget, industry, timeline, and urgency
- Suggest tags
- Suggest a status
- Draft an internal summary
- Draft an outreach reply for human review

Required safeguards:
- Label all output “AI-generated suggestion”
- Require a human approval before sending, publishing, changing lead status, converting a lead, creating a client, creating a project, or creating an invoice
- Never send emails automatically
- Never make financial, access-control, deletion, or status decisions autonomously
- Send only minimal necessary data to any AI provider
- Never send passwords, tokens, payment data, private attachments, or unnecessary PII
- Protect against prompt injection in form content, imported data, websites, and scraper results
- Add rate limits, cost limits, error handling, and an audit event for AI actions
- Do not present an AI score as fact or “verification”

K. Google Maps/import integration
If the repository contains a Google Maps scraper or lead-import workflow:
- Keep it isolated from automatic outreach.
- Review platform terms, privacy obligations, and data provenance.
- Store source URL and source date.
- Require manual review before a record becomes an active lead.
- Do not perform worldwide mass scraping, automated enrichment, or automatic cold emailing.
- Do not send data externally without an approved, documented reason.

L. Security and permissions
- Require authenticated, authorized admin access on every route/action.
- Client portal users must never access lead data.
- Enforce server-side role/capability checks.
- Validate and allowlist all mutable fields to prevent mass assignment.
- Audit create, update, assignment, status changes, conversion, export, import, archive, restore, and delete actions.
- Use generic safe errors.
- Do not log full lead content, emails, phone numbers, or private notes unnecessarily.
- Use CSRF protection for mutations if cookie authentication is used.
- Ensure pagination, filters, search, exports, imports, and record IDs cannot reveal unauthorized records.

M. Accessibility and quality
- Semantic table/list markup.
- Keyboard accessible filters, menus, modals, and forms.
- Visible focus states.
- Accessible form labels and error messages.
- Do not rely on color alone for lead status.
- Responsive layout for mobile.
- Respect reduced motion.
- Avoid unnecessary animation and dashboard decoration.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authentication and authorization
- Unauthenticated request cannot access leads.
- Client portal user cannot access any leads route/API.
- Unauthorized admin role cannot import/export/delete if not permitted.
- Authorized admin can access allowed records.

2. Validation and security
- Invalid lead input is rejected.
- Mass-assignment fields are ignored/rejected.
- XSS payloads are safely handled.
- CSV formula injection is neutralized on export.
- CSRF protection works where applicable.
- Rate limits apply to public intake and sensitive admin actions.
- Search/filter/pagination cannot leak unauthorized data.

3. Workflow
- Valid state transitions succeed.
- Invalid state transitions fail.
- Follow-up priority sorting works.
- Duplicate detection identifies normalized email/domain/phone duplicates.
- Manual “create anyway” is logged.
- Conversion is transactional.
- Failed conversion leaves no partial client/project records.
- Audit logs are created.

4. AI
- AI output is labelled.
- AI cannot send messages automatically.
- AI cannot change status automatically.
- Sensitive fields are excluded from AI payloads.
- Prompt-injection-like input is treated as untrusted content.

5. UI and quality
- Empty, loading, error, and search-empty states render.
- Responsive view works.
- Keyboard navigation works.
- Typecheck passes.
- Lint passes.
- Unit/integration tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Backfill/data migration plan if needed
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”


PROPOSALS PAGE:
You are a principal full-stack engineer, senior agency-operations product manager, application-security engineer, UX designer, document-workflow architect, and AI-safety engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this route and the directly required supporting proposal workflow:

/admin/proposals

The page is an internal workspace for creating, reviewing, approving, sending, versioning, and tracking proposals and statements of work (SOWs) for real CYBERSTYLE prospects and clients.

Do not modify database reset scripts, administrator creation, email OTP, public-site pages, Stripe payment implementation, file-storage implementation, client-portal pages, Docker/DevOps, or unrelated admin pages during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing anything:

1. Inspect the actual implementation of:
   - /admin/proposals route/page
   - Proposal components, detail panel, forms, dialogs, and tables
   - API routes, server actions, services, repositories, and validation schemas
   - Prisma models and migrations related to proposals, leads, contacts, organizations, projects, invoices, payments, files, audit logs, users, and emails
   - Demo/seed data and hardcoded proposal records
   - Existing proposal PDF/SOW generation
   - Existing email/send/share-link workflow
   - Existing AI drafting/generation workflow
   - Authentication, role/capability checks, and audit logging
   - Existing tests

2. Classify all visible content as:
   - Real database-backed data
   - Demo/seed data
   - Hardcoded UI data
   - Derived data
   - Unimplemented mock capability
   - Unsupported/misleading commercial/security/AI claim

3. Identify all risks:
   - Fictional/unsafe demo customer data
   - Fake budgets, scopes, timelines, or signed/approved statuses
   - Incorrect proposal state transitions
   - Missing proposal versioning
   - Missing approval evidence
   - Automatic project/invoice/client-account creation
   - Unsafe share links
   - PDF/document tampering risks
   - Incorrect money calculations
   - Missing validation
   - Missing authorization
   - Missing audit events
   - IDOR/BOLA risks
   - XSS in proposal content
   - Prompt injection from lead briefs and imported content
   - PII/data leakage to AI providers
   - Uncontrolled email sending
   - Confusing “approved” versus “accepted” states

4. Return an audit report with:
   - Files inspected
   - Current proposal architecture
   - Current database/data model
   - Current demo data/hardcoded content findings
   - Current AI integration findings
   - Current sending/PDF/share-link findings
   - Current security findings
   - Current UI/UX findings
   - Unsupported claims
   - Proposed changes
   - Exact files proposed for modification
   - Database migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not modify code, delete demo records, reset the database, send email, generate files, call AI services, create invoices, create projects, or create user accounts during this audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, make this a truthful, secure, practical proposal workflow.

A. Page wording
Use:

Title: “Proposals”
Subtitle: “Create, review, send, and track client proposals and statements of work.”

Replace or remove:
- “AI Proposal & SOW Drafting Workspace”
- “PHASE 3 GOVERNANCE”
- Direct model-name marketing such as “Gemini 3.7 Flash SOW generator”
- “2-minute Loom pitch scripts”
- Any fake or unsupported “approved,” “verified,” “secure,” “enterprise,” or “live” label

Use an optional contextual label:
“AI draft assistance — review before external use.”

B. Demo-content cleanup
- Identify and remove or disable all default demo customers, names, budgets, project scopes, timelines, pitch scripts, proposal statuses, and fictional acceptance records.
- Never auto-seed demo proposals in development, staging, or production.
- If an optional demo seed is retained for UI testing, require an explicit manual command and visibly label every record as demo.
- Do not use real-looking clients, people, emails, financial figures, or business claims as sample data.
- After demo records are removed, show useful empty states.

C. Proposal state machine
Implement only these canonical states unless the current system has a justified equivalent:

- DRAFT
- INTERNAL_REVIEW
- APPROVED_TO_SEND
- SENT
- VIEWED (optional; only if technically accurate and privacy-reviewed)
- CLIENT_QUESTIONS
- REVISION_REQUESTED
- ACCEPTED
- DECLINED
- EXPIRED
- ARCHIVED

Rules:
- “APPROVED_TO_SEND” is internal approval only.
- “ACCEPTED” means explicit client acceptance with recorded evidence.
- Do not mark a proposal accepted based on link viewing, email opening, browser redirect, or a button without authentication/evidence.
- Define allowed state transitions server-side.
- Record every status transition in the audit log.
- Do not permit arbitrary client/browser status changes.

D. Required data model
A proposal must support:

Identity:
- id
- proposalNumber, unique and human-readable
- title
- status
- versionNumber
- issueDate, optional until sent
- expiresAt, optional
- archivedAt, optional

Relationship:
- leadId, optional but preferred
- contactId, optional
- organizationId, optional only if a real client organization already exists
- ownerId
- preparedById

Scope:
- executiveSummary
- goals
- scopeOfWork
- deliverables
- milestones
- assumptions
- exclusions
- clientResponsibilities
- technicalNotes, internal-only
- riskNotes, internal-only

Commercials:
- currency
- line items stored in integer minor units
- taxes in explicit supported format
- discounts in explicit supported format
- subtotalMinor
- taxTotalMinor
- totalMinor
- paymentSchedule
- deposit requirement if applicable

Governance:
- internalReviewedById
- internalReviewedAt
- approvedToSendById
- approvedToSendAt
- sentById
- sentAt
- acceptedByName/contact reference
- acceptedAt
- declinedAt
- declineReason, optional
- revisionReason, optional

Document/versioning:
- immutable rendered snapshot or PDF for every sent version
- content snapshot/checksum
- parentProposalVersionId or previousVersionId
- document storage reference
- no silent overwrites of sent/accepted versions

Security:
- expiring, random, hashed share token if external sharing is used
- share-link expiration
- revocation state
- secure client authorization when an authenticated portal is used
- audit log links

E. Commercial safety
- Use integer minor units for all money.
- Never use JavaScript floating-point calculations for invoice/proposal totals.
- Perform totals server-side.
- Never trust price, tax, discount, total, or currency values supplied by the browser.
- Validate line items and allowed currency codes.
- Make currency explicit on every displayed amount.
- Do not create invoices or Stripe Checkout links from drafts or internal approval alone.

F. Proposal creation workflow
1. Start from a qualified lead or existing client/contact.
2. Create a draft.
3. Add/edit scope, deliverables, assumptions, exclusions, timeline, and pricing.
4. Optionally use AI to create a draft.
5. Require human editing and review.
6. Move to INTERNAL_REVIEW.
7. Approve as APPROVED_TO_SEND.
8. Explicitly send through a controlled email workflow or generate a secure, expiring share link.
9. Track response/acceptance through a deliberate client action.
10. After ACCEPTED, provide an explicit, confirmed option to create:
   - Client organization, if needed
   - Organization membership/invitation, if approved
   - Project
   - Milestones
   - Initial tasks
   - Draft invoice, only if explicitly selected

Use a database transaction for multi-record conversion. If any operation fails, avoid partial records.

G. Sending and sharing
- Sending must always require a deliberate human action and confirmation.
- Preview the final sent version before send.
- Record the exact sent document version.
- Use an authorized transactional-email provider configured only with environment variables.
- Do not expose SMTP secrets.
- Use safe retry/error handling.
- Prevent duplicate sends.
- Log send events without logging full document contents.
- External share links must be unguessable, stored as hashes, expire, be revocable, and use strict access validation.
- Prefer authenticated portal access for existing clients.

H. AI draft assistance
AI is assistive only.

Allowed:
- Summarize a prospect brief
- Suggest scope outline, deliverables, assumptions, exclusions, discovery questions, risks, and internal proposal notes
- Draft a first-pass proposal section
- Draft an optional video-pitch outline for internal review

Required controls:
- Display: “AI-generated draft — review and edit before external use.”
- Never send, approve, accept, reject, publish, invoice, create accounts, create projects, or alter commercial records autonomously.
- Require a human to explicitly apply any AI suggestion.
- Send only minimum necessary information to the provider.
- Never send credentials, tokens, passwords, payment details, private client files, internal-only messages, or unnecessary personal data.
- Treat lead briefs, uploaded documents, scraped data, and web content as untrusted; protect against prompt injection.
- Provide a safe fallback when AI is unavailable.
- Apply rate limits and cost controls.
- Log AI use safely without storing sensitive prompts/responses unnecessarily.
- Do not represent AI suggestions as verified facts, guaranteed estimates, legal advice, security assurances, or contractual commitments.

I. UI/UX requirements
- Calm, premium, readable, editorial interface.
- Avoid fake operational metrics, decorative progress bars, terminal gimmicks, or alarming neon states.
- Clear list/table with:
  - Proposal number/title
  - Related lead/client
  - Status
  - Owner
  - Total/currency
  - Last updated
  - Expiry
  - Actions
- Clear detail workspace with tabs/sections:
  - Overview
  - Scope
  - Commercials
  - Versions
  - Activity
  - Internal notes
- Clearly distinguish internal notes from client-visible/sent content.
- Use visible status labels that do not rely on color alone.
- Add accessible loading, empty, error, validation, confirmation, and success states.
- Make the layout keyboard-accessible and responsive.
- Confirm archive/delete/send/acceptance-related actions.
- Prefer archive over permanent delete.

J. Empty states
Use:

“No proposals yet

Create a proposal from a qualified lead when the scope, budget, and next step are clear.”

If a lead must be selected:

“Select a qualified lead first

Proposals should be linked to a real lead or client contact so commercial history remains traceable.”

K. Authorization and audit
- Admin route must require authenticated, authorized server-side access.
- Client portal users must not access admin proposal records.
- If clients can view a sent proposal, scope it strictly to their organization/contact and proposal token/session.
- Enforce capability checks for create/edit/review/approve/send/archive/export.
- Validate every server-side request with Zod.
- Use allowlisted mutable fields to prevent mass assignment.
- Audit proposal creation, edits, internal review, approval-to-send, send, share-link creation/revocation, status transition, acceptance, conversion, archive, delete, export, and AI actions.
- Never return internal notes, raw audit metadata, hidden assumptions, margin data, or privileged fields to a client/prospect view.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authorization
- Unauthenticated users cannot access proposals.
- Client portal users cannot access admin proposals.
- Unauthorized internal roles cannot send, approve, export, or delete.
- Authorized roles can perform permitted actions only.

2. State machine and data integrity
- Valid status transitions succeed.
- Invalid transitions fail.
- APPROVED_TO_SEND does not equal ACCEPTED.
- SENT does not automatically create a project/invoice/client.
- ACCEPTED conversion uses a transaction.
- Failed conversion does not leave partial data.
- Sent/accepted versions are immutable.
- Money totals use integer minor units and server-side calculations.

3. Security
- Invalid/mass-assigned input is rejected.
- IDOR/BOLA tests cover proposal read/update/send/share/export endpoints.
- Internal notes never appear in external/client responses.
- Share links are unguessable, hashed, expiry-enforced, and revocable.
- XSS payloads in proposal content are sanitized.
- No secret/PII leakage in errors/logs.
- CSRF protection works if cookie auth is used.

4. AI
- AI output is labelled.
- Human action is required before applying/sending.
- AI cannot create financial/security/access-control changes.
- Sensitive data is excluded from provider payload.
- Prompt injection-like lead content is handled as untrusted.

5. UI and quality
- Empty, loading, error, confirmation, and success states render.
- Keyboard navigation works.
- Responsive layout works.
- Typecheck passes.
- Lint passes.
- Unit/integration tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data cleanup details
- Backfill/data migration plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

CONTACT PAGE:
You are a principal full-stack engineer, CRM product designer, application-security engineer, privacy-conscious backend engineer, UX designer, and QA lead.

You are working inside the CYBERSTYLE monorepo.

Review and improve only the current internal page:

/admin/contacts

Important product clarification:
This route currently represents public contact-form submissions and website enquiries. It is not the same thing as the CRM Contacts system.

All currently visible records are intentional local development/demo fixtures. Do not treat them as dishonest public claims. However, ensure demo fixtures cannot be seeded automatically or reach production.

Do not modify authentication, administrator bootstrap, email OTP, database reset scripts, billing, Stripe, DevOps, client portal, file storage, Google Maps tooling, or unrelated pages during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before modifying files:

1. Inspect:
   - /admin/contacts page and every used component
   - API routes, server actions, services, validation schemas, and repositories
   - Public contact-form route and Start a Project form route
   - Prisma models and migrations for contact submissions, enquiries, leads, users, notifications, email, and audit logs
   - Demo/seed data and hardcoded records
   - Authentication and authorization guards
   - Search, filters, pagination, export, delete, and conversion logic
   - Any outbound email integration
   - Existing tests

2. Determine whether “Contacts” is a real CRM contact model, a public-enquiry inbox, or an overloaded/ambiguous model.

3. Classify displayed content and functionality as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded
   - Mocked/unimplemented
   - Derived
   - Unsupported or misleading

4. Identify risks:
   - Unauthenticated or weakly protected public intake
   - Spam/bot abuse
   - Stored XSS from message content
   - CSRF where applicable
   - Rate-limit gaps
   - PII leakage in tables, logs, exports, URLs, analytics, or error messages
   - Insecure delete actions
   - Missing audit logs
   - IDOR/BOLA and role-access gaps
   - Mass assignment
   - Email enumeration
   - Unsafe auto-response or auto-conversion
   - Missing retention/deletion process
   - Demo data reaching staging/production

5. Return:
   - Files inspected
   - Current architecture and data model
   - Current public-form intake flow
   - Current permission/auth findings
   - Current demo-data findings
   - Current data/privacy/security findings
   - Current UX findings
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not modify code, delete records, send emails, call AI, reset the database, or touch other routes during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, transform this into a secure, practical Enquiries inbox.

A. Naming
- Rename the visible page title from “Contacts” to “Enquiries.”
- Use subtitle:
  “New messages submitted through your public website.”
- Keep a separate CRM “Contacts” concept for people connected to leads, client organizations, projects, or proposals.
- Route renaming must preserve backward compatibility with redirects if needed; do not break existing admin links.

B. Canonical enquiry statuses
Use a server-enforced enum/state machine:

- NEW
- IN_REVIEW
- REPLIED
- CONVERTED_TO_LEAD
- ARCHIVED
- SPAM

Rules:
- An enquiry does not become a CRM lead automatically.
- Conversion to a lead is a deliberate human action.
- Spam classification must be reversible by authorized staff.
- Archive is the default non-destructive removal option.
- Permanent deletion requires elevated permission, explicit confirmation, and audit logging.
- Document allowed server-side transitions.

C. Required record model
Keep enquiries separate from CRM Contacts and CRM Leads.

Support only necessary fields:
- id
- name, optional
- email, optional
- phone, optional
- companyName, optional
- website, optional
- subject, optional
- message
- source: CONTACT_FORM | START_PROJECT | MANUAL
- sourcePage/path, optional
- status
- assignedToId, optional
- nextActionAt, optional
- reviewedAt, optional
- reviewedById, optional
- repliedAt, optional
- repliedById, optional
- convertedLeadId, optional
- spamSignals, optional and minimized
- consentMetadata, optional and minimized
- createdAt
- updatedAt
- archivedAt, optional
- deletedAt, optional

Do not retain raw IP addresses, user-agent strings, or excessive tracking data indefinitely without a documented purpose and retention policy.

D. Page UI/UX
Use:

Title: “Enquiries”
Subtitle: “New messages submitted through your public website.”

Header actions:
- Log manual enquiry
- Search
- Status filter
- Source filter
- Date range filter

Summary counters only from real data:
- Needs attention
- New
- In review
- Spam

Table/list fields:
- Sender/company
- Subject and safely truncated plain-text excerpt
- Source
- Received date
- Status
- Owner
- Next action
- Actions

Default sorting:
1. New/unreviewed
2. Follow-ups due/overdue
3. Most recently received

Actions:
- Open
- Mark in review
- Assign
- Add internal note
- Create lead
- Archive
- Mark/restore spam
- Delete only for elevated roles with confirmation

Detail panel/page:
- Sender details
- Full safely rendered message
- Internal notes
- Activity timeline
- Source/consent metadata
- Linked lead if converted
- Reply history if truly implemented
- Clear actions

E. Empty/loading/error states
Use:
- “No enquiries yet. New messages from your public website will appear here.”
- “No enquiries match these filters.”
- “We could not load enquiries. Try again.”
- Accessible loading placeholders.

F. Secure public intake
- Public contact and Start a Project forms must call a dedicated public intake endpoint.
- Validate every payload server-side with Zod.
- Use field length limits and plain-text/sanitized handling.
- Add a honeypot field.
- Add rate limits for IP and/or privacy-safe identifiers.
- Use CAPTCHA only if abuse requires it.
- Return generic success responses.
- Do not expose unrestricted admin APIs to public pages.
- Do not automatically send external email, create CRM leads, create client accounts, create projects, or call AI.
- Do not log full enquiry contents, email addresses, phone numbers, or raw IPs unnecessarily.

G. Safe conversion to CRM lead
- “Create lead” must show a review/confirmation workflow.
- Map only relevant fields into the Lead model.
- Preserve the original enquiry and link it to the new lead.
- Run conversion transactionally.
- Avoid partial records on failure.
- Add audit events.
- Never create proposal, project, invoice, payment link, client organization, portal account, or invitation automatically.

H. Authorization, privacy, and audit
- Require authenticated, authorized admin access.
- Client portal users must never access enquiries.
- Add server-side capabilities for view, assign, reply, convert, archive, export, and permanently delete.
- Validate and allowlist mutable fields.
- Audit staff reads where appropriate and all sensitive mutations.
- Secure search/filter/pagination/export routes.
- Restrict export and neutralize CSV formula injection.
- Do not expose PII through URLs, analytics tools, browser console logs, or raw errors.
- Use CSRF protection for cookie-authenticated mutations.
- Add a documented retention and deletion strategy.

I. Demo behavior
- Current records are local demo fixtures.
- Demo seeding must be explicit and opt-in.
- Mark demo records clearly.
- Demo records must never reach production, customer emails, public pages, exports, analytics, or real portal accounts.
- Do not delete demo data during the audit.

J. Accessibility
- Semantic table/list markup.
- Keyboard-accessible actions and dialogs.
- Visible focus states.
- Accessible search/filter/form labels.
- Error messages announced accessibly.
- Status not communicated by color alone.
- Responsive mobile layout.
- Reduced-motion support.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Security
- Public endpoint validates payloads.
- Honeypot and rate-limit protections work.
- Stored XSS payload is rendered safely.
- Generic success response does not leak sensitive state.
- Client users cannot access admin enquiries.
- Unauthorized internal roles cannot mutate/export/delete.
- CSRF protections work if applicable.
- Search/filter/pagination cannot expose unauthorized records.
- CSV exports neutralize formula injection.

2. Workflow
- Valid status transitions work.
- Invalid transitions fail.
- Conversion to lead is deliberate, linked, audited, and transactional.
- Failed conversion leaves no partial records.
- Archive/restore works.
- Permanent delete requires elevated permission and confirmation.

3. Privacy
- Sensitive fields are not unnecessarily logged.
- PII does not appear in URLs or raw errors.
- Retention behavior works as documented.

4. UX and quality
- Empty, loading, error, and no-results states render.
- Desktop and mobile layouts work.
- Keyboard navigation works.
- Typecheck, lint, tests, and production build pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

CLIENTS PAGE:
You are a principal full-stack engineer, multi-tenant SaaS architect, senior CRM/agency-operations product designer, application-security engineer, UX designer, and QA lead.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this internal admin route and its directly required organization-management workflow:

/admin/clients

Important context:
All currently visible client organizations, industry names, domains, service labels, active projects, dates, and messages are intentional local demo fixtures. Do not treat demo fixtures as dishonest public claims.

However, demo records must remain explicitly local/demo-only, must be opt-in seeded, and must never enter production, public pages, client emails, exports, analytics, payment workflows, or real portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, Stripe/payment processing, public-site routes, file storage implementation, DevOps/deployment files, client portal pages, or unrelated admin pages during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before changing any files:

1. Inspect:
   - /admin/clients route/page and all used components
   - Admin navigation entries and route names
   - API routes, server actions, services, repositories, and validation schemas
   - Prisma models and migrations for ClientOrganization, User, OrganizationMembership, Project, Proposal, Invoice, Payment, FileAsset, MessageThread, Message, AuditLog, support/service agreements, and notes
   - Authentication, authorization, RBAC/capability checks, tenant-boundary middleware, and explicit organization-context logic
   - Search, filters, pagination, create, edit, archive, delete, export, invitation, and messaging actions
   - Demo seeds and hardcoded content
   - Existing client-portal routes that depend on organization data
   - Existing tests

2. Classify every visible card, field, table row, action, metric, label, and claim as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “SLA tier” maps to a real signed agreement and an enforceable rule
   - Whether “active builds” is a real project query
   - Whether client organization deletion is safe
   - Whether existing roles are global-only or organization-specific
   - Whether admins can bypass client organization boundaries
   - Whether client messages can leak internal notes
   - Whether archived/removed users retain sessions or signed file access
   - Whether organization list/search/export/filter routes can leak data
   - Whether any action is missing audit logs

4. Return an audit report with:
   - Files inspected
   - Current implementation architecture
   - Current data source classification
   - Current data model/migration findings
   - Existing user, role, and organization membership findings
   - Existing tenant isolation findings
   - Existing archive/delete behavior
   - Existing demo data behavior
   - UI/UX findings
   - Security/privacy findings
   - Unsupported or misleading labels/claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Data backfill/cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, alter records, delete demo data, create users, send invitations/emails, run migrations, or touch unrelated modules during Phase 1.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, turn this into a secure, practical Client Organizations workspace.

A. Naming and UI copy
Use:

Title: “Client organizations”
Subtitle: “Manage client records, access, projects, and account context.”

Remove or replace:
- “CLIENT ENCLAVES & SLAS”
- Generic “SLA Tier”
- Unsupported “Enterprise,” “Premium,” or other service labels
- “Active Builds”
- “Open Messages Channel”
- Any “secure,” “verified,” “real-time,” “enterprise,” “SLA,” or “enclave” claim not backed by actual implemented and contractually valid evidence

Preferred replacements:
- “Engagement status”
- “Support agreement,” only if real
- “Active projects”
- “Open client messages”

B. Organization states
Use canonical server-enforced states:

- ACTIVE
- PAUSED
- ARCHIVED

Rules:
- An organization is normally created only after a deliberate conversion from an accepted proposal or manual authorized creation.
- A public enquiry or unqualified lead never automatically creates a client organization.
- Do not permanently delete client organizations from normal UI actions.
- Archive by default.
- Block/archive-with-warning when active projects, unpaid invoices, active portal memberships, unresolved security events, or required financial/audit retention records exist.
- Permanent deletion, if legally allowed at all, must be a separately designed high-privilege operation with retention checks, reauthentication, typed confirmation, and full audit logging.
- Do not silently cascade-delete projects, invoices, messages, files, proposals, memberships, or audit logs.

C. Organization data model
Ensure the model supports:

Organization:
- id
- legalName
- displayName
- domain, optional
- industry, optional
- billingEmail, optional
- primaryContactId, optional
- status
- engagementType, optional
- contractReference, optional
- supportAgreementId, optional
- createdFromLeadId, optional
- acceptedProposalId, optional
- createdAt
- updatedAt
- archivedAt, optional

Do not store credentials, secrets, payment-card data, unnecessary personal data, or vague security labels on the organization record.

D. Organization membership model
Use a separate membership model. Do not rely only on one global User.role field for client permissions.

Membership fields:
- id
- organizationId
- userId
- role:
  - CLIENT_OWNER
  - CLIENT_BILLING_CONTACT
  - CLIENT_PROJECT_CONTACT
  - CLIENT_MEMBER
- status:
  - INVITED
  - ACTIVE
  - SUSPENDED
  - REMOVED
- invitedAt
- acceptedAt
- removedAt
- invitedById
- createdAt
- updatedAt

Rules:
- Membership role controls access to invoices, payment, projects, files, messages, and organization settings.
- A removed member must immediately lose organization API access.
- Revoking/removing membership must revoke active organization-scoped sessions/tokens and prevent new signed file links.
- Invitations must be single-use, random, hashed-at-rest, expiring, revocable, rate-limited, and audited.
- Do not reveal whether a target email already has an account.

E. Organization list page
Use columns:
- Organization
- Industry / website
- Engagement status
- Active projects
- Primary contact
- Created
- Actions

Features:
- Search by authorized organization fields only
- Filters: status, industry, engagement type, created date
- Sort: newest, recently updated, active projects, name
- Pagination
- Accessible mobile list/card alternative
- No fake metrics
- No exposed internal notes or sensitive financial details
- No broad N+1 queries

Actions:
- Open organization
- Edit organization
- View client messages
- Archive / restore
- Do not put permanent “Delete organization” in normal row actions

F. Organization detail route
Create/upgrade a protected detail route such as:

/admin/clients/[organizationId]

Use tabs or sections:
- Overview
- Contacts & portal access
- Projects
- Proposals
- Invoices & payments
- Files
- Messages
- Internal notes
- Activity
- Settings

Requirements:
- Load only authorized organization-scoped records.
- Separate internal notes from client-visible records.
- Use role-aware fields/actions.
- Add loading, empty, error, forbidden, and not-found states.
- Keep list pages performant; load deep details only in the organization view.

G. Support agreements and SLAs
- Do not display generic SLA tiers unless there is an actual executed agreement and an implemented rule.
- If support agreements are needed, create a separate factual model:
  - agreement name/reference
  - effective dates
  - documented response targets, if contractually agreed
  - scope
  - status
  - signed document reference
- Do not calculate availability, response compliance, or SLA performance until real monitored data and contract rules exist.
- Default copy should be “No support agreement recorded.”

H. Authorization, tenancy, privacy, audit
- Require authenticated internal staff access to all admin organization routes.
- Client portal users must never access /admin/clients.
- Use centralized capability checks.
- Do not allow broad admin bypass through shared client/portal data services without explicit organization context.
- Every related query must directly scope by organizationId.
- Validate all requests using Zod.
- Allowlist mutable input fields.
- Protect against IDOR/BOLA, mass assignment, cross-tenant searches, exports, pagination leakage, attachment leakage, and internal-message leakage.
- Audit create, edit, status change, archive, restore, invitation, member role change, member removal, support-agreement changes, export, and privileged views/actions.
- Do not expose PII, private notes, file keys, raw error messages, audit metadata, secrets, or payment details through list data, URLs, logs, analytics, or client-facing APIs.
- Use CSRF protection for cookie-authenticated mutations.

I. Demo behavior
- Current organizations are local demo fixtures.
- Demo seed must be opt-in only.
- Demo records must be visibly marked in development/demo mode.
- Demo records must never be inserted in staging or production.
- Do not delete demo data during the audit.
- Do not run database reset commands.

J. Accessibility and quality
- Semantic table/list markup.
- Keyboard-accessible filters, actions, menus, dialogs, tabs, and forms.
- Visible focus states.
- Status not communicated only by color.
- Responsive mobile UI.
- Accessible empty/loading/error/success messages.
- Reduced-motion support.
- Type-safe API contracts.
- Avoid unnecessary animations and decorative metrics.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authorization and tenancy
- Unauthenticated user cannot access admin clients.
- Client portal user cannot access admin organizations.
- Authorized staff can access permitted organization records only.
- Object-ID guessing cannot access another organization’s records.
- Search, filters, sorting, pagination, export, messages, invoices, files, and membership actions cannot leak unauthorized data.
- Shared services require explicit organization context.

2. Organization lifecycle
- Valid create/edit/archive/restore flows work.
- Archive blocks or warns correctly when required related records exist.
- No uncontrolled cascade deletion occurs.
- Permanent delete is absent from normal actions.
- Audit events are created.

3. Membership
- Valid invitation works.
- Invitation token is hashed, expires, is single-use, and revocable.
- Removed/suspended membership loses access.
- Role changes affect access immediately.
- Membership actions are audited.

4. Support agreements
- SLA/support labels are hidden unless a valid agreement exists.
- No unsupported availability/response claims appear.

5. UI and quality
- Empty/loading/error/not-found/forbidden states render.
- Responsive layout works.
- Keyboard navigation works.
- Typecheck passes.
- Lint passes.
- Unit/integration/security tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Data cleanup/backfill plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

PROJECTS:
You are a principal full-stack engineer, senior agency-delivery product manager, multi-tenant SaaS architect, application-security engineer, UX designer, DevOps-aware technical lead, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only the following internal admin module and its directly required supporting project-delivery workflow:

/admin/projects
/admin/projects/[projectId]

Important context:
All visible project names, organizations, budgets, dates, statuses, milestones, progress values, health scores, technical scopes, staging links, and messages are intentionally local development/demo fixtures.

Do not treat them as dishonest public claims. However, demo fixtures must be opt-in, clearly isolated to local/demo environments, and must never reach production, public pages, client emails, exports, analytics, real portal accounts, payment workflows, or real deployment environments.

Do not modify database reset scripts, administrator creation, email OTP, billing/Stripe implementation, public-site routes, client-portal pages, Docker/DevOps deployment files, or unrelated modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/projects and /admin/projects/[projectId]
   - All project list/card/detail components
   - API routes, server actions, services, repositories, and validation schemas
   - Prisma models/migrations for Project, ClientOrganization, Proposal, Milestone, Task, Deliverable, Approval, FileAsset, MessageThread, Message, Invoice, Payment, User, OrganizationMembership, AuditLog, and environment/staging links
   - Existing project creation/conversion workflow
   - Existing progress and health calculations
   - Existing status models and transitions
   - Existing project archive/delete behavior
   - Existing project/client authorization and organization scoping
   - Existing staging/preview URL behavior
   - Existing seed/demo data
   - Existing tests

2. Classify each visible value/label/action as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether project progress is calculated from real milestones
   - Whether “health” scores are real, explainable, and useful
   - Whether “at risk” status conflicts with health/progress values
   - Whether milestone gating is automatic or human-approved
   - Whether project delete cascades/orphans records
   - Whether project data is strictly scoped to client organization
   - Whether internal notes, budgets, margins, invoices, files, and messages can leak to clients
   - Whether staging links expose credentials, private environments, or unsafe URLs
   - Whether project creation is linked to accepted proposals
   - Whether audit logs exist for sensitive actions

4. Return:
   - Files inspected
   - Current architecture and data flow
   - Current project schema and migration findings
   - Current status/progress/health findings
   - Current client/organization scoping findings
   - Current milestone/task/deliverable/approval findings
   - Current staging-link findings
   - Current demo-data findings
   - Security/privacy risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not modify code, database records, seed data, external environments, project links, users, messages, files, payments, or deployment configuration during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, turn this into a truthful, secure, practical agency project-management workspace.

A. Naming and page copy
Use:

Title: “Projects”
Subtitle: “Manage delivery, milestones, approvals, and project context.”

Remove or replace:
- “Active Builds & Delivery Squads”
- “PHASE 5 ENGINE ACTIVE”
- “Realtime project health scoring”
- “Automated milestone gating”
- Unsupported “live,” “verified,” “secure,” “real-time,” “enterprise,” or compliance claims
- “HEALTH 92%” style indicators
- “Active build” wording, unless it accurately describes all work

Use:
- “Project status”
- “Milestone progress”
- “Current milestone”
- “Needs attention”
- “Waiting on client”
- “Project environment,” only when an actual authorized link exists

B. Canonical project state machine
Use server-enforced statuses:

- DRAFT
- PLANNING
- ACTIVE
- WAITING_ON_CLIENT
- AT_RISK
- BLOCKED
- ON_HOLD
- COMPLETED
- CANCELLED
- ARCHIVED

Rules:
- Project must have a real linked ClientOrganization.
- Prefer creation from an ACCEPTED proposal, while allowing an authorized manual-creation workflow with a documented reason.
- AT_RISK, BLOCKED, WAITING_ON_CLIENT, ON_HOLD, CANCELLED, and ARCHIVED require a reason.
- Document allowed transitions and enforce them server-side.
- Do not let the browser provide arbitrary status values.
- Audit all status changes.
- Do not automatically create invoices, client accounts, portal invitations, public staging sites, or payment links as a side effect of changing a project status.

C. Progress and delivery health
Do not display arbitrary “health scores” or hand-entered percentage progress.

Show factual values:
- Milestone progress: “3 of 5 milestones completed”
- Current milestone
- Next required action
- Owner
- Target date, if present
- Last activity date

If an optional risk indicator is implemented:
- Use only: ON_TRACK, NEEDS_ATTENTION, AT_RISK, BLOCKED
- Require an explicit human-entered reason and timestamp.
- Show the reason in the project detail view.
- Do not derive a fake numeric health percentage.
- Do not let AI set risk status automatically.

If weighted milestone progress is needed:
- Store explicit milestone weights.
- Validate weights.
- Calculate server-side.
- Display calculation context.
- Keep a simple count-based fallback.

D. Project data model
Ensure a Project supports:

Identity:
- id
- projectCode, unique/human-readable
- name
- description, optional
- status
- statusReason, optional
- clientOrganizationId
- originatingProposalId, optional
- ownerId
- projectManagerId, optional

Schedule:
- plannedStartAt, optional
- targetReleaseAt, optional
- completedAt, optional
- archivedAt, optional

Commercial context, staff-only:
- agreedAmountMinor, optional
- currency, optional
- contract/proposal reference
- no margin or sensitive finance data exposed to portal users

Delivery:
- currentMilestoneId, optional
- riskStatus, optional
- riskReason, optional
- nextAction
- lastActivityAt

Governance:
- createdAt
- updatedAt
- createdById
- archivedById, optional

E. Milestones, deliverables, approvals
- Every milestone must belong to one project.
- Use explicit statuses: NOT_STARTED, IN_PROGRESS, READY_FOR_REVIEW, WAITING_ON_CLIENT, APPROVED, COMPLETED, BLOCKED, CANCELLED.
- Define completion conditions.
- Client approval must be an explicit, recorded action.
- Keep internal review distinct from client approval.
- Do not auto-complete milestones from task completion alone unless a documented approved rule exists.
- Preserve approval evidence and versioned deliverables.
- Do not expose internal-only notes/tasks/files to portal users.

F. Project list UI
Include:
- Create project button
- Search by authorized project/client fields
- Status filter
- Client filter
- Owner filter
- Date/risk filter where useful
- Pagination
- Accessible desktop table or dense list
- Responsive mobile cards

Columns:
- Project
- Client
- Status
- Current milestone
- Milestone progress
- Owner
- Target date
- Last activity
- Actions

Summary counters, real data only:
- Needs attention
- Waiting on client
- Active
- Completed this month

Default ordering:
1. BLOCKED and AT_RISK
2. WAITING_ON_CLIENT
3. Active projects with upcoming targets
4. Recently updated projects

G. Project detail page
Use a protected route:

/admin/projects/[projectId]

Sections:
- Overview
- Milestones
- Deliverables
- Client approvals
- Files
- Messages
- Project activity
- Internal notes
- Commercial context, staff-only
- Settings

Requirements:
- Clearly separate staff-only content from client-visible content.
- Add loading, empty, error, forbidden, and not-found states.
- Protect every related query with organization and role/capability checks.
- Do not use broad project includes that accidentally expose invoices, staff notes, audit details, other client data, or file keys.

H. Archive and delete
- Replace normal “Delete Project” actions with “Archive project.”
- Archiving requires confirmation and an audit event.
- Warn/block archive if there are active milestones, open invoices, pending approvals, active portal users, retention requirements, or unresolved security issues.
- Do not cascade-delete invoices, payments, proposals, messages, files, audit events, or client records.
- Any permanent deletion must be a separately designed high-privilege legal-retention workflow, not a standard project-page action.

I. Environment/staging links
- Support optional project environment links only when genuinely needed.
- Fields: label, URL, environment type (development/preview/staging/production), visibility, createdBy, updatedAt.
- Validate HTTPS URLs.
- Do not allow credentials, secrets, or private tokens in URLs.
- Use domain allowlists where practical.
- Only authorized staff can see/edit staff environment links.
- Portal visibility must be an explicit per-link decision.
- Clearly label the environment; never present staging as production.
- Audit create/update/delete/open events where appropriate.
- Do not create/deploy environments automatically from the project page.

J. Security, tenancy, audit
- Require authenticated authorized admin access to admin project routes.
- Client portal users must never access internal admin project data.
- All shared client/portal services must require explicit organization context.
- Scope all project, milestone, file, message, deliverable, invoice, proposal, and approval queries to the correct organization/project.
- Protect against IDOR/BOLA, mass assignment, cross-tenant search/export/pagination leaks, XSS, CSRF where applicable, unsafe uploads/links, and raw error leakage.
- Validate every mutation with Zod and allowlist mutable fields.
- Audit project create/edit/status changes, milestones, approvals, archive/restore, environment-link changes, sensitive views, exports, and file actions.
- Do not expose staff-only scope notes, budgets, margins, invoice metadata, private messages, credentials, file keys, or audit metadata to clients.

K. Demo behavior
- Existing projects are local demo fixtures.
- Demo seeds must be opt-in only.
- Demo mode must be server-enforced and visibly labelled only outside production.
- Demo records must never appear in production, client portal accounts, public site content, outbound email, exports, payments, or external environments.
- Do not delete demo data during this audit.
- Do not run any reset/migration command during this audit.

L. Accessibility and quality
- Semantic headings, table/list semantics, and clear form labels.
- Keyboard-accessible filters, menus, dialogs, tabs, and actions.
- Visible focus states.
- Do not use color alone for status/risk.
- Responsive design.
- Accessible loading/error/success feedback.
- Reduced-motion support.
- No decorative fake telemetry or arbitrary scores.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authentication and tenancy
- Unauthenticated users cannot access admin projects.
- Client users cannot access admin project APIs/pages.
- Object-ID guessing cannot expose another organization’s project, milestone, file, message, approval, invoice, or environment link.
- Search/filter/pagination/export actions remain organization and role scoped.

2. State and delivery integrity
- Valid project/milestone transitions work.
- Invalid transitions fail.
- Required reasons are enforced for risk/block/archive/cancel states.
- Progress is computed from real milestones.
- No arbitrary health percentage is emitted.
- Client approval and internal review remain distinct.
- Project creation/conversion is transactional where it creates related records.

3. Archive/delete
- Archive is default.
- Archive guards/warnings work.
- No unintended cascade deletion occurs.
- Audit entries are created.

4. Environment links
- Only authorized staff can access/manage staff links.
- URL validation rejects unsafe schemes/credentials.
- Staging/preview labels are accurate.
- Portal visibility rules are enforced.
- Cross-project/tenant link access is blocked.

5. UI and quality
- Empty/loading/error/not-found/forbidden states render.
- Responsive layout works.
- Keyboard navigation works.
- Typecheck passes.
- Lint passes.
- Unit, integration, authorization, and security tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

MILESTONE PAGE:
You are a principal full-stack engineer, agency-delivery systems architect, financial-workflow engineer, multi-tenant SaaS security engineer, UX designer, DevOps-aware technical lead, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only the following internal delivery module and its directly required supporting milestone workflow:

/admin/milestones
/admin/projects/[projectId] (only the milestone-related parts)

Important context:
All currently visible projects, organizations, milestone descriptions, budgets, target dates, payment amounts, sign-off names, AI/security/compliance statements, technical claims, and staging links are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo content must be opt-in, isolated to local/demo environments, visibly labelled, and prevented from reaching production, public pages, client emails, exports, payment workflows, production analytics, or real client portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, Stripe/payment implementation, public-site routes, global DevOps configuration, client portal pages outside milestone approval support, or unrelated admin modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/milestones route/page and every used component
   - Project-detail milestone views
   - API routes, server actions, services, repositories, validation schemas, and types
   - Prisma models/migrations for Milestone, Project, ClientOrganization, Deliverable, DeliverableVersion, Approval, Invoice, Payment, User, OrganizationMembership, FileAsset, EnvironmentLink, Message, and AuditLog
   - Existing milestone create/edit/delete/archive behavior
   - Existing milestone statuses and transitions
   - Existing progress calculation in project/dashboard pages
   - Existing client approval/sign-off behavior
   - Existing billing/payment-gate/invoice behavior
   - Existing staging/preview links
   - Existing role/capability and tenant-scoping controls
   - Existing demo seed data and tests

2. Classify every displayed value, action, label, amount, sign-off, status, metric, link, and description as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “payment gate” triggers any invoice/payment action
   - Whether completed, internal review, client approval, invoice state, and payment state are incorrectly merged
   - Whether named sign-offs are linked to authorized client memberships and immutable deliverable versions
   - Whether milestone deletion can orphan invoices, files, approvals, audit logs, task records, or project progress
   - Whether milestone status can be changed by unauthorized users
   - Whether milestone/project queries are scoped to the correct client organization
   - Whether client-facing APIs can leak internal notes, budgets, staff notes, hidden deliverables, or other organizations’ milestones
   - Whether staging links expose private environments, credentials, or unsafe URLs
   - Whether money uses floating-point calculations
   - Whether high-risk compliance, security, AI, trading-performance, or payment claims are hardcoded in templates

4. Return an audit report with:
   - Files inspected
   - Current architecture and data flow
   - Current milestone/database schema findings
   - Current state machine findings
   - Current billing/payment relationship findings
   - Current approval/deliverable-version findings
   - Current project-progress findings
   - Current authorization/tenant-isolation findings
   - Current delete/archive findings
   - Current staging-link findings
   - Current demo-data findings
   - Security/privacy risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, migrate/reset databases, delete demo records, create invoices, create payment links, send emails, change live environments, or create client approvals during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, practical milestone-management system.

A. Page wording
Use:

Title: “Project milestones”
Subtitle: “Track delivery stages, reviews, approvals, and optional billing links.”

Remove or replace:
- “Engineering Milestones” when the agency delivers more than engineering
- “PAYMENT GATE” as a blanket default
- “IN ACTIVE BUILD”
- Any “live,” “verified,” “automatic,” “real-time,” “cryptographic,” “zero-knowledge,” “HIPAA compliant,” “sub-millisecond,” “penetration tested,” or similar claim unless backed by actual approved evidence

Use plain factual labels:
- Milestone status
- Internal review
- Client approval
- Billing relationship
- Linked invoice
- Project environment

B. Server-enforced milestone status model
Use:

- NOT_STARTED
- IN_PROGRESS
- READY_FOR_INTERNAL_REVIEW
- READY_FOR_CLIENT_REVIEW
- WAITING_ON_CLIENT
- APPROVED
- COMPLETED
- BLOCKED
- ON_HOLD
- CANCELLED
- ARCHIVED

Rules:
- Enforce allowed transitions on the server.
- BLOCKED, ON_HOLD, CANCELLED, and ARCHIVED require a reason.
- Do not let browser input supply arbitrary statuses.
- Keep internal review distinct from client approval.
- Do not automatically mark a milestone completed because a task is complete.
- Do not automatically mark a milestone paid because it is completed or approved.
- Audit every status transition.

C. Completion and approval
- Define milestone completion criteria.
- Support internal review evidence: reviewer, timestamp, notes.
- Support client approval only from an authorized organization membership.
- Bind client approval to an immutable deliverable/version.
- Record approver, organization membership, timestamp, approved version, and optional approved comment.
- Never treat email opens, link views, or generic browser clicks as formal client approval.
- Support “client approval not required” only as a deliberate, auditable configuration.
- Do not expose staff-only internal review notes or hidden deliverables to client users.

D. Billing relationship
Replace generic “PAYMENT GATE” with a factual billing model:

billingMode:
- NONE
- AFTER_INTERNAL_COMPLETION
- AFTER_CLIENT_APPROVAL

Optional related records:
- plannedAmountMinor
- currency
- linkedInvoiceId
- invoice creation eligibility
- invoice status summary

Rules:
- Use integer minor units for all money.
- Money calculations must happen server-side.
- Milestone completion does not automatically issue an invoice.
- Client approval does not automatically charge a card.
- Payment status comes only from the payment/invoice system.
- Creating a linked invoice requires a deliberate authorized confirmation and an audit event.
- Clearly display:
  - No billing trigger
  - Invoice eligible after internal completion
  - Invoice eligible after client approval
  - Linked invoice — draft/sent/overdue/partially paid/paid
- Never label planned milestone value as money received.

E. Milestone data model
Ensure a milestone supports:
- id
- projectId
- title
- description, optional
- sequence
- status
- statusReason, optional
- targetDate, optional
- completedAt, optional
- ownerId, optional
- nextAction, optional
- billingMode
- plannedAmountMinor, optional
- currency, optional
- linkedInvoiceId, optional
- internalReviewedById, optional
- internalReviewedAt, optional
- internalReviewNotes, staff-only
- clientApprovalRequired
- clientApprovedByMembershipId, optional
- clientApprovedAt, optional
- approvedDeliverableVersionId, optional
- createdById
- createdAt
- updatedAt
- archivedAt, optional
- archivedById, optional

F. List and detail UX
List filters:
- All
- Not started
- In progress
- Ready for internal review
- Waiting on client
- Completed
- Blocked
- On hold
- Archived

Search:
- Authorized project name
- Client organization name
- Milestone title

Each list item must show:
- Project/client
- Milestone sequence and title
- Status
- Owner
- Target date
- Next action
- Internal review/client approval state
- Billing relationship
- Safe actions

Detail view/side panel:
- Overview
- Completion criteria
- Deliverables and versions
- Internal review
- Client approval
- Billing relationship
- Activity/audit history
- Staff-only notes

Use clear empty/loading/error/no-results states. Do not show fake metrics or demo claims outside demo mode.

G. Archive and delete
- Replace standard “Delete Milestone” actions with “Archive milestone.”
- Archive must retain delivery history, approvals, invoices, files, and audit references.
- Archive requires confirmation and an audit event.
- Warn/block archive when a milestone has an unpaid linked invoice, pending client approval, active deliverable share, or retention-sensitive record.
- Do not cascade-delete related records.
- Permanent deletion must not be a standard UI action; design it only as a separate elevated retention-reviewed operation if ever necessary.

H. Staging/environment links and files
- Environment links must be separate records with: label, URL, environment type, visibility, organization/project scope, createdBy, updatedAt.
- Validate HTTPS URLs; reject embedded credentials and unsafe schemes.
- Use allowlisted domains where practical.
- Staff-only by default.
- Client visibility must be an explicit per-link decision.
- Clearly label development, preview, staging, or production.
- Never make staging links equivalent to client approval.
- Use private storage and authorization-checked, short-lived downloads for deliverables.
- Bind client approval to a document/deliverable version, not mutable environment content.

I. Authorization, tenancy, and audit
- Require authenticated, authorized internal staff access to all admin milestone endpoints.
- Client portal users may only view milestones/deliverables belonging to their active organization membership and permitted project.
- Enforce explicit organization/project scoping in every query, including search, filters, pagination, invoices, files, approvals, environment links, and exports.
- Protect against IDOR/BOLA, mass assignment, XSS, CSRF where applicable, unsafe URL injection, cross-tenant leakage, and raw-error leakage.
- Validate server-side with Zod and allowlist mutable fields.
- Audit create/edit/status change/review/client approval/billing-link/invoice eligibility/archive/restore/export/environment-link/file actions.
- Do not expose staff-only notes, hidden project data, internal pricing/margins, payment metadata, credentials, file keys, audit metadata, or other clients’ data.

J. Demo behavior
- Existing data is local demo data.
- Demo seed must be explicit and opt-in.
- Demo mode must be server-enforced and visibly labelled outside production.
- Demo records must never reach production, portal accounts, emails, exports, payments, public pages, or external environment links.
- Do not delete/reset demo data during the audit.

K. Accessibility and quality
- Use semantic list/table and heading structure.
- Keyboard-accessible search, filters, actions, dialogs, forms, and tabs.
- Visible focus states.
- Status and billing state cannot rely on color alone.
- Responsive mobile design.
- Accessible validation/loading/error/success states.
- Reduced-motion support.
- No decorative telemetry, arbitrary health percentages, or unsupported compliance claims.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authorization and tenant isolation
- Unauthenticated users cannot access admin milestones.
- Client users cannot access admin milestone APIs.
- Client users see only milestones/deliverables of their own organization and permitted projects.
- Object-ID guessing cannot expose another project/organization’s milestone, invoice, file, approval, or environment link.
- Search/filter/pagination/export remain scoped.

2. State and approval integrity
- Valid milestone transitions work.
- Invalid transitions fail.
- Required reasons are enforced.
- Internal review, client approval, completion, invoice issuance, and payment state remain distinct.
- Client approval requires an authorized membership and immutable deliverable version.
- No browser input can self-approve or alter unauthorized milestones.
- Project progress correctly derives from eligible real milestone states.

3. Billing integrity
- Money uses integer minor units.
- Totals/eligibility are calculated server-side.
- Completion/approval does not auto-create invoice or payment.
- Invoice creation requires explicit permission/confirmation.
- Linked-invoice status displays accurately.

4. Archive/delete and file safety
- Archive retains related data and audit history.
- Archive guards/warnings work.
- No unintended cascade delete occurs.
- Permanent delete is absent from standard UI.
- Environment URLs are validated and authorization-scoped.
- Client cannot access staff-only links/files.

5. Quality
- Empty/loading/error/no-results states render.
- Responsive layout works.
- Keyboard navigation works.
- Typecheck passes.
- Lint passes.
- Unit, integration, security, and tenant-boundary tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

INVOICES:

You are a principal full-stack engineer, payments-platform engineer, finance-workflow designer, application-security engineer, multi-tenant SaaS architect, UX designer, DevOps-aware technical lead, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only the internal invoice module and directly required supporting invoice/payment workflow:

/admin/invoices
/admin/invoices/[invoiceId] if it exists
/admin/payments only where required to correctly display invoice-linked payment state

Important context:
All current invoice numbers, organization names, projects, amounts, due dates, statuses, payment records, PDF actions, and Stripe labels are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo data must be opt-in, local/demo-only, visibly labelled in non-production, and must never reach production, customer emails, exports, public pages, live Stripe workflows, production analytics, or real portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, unrelated CRM pages, public-site pages, client portal pages, file storage outside invoice-document requirements, Docker/DevOps deployment files, or unrelated modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/invoices and invoice detail routes/components
   - /admin/payments only where invoice-linked payment status is surfaced
   - API routes, server actions, services, repositories, validation schemas, types, and UI state
   - Prisma models and migrations for Invoice, InvoiceLineItem, InvoiceVersion/Snapshot, Payment, PaymentAttempt, StripeEvent/WebhookEvent, CreditNote, Refund, ClientOrganization, Project, Proposal, Milestone, User, OrganizationMembership, FileAsset, MessageThread, and AuditLog
   - Current invoice create/edit/send/download/void/delete behavior
   - Current money calculation logic
   - Current PDF generation/storage logic
   - Current Stripe Checkout, PaymentIntent, webhook, customer, receipt, refund, and reconciliation logic
   - Current manual-payment process
   - Current role/capability and organization-scoping controls
   - Existing seed/demo data and tests
   - Environment-variable validation and test/live Stripe mode separation

2. Classify every visible item/action/claim as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “PAID / SETTLED” incorrectly combines separate states
   - Whether invoice numbers are unique and immutable
   - Whether sent/paid invoices are editable or PDF content can change
   - Whether “Void / Delete Invoice” causes destructive deletion or cascades
   - Whether PDF downloads are immutable, private, and authorization-protected
   - Whether totals use floating-point arithmetic
   - Whether Stripe webhooks use raw request body, signature verification, idempotency, transactions, retry handling, and safe logging
   - Whether client-side success redirects can alter paid status
   - Whether manual payments are distinguishable from Stripe payments
   - Whether refunds, disputes, partial payments, credit notes, and failed payments have a safe model
   - Whether finance data can leak across organizations, through guessed IDs, exports, messages, PDFs, or client portal routes
   - Whether tax/receipt/SLA/legal claims are unsupported
   - Whether audit logs exist for all sensitive finance actions

4. Return an audit report with:
   - Files inspected
   - Current invoice/payment architecture
   - Current data-model and migration findings
   - Current state machine findings
   - Current money-calculation findings
   - Current PDF/document findings
   - Current Stripe/webhook/reconciliation findings
   - Current authorization/tenant-isolation findings
   - Current delete/void/refund/credit-note findings
   - Current demo-data behavior
   - Security/privacy risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, create invoices, call Stripe, send email, create payment links, issue PDFs, change invoice statuses, or touch live/test payment configuration during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, practical invoicing workflow.

A. Naming and claims
Use:

Title: “Invoices”
Subtitle: “Create, review, send, and track client invoices.”

Remove or qualify:
- “Billing Ledger” unless a true reconciled ledger exists
- “Stripe automated billing” unless implemented and tested
- “PDF receipts” when referring to invoice documents
- “PAID / SETTLED” combined label
- “Void / Delete Invoice”
- Any unsupported “verified,” “automatic,” “secure,” “real-time,” tax-compliance, legal-receipt, or payment guarantee claim

Use:
- Invoice PDF
- Payment receipt, only after verified payment and when appropriate
- Payment status
- Payout/settlement status, only in a separately implemented reconciliation view
- Stripe test mode, clearly only in local/staging when configured

B. Invoice state machine
Implement server-enforced canonical states:

- DRAFT
- APPROVED_TO_SEND
- SENT
- PARTIALLY_PAID
- PAID
- OVERDUE
- VOID
- UNCOLLECTIBLE
- ARCHIVED

Optional related workflows:
- CREDIT_NOTE_ISSUED
- REFUNDED_PARTIALLY
- REFUNDED

Rules:
- DRAFT is editable.
- APPROVED_TO_SEND is internal approval, not payment or client acceptance.
- SENT invoices become commercially immutable.
- Changes to sent/paid invoices must use a controlled revision/replacement or credit-note workflow.
- PAID is derived only from verified payment records or audited authorized manual-payment reconciliation.
- OVERDUE is derived server-side from due date and outstanding balance.
- VOID requires a reason, elevated permission, confirmation, and audit event.
- Do not provide normal permanent invoice deletion.
- State transitions must be server-side, validated, authorized, and audited.
- No client-side redirect may mark an invoice paid.

C. Invoice data model
Support:

Invoice:
- id
- invoiceNumber: unique, human-readable, immutable once issued
- organizationId
- projectId, optional
- proposalId, optional
- milestoneId, optional
- status
- currency
- subtotalMinor
- discountMinor
- taxMinor
- totalMinor
- amountPaidMinor
- amountDueMinor
- issueDate, optional until sent
- dueDate
- sentAt, optional
- paidAt, optional
- voidedAt, optional
- voidReason, optional
- versionNumber
- renderedSnapshotId, optional
- createdById
- approvedById, optional
- sentById, optional
- archivedAt, optional
- createdAt
- updatedAt

Invoice line item:
- id
- invoiceId
- description
- quantity in a validated representation
- unitAmountMinor
- lineTotalMinor
- tax treatment/code where required
- sort order

Payment:
- id
- invoiceId
- provider: STRIPE | MANUAL | OTHER_APPROVED
- providerPaymentReference, optional/unique when appropriate
- amountMinor
- currency
- status
- receivedAt
- recordedById, optional
- evidence/reference, optional
- createdAt

Invoice document/version:
- id
- invoiceId
- versionNumber
- rendered content snapshot/checksum
- private file reference
- generatedAt
- generatedById
- sentAt, optional
- immutable after send

Do not store card data, Stripe secrets, passwords, raw webhook secrets, or unnecessary PII.

D. Money, taxes, and totals
- Store every monetary value as integer minor units.
- Calculate all totals server-side.
- Never trust browser-provided subtotal, total, tax, discount, amount paid, invoice number, currency, organization, project, or Stripe identifiers.
- Validate currencies and line items.
- Define rounding rules.
- Ensure discounts/taxes cannot produce invalid totals.
- Do not implement tax/VAT/legal rules based on assumptions; make tax settings configurable and require my legal/accounting confirmation.
- Clearly show currency and amount due.
- Do not call an invoice a tax receipt unless legally appropriate and configured.

E. Invoice versioning and PDFs
- Draft invoices may be edited.
- When sent, generate and store an immutable invoice snapshot/PDF for that exact version.
- Downloads must retrieve the immutable sent version, not regenerate mutable content.
- Store documents privately.
- Use authorization-checked short-lived download access.
- Do not use predictable public file URLs.
- Include seller/buyer information, invoice number, dates, line items, totals, payment instructions, and legally required fields only after configuration.
- Generate payment receipts separately only after verified payment.
- Preserve document history and audit events.

F. Invoice creation and milestone links
- Invoice creation requires a real authorized organization.
- Project/proposal/milestone links are optional and validated against the same organization.
- A milestone can indicate invoice eligibility but must never automatically create an invoice, charge a customer, or mark a payment as received.
- Require deliberate authorized confirmation before creating an invoice from a milestone/proposal.
- Use transactions for multi-record relationships.
- Preserve references without exposing internal commercial details to unauthorized portal users.

G. Send and reminders
- Sending must require explicit authorized human action and confirmation.
- Preview the immutable final invoice version before sending.
- Use a transactional email provider configured with environment variables only.
- Prevent duplicate sends.
- Record sender, document version, recipient, timestamp, and result safely.
- Reminder sending must be opt-in, rate-limited, template-controlled, and require approval until a separately approved automation policy exists.
- Never send a payment link or invoice automatically from AI or a browser action without server-side authorization.

H. Stripe and payment events
Implement only after the audit confirms appropriate architecture:

- Separate test and live Stripe configuration by environment.
- Use the raw HTTP request body for webhook signature verification.
- Verify the Stripe webhook signature.
- Persist provider event IDs with unique/idempotency constraints.
- Process payment events transactionally and safely on retries.
- Map Stripe customer, Checkout Session/PaymentIntent, payment event, invoice, and organization explicitly.
- Never trust success/cancel browser redirects as payment truth.
- Handle successful payment, failed payment, canceled session, refund, dispute, duplicate event, delayed event, and event-processing failure.
- Provide controlled retry and alert/dead-letter handling.
- Never log webhook secrets, full payment data, or sensitive customer information.
- Keep manual payments separate, with authorized recording, evidence/reference, timestamp, user, and audit event.
- Do not enable Stripe live mode until test-mode workflows and webhook tests pass.

I. Void, credit note, refund, archive
- Replace “Void / Delete Invoice” with separate safe actions.
- Void: only when appropriate; requires elevated capability, reason, confirmation, audit log, and no unsafe financial data loss.
- Credit note: preserve original invoice and record adjustment.
- Refund: initiated/recorded through controlled Stripe/manual flow, with reason and audit.
- Archive: hide from routine views while retaining required records.
- Permanent delete must not be available in normal admin UI.
- Respect legal/accounting retention requirements; flag them for my professional review.

J. Client messaging and portal visibility
- Invoice discussions must be organization-scoped.
- Clearly separate staff-only finance notes from client-visible messages.
- Do not expose internal invoice notes, Stripe metadata, margins, provider IDs, audit metadata, or other organizations’ records.
- Client portal users can see only invoices/payments/documents belonging to active membership in their organization and only fields approved for client visibility.
- Never put invoice PDFs or payment records behind guessable URLs.

K. UI/UX
Header:
- Invoices
- Create invoice
- Search
- Status/client/project/due-date filters

Summary cards, real data only:
- Needs attention
- Drafts
- Overdue
- Payments pending

Table columns:
- Invoice number
- Client
- Project
- Issued
- Due
- Amount due
- Status
- Last payment activity
- Actions

State-specific actions:
- Draft: Edit, preview, approve to send, archive
- Approved to send: Preview, send, return to draft, archive
- Sent: View immutable version, resend, payment history, record manual payment, void/credit note if authorized
- Partially paid: Payment history, reminder, payment recording, controlled adjustment
- Paid: View invoice, payment receipt if applicable, payment event history, controlled refund/credit workflow
- Overdue: Reminder, payment history, manual reconciliation, uncollectible workflow with reason/approval
- Void/archived: View/audit only

Include accessible loading, empty, error, no-results, confirmation, validation, and success states. Use responsive layout and keyboard-accessible controls. Never rely on color alone.

L. Authorization, tenancy, audit
- Require authenticated and authorized staff access to admin invoice/payment routes.
- Client portal users must never access admin finance routes.
- Enforce explicit organization scoping in every query/action: list, search, filters, pagination, document download, payment lookup, send, void, refund, export, and message thread.
- Protect against IDOR/BOLA, mass assignment, XSS, CSRF where applicable, CSV injection, document-link leakage, cross-tenant data exposure, duplicate sends, duplicate webhooks, and raw error leakage.
- Validate all mutable input with Zod and allowlist fields.
- Audit create/edit/approve/send/resend/void/archive/credit/refund/manual payment/export/download/share/payment-event processing and privileged views.
- Do not expose secrets, payment metadata, internal notes, file keys, raw errors, or PII in logs, frontend payloads, URLs, analytics, or client APIs.

M. Demo behavior
- Existing invoices/payment records are local demo fixtures.
- Demo seeding must be opt-in only.
- Demo/test mode must be server-enforced and visibly labelled outside production.
- Demo records must never appear in production, public pages, real emails, exports, live Stripe data, real portal accounts, or live financial reports.
- Do not delete/reset demo data during the audit.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Access and tenant isolation
- Unauthenticated users cannot access admin invoices/payments.
- Client users cannot access admin finance routes.
- Object-ID guessing cannot access another organization’s invoice, payment, PDF, Stripe event, message, or export.
- Search/filter/pagination/export/document-download queries remain scoped.

2. Invoice state/data integrity
- Valid state transitions work; invalid transitions fail.
- DRAFT is editable; SENT/PAID financial snapshots are immutable.
- APPROVED_TO_SEND does not mean sent, accepted, or paid.
- OVERDUE is derived server-side.
- Invoice numbers are unique and immutable after issue.
- Money calculations use integer minor units and server-side totals.
- Invalid currency/line item/tax/discount values fail validation.

3. Payment and Stripe
- Browser redirect cannot mark invoice paid.
- Webhook signature validation works using raw body.
- Duplicate provider event is idempotent.
- Payment updates are transactional.
- Failed/retried/out-of-order events behave safely.
- Manual payment is separate, permission-controlled, and audited.
- Refund/credit/void behavior preserves original financial history.

4. Documents/security
- Sent invoice PDF is immutable.
- Downloads are private, authorized, and short-lived.
- Internal finance data is absent from client-facing responses.
- XSS/mass-assignment/CSRF/IDOR protections work.
- No secrets or sensitive payment data appear in logs/errors.

5. Quality
- Empty/loading/error/no-results states render.
- Accessible keyboard and responsive interactions work.
- Typecheck passes.
- Lint passes.
- Unit/integration/security tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”



PAYMENTS________________________________________________________________________________


You are a principal full-stack engineer, payments-platform engineer, finance-operations designer, multi-tenant SaaS security engineer, UX designer, DevOps-aware technical lead, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this internal finance module and directly required supporting payment/reconciliation workflow:

/admin/payments
/admin/payments/[paymentId] if it exists
/admin/invoices only where required to correctly connect invoice balance and payment state

Important context:
All payment IDs, Stripe PaymentIntent IDs, invoice references, client names, amounts, payment methods, statuses, dates, receipt actions, webhook-health figures, and success-rate figures currently shown are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo data must be opt-in, local/demo-only, visibly marked outside production, and must never reach production, live Stripe workflows, customer emails, public pages, exports, financial reports, or real portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, unrelated CRM pages, public-site pages, client-portal pages except payment-view support if strictly required, file storage outside receipt/evidence needs, Docker/DevOps deployment files, or unrelated modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any files:

1. Inspect:
   - /admin/payments and payment detail route/components
   - Invoice/payment list integration
   - API routes, server actions, services, repositories, validation schemas, and types
   - Prisma models/migrations for Payment, Invoice, InvoiceLineItem, PaymentAttempt, StripeEvent/WebhookEvent, Refund, Dispute, Payout, ClientOrganization, User, OrganizationMembership, FileAsset, Receipt, and AuditLog
   - Current payment create/edit/reconcile/refund/receipt behavior
   - Current Stripe Checkout, PaymentIntent, webhook, event-processing, idempotency, and signature-validation logic
   - Current manual bank-transfer and wire reconciliation logic
   - Current payment/invoice state synchronization
   - Current payout/settlement tracking
   - Current provider-ID display/logging rules
   - Current authorization and organization-scoping rules
   - Existing demo seeds and tests
   - Environment validation and Stripe test/live mode separation

2. Classify all displayed values, KPIs, statuses, links, receipts, identifiers, and actions as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether customer payment success and bank payout/settlement are incorrectly combined
   - Whether “100% success rate” and “99.9% webhook health” are hardcoded or measured
   - Whether webhook signature verification and duplicate-event protection actually exist and are tested
   - Whether processing or failed payments can incorrectly offer receipts
   - Whether payment status can be changed by client redirects/browser input
   - Whether Stripe raw request bodies are available for signature verification
   - Whether event IDs are uniquely persisted for idempotency
   - Whether payment updates are transactional/retry-safe
   - Whether payment references and raw provider data are overexposed
   - Whether manual bank/wire payments require proof, role restriction, review, and audit logging
   - Whether refunds, disputes, reversals, partial payments, and failures are supported safely
   - Whether finance records can leak across organizations through IDs, search, filters, pagination, exports, receipts, or portal APIs
   - Whether payment history has destructive deletion behavior

4. Return an audit report with:
   - Files inspected
   - Current payment/reconciliation architecture
   - Current data-model and migration findings
   - Current status/state-machine findings
   - Current Stripe/webhook findings
   - Current manual-payment findings
   - Current payout/settlement findings
   - Current receipt/document findings
   - Current authorization/tenant-isolation findings
   - Current demo-data behavior
   - Security/privacy risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, call Stripe, send emails, issue refunds, create payment links, change payment/invoice statuses, create receipts, or alter provider configuration during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure payments and reconciliation workspace.

A. Page wording
Use:

Title: “Payments”
Subtitle: “Review customer payment activity and reconciliation status.”

Replace/remove:
- “Payments & Settlement Ledger” unless a true accounting/reconciliation ledger is implemented
- “Gross volume recorded” unless the period/provider/status is explicit
- “100% success rate”
- Hardcoded “99.9% webhook health”
- “Idempotent signature verified”
- “Stripe charge events, ACH settlements...” as a broad unsupported claim
- “Quick Create” for payments
- “Receipt” action for non-successful payments
- Combined “PAID / SETTLED” wording

Use factual alternatives:
- “Payments received”
- “Processing payments”
- “Payments requiring review”
- “Webhook processing status,” only from actual persisted/monitored data
- “Signature verification enabled,” only if verified in code/tests
- “Duplicate-event protection enabled,” only if verified in code/tests
- “Record manual payment,” permission-controlled

B. Separate concepts
Keep these models/states distinct:

1. Invoice state:
- DRAFT
- APPROVED_TO_SEND
- SENT
- PARTIALLY_PAID
- PAID
- OVERDUE
- VOID
- UNCOLLECTIBLE
- ARCHIVED

2. Customer payment state:
- PENDING
- PROCESSING
- SUCCEEDED
- FAILED
- CANCELED
- REFUNDED_PARTIALLY
- REFUNDED
- DISPUTED
- REVERSED
- MANUAL_REVIEW

3. Payout/settlement state:
- NOT_APPLICABLE
- PENDING
- PAID_OUT
- FAILED

Rules:
- Do not display “settled” as a synonym for payment success.
- Customer payment success does not mean funds are paid out to CYBERSTYLE’s bank.
- A processing payment must not be treated as received.
- A manual wire/bank transfer must remain awaiting confirmation until an authorized reconciliation action and evidence exist.
- Do not mark payments/invoices paid from browser redirects.

C. Payment model
Ensure payment records support:
- id
- invoiceId
- organizationId
- provider: STRIPE | MANUAL_BANK_TRANSFER | WIRE | OTHER_APPROVED
- method: CARD | ACH | WIRE | BANK_TRANSFER | OTHER
- status
- amountMinor
- currency
- providerPaymentIntentId, optional
- providerCheckoutSessionId, optional
- providerEventId, optional
- receivedAt, optional
- failureCode, optional
- safeFailureMessage, optional
- payoutStatus
- payoutReference, optional and restricted
- recordedById, optional
- manualReference, optional and restricted
- evidenceFileId, optional and private
- createdAt
- updatedAt

Use integer minor units and server-side calculations only. Do not store card data, bank credentials, webhook secrets, or raw unredacted provider payloads in broad-access models.

D. Stripe and webhook security
Implement only after the audit confirms correct architecture:

- Separate Stripe test and live credentials by environment.
- Webhook endpoint must use raw request body.
- Verify Stripe signatures with webhook secret.
- Persist provider event IDs under unique constraints before/with processing.
- Make event handling idempotent, transactional, retry-safe, and safe for out-of-order events.
- Explicitly map Stripe customer, Checkout Session, PaymentIntent, payment, invoice, and organization.
- Do not trust client redirects or client-provided IDs/statuses.
- Handle successful, failed, canceled, refunded, disputed, reversed, duplicated, delayed, and malformed events.
- Record safe processing errors and surface them to authorized staff.
- Add retry/dead-letter/alert behavior for failed processing.
- Never log secrets, full provider payloads, sensitive payment data, or unnecessary PII.
- Never claim webhook health with a percentage unless you have an actual monitoring definition, observation period, and data source.

E. Manual payment reconciliation
- Replace “Quick Create” with “Record manual payment.”
- Restrict it to explicitly authorized finance/admin roles.
- Require invoice selection, amount, currency, method, received date, reference/evidence, confirmation, and staff identity.
- Never mark an invoice paid automatically from a manual entry unless validated against its balance.
- Support partial payment.
- Require elevated review for overpayment, write-off, reversal, or adjustment.
- Keep manual payments clearly distinct from Stripe/provider-confirmed payments.
- Audit every create, edit, confirm, reject, reverse, export, receipt, and reconciliation action.

F. Receipts and documents
- A receipt may be generated/displayed only after a successful/confirmed payment.
- It must refer to the exact payment and linked invoice.
- Store receipts privately and serve through authorization-checked, short-lived access.
- Do not expose predictable public receipt URLs.
- Processing, failed, canceled, disputed, and unconfirmed manual payments must not expose final receipts.
- Separate invoice PDF from payment receipt.
- Retain immutable receipt metadata once issued.

G. Payments list and UX
Header:
- Payments
- Record manual payment, capability-controlled
- Search
- Filters: customer payment status, provider, method, client, invoice, date range
- Optional payout-status filter only if actual payout data exists

Summary cards, real data only:
- Payments requiring review
- Processing
- Failed/disputed
- Payments received in selected period

Table columns:
- Payment reference
- Invoice / client
- Amount
- Provider / method
- Customer payment status
- Payout status, if applicable
- Received / last updated
- Actions

Rules:
- Show a shortened provider reference by default, with full reference restricted to finance administrators.
- Link only to authorized invoice/client records.
- Offer Receipt only for confirmed successful payment.
- Provide no normal delete action; financial history must be preserved.
- Add safe empty/loading/error/no-results states.
- Make the page keyboard accessible and responsive.
- Do not rely on color alone for payment state.

H. Authorization, tenancy, audit
- Require authenticated authorized staff for all admin payment routes/actions.
- Client users must never access admin payment views.
- Client portal users may only see their own organization’s invoice/payment/receipt fields that are explicitly client-visible.
- Every query must scope by organization: list, search, filters, pagination, payment details, receipts, exports, reconciliation, manual-entry actions, and webhook mapping.
- Protect against IDOR/BOLA, mass assignment, cross-tenant data leaks, raw error exposure, unsafe file links, CSV formula injection, duplicate records, and duplicate webhooks.
- Validate all mutable server-side input with Zod and allowlist fields.
- Audit sensitive reads where appropriate and all payment mutations, receipt downloads, refunds, reversals, manual reconciliation, exports, and provider event processing.

I. Demo behavior
- Existing payment data is local demo/test data.
- Demo seed must be explicit and opt-in only.
- Test/demo mode must be server-enforced and clearly visible outside production.
- Demo payment records must never reach production, public pages, real client portal accounts, exports, emails, live Stripe records, or real financial reports.
- Do not reset/delete demo data during the audit.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authentication and tenant isolation
- Unauthenticated users cannot access admin payments.
- Client portal users cannot access admin payment routes.
- Object-ID guessing cannot expose another organization’s payment, invoice, receipt, event, or export.
- Search/filter/pagination/receipt/export/reconciliation remain authorization and organization scoped.

2. State/data integrity
- Payment, invoice, and payout statuses stay distinct.
- Valid transitions work; invalid transitions fail.
- Processing payment cannot receive final receipt.
- Invoice cannot be marked paid from browser redirect.
- Partial, failed, refunded, disputed, and reversed payments reconcile correctly.
- Money uses integer minor units and server-side calculations.
- No normal delete action exists.

3. Stripe/webhook
- Raw-body signature verification works.
- Invalid signature is rejected.
- Duplicate event processing is idempotent.
- Delayed/out-of-order/retried events are safe.
- Payment/invoice updates are transactional.
- Sensitive data and secrets are absent from logs/errors.
- Webhook failures surface safely to authorized staff.

4. Manual payments
- Authorized finance role is required.
- Required evidence/reference validation works.
- Partial payment works.
- Overpayment/adjustment requires elevated review.
- Manual payments are clearly distinguished and audited.

5. Documents/UI/quality
- Receipts exist only after confirmed payment and remain authorized/private.
- Empty/loading/error/no-results states render.
- Keyboard and responsive interactions work.
- Typecheck passes.
- Lint passes.
- Unit, integration, security, and tenant-isolation tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”




RETAINERS ___________________________________________________________________
You are a principal full-stack engineer, agency-operations product manager, contract-and-recurring-billing workflow designer, finance-system engineer, multi-tenant SaaS security engineer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this internal admin module and the directly required supporting retainer workflow:

/admin/retainers
/admin/retainers/[retainerId] if it exists

Important context:
All current retainer names, clients, monthly fees, MRR figures, capacity figures, usage hours, response targets, renewal dates, auto-renew labels, status values, messages, and SLA metrics are intentional local development/demo fixtures.

Do not treat those demo records as dishonest public claims. However, demo records must be explicit opt-in fixtures, isolated to local/demo environments, visibly labelled outside production, and prevented from reaching production, public pages, customer emails, exports, live billing, financial reports, or real portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, Stripe/payment implementation, unrelated CRM modules, public-site routes, client-portal modules outside retainer visibility if strictly required, file storage, Docker/DevOps files, or unrelated pages during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/retainers route/page and all used components
   - Retainer detail routes/components
   - API routes, server actions, services, repositories, validation schemas, and types
   - Prisma models/migrations for Retainer, ClientOrganization, Project, Contract/Agreement, SupportAgreement, Subscription, Invoice, Payment, UsageEntry/TimeEntry, MessageThread, User, OrganizationMembership, FileAsset, and AuditLog
   - Current retainer create/edit/delete/archive/pause/end/renew workflow
   - Current recurring billing/subscription integration
   - Current usage-hours/capacity calculation
   - Current SLA/response-time calculation
   - Current auto-renewal behavior
   - Current contract/document/signature behavior
   - Current permission and organization-scoping controls
   - Existing demo seeds and tests

2. Classify every visible card, metric, label, action, status, rate, renewal date, usage figure, response target, and claim as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether active retainer status requires signed/approved agreement evidence
   - Whether “auto-renew” maps to a real contract clause and safe workflow
   - Whether monthly rates and MRR use correct integer minor-unit currency logic
   - Whether usage hours come from approved time entries
   - Whether SLA/response compliance claims are measured from auditable source events
   - Whether support coverage timezone/business-hours rules exist
   - Whether billing is automatic, manual, Stripe subscription-based, or mocked
   - Whether ending/deleting a retainer can orphan invoices, payments, time entries, messages, files, or audit evidence
   - Whether client/retainer data leaks across organization boundaries
   - Whether staff-only commercial and support notes could appear in client-visible conversations
   - Whether “24/7” or fast response terms are unsupported default claims

4. Return an audit report with:
   - Files inspected
   - Current architecture/data flow
   - Current retainer schema/migration findings
   - Current contract/signature findings
   - Current recurring billing findings
   - Current usage/capacity findings
   - Current SLA/response-time findings
   - Current renewal/auto-renew findings
   - Current authorization/tenant-isolation findings
   - Current delete/archive findings
   - Current demo-data behavior
   - Security/privacy risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, create contracts, issue invoices, charge customers, create Stripe subscriptions, send email, change renewal state, or modify external billing configuration during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, turn this into a truthful, secure, practical retainer-management workflow.

A. Naming and copy
Use:

Title: “Retainers”
Subtitle: “Manage recurring client agreements, included capacity, and renewal dates.”

Remove or qualify:
- “Monthly Recurring Retainers & SLAs”
- “Automated subscription billing”
- “Allocated engineering capacity”
- “Guaranteed SLA response times”
- “Average SLA response < X”
- “100% SLA compliance”
- “MTD engineering burn”
- “AUTORENEW ON” unless contract-backed
- “Delete Retainer”
- Any unsupported “guaranteed,” “verified,” “real-time,” “automated,” “secure,” “SLA,” or 24/7 claim

Use:
- Contracted recurring value
- Included capacity
- Approved usage
- Response target under agreement
- Renewal review date
- Billing relationship
- No support agreement recorded, where applicable

B. Retainer state machine
Use server-enforced statuses:

- DRAFT
- INTERNAL_REVIEW
- PENDING_CLIENT_SIGNATURE
- ACTIVE
- PAUSED
- PENDING_RENEWAL
- ENDED
- EXPIRED
- CANCELLED
- ARCHIVED

Rules:
- ACTIVE requires explicit signed-agreement or authorized recorded-contract evidence.
- Status transitions must be enforced server-side and audited.
- Pause/end/cancel/archive require reason.
- Do not allow arbitrary browser-provided statuses.
- No normal permanent deletion.
- A retainer cannot be silently removed if linked invoices, payments, signed agreements, usage entries, active portal access, or retention-sensitive records exist.
- Auto-renewal must never silently alter contract terms or charge the client without an approved billing/legal workflow.

C. Retainer data model
Support:
- id
- organizationId
- projectId, optional
- contractReference, optional
- title
- serviceScope
- status
- currency
- recurringAmountMinor
- billingInterval: MONTHLY | QUARTERLY | ANNUAL | CUSTOM
- billingAnchorDate, optional
- startDate, optional
- endDate, optional
- renewalType: NONE | MANUAL_REVIEW | AUTO_RENEWAL_CLAUSE
- renewalNoticeDays, optional
- renewalDate, optional
- usageType: NONE | HOURS | CREDITS | DELIVERABLES
- includedUnits, optional
- usedUnits, derived from approved usage records where possible
- usageCycleStart, optional
- usageCycleEnd, optional
- responseTargetMinutes, optional
- coverageHours, optional
- supportAgreementVersionId, optional
- createdById
- approvedById, optional
- signedAt, optional
- endedAt, optional
- endReason, optional
- archivedAt, optional
- createdAt
- updatedAt

Use integer minor units for money. Do not store credentials, payment-card data, unrelated personal data, or unenforceable contract labels.

D. Contracts and renewal
- A retainer should link to a signed agreement/version or a clearly auditable manual-contract record.
- Keep agreement documents private, immutable when signed, versioned, and authorization-scoped.
- Capture effective date, term, scope, billing cadence, renewal clause, notice period, support terms, and signatory evidence only where needed.
- Auto-renew must be a contract value, not a generic toggle.
- Create renewal reminders with configurable notice windows.
- Require an explicit authorized action to renew, change price/scope, issue a new contract version, or create billing changes.
- Preserve history and audit events.

E. Billing relationship
- Do not claim automated billing unless a verified billing schedule/subscription/invoice integration exists.
- Allow billing modes:
  - MANUAL_INVOICE
  - SCHEDULED_INVOICE_REVIEW
  - STRIPE_SUBSCRIPTION, only if implemented/tested
  - NONE
- Recurring agreement activation must not automatically charge a client.
- Invoice creation/payment collection must follow the dedicated invoice/payment safety workflow.
- Keep retainer state, invoice state, payment state, and bank payout state separate.
- Do not mark a retainer paid based on a UI toggle.

F. Usage and capacity
- Do not use “engineering burn.”
- Support configurable units: hours, credits, deliverables, or no tracked usage.
- Usage must come from approved time/usage entries or be clearly labelled manual.
- Display:
  - Included units
  - Approved units used
  - Remaining units
  - Usage cycle dates
- Do not compute automated overages, employee performance, billing, or SLA compliance without documented rules and approved inputs.
- If usage tracking is unavailable, display:
  “Usage tracking is not configured.”

G. Support terms / SLA
- Show support terms only when a real signed agreement/version exists.
- Store:
  - response target
  - coverage/business hours
  - timezone
  - intake channel
  - exclusions/paused clocks
  - effective dates
- Do not display SLA compliance or average response time until actual support-ticket/request events and a documented calculation exist.
- If unsupported, show:
  “Support metrics are not configured.”
- Do not include 24/7, <15 minute, guaranteed response, or compliance labels in default templates.

H. List and detail UX
Header:
- Retainers
- New retainer
- Search
- Status/client/renewal-window filters

Summary cards, real data only:
- Renewals due
- Active agreements
- Usage review needed
- Agreements ending soon

List fields:
- Client
- Agreement/scope
- Status
- Recurring value/currency
- Billing cycle
- Usage
- Renewal/end date
- Support terms
- Actions

State-specific actions:
- Draft: Edit, internal review, archive
- Pending signature: View agreement, resend controlled signature request, cancel draft
- Active: View agreement, record usage, linked invoices, pause, start renewal review, end
- Paused: Resume, end, archive
- Pending renewal: Review/renew manually/end
- Ended/cancelled/archived: View history/audit only

Replace normal “Delete Retainer” with archive/end/cancel actions. Use confirmation dialogs and reasons for high-impact actions.

Detail sections:
- Overview
- Scope and agreement
- Usage
- Billing/invoices
- Support terms
- Renewal
- Client-visible messages
- Staff-only notes
- Activity/audit history
- Settings

I. Authorization, tenancy, privacy, audit
- Require authenticated, authorized staff access for all admin retainer routes.
- Client users must never access admin retainer management.
- Portal users may view only their own organization’s approved client-visible retainer fields.
- Enforce explicit organization scoping for list/search/filter/pagination/detail/contract/files/invoices/messages/usage/exports.
- Protect against IDOR/BOLA, mass assignment, XSS, CSRF where applicable, CSV injection, document-link leakage, cross-tenant access, raw errors, and unsafe user-provided URLs.
- Validate all mutations with Zod and allowlist fields.
- Audit create/edit/status change/agreement attachment/signature state/renewal settings/renewal action/usage entry/billing link/archive/end/cancel/export/privileged views.
- Never expose internal margins, private staff notes, raw contract metadata, payment identifiers, secrets, file keys, or another organization’s data.

J. Demo behavior
- Existing retainers are local demo/test data.
- Demo seeds must be explicit and opt-in.
- Demo mode must be server-enforced and visibly labelled outside production.
- Demo records must never appear in production, public pages, client emails, exports, live payments, real financial reports, or real portal accounts.
- Do not delete/reset data during the audit.

K. Accessibility and quality
- Semantic headings, table/list markup, and clear field labels.
- Keyboard-accessible filters, actions, dialogs, tabs, and forms.
- Visible focus states.
- Do not rely on color alone for contract/billing/status information.
- Responsive layout.
- Accessible loading, error, no-results, confirmation, and success states.
- Reduced-motion support.
- No decorative fake telemetry, fake SLA rates, or arbitrary capacity metrics.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authorization and tenant isolation
- Unauthenticated users cannot access admin retainers.
- Client portal users cannot access admin retainer routes.
- Object-ID guessing cannot access another organization’s retainer, contract, invoice, usage, support term, or message.
- Search/filter/pagination/export remain organization and role scoped.

2. Contract lifecycle
- Valid state transitions work; invalid transitions fail.
- ACTIVE requires contract/signed-agreement evidence.
- Pause/end/cancel/archive reasons are enforced.
- No normal permanent delete exists.
- Archive/end preserves linked financial, usage, contract, and audit records.

3. Billing and finance
- Money uses integer minor units.
- Retainer status does not automatically charge a client or mark invoices paid.
- Billing mode restrictions work.
- Renewal does not silently change/charge contract terms.
- Retainer/invoice/payment/payout states remain separate.

4. Usage and support
- Usage derives from approved entries or is clearly labelled manual/unconfigured.
- No unsupported capacity/SLA KPI is displayed.
- SLA calculation only appears where agreement and source data exist.
- Coverage/timezone/exclusion rules are respected if SLA measurement is implemented.

5. Security/UI/quality
- Staff-only notes and commercial information are absent from client responses.
- Contract/document access is private, authorization-checked, and short-lived.
- XSS/mass-assignment/CSRF/IDOR protections work.
- Empty/loading/error/no-results states render.
- Responsive and keyboard interactions work.
- Typecheck, lint, unit/integration/security/tenant tests, and production build pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

REPORTS:______________________________________________________________________________________________

You are a principal full-stack engineer, client-reporting product manager, AI-safety engineer, multi-tenant SaaS security engineer, document-generation engineer, UX designer, and QA lead.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this reporting module and directly required support for report generation, review, publication, PDF delivery, and client-portal visibility:

/admin/reports
/admin/reports/[reportId]
/api/v1/reports/[reportId]/pdf only where required for secure report delivery
/client portal report views only where strictly required to enforce report visibility

Important context:
All client names, report titles, summaries, reported hours, milestones, invoice/payment references, SLA availability values, performance claims, AI labels, report states, report IDs, and PDF links currently shown are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo data must be opt-in, local/demo-only, visibly labelled outside production, and must never reach production, public pages, real client portal accounts, customer emails, exports, live financial reports, analytics, or external AI requests.

Do not modify database reset scripts, administrator bootstrap, email OTP, Stripe/payment implementation, unrelated CRM/delivery modules, public website pages, broad DevOps/deployment configuration, or unrelated admin pages during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/reports and report detail/studio routes/components
   - PDF route/controller and document storage/rendering code
   - Client-portal report listing/detail/download code, if present
   - API routes, server actions, services, repositories, validation schemas, and types
   - Prisma models/migrations for Report, ReportVersion, ReportSourceSnapshot, ClientOrganization, Project, Retainer, Milestone, Deliverable, Approval, TimeEntry/UsageEntry, Invoice, Payment, MonitoringMetric, SupportRequest/Ticket, FileAsset, User, OrganizationMembership, AI generation metadata, and AuditLog
   - Existing report generation, update, publish, archive, delete, PDF, email, and portal-visibility flows
   - Existing AI provider integration, prompt templates, source selection, output handling, logging, retention, and user-data boundaries
   - Existing authorization/capability/tenant-scoping controls
   - Existing demo seeds and tests

2. Classify every visible metric, claim, status, action, label, summary, PDF link, and portal setting as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “human-approved AI executive summaries” is actually enforced
   - Whether AI can publish, email, alter data, or make contractual claims without human approval
   - Whether reported figures are backed by approved source records and fixed period windows
   - Whether SLA availability, performance, uptime, sprint, compliance, payment, or delivery claims are measured, sourced, and appropriate
   - Whether report generation can mix data between client organizations
   - Whether report PDFs use guessable IDs, public storage, predictable URLs, or insufficient capability checks
   - Whether published reports/PDFs are immutable snapshots or mutable regenerations
   - Whether published content can be silently changed in the studio
   - Whether Delete Report destroys client-visible/audit history
   - Whether staff-only notes, raw finance data, AI prompts, private files, or audit details can leak through portal/API/PDF views
   - Whether AI prompts can be manipulated by client-submitted text or uploaded documents
   - Whether current report source queries cause N+1 performance issues or broad over-fetching

4. Return an audit report with:
   - Files inspected
   - Current architecture and data flow
   - Current report/version/source-snapshot schema findings
   - Current metric/data-source findings
   - Current AI generation and approval findings
   - Current PDF/document-delivery findings
   - Current portal visibility and authorization findings
   - Current archive/delete findings
   - Current demo-data behavior
   - Security/privacy/AI-safety risks
   - UI/UX findings
   - Unsupported or misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, migrate/reset data, generate or publish reports, call an AI provider, create PDFs, send emails, expose portal content, delete reports, or change external integrations during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure client-reporting workflow.

A. Naming and claims
Use:

Title: “Client delivery reports”
Subtitle: “Create, review, and publish client-facing delivery and usage reports.”

Replace/remove:
- “PHASE 6 ACTIVE”
- “Monthly retainer rollup generator”
- “AI ASSISTED” without review context
- “PDF Statement”
- Generic SLA availability, uptime, compliance, performance, sprint, security, or AI claims without verified evidence

Use:
- Generate draft report
- AI draft — human review required
- Download report PDF
- Data completeness
- Source data unavailable/not configured, where applicable
- Published report version

B. Report lifecycle and versioning
Use server-enforced states:

- DRAFT
- READY_FOR_REVIEW
- APPROVED_FOR_PUBLICATION
- PUBLISHED
- ARCHIVED
- SUPERSEDED

Rules:
- DRAFT is editable by authorized staff only.
- READY_FOR_REVIEW signals a complete draft, not client visibility.
- APPROVED_FOR_PUBLICATION requires named human approval.
- PUBLISHED requires a final confirmation, audience selection, immutable content/source snapshot, timestamp, and audit event.
- Published reports must be immutable.
- Corrections create a revision/version and mark the prior publication SUPERSEDED; never silently overwrite client-visible content.
- ARCHIVED preserves historical records.
- Remove standard Delete Report actions.
- Any permanent deletion must be an elevated, legal-retention-reviewed process outside normal UI.

C. Evidence-based sources
Each displayed metric/claim must carry source metadata, period range, calculation definition, and availability status.

Display only if evidence exists:
- Usage: approved time/usage entries
- Delivery: completed milestones, approved deliverables, client approvals
- Finance: authorized/reconciled invoice/payment data
- SLA: signed agreement, coverage window/timezone, intake channel, request and first-human-response timestamps, pause/exclusion rules, documented formula
- Availability/uptime: approved monitoring source, service scope, time window, calculation
- Benchmarks/performance: versioned protocol/environment/load/results/timestamp and human review

Rules:
- Do not fabricate, interpolate, round up, or infer unavailable metrics.
- Do not call synthetic data production performance.
- If evidence is missing, show a neutral unavailable state.
- Do not automatically include finance or sensitive operational data in client-facing reports.
- Allow report template fields to be optional and audience-controlled.

D. AI drafting controls
- AI may generate a draft only, never publish, email, send, alter source records, issue invoices, or alter payment/project states.
- Feed AI only explicitly selected, authorized, organization-scoped source snapshots.
- Exclude secrets, access tokens, payment details, private staff notes, audit logs, raw attachments, and other organization data.
- Treat generated output as untrusted.
- Protect against prompt injection from client messages, uploads, and external text.
- Provide reviewer-visible source references for numeric claims and material statements.
- Record provider/model, prompt-template version, generation timestamp, source-snapshot ID, reviewer, approval event, and safe/redacted generation metadata.
- Keep AI data retention/third-party transfer configurable and explicit.
- AI reports must remain labelled “AI draft — human review required” until human approval.
- Do not show AI labels on a published report unless the user specifically wants disclosure and wording has been legally/contractually approved.

E. Report schema
Support:
- id
- organizationId
- projectId, optional
- retainerId, optional
- reportType: MONTHLY_DELIVERY | RETAINER_USAGE | CUSTOM
- periodStart
- periodEnd
- status
- title
- clientVisibleContentJson
- staffOnlyNotes, separate/private
- versionNumber
- replacesReportId, optional
- generationMode: MANUAL | RULE_BASED | AI_ASSISTED
- aiGenerationMetadata, optional/redacted/restricted
- sourceSnapshotId
- renderedPdfFileId, optional
- approvedById, optional
- approvedAt, optional
- publishedById, optional
- publishedAt, optional
- portalVisible
- archivedAt, optional
- createdAt
- updatedAt

Create an immutable ReportSourceSnapshot / report-version model sufficient to preserve every published report’s inputs and rendered output.

F. Report list and studio UX
List header:
- Client delivery reports
- Generate draft report
- Search
- Status/client/period/report-type filters

Summary metrics must be real:
- Awaiting review
- Published this month
- Source data incomplete
- Reports due, only if a real reporting schedule exists

List columns:
- Client
- Report period
- Report type
- Status
- Data completeness
- Reviewer/publisher
- Published
- Actions

Studio:
- Overview
- Source data/completeness
- Client-visible content
- Staff-only notes
- Version history
- Review checklist
- Publication settings
- Activity/audit history

Show clear loading, empty, no-results, forbidden, error, success, and confirmation states. Use keyboard-accessible and responsive controls; do not rely on color alone.

G. PDF and portal security
- Generate PDFs only from a final approved/published snapshot.
- Store PDFs privately.
- Use authorized, short-lived download access; no predictable public URLs.
- Both staff and client portal requests must require capability/membership checks plus explicit organization scope.
- Require active organization membership for client report access.
- Do not expose raw source data, staff-only notes, finance internals, AI metadata, file keys, audit metadata, report IDs in URLs if avoidable, or another organization’s reports.
- Audit view/download/export/publication actions.
- Do not conflate a public website report with a client-portal report.

H. Authorization, tenant isolation, audit
- Require authorized staff for all admin report operations.
- Client portal users cannot access admin studio/routes/APIs.
- Portal users may access only published, portal-visible report versions for their active organization membership.
- Scope every list, search, filter, pagination, report source, PDF, export, portal response, AI generation request, and file download by organization.
- Protect against IDOR/BOLA, mass assignment, XSS, CSRF where applicable, prompt injection, cross-tenant data mixing, CSV injection, document-link leakage, raw error leakage, and over-fetching.
- Validate all mutable inputs server-side with Zod and allowlist fields.
- Audit draft creation/editing, source refresh, AI generation, review, approval, publication, portal visibility, PDF generation, view/download/export, archive, restore, and revision creation.

I. Demo behavior
- Existing reports are local demo fixtures.
- Demo seeds must be opt-in.
- Demo mode must be server-enforced and visibly labelled only outside production.
- Demo reports must never appear in production, public pages, real portal accounts, real emails, exports, billing/finance reports, external AI requests, or production analytics.
- Do not delete/reset demo data during audit.

J. Accessibility and quality
- Semantic headings, tables, form fields, review checklists, dialogs, and tabs.
- Keyboard-accessible filters, actions, publication confirmations, and studio controls.
- Visible focus states.
- Status/data-completeness cannot depend only on color.
- Responsive layout and reduced-motion support.
- Accessible errors, loading, empty states, confirmation, and success feedback.
- No decorative fake KPIs or unsupported claims.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Authorization and tenant isolation
- Unauthenticated users cannot access admin reports.
- Client users cannot access admin report studio/API.
- Client users see only published, portal-visible reports for their active organization membership.
- Guessed IDs cannot access another organization’s report, snapshot, PDF, source data, AI draft, or export.
- Search/filter/pagination/PDF/export/portal requests remain scoped.

2. Lifecycle/version integrity
- Valid transitions work; invalid transitions fail.
- Publication requires named human approval and confirmation.
- AI-generated content cannot publish automatically.
- Published report content/PDF/source snapshot remain immutable.
- Correction creates a new revision and supersedes—not overwrites—the original.
- Archive preserves report history; normal delete is absent.

3. Evidence and AI safety
- Missing source data produces unavailable state, not fabricated metrics.
- SLA/uptime/benchmark claims render only when qualifying evidence/configuration exists.
- AI source selection remains organization-scoped and excludes private/secrets/staff-only fields.
- Prompt-injected client content cannot alter report-generation instructions or cause data leakage.
- Reviewer can see source references for numeric/material claims.

4. Documents/security
- PDFs are private, authorization-checked, and short-lived.
- Report/PDF versions are immutable after publication.
- Staff-only data and AI metadata remain absent from portal/PDF payloads.
- XSS/mass-assignment/CSRF/IDOR protections work.
- No secrets, raw error details, or sensitive data appear in logs/responses.

5. Quality
- Empty/loading/error/no-results/forbidden states render.
- Keyboard-accessible and responsive UI works.
- Typecheck passes.
- Lint passes.
- Unit, integration, security, authorization, tenant-boundary, and AI-safety tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”


REVIEWS PAGE : --------------------------------------------------------------------------------------------------------
You are a principal full-stack engineer, content-moderation product manager, privacy and consent workflow designer, advertising-claims risk reviewer, application-security engineer, multi-tenant SaaS architect, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this internal testimonial/review moderation module and the directly required public rendering support:

/admin/reviews
/admin/reviews/[reviewId] if it exists
/public testimonial rendering only where strictly required to enforce approved publication, consent, attribution, and placement rules

Important context:
All current review authors, companies, testimonial text, performance claims, outcome claims, ratings, verified/unverified badges, review states, and public-use examples are intentional local development/demo fixtures.

Do not treat local demo fixtures as dishonest public claims. However, demo fixtures must be opt-in, isolated to local/demo environments, visibly labelled outside production, and prevented from reaching production, public pages, search-engine structured data, marketing email, social publishing, exports, analytics, or real client portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, finance/payment systems, unrelated CRM/delivery modules, broad public-site redesigns, Docker/DevOps files, or unrelated admin pages during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/reviews and review detail/editor components
   - Public components, APIs, loaders, structured-data generators, and CMS queries that render testimonials
   - API routes, server actions, services, repositories, validation schemas, and types
   - Prisma models/migrations for Testimonial/Review, ClientOrganization, User, OrganizationMembership, ConsentRecord, FileAsset, ContentPlacement, ModerationEvent, AuditLog, and public-site content
   - Existing create/edit/status/delete/publication behavior
   - Existing verified-badge logic
   - Existing author/company/logo/attribution behavior
   - Existing external review import/source-link behavior
   - Existing consent capture and withdrawal process
   - Existing authorization, tenant isolation, public data filtering, sanitization, caching, and structured-data behavior
   - Existing demo seeds and tests

2. Classify every displayed value, badge, field, claim, action, placement, source, and public-rendering path as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “VERIFIED” has a defined, evidence-backed meaning
   - Whether the “RATING” column is incorrectly used for verification state
   - Whether a status dropdown can publish content without consent, review, or audit evidence
   - Whether public display requires explicit client authorization
   - Whether testimonials with quantified, technical, absolute, compliance, revenue, or performance claims are reviewed safely
   - Whether content edits preserve customer meaning and require renewed consent where material
   - Whether delete actions destroy consent/withdrawal/moderation evidence
   - Whether public APIs/pages/structured data can expose pending, rejected, internal, unconsented, or cross-client testimonials
   - Whether withdrawal promptly removes public placement and caches
   - Whether client names, logos, titles, and company attribution have explicit permissions
   - Whether client-supplied text can inject HTML/script or manipulate moderation/AI instructions
   - Whether external review imports comply with source-platform terms and preserve required attribution/linking

4. Return an audit report containing:
   - Files inspected
   - Current architecture/data flow
   - Current testimonial/consent/moderation schema findings
   - Current verification-badge findings
   - Current claims-review findings
   - Current public-rendering/structured-data findings
   - Current attribution/source/import findings
   - Current archive/delete/withdrawal findings
   - Current authorization/privacy/tenant-isolation findings
   - Current demo-data behavior
   - Security/privacy/content-governance risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Cache invalidation plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, migrate/reset data, publish/unpublish reviews, alter public pages, request consent, send email, import third-party reviews, delete records, generate structured data, or modify caches during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure testimonial moderation and publication workflow.

A. Naming and UI
Use:

Title: “Testimonials”
Subtitle: “Review consent, claims, attribution, and public placement.”

Replace/remove:
- “PUBLIC TESTIMONIAL VERIFICATION” unless a narrowly defined evidence-backed verification workflow exists
- “VERIFIED” as a vague public badge
- Verification state in a “RATING” column
- Direct inline approval/publish dropdowns
- Standard “Delete Review” action
- Any unsupported “verified,” “guaranteed,” “flawless,” “sub-second,” “tripled,” “significant increase,” compliance, security, or performance claim

Use separate fields:
- Rating, only when a genuine rating exists
- Consent status
- Identity confirmation
- Client authorization
- Moderation status
- Public placement

B. State model
Implement separate server-enforced state dimensions:

Consent:
- NOT_REQUESTED
- PENDING
- GRANTED
- WITHDRAWN

Verification:
- NOT_VERIFIED
- IDENTITY_CONFIRMED
- CLIENT_AUTHORIZED

Moderation/publication:
- DRAFT
- PENDING_REVIEW
- APPROVED_FOR_PUBLICATION
- PUBLISHED
- REJECTED
- ARCHIVED

Rules:
- Only authorized staff can change moderation/publication state.
- Public rendering requires consent GRANTED and moderation status PUBLISHED, plus approved placement.
- Approval/publish actions must use confirmation and audit logs, not unsafe inline changes.
- A withdrawal must unpublish promptly, remove eligible placements/structured data, invalidate caches, and preserve minimal required internal history.
- No normal permanent delete action.
- ARCHIVED/REJECTED content remains non-public.

C. Consent and attribution
Support:
- Source: direct request, client portal, email, permitted external import
- Original submitted text
- Approved public text
- Attribution preferences: full name and company, first name and company, company only, anonymous
- Separate permissions for name, title, company, logo, and quote
- Consent text/version, timestamp, evidence, and optional expiry/review date
- Withdrawal evidence and timestamp
- Source URL only where valid and safe

Rules:
- Do not publish a name, company, title, logo, or result claim without appropriate affirmative permission.
- Keep consent evidence and contact details private.
- Material edits to meaning require renewed approval.
- Do not fabricate, rewrite deceptively, or combine testimonials.
- Make consent language specific to intended marketing/public-site use.

D. Claim moderation
Classify claims and require appropriate treatment:

- Subjective opinion: allowed with consent and basic moderation
- General experience: allowed with consent
- Specific delivery fact: check internally where practical
- Technical performance/security/compliance: evidence, defined scope/date, reviewer approval, or remove
- Quantified business outcome/revenue/lead conversion: client authorization and substantiation/approved wording, or remove
- Absolute guarantees: reject or reword

Do not use testimonials as proof of legal, medical, financial, compliance, security, uptime, availability, or performance guarantees.

E. Data model
Support:
- id
- organizationId, optional
- source
- externalSourceUrl, optional
- authorName, optional
- authorTitle, optional
- companyName, optional
- rating, optional and validated
- originalText
- approvedPublicText, optional
- attributionMode
- consentStatus
- consentVersion, optional
- consentedAt, optional
- consentEvidenceFileId, optional/private
- withdrawnAt, optional
- verificationStatus
- verificationNotes, staff-only
- moderationStatus
- moderationReason, staff-only
- approvedById, optional
- approvedAt, optional
- publishedById, optional
- publishedAt, optional
- archivedAt, optional
- publicPlacements
- publicVersionNumber, optional
- createdAt
- updatedAt

Use a separate immutable public-version/history/moderation-event model where needed. Do not expose internal notes, consent evidence, CRM IDs, email addresses, organization IDs, reviewer details, or raw audit metadata publicly.

F. Moderation UI
Header:
- Testimonials
- New testimonial
- Search
- Filters: moderation status, consent, verification, source, placement

Summary data, real only:
- Needs consent
- Awaiting review
- Ready to publish
- Published

List columns:
- Author / organization
- Testimonial preview
- Rating
- Consent
- Verification
- Moderation status
- Public placement
- Last updated
- Actions

Review detail:
- Original submission
- Approved public version
- Claim flags/evidence checklist
- Consent and attribution controls
- Source/import reference
- Version history
- Publication settings
- Moderation history
- Archive/withdrawal controls
- Staff-only notes

G. Public rendering and SEO
- Public pages/queries must return only PUBLISHED testimonials with GRANTED consent and explicit allowed placement.
- Render only approved public text and approved attribution fields.
- Sanitize as plain text or safe limited markup; never render raw user HTML.
- Pending, rejected, archived, internal, unconsented, or withdrawn content must not appear in public pages, feeds, APIs, structured data, page source, server props, prefetch payloads, caches, sitemaps, social cards, search indexes, or analytics events.
- Respect attribution restrictions.
- Structured-data output must use only eligible published data and must not make unsupported verification/performance claims.
- Invalidate cache/CDN/static regeneration paths immediately on publication, revision, archive, or withdrawal.

H. Security, authorization, privacy, audit
- Require authenticated authorized staff for all admin moderation operations.
- Client users must never access admin review moderation routes.
- Scope linked client data/consent evidence by organization and staff capability.
- Protect against IDOR/BOLA, mass assignment, XSS, CSRF where applicable, cross-tenant data leakage, unsafe external URLs, raw error exposure, and content injection.
- Validate all mutable inputs server-side with Zod and allowlist fields.
- Audit create/edit/consent request/consent grant/withdrawal/verification/approval/publication/unpublication/archive/export/privileged views.
- Maintain minimal privacy-respecting records required to honor consent and withdrawal.
- Do not expose internal notes, reviewer identity, emails, consent files, or raw moderation history publicly.

I. Demo behavior
- Existing reviews are local demo fixtures.
- Demo seeding must be opt-in.
- Demo mode must be server-enforced and visibly labelled outside production.
- Demo reviews must never reach production, public pages, structured data, marketing email, social posts, exports, analytics, or real portal accounts.
- Do not delete/reset demo records during audit.

J. Accessibility and quality
- Semantic tables/forms/headings.
- Keyboard-accessible filters, row actions, dialogs, approval controls, and editors.
- Visible focus states.
- Do not rely on color alone for state.
- Responsive layout.
- Accessible loading/empty/error/no-results/confirmation/success states.
- Reduced-motion support.
- Type-safe API contracts and no decorative fake moderation metrics.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Public eligibility and consent
- Only testimonials with GRANTED consent, PUBLISHED moderation status, and allowed placement render publicly.
- Pending/rejected/archived/withdrawn/unconsented testimonials never appear in pages, APIs, structured data, caches, sitemaps, social cards, or analytics.
- Withdrawal immediately removes public visibility and invalidates cache paths.
- Attribution permissions are enforced.

2. Moderation and versioning
- Authorized staff can create/review/approve/publish/archive.
- Unauthorized users cannot.
- Direct browser input cannot bypass consent/review/publication gates.
- Material edit creates/requires proper new public approval where configured.
- Archive preserves internal history; normal delete is absent.
- Claim flags and required evidence checks enforce configured rules.

3. Security and isolation
- Client portal users cannot access admin moderation.
- Guessed IDs cannot access another organization’s linked review/consent evidence.
- XSS, mass-assignment, CSRF, unsafe URL, and IDOR protections work.
- Internal notes/evidence/reviewer metadata are absent from public responses.

4. UI and quality
- Empty/loading/error/no-results/forbidden states render.
- Responsive and keyboard interactions work.
- Typecheck passes.
- Lint passes.
- Unit/integration/security/tenant-boundary/public-rendering/cache-invalidation tests pass.
- Production build passes.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Cache invalidation plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

CASE STUDIES : ___________________________________________________________________________________

You are a principal full-stack engineer, content-CMS architect, portfolio and agency-marketing product manager, privacy/consent workflow designer, advertising-claims risk reviewer, SEO and structured-data engineer, multi-tenant SaaS security engineer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this case-study CMS and the directly required public portfolio rendering:

/admin/case-studies
/admin/case-studies/[caseStudyId] if it exists
/work
/work/[slug]
Structured-data, sitemap, OpenGraph, social-card, and caching paths only where strictly required for safe case-study publication

Important context:
All current case-study titles, organizations, industries, target cities, locations, categories, impact metrics, performance values, conversion claims, payment-settlement claims, URLs, featured badges, publication states, and SEO/GEO statements are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo fixtures must be opt-in, local/demo-only, visibly labelled outside production, and prevented from reaching production, public pages, work indexes, search-engine structured data, sitemaps, OpenGraph/social cards, marketing emails, exports, analytics, or real client portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, invoice/payment systems, unrelated CRM/delivery modules, broad public-site redesigns, Docker/DevOps files, or unrelated admin modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before changing any file:

1. Inspect:
   - /admin/case-studies and case-study editor/detail components
   - /work and /work/[slug] routes, data loaders, API endpoints, static generation/revalidation/caching
   - Structured-data, sitemap, robots, canonical, OpenGraph, social-card, and metadata code related to case studies
   - API routes, server actions, services, repositories, validation schemas, types, and image/media handling
   - Prisma models/migrations for CaseStudy, CaseStudyVersion, CaseStudyMetric/Claim, ClaimEvidence, ClientPermission/Consent, ClientOrganization, Project, MediaAsset, ContentPlacement, Redirect, User, OrganizationMembership, AuditLog, and public CMS data
   - Existing create/edit/publish/archive/delete/featured/slug/preview behavior
   - Existing public URL access rules and draft preview logic
   - Existing client-logo/name/quote/screenshot handling
   - Existing organization/role/capability/tenant-isolation logic
   - Existing demo seeds, public output, and tests

2. Classify every visible field, metric, claim, status, badge, SEO/GEO statement, link, public preview, and action as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether published CMS content is directly queried live by public pages or produced as an immutable public snapshot
   - Whether draft/archived/demo/unauthorized content can leak through pages, APIs, prefetch payloads, social cards, OpenGraph, JSON-LD, sitemap, search, cache, or static builds
   - Whether “instant Google Schema,” “geo-targeted ranking relevance,” “SEO optimized,” or similar claims are technically supportable
   - Whether published case studies can be silently edited without a new version
   - Whether client/company names, logos, locations, screenshots, quotes, and project outcomes require explicit permission
   - Whether lead-growth, conversion, response-time, Core Web Vitals, payment-settlement, speed, administrative-overhead, security, compliance, revenue, ranking, AI, or performance claims have source evidence, period, methodology, scope, and approval
   - Whether “featured” is a deliberate public placement and whether it can be exposed without publication authorization
   - Whether case-study deletion breaks public URLs, SEO history, redirects, cache, audit history, or permission records
   - Whether slugs, image paths, redirects, user HTML/MDX, external URLs, and uploads are validated/sanitized
   - Whether client/project/internal data can leak across tenant boundaries or into public content
   - Whether public case-study performance queries are safe and avoid broad private data fetching

4. Return an audit report containing:
   - Files inspected
   - Current CMS/public-rendering architecture and data flow
   - Current schema/migration/version/snapshot findings
   - Current consent/client-permission findings
   - Current claim/evidence and metrics findings
   - Current SEO/structured-data/OpenGraph/sitemap/cache findings
   - Current public visibility/preview/featured findings
   - Current slug/redirect/archive/delete findings
   - Current authorization/tenant-isolation/privacy findings
   - Current demo-data behavior
   - Security/privacy/content-governance risks
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data-cleanup plan
   - Cache invalidation/revalidation plan
   - Redirect/SEO preservation plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, publish/unpublish case studies, alter public content, generate metadata/sitemaps, upload/delete media, request client permission, send emails, call external analytics/AI systems, or invalidate caches during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, evidence-based case-study workflow.

A. Naming and public claims
Use:

Title: “Case studies”
Subtitle: “Create, review, and publish evidence-backed portfolio stories.”

Replace/remove:
- “PORTFOLIO CMS — SEO & GEO OPTIMIZED SHOWCASE”
- “Portfolio specimens”
- “TOTAL SPECIMENS”
- “LIVE & PUBLISHED”
- “FEATURED SHOWCASE”
- “Instant Google Schema”
- “geo-targeted ranking relevance”
- Any unsupported “SEO optimized,” “instant,” “verified,” “guaranteed,” “sub-second,” “secure,” “compliant,” “AI-powered,” “enterprise,” “performance” or ranking promise

Use factual alternatives:
- Total case studies
- Published
- Featured on work page
- Drafts
- Supports configured social metadata and eligible structured data for published content
- Claim review required
- Client permission required

B. Versioned lifecycle
Use server-enforced statuses:

- DRAFT
- PENDING_CLIENT_PERMISSION
- PENDING_EVIDENCE_REVIEW
- READY_FOR_EDITORIAL_REVIEW
- APPROVED_FOR_PUBLICATION
- PUBLISHED
- ARCHIVED
- SUPERSEDED

Rules:
- DRAFT is private and excluded from all public outputs.
- Public publication requires client permission as needed, evidence review for claims, named editorial approval, final confirmation, version snapshot, and audit event.
- PUBLISHED versions are immutable.
- Corrections create a new version and mark prior version SUPERSEDED; never silently overwrite public content.
- ARCHIVED must safely remove public visibility while preserving internal history, consent, claim evidence, prior versions, redirects, and audit data.
- No normal permanent delete action.
- All transitions are server-side, validated, authorized, and audited.

C. Consent/client permission
Create a granular permission model for:
- Client/company name
- Logo/brand assets
- Location
- Screenshots/media
- Quotes
- Project description
- Quantified results
- Technical/security/compliance claims
- Public portfolio use
- Search/social/structured-data distribution

Store:
- Permission status: NOT_REQUESTED | PENDING | GRANTED | WITHDRAWN
- Consent/permission text/version
- Granted/withdrawn timestamps
- Authorized client identity/membership or document evidence
- Expiry/review date where needed
- Internal notes/evidence files restricted from public output

Rules:
- Do not publish any client identity, logo, location, screenshots, quote, or result claim without matching permission.
- Withdrawal unpublishes relevant public content promptly, invalidates caches/static output/social metadata, and preserves minimal required internal history.
- Material public edits require reapproval where policy requires.
- Do not fabricate testimonials, results, sources, or permission evidence.

D. Claims and evidence model
For each public claim/metric, support:
- id
- caseStudyVersionId
- category: DELIVERY | PERFORMANCE | SEO | CONVERSION | REVENUE | COST | TIME | SECURITY | COMPLIANCE | OTHER
- label
- displayValue
- numeric value/unit where applicable
- baseline period
- measurement period
- scope/environment
- methodology
- source/tool
- evidence file/reference
- evidence status: MISSING | PENDING_REVIEW | APPROVED | REJECTED
- client approval required/received
- reviewer/approval timestamps
- public visibility
- approved wording/disclaimer

Rules:
- Do not publish metrics unless evidence is APPROVED and required client permission is GRANTED.
- Do not infer, synthesize, round up, or let AI create outcome figures.
- Use qualitative approved copy when metrics cannot be substantiated.
- Define Core Web Vitals measurement source/page/device/date and lab-vs-field context.
- Do not describe bank/provider settlement improvements as product outcomes unless scope and measurement are clear.
- Security/compliance/availability/ranking claims require explicit approved evidence and scope, otherwise omit them.

E. Case-study and public-snapshot model
Ensure case study/version fields support:
- id
- internal title
- public title
- slug
- category
- industry, optional
- approved location, optional
- short summary
- challenge
- approach
- approved results
- approved client attribution
- approved media
- status
- versionNumber
- replacesVersionId, optional
- publicSnapshotId, optional
- publication date
- publishedById
- editor/reviewer IDs
- public placements
- featured placement setting
- SEO metadata fields, optional/validated
- canonical/public URL configuration
- archivedAt
- createdAt
- updatedAt

Public routes must consume only a minimal immutable published snapshot that includes permitted public fields. Never directly expose/edit the private CMS entity through public loaders.

F. CMS UX
Header:
- Case studies
- New case study
- Search
- Category/status/permission/claim-review filters

Summary counts, real only:
- Needs client permission
- Needs evidence review
- Ready to publish
- Published

Columns:
- Title / permitted client attribution
- Category
- Publication status
- Permission status
- Claim review
- Public placements
- Last updated
- Actions

Editor sections:
- Overview and narrative
- Client permission
- Claims and evidence
- Approved results
- Media and attribution
- Public placements/featured setting
- SEO/social metadata
- Draft preview
- Version history
- Activity/audit history
- Archive/unpublish controls
- Staff-only notes

Draft preview must be authenticated, capability-checked, noindex/nofollow, non-cacheable, and unavailable to ordinary public visitors.

G. SEO, GEO, structured data, and public output
- Do not promise rankings, indexing, geographic relevance, or SEO outcomes.
- Generate OpenGraph/social metadata only for eligible PUBLISHED public snapshots.
- Generate JSON-LD only from eligible published and permission-approved data; do not inject unsupported claims.
- Ensure draft/archived/withdrawn/demo content is absent from HTML, server data, JSON-LD, sitemap, RSS/feeds, social images, prefetch payloads, APIs, caches, and static output.
- Use canonical URLs correctly.
- Validate metadata lengths, slugs, and alt text.
- Do not fabricate location relevance; show location only when accurate and permissioned.
- Revalidate/invalidate caches on publish, unpublish, archive, permission withdrawal, media change, or version replacement.
- Preserve SEO safely with redirects for changed published slugs, subject to authorization and permission status.
- Do not redirect withdrawn/private case studies to a page that exposes their prior details.

H. Media and link safety
- Keep original/private media separate from approved public derivatives.
- Require explicit permission for client logos, screenshots, people, and brand assets.
- Validate uploads by MIME, size, content safety, ownership, and malware scanning/quarantine where available.
- Use non-guessable authorized access for private assets.
- Sanitize Markdown/HTML/MDX; do not allow arbitrary scripts, embeds, style injection, or unsafe URLs.
- Validate external links and redirect targets.
- Do not expose internal project URLs, staging links, credentials, analytics IDs, asset keys, EXIF location data, or internal file metadata publicly.

I. Authorization, privacy, audit
- Require authenticated authorized staff for all CMS management routes/actions.
- Client portal users must never access admin case-study CMS.
- Scope client/project/media/permission/evidence access by organization and staff capability.
- Protect against IDOR/BOLA, mass assignment, stored XSS, CSRF where applicable, open redirects, unsafe uploads, cross-tenant data leakage, cache leaks, sitemap leaks, and raw error exposure.
- Validate all server-side mutations with Zod and allowlist mutable fields.
- Audit create/edit/claim change/evidence upload-review/permission request-grant-withdrawal/approval/publish/unpublish/archive/restore/slug redirect/media action/export/privileged view.
- Public responses must exclude internal notes, evidence files, consent records, staff IDs, organization IDs, project data, file keys, analytics credentials, audit metadata, unpublished versions, and raw errors.

J. Demo behavior
- Current case studies are local demo fixtures.
- Demo seeding must be explicit and opt-in only.
- Demo mode must be server-enforced and visibly labelled outside production.
- Demo cases must never be published or included in public work routes, structured data, sitemaps, social cards, analytics, exports, marketing emails, or real portal data.
- Do not reset/delete data during the audit.

K. Accessibility and quality
- Semantic tables/forms/headings and accessible editing controls.
- Keyboard-accessible filters, menus, dialogs, preview, review, publish, archive, and media controls.
- Visible focus states and reduced-motion support.
- Status/permission/claim state cannot rely on color alone.
- Responsive layout.
- Accessible loading, validation, confirmation, error, empty, no-results, and success states.
- Type-safe API contracts.
- No decorative fake metrics or unsupported SEO/GEO messaging.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Publication eligibility
- Only PUBLISHED, permission-authorized, evidence-approved public snapshots appear on /work and /work/[slug].
- Draft, archived, superseded, withdrawn, demo, or unapproved case studies never appear in HTML, APIs, structured data, sitemap, social cards, caches, prefetch data, or static output.
- Featured placement appears only for eligible published records.
- Permission withdrawal unpublishes content and invalidates all relevant caches/metadata paths.

2. Claims/evidence
- Unsupported/missing-evidence metrics do not render publicly.
- Quantified, performance, SEO, security, compliance, financial, and outcome claims require approved evidence and permission.
- Published metrics maintain original approved wording/version.
- Editing a published claim requires a new revision/approval.

3. Versioning and URLs
- Published snapshots are immutable.
- Revisions supersede without silently rewriting existing public versions.
- Archive preserves history and removes public access.
- Normal delete is absent.
- Slug changes create safe redirects where authorized; withdrawn content does not leak through redirects.

4. Security and isolation
- Unauthorized users cannot access admin CMS/evidence/permission records.
- Guessed IDs cannot expose another organization’s client/media/evidence/project records.
- Stored XSS, unsafe Markdown/MDX, open redirect, unsafe upload, CSRF, mass assignment, and IDOR protections work.
- Private CMS/source data never leaks through public routes, metadata, cache, media, or errors.

5. SEO/rendering/quality
- Canonicals, metadata, OpenGraph, JSON-LD, and sitemap include only eligible published snapshots.
- No SEO/ranking guarantee text is rendered by default.
- Draft preview is authenticated, noindex, and non-cacheable.
- Empty/loading/error/not-found/forbidden states render.
- Keyboard and responsive UI works.
- Typecheck, lint, unit, integration, security, tenant-isolation, public-rendering, caching, redirect, and build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Cache invalidation/revalidation plan
- Redirect/SEO preservation plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

BLOGS PAGE:+++++++++++++++++++++++++++++++++++++++++++++++++++++++=====================================================

You are a principal full-stack engineer, editorial-CMS architect, technical-content editor, SEO and structured-data engineer, application-security engineer, AI-safety engineer, multi-tenant SaaS architect, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this blog CMS and the directly required public blog rendering:

/admin/blog
/admin/blog/[articleId] if it exists
/blog
/blog/[slug]
Article structured data, OpenGraph/social metadata, sitemap, preview, caching, and redirect paths only where strictly required for safe article publication

Important context:
All current article titles, authors, categories, cities, featured labels, reading-time values, statuses, technical/security/AI/performance claims, SEO/GEO wording, public URLs, and article content are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo fixtures must be opt-in, local/demo-only, visibly labelled outside production, and prevented from reaching production, public blog routes, metadata, structured data, sitemap, social cards, marketing emails, exports, analytics, external AI requests, or real client portal accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, invoices/payments, unrelated CMS modules, broad public-site redesigns, Docker/DevOps deployment files, or unrelated admin modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/blog and article editor/detail components
   - /blog and /blog/[slug] pages, loaders, server actions, APIs, public data contracts, static generation, cache/revalidation
   - Article Schema/JSON-LD, OpenGraph, canonical, robots, sitemap, RSS/feed, social-card, and metadata code
   - API routes, services, repositories, validation schemas, types, editor/Markdown/MDX/rendering/sanitization logic, and media handling
   - Prisma models/migrations for Article, ArticleVersion, ArticleReview, ArticleClaim/Evidence, AuthorProfile, MediaAsset, ContentPlacement, Redirect, AI generation metadata, AuditLog, and public-content snapshots
   - Existing draft/publish/schedule/archive/delete/featured/slug/preview workflows
   - Existing technical/security/legal review controls
   - Existing AI writing/provider integration, prompt templates, content boundaries, logging, and retention
   - Existing authorization, public data filtering, cache controls, and demo seeds/tests

2. Classify every field, label, article, title, claim, city/location, public link, schema/meta behavior, action, status, featured state, and metric as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether public blog routes query editable CMS data directly or use immutable public snapshots
   - Whether draft/scheduled/archived/demo content leaks through pages, APIs, RSS, JSON-LD, OpenGraph, sitemap, caches, prefetch payloads, static output, or social images
   - Whether published articles can be silently edited without versioning
   - Whether Delete removes URLs, revisions, redirects, audit history, or editorial evidence
   - Whether the location field creates unsupported geographic/local-service claims
   - Whether “automated Article Schema,” “high authority,” “SEO,” “24/7,” “self-hosted auth,” “sub-second,” security, AI, performance, availability, compliance, or ranking claims are factually reviewed and evidence-backed
   - Whether AI can publish, generate unsupported claims, use private customer data, or be manipulated by article/editorial input
   - Whether Markdown/MDX/HTML/media/links can introduce XSS, script injection, unsafe embeds, open redirects, unsafe external URLs, private asset exposure, or prompt injection
   - Whether slug changes and archives preserve SEO safely without revealing withdrawn/private content
   - Whether search, previews, author fields, and audit data are appropriately access-controlled
   - Whether public content queries are performant and avoid over-fetching private CMS data

4. Return an audit report with:
   - Files inspected
   - Current CMS/public rendering architecture and data flow
   - Current schema/migration/version/public-snapshot findings
   - Current state/review workflow findings
   - Current technical-claim and evidence findings
   - Current AI generation/safety findings
   - Current metadata/SEO/schema/sitemap/cache/preview findings
   - Current author/location/featured/placement findings
   - Current slug/redirect/archive/delete findings
   - Current authorization/privacy/security findings
   - Current demo-data behavior
   - UI/UX findings
   - Unsupported/misleading claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Cache invalidation and SEO/redirect plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, create/edit/publish/archive articles, change slugs, generate metadata/sitemaps, upload/delete media, call AI providers, send emails, invalidate caches, or alter public pages during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, versioned blog-publishing workflow.

A. Naming and editorial copy
Use:

Title: “Blog”
Subtitle: “Draft, review, and publish technical articles.”

Replace/remove:
- “EDITORIAL CMS — TECHNICAL WRITING, SEO & LOCAL RELEVANCE” if it creates outcome claims
- “high-authority engineering articles”
- “PUBLISHED LIVE”
- “automated Article Schema and OpenGraph data” as a benefit/ranking promise
- generic GEO/location labels used only for SEO
- default claims such as “24/7,” “sub-second,” “self-hosted,” “secure,” “verified,” “compliant,” “AI-powered,” or ranking promises unless approved and evidence-backed

Use:
- Published
- Featured on blog index
- Location context, optional and factual
- Supports configured social metadata and eligible Article structured data for published posts
- Technical review required
- Claim review required

B. Versioned article lifecycle
Use server-enforced states:

- DRAFT
- IN_EDITORIAL_REVIEW
- IN_TECHNICAL_REVIEW
- APPROVED_FOR_PUBLICATION
- SCHEDULED
- PUBLISHED
- ARCHIVED
- SUPERSEDED

Rules:
- DRAFT is private and excluded from all public/search/social output.
- Security, privacy, AI, performance, availability, finance, legal/compliance, and product-architecture claims require technical review before publication.
- PUBLISHED creates an immutable public version/snapshot.
- Edits to published content create a new revision and require appropriate review; never silently overwrite public content.
- Scheduled publication must use server-side time-zone-aware processing and audit events.
- Archive/unpublish must preserve history and remove public visibility safely.
- Do not show a normal permanent Delete action.
- All state transitions must be server-side, capability-checked, validated, and audited.

C. Article schema
Support:
- id
- title
- slug
- excerpt
- bodySource
- approvedPublicContent
- category
- authorProfileId
- optional factual locationContext
- featured placement
- status
- publication/schedule timestamps
- versionNumber
- replacesVersionId, optional
- publicSnapshotId, optional
- editorial reviewer ID
- technical reviewer ID, optional
- publishedById
- publishedAt
- archivedAt, optional
- SEO metadata fields, validated and optional
- createdAt
- updatedAt

Use a separate immutable public snapshot/version model. Public blog routes must consume only approved published snapshot data.

D. Claim and technical review
Add a claim-review system or structured checklist for:
- Security/authentication
- Privacy/data handling
- AI capability/automation
- Availability/uptime/24-7 claims
- Performance/Core Web Vitals/sub-second claims
- SEO/ranking/local-search claims
- Finance/payment claims
- Compliance/legal claims
- Customer/business outcomes

For material claims capture:
- Claim text/category
- Scope/environment
- Evidence/source reference
- Measurement period/date where relevant
- Approved wording/disclaimer
- Reviewer
- Approval timestamp
- Review status

Rules:
- Do not invent, infer, round up, or publish unsupported technical/business claims.
- Use clearly educational wording when explaining patterns rather than describing CYBERSTYLE’s live product behavior.
- Do not present benchmark results without tool, page/system, device/load, date, methodology, and lab/field context.
- Do not use city/location metadata to imply an office, client base, local availability, or ranking expectation unless true and approved.
- Do not use AI output as evidence.

E. AI safety
- AI may draft/edit/summarize only; it cannot publish, schedule, change public URLs, send emails, alter source data, or make final claim decisions.
- Restrict AI inputs to explicitly selected, authorized editorial material.
- Exclude secrets, tokens, customer/client data, staff notes, audit data, credentials, invoice/payment data, and other private records.
- Treat AI output as untrusted draft text.
- Protect prompts against instructions embedded in article content, external links, uploads, or comments.
- Store only safe/redacted generation metadata: model/provider, prompt-template version, time, reviewer, and source references as needed.
- Do not expose prompts, private inputs, or AI metadata publicly.

F. Public rendering, SEO, and caching
- `/blog` and `/blog/[slug]` must render only PUBLISHED public snapshots.
- Draft, scheduled, archived, superseded, demo, or unapproved versions must never appear in HTML, APIs, RSS, sitemap, JSON-LD, OpenGraph, social-card generation, canonical tags, prefetch payloads, caches, analytics, or static output.
- Use authenticated, capability-checked, noindex/nofollow, non-cacheable draft previews separate from public article URLs.
- Generate Article JSON-LD and OpenGraph only from eligible published snapshots.
- Do not promise ranking, authority, indexing, or local-search outcomes.
- Validate canonical URLs, metadata lengths, social images, alt text, and slugs.
- Invalidate/revalidate public caches safely on publication, revision, archive, media change, or schedule execution.
- For changed published slugs, create deliberate redirect records; do not redirect archived/withdrawn content in a way that reveals private information.
- Do not include private CMS IDs, internal notes, reviewer metadata, source evidence, AI metadata, analytics IDs, or private media links in public responses.

G. Content/media safety
- Sanitize Markdown/HTML/MDX and prohibit scripts, unsafe embeds, event handlers, styles, and dangerous URL schemes.
- Validate outbound links and apply safe rel attributes where appropriate.
- Validate uploads by MIME type, size, content inspection, ownership, and scanning/quarantine where available.
- Separate original/private media from approved public derivatives.
- Strip sensitive EXIF/location data unless deliberately approved.
- Protect against stored XSS, script injection, link injection, and unsafe redirects.

H. Admin UX
Header:
- Blog
- New article
- Search
- Category/status/author/review-state filters

Summary metrics, real only:
- In editorial review
- Needs technical review
- Scheduled
- Published this month

Columns:
- Article
- Category
- Author
- Review status
- Publication status
- Published/scheduled
- Featured placement
- Actions

State-aware actions:
- Draft: Edit, submit for review, archive
- Editorial review: Return to draft, send to technical review, archive
- Technical review: Approve/reject/request changes
- Approved/scheduled: Final private preview, schedule/publish, return to draft
- Published: View live, create revision, archive/unpublish, version history
- Archived: View/restore history where authorized

I. Authorization, audit, and quality
- Require authenticated authorized staff for admin blog routes/actions.
- Public users may read only eligible published snapshots.
- Scope author/editor/reviewer/media access correctly and do not expose private CMS fields.
- Protect against IDOR/BOLA, mass assignment, CSRF where applicable, stored XSS, unsafe uploads, unsafe links, cache leakage, metadata leakage, open redirects, prompt injection, raw errors, and over-fetching.
- Validate all mutations with Zod and allowlist mutable fields.
- Audit create/edit/review/technical approval/schedule/publish/unpublish/archive/restore/slug change/redirect/media/featured placement/preview/export/privileged view actions.
- Include accessible loading, empty, error, no-results, confirmation, and success states; keyboard-accessible controls; responsive design; visible focus states; reduced-motion support; and no color-only status signaling.

J. Demo behavior
- Existing blog posts are local demo fixtures.
- Demo seed is opt-in only.
- Demo mode is server-enforced and visibly labelled outside production.
- Demo posts never appear in production, public blog routes, Article Schema, sitemap, feeds, social cards, analytics, external AI inputs, emails, or exports.
- Do not reset/delete demo data during audit.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Public eligibility and publishing
- Only PUBLISHED approved public snapshots appear on `/blog` and `/blog/[slug]`.
- Draft/scheduled/archived/superseded/demo/unapproved articles never appear in public pages, APIs, feeds, sitemap, JSON-LD, OpenGraph, social cards, cache/prefetch data, or static output.
- Featured placement works only for eligible published versions.
- Publish/archive/revision/schedule actions invalidate/revalidate correct paths.

2. Lifecycle/version integrity
- Valid transitions work; invalid transitions fail.
- Technical-review requirement is enforced for configured claim categories.
- Published snapshots remain immutable.
- Published edits create a revision and do not overwrite prior content.
- Archive preserves history; normal delete is absent.
- Slug-change redirect behavior works without leaking archived/private content.

3. Claims/AI/content security
- Unsupported claims cannot bypass configured review.
- AI cannot publish/schedule or access excluded private data.
- Prompt injection from content/links/uploads is neutralized.
- Markdown/HTML/MDX sanitization blocks scripts, unsafe embeds, and dangerous URLs.
- Private evidence, reviewer metadata, prompts, and CMS IDs are absent from public responses.

4. Access and quality
- Unauthorized users cannot access admin editing/review paths.
- Draft preview requires capability, is noindex, and is non-cacheable.
- Empty/loading/error/no-results/forbidden states render.
- Keyboard accessibility and responsive UI work.
- Typecheck, lint, unit/integration/security/public-rendering/cache/redirect/AI-safety tests, and production build pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Cache invalidation/revalidation plan
- Redirect/SEO preservation plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”


FAQS:________________________________________________________________________________________________________________

You are a principal full-stack engineer, content-CMS architect, commercial-content reviewer, technical documentation editor, SEO/structured-data engineer, application-security engineer, AI-safety engineer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this FAQ CMS and the directly required public FAQ rendering/placement support:

/admin/faqs
/faq
Homepage, Pricing, and service-page FAQ components only where strictly required for safe FAQ placement and publication
FAQ structured-data, caching, preview, and public-content loading paths only where strictly required

Important context:
All visible FAQ questions, categories, placement counts, “live synced” labels, publication states, answer content, pricing/payment/ownership/SEO/AI/security/hosting claims, and public page placements are intentional local development/demo fixtures.

Do not treat demo fixtures as dishonest public claims. However, demo FAQ records must be opt-in, local/demo-only, visibly labelled outside production, and prevented from reaching production pages, public APIs, structured data, sitemap-related output, search/social metadata, emails, exports, analytics, external AI calls, or real customer accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, finance/payment implementation, unrelated CRM/delivery modules, broad public-site redesigns, Docker/DevOps deployment files, or unrelated admin modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/faqs route/page, editor/detail components, dialogs, and row actions
   - /faq plus homepage, pricing, and service-page FAQ components/loaders
   - Public APIs, server actions, services, repositories, validation schemas, types, caching/revalidation/static-generation logic
   - FAQ JSON-LD/structured-data, metadata, sitemap, robots, preview, and search paths
   - Prisma models/migrations for FAQ, FAQVersion, FAQPlacement, PublicContentSnapshot, ContentReview, AuditLog, User, and media/link support
   - Current create/edit/publish/unpublish/delete/category/placement ordering behavior
   - Existing claim-review or legal/technical review logic
   - Existing authorization, sanitization, public data filtering, and demo seed behavior
   - Existing tests

2. Classify every visible label, FAQ item, count, category, placement, action, status, answer, schema/meta behavior, and public rendering path as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “POSTGRES LIVE SYNCED” means public pages read mutable admin records directly
   - Whether single-click changes can alter multiple public pages without review/confirmation
   - Whether all “LIVE” records are actually published and visible in their listed placements
   - Whether drafts, archived records, demo data, or unapproved changes can leak through pages, APIs, JSON-LD, cache, static output, prefetch payloads, or search endpoints
   - Whether delete breaks content history, links, schema, public placement ordering, cache, or audit trails
   - Whether published answers can be silently changed without revision/versioning
   - Whether answers about pricing, milestone payments, ownership, revisions, timelines, SEO, AI, integrations, portals, hosting, security, privacy, compliance, and support require a review process
   - Whether FAQ structured data is generated safely and without unsupported ranking/rich-result claims
   - Whether FAQ answer text/links/HTML can introduce XSS, unsafe URLs, or prompt injection into AI tooling
   - Whether public page placement counts are correctly derived from eligible published records
   - Whether public queries are fast and avoid broad CMS data leakage

4. Return an audit report containing:
   - Files inspected
   - Current CMS/public-rendering architecture and data flow
   - Current FAQ/version/placement/public-snapshot schema findings
   - Current publication/review/versioning findings
   - Current content-claim review findings
   - Current page-placement/order findings
   - Current public-rendering/structured-data/cache/preview findings
   - Current archive/delete findings
   - Current authorization/security/privacy findings
   - Current demo-data behavior
   - UI/UX findings
   - Unsupported or misleading labels/claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Cache invalidation/revalidation plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, add/edit/publish/unpublish/archive/delete FAQs, alter public pages, generate JSON-LD/sitemaps, invalidate caches, send emails, call AI providers, or change external integrations during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, versioned multi-page FAQ workflow.

A. Naming and CMS copy
Use:

Title: “FAQs”
Subtitle: “Draft, review, and publish accurate answers across the public site.”

Replace/remove:
- “FAQ Management & Multi-Page Feeds”
- “POSTGRES LIVE SYNCED”
- “single-click synchronization”
- ambiguous universal “LIVE”
- standard “Delete FAQ”
- any claim that schema, SEO, sync, AI, hosting, security, payment, or services work automatically unless backed by implementation/evidence

Use:
- Publication status
- Review status
- Public placements
- Published FAQ content
- Preview affected pages
- Create revision
- Archive FAQ
- Supports eligible structured data for published FAQs

B. Versioned state model
Use server-enforced statuses:

- DRAFT
- IN_CONTENT_REVIEW
- IN_TECHNICAL_OR_COMMERCIAL_REVIEW
- APPROVED_FOR_PUBLICATION
- PUBLISHED
- ARCHIVED
- SUPERSEDED

Rules:
- Draft/review/archived/superseded/demo FAQs are private and excluded from all public outputs.
- Pricing, commercial terms, payment, ownership, security, privacy, AI, hosting, support, availability, compliance, SEO/ranking, and technical-performance claims require the configured appropriate review before approval.
- PUBLISHED creates an immutable public version/snapshot with reviewer/approver, selected placements, effective time, publication time, and audit evidence.
- Published edits create a revision; never silently overwrite public guidance.
- Placement changes after publication require confirmation and audit log; use revision when material.
- Archive/unpublish preserves history and safely removes all public placements.
- Normal permanent delete must be absent.

C. FAQ schema and placement model
Support:
- id
- internalTitle
- question
- answerSource
- approvedPublicAnswer
- category
- status
- versionNumber
- replacesFaqVersionId, optional
- effectiveFrom, optional
- effectiveUntil, optional
- reviewRequired flags/categories
- reviewer/approver/publisher IDs/timestamps
- publicSnapshotId
- archivedAt, optional
- createdAt
- updatedAt

Use a separate placement relation:
- id
- faqVersionId or publicSnapshotId
- pageTarget: FAQ_INDEX | HOMEPAGE | PRICING | SERVICE_PREMIUM_WEB | SERVICE_AI_AUTOMATION | SERVICE_CUSTOM_SAAS
- displayOrder
- enabled
- createdBy
- createdAt
- updatedAt

Rules:
- Validate and allowlist targets.
- Placement counts must be derived server-side only from eligible published snapshots.
- Placement order must be stable and page-scoped.
- Do not use generic free-form page routes/URLs as placement input.
- Bulk placement actions need explicit affected-page preview and confirmation.

D. Content/claims review
Implement structured review requirements/checklists for:
- Fees, scope, pricing, revisions, discounts
- Milestone payments, invoice/payment methods, refunds
- Ownership, licences, deliverable handover
- Timelines and delivery promises
- Support/maintenance, availability, response time
- SEO, indexing, rankings, traffic, local relevance
- AI behavior, data use, human review, limitations
- Integrations, CRM/calendar access, credentials/data access
- Client portal, authentication, payments, files
- Hosting, infrastructure, backups, monitoring, region, security, privacy, compliance
- Technical performance/security claims

Rules:
- Do not publish universal guarantees, exact commitments, unsupported legal/compliance claims, or promised outcomes unless actual documented terms/evidence support them.
- Use conditional/scoped wording where appropriate.
- Require appropriate reviewer and approval for flagged categories.
- AI may help draft but must never approve/publish or invent policy/technical claims.
- Treat all AI output as untrusted draft content.

E. Public rendering, preview, schema, and caching
- Public pages must consume only minimal immutable PUBLISHED public snapshots whose placement includes that page and whose effective window includes the current date.
- Never render direct editable CMS rows.
- Draft/review/scheduled/archived/superseded/demo FAQs must never appear in page HTML, API responses, prefetch data, static output, caches, JSON-LD, social metadata, feeds, sitemaps, search, analytics, or error responses.
- Generate FAQ structured data only from eligible published snapshots and only where appropriate; do not claim it guarantees search ranking or rich results.
- Render question/answer using sanitized limited markup or plain text; block scripts, event handlers, unsafe embeds, unsafe URLs, and arbitrary HTML.
- Draft previews must be authenticated, capability-checked, noindex/nofollow, non-cacheable, and separate from public URLs.
- Publishing, revising, placement changes, unpublishing, archiving, or effective-date changes must revalidate/invalidate every affected public page and metadata/cache path.
- Use explicit cache tags/keys and test them.

F. Admin UX
Header:
- FAQs
- New FAQ
- Search
- Category/status/placement/review filters

Summary counts, real only:
- Needs review
- Ready to publish
- Published
- Archived

Table/list fields:
- Question
- Category
- Review status
- Publication status
- Public placements
- Effective date
- Last updated
- Actions

Detail/editor sections:
- Question and approved answer
- Category
- Claim/review checklist
- Public placements and page preview
- Effective dates
- Version history
- Activity/audit history
- Archive/unpublish controls
- Staff-only notes

Actions:
- Edit draft
- Submit for review
- Return for changes
- Approve for publication
- Preview affected pages
- Publish/unpublish
- Create revision
- Archive

G. Authorization, security, audit
- Require authenticated authorized staff for admin FAQ management.
- Public users access only eligible public snapshots.
- Ensure placement/public-preview/public-fetch logic cannot leak drafts or staff-only records.
- Protect against IDOR/BOLA, mass assignment, stored XSS, CSRF where applicable, unsafe links, open redirects, prompt injection, cache leakage, raw errors, and over-fetching.
- Validate all mutable inputs server-side using Zod and allowlist fields.
- Audit creation, edits, review, approval, publish/unpublish, placement changes, ordering changes, effective-date changes, archive/restore, revision creation, previews, exports, and privileged views.
- Do not expose staff notes, reviewer data, CMS IDs, source text, audit metadata, private links, or unpublished versions publicly.

H. Demo behavior
- Existing FAQs are local demo fixtures.
- Demo seed must be explicit and opt-in.
- Demo mode must be server-enforced and visibly labelled outside production.
- Demo FAQs must never appear in production public pages, schema, metadata, sitemaps, feeds, analytics, exports, emails, or external AI requests.
- Do not reset/delete demo data during audit.

I. Accessibility and quality
- Use semantic tables/forms/headings and accessible placement controls.
- Keyboard-accessible filters, row actions, dialogs, previews, review controls, ordering, and forms.
- Visible focus states and reduced-motion support.
- Do not rely on color alone for review/publication state.
- Responsive mobile design.
- Accessible loading, error, validation, confirmation, empty, no-results, and success states.
- Type-safe contracts and no fake sync/SEO telemetry.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Publication eligibility and placement
- Only eligible PUBLISHED snapshots render on `/faq`, homepage, pricing, and matching service pages.
- Draft/review/archived/superseded/demo/unapproved/effective-date-ineligible FAQs never appear in public pages, APIs, JSON-LD, sitemap, caches, prefetch/static output, analytics, or metadata.
- Placement filters/counts/orders are correct and server-derived.
- Placement changes affect only selected pages and require proper authorization/confirmation.
- Publish/unpublish/archive/revision changes invalidate all affected cache paths.

2. Lifecycle/version/review
- Valid status transitions work; invalid transitions fail.
- Required review is enforced for flagged commercial/technical/security/AI/SEO/hosting content.
- Published public snapshots stay immutable.
- Published edits create new revisions rather than silently changing public text.
- Archive preserves history and normal permanent deletion is unavailable.

3. Security and content safety
- Unauthorized users cannot manage FAQs or access drafts/previews.
- Draft preview is authenticated, noindex, and non-cacheable.
- Stored XSS, unsafe links/HTML, mass assignment, CSRF, IDOR/BOLA, prompt injection, cache leakage, and raw-error exposure are prevented.
- Public payloads exclude CMS IDs, internal notes, reviewer metadata, source text, audit data, and unpublished versions.

4. Quality
- Empty/loading/error/no-results/forbidden states render.
- Responsive and keyboard-accessible behavior works.
- Typecheck passes.
- Lint passes.
- Unit, integration, security, public-rendering, structured-data, cache-invalidation, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Cache invalidation/revalidation plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”


MEDIA: __________________________________________________________________________________

You are a principal full-stack engineer, cloud-storage security engineer, malware-scanning and file-processing workflow designer, multi-tenant SaaS security architect, privacy/records-retention engineer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only the media/file-storage administration module and directly required secure upload, processing, authorization, preview, download, sharing, retention, and audit paths:

/admin/media
/admin/media/[fileId] if it exists
File upload APIs/server actions
File preview/download/share endpoints only where strictly required
Private file storage adapters, scan-processing jobs, and file metadata persistence only where strictly required

Important context:
The visible development banner, all file names, duplicate `System_Architecture_v1.pdf` rows, 74 B sizes, “Scanning…” statuses, checksums, folders, scan labels, signed-link controls, and other media records are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat local demo fixtures as production security claims. Demo media must be opt-in, local/demo-only, visibly labelled outside production, and prevented from appearing in production, public pages, real portal accounts, client emails, exports, analytics, storage reporting, scan-provider traffic, or external sharing.

Do not modify database reset scripts, administrator bootstrap, email OTP, unrelated CRM/finance/content modules, broad public-site code, Docker/DevOps infrastructure files, or unrelated admin routes during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/media route, list/detail components, upload dialogs, folder taxonomy, search, refresh, version controls, delete actions, signed-link actions, previews, and error states
   - Upload, multipart upload, direct-to-storage, server-streaming, file-confirmation, processing, scan, checksum, metadata-extraction, preview/derivative, download, sharing, revocation, archive, and purge routes/jobs
   - Storage adapter configuration and interfaces, but do not expose or alter secrets/configuration
   - Prisma models/migrations for FileAsset, FileVersion, FileShare/DownloadGrant, UploadIntent, ScanJob, FileAuditEvent, ClientOrganization, Project, User, OrganizationMembership, RetentionPolicy, and AuditLog
   - Existing authorization, organization/project/file classification checks, and client-portal file access
   - Existing CDN/cache/content-disposition controls, public/private object visibility, and filename/content-type handling
   - Existing demo seeds/tests and duplicate-file/idempotency behavior

2. Classify every visible label, security claim, action, record, status, checksum, folder, file size, and storage behavior as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether uploads actually enter an isolated private quarantine location
   - Whether magic-byte/type/size/container validation exists and is enforced server-side
   - Whether malware scanning is implemented, which statuses represent pending/clean/flagged/error, and whether failures fail closed
   - Whether SHA-256 is calculated over the final stored bytes and persisted correctly
   - Whether files can be previewed/downloaded/shared while scanning, unscanned, flagged, quarantined, archived, or rejected
   - Whether signed links are truly HMAC signed, short-lived, recipient/session-bound, revocable, and actually single-use; do not assume “single-use”
   - Whether storage objects or presigned URLs are publicly reachable, predictable, long-lived, leaked in logs, or included in browser payloads
   - Whether duplicate demo files arise from non-idempotent upload, incorrect list query joins, missing version grouping, or seed behavior
   - Whether normal Delete destroys contracts, invoices, evidence, versions, file references, audit history, or retention obligations
   - Whether all list/search/detail/download/preview/share/API paths are organization- and role-scoped and protected against IDOR/BOLA
   - Whether folder taxonomy is mistakenly treated as a security control
   - Whether filenames, MIME types, PDFs, images, office docs, archives, SVG, HTML, Markdown, media metadata, thumbnails, and previewers can create XSS, SSRF, decompression bomb, path traversal, malware, EXIF privacy, or content-sniffing risks
   - Whether errors/logging leak storage keys, signed URLs, malware detail, secrets, client data, or raw infrastructure details
   - Whether uploads/downloads and security-state transitions are auditable

4. Return an audit report with:
   - Files inspected
   - Current upload/storage/processing/download architecture and data flow
   - Current FileAsset/version/share/scan/retention schema findings
   - Current quarantine/validation/malware-scan/checksum findings
   - Current signed-link/download/preview/revocation findings
   - Current authorization/tenant-isolation/client-portal findings
   - Current duplicate/idempotency/list-query findings
   - Current delete/archive/retention findings
   - Current public exposure/logging/error/cache findings
   - Current demo-data behavior
   - Security/privacy/records-management risks
   - UI/UX findings
   - Unsupported/misleading security claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Storage migration plan, if needed
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, upload/download/share files, generate signed links, inspect or change storage secrets, invoke scan providers, move/delete objects, alter access-control policies, or change external integrations during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, private-by-default, tenant-safe file-management workflow.

A. Naming and claim accuracy
Use:

Title: “Media library”
Subtitle: “Upload, review, and share approved project files.”

Replace/remove unless verified by implementation:
- “Media & File Storage Enclave”
- “All uploads undergo quarantine inspection, magic byte verification, heuristic virus scanning, and expiring HMAC signed delivery”
- “Zero Direct Object Storage Exposure”
- “single-use expiring signed tokens (300s TTL)”
- “strictly barred” and equivalent absolute guarantees
- “Signed Link” if it generates an uncontrolled or unverified link
- standard “Delete File”

Use accurate status/copy:
- Upload pending validation
- Scanning
- Available for authorized access
- Quarantined
- Scan failed — restricted pending review
- Private authorized download
- Create controlled share
- Archive file
- Request purge under retention policy

B. File lifecycle
Use server-enforced states:

- INITIATED
- UPLOADED_TO_QUARANTINE
- VALIDATING
- SCANNING
- CLEAN
- AVAILABLE
- QUARANTINED
- REJECTED
- ARCHIVED
- RETENTION_PENDING_PURGE
- PURGED

Rules:
- Objects upload only to a private quarantine location.
- Server validates authorization, organization/project scope, classification, filename, size, declared type, actual MIME/magic bytes, and safe limits.
- Scan/checksum/metadata/derivative jobs are asynchronous and idempotent.
- Scan errors fail closed: asset stays unavailable/restricted until resolved by authorized security workflow.
- A file is previewable/downloadable/shareable only when AVAILABLE, authorized, and within retention/access policy.
- Do not claim or implement single-use links unless atomic redemption/retry/range-request semantics are deliberately specified and tested.
- Archive before purge; permanent purge is privileged, retention-policy-aware, confirmed, and audited.
- Preserve required minimal audit evidence after purge without retaining file content beyond policy.

C. File and version schema
Support:
- id
- organizationId
- projectId, optional
- parentAssetId, optional
- versionNumber
- originalFilename
- safeDisplayName
- declaredMimeType
- detectedMimeType
- sizeBytes
- privateStorageKey
- classification: GENERAL | CLIENT_CONFIDENTIAL | FINANCE | CONTRACT | PERSONAL_DATA | SECURITY_SENSITIVE
- status
- sha256, optional
- scanProvider, optional/restricted
- scanResult: PENDING | CLEAN | FLAGGED | ERROR, optional
- scanCompletedAt, optional
- validation/findings summary, access-restricted
- retentionUntil, optional
- archivedAt, optional
- purgedAt, optional
- uploadedById
- createdAt
- updatedAt

Support separate related models for:
- FileVersion/history
- UploadIntent/idempotency key
- ScanJob and safe status
- Authorized FileShare/DownloadGrant
- FileAuditEvent
- RetentionPolicy reference

Do not expose storage keys, full scan data, signed URLs, malware indicators, secret configuration, or raw security findings in normal/public responses.

D. Secure upload and processing
- Require authenticated authorization and explicit organization/project/classification selection.
- Use server-generated, short-lived, tightly scoped upload intents and idempotency keys.
- Store all incoming bytes in a private quarantine prefix/bucket; never public-read.
- Verify final object identity/size/checksum server-side.
- Validate extension, normalized filename, actual MIME/magic bytes, file size, image dimensions, PDF/page limits, archive/compression ratio/depth/file count, and type-specific policy.
- Block or specially handle executable files, scripts, HTML, SVG, untrusted office macros, password-protected/encrypted archives, nested archives, and unsupported media.
- Malware scan before availability; failure must fail closed.
- Calculate SHA-256 only from final immutable approved bytes.
- Generate public-safe derivatives/previews only after clearance; strip unsafe EXIF/location metadata unless specifically approved.
- Ensure jobs are retry-safe/idempotent and cannot mark the wrong tenant’s object as clean.
- Limit concurrent uploads, rate-limit abuse, and manage quotas.

E. Access, preview, download, sharing
- Every file list/search/detail/preview/download/share/revoke request must authenticate, authorize, and scope organization/project/classification server-side.
- Require active client organization membership before client-portal file visibility.
- Do not trust browser-supplied file IDs, tenant IDs, storage keys, or folder IDs.
- Never expose direct bucket/object URLs or permanent storage credentials.
- For private downloads, use a server-authorized request or an authenticated short-lived signed grant; revalidate status and authorization at issuance and access where architecture permits.
- Bind external shares to an intended recipient/access policy when possible; default to no public sharing for contracts, invoices, personal data, client confidential, or security-sensitive content.
- Make expiry, revocation, password requirement, and download limits explicit; do not falsely call links single-use.
- Use safe Content-Disposition, Content-Type, nosniff, CSP/sandbox for previews, referrer policy, and controlled rendering.
- Do not inline untrusted active content; force download or safely convert it.
- Revoke access on membership/role/project changes, archive, quarantine, purge, contract end, or explicit revocation.
- Audit upload, retry, state transition, preview, download, sharing, revocation, archive, restore, retention exception, and purge events.

F. Versioning, duplicate handling, folders
- Treat folders as taxonomy only, never authorization.
- Support version grouping via parent asset/version number, with immutable historical versions where retention requires.
- Investigate and fix duplicate listing/seed/upload behavior; make upload confirmation and background jobs idempotent.
- Display duplicate/version relationships clearly.
- Do not use original filenames as unique identifiers.
- Search, filters, pagination, and counts must be server-side, role/tenant scoped, and free of duplicate joins.

G. Retention and deletion
- Remove normal permanent delete from UI.
- Provide archive/revoke for ordinary staff.
- Permit secure purge only for appropriately authorized staff, after retention checks, dependency checks, confirmation, and audit event.
- Before archive/purge, identify links from invoices, agreements, reports, cases, testimonials, projects, portal visibility, and public assets.
- Block/require escalation for regulated, contractual, financial, legal-hold, or client-record files as policy requires.
- Unpublish/revoke derivative/public access and invalidate permitted cache paths before final purge.

H. Admin UX
Header:
- Media library
- Upload file
- Search
- Organization/project/classification/status filters

Summary data, real only:
- Pending validation or scan
- Available
- Quarantined/restricted
- Storage used, only if accurately calculated and scoped

Columns:
- File / version
- Organization / project
- Classification
- Security status
- Size
- Checksum
- Uploaded by / date
- Retention
- Actions

Actions:
- Scanning: View safe status/cancel if safe; no preview/download/share
- Available: Preview/download, create controlled share, upload new version, archive
- Quarantined/rejected: Restricted view; authorized security review workflow only
- Archived: View history/restore if allowed/request purge
- Purged: Minimal audit-only record

Do not display fake status/telemetry/checksum data. Clearly distinguish pending, scan error, flagged, clean, available, archived, and purged states without relying on colour alone.

I. Authorization, privacy, security, audit
- Require authenticated authorized staff for admin media management.
- Client users never access admin media routes; portal users see only explicitly client-visible AVAILABLE assets within their active organization/project scope.
- Defend against IDOR/BOLA, mass assignment, CSRF where applicable, path traversal, storage-key leakage, MIME confusion, content sniffing, stored XSS, SVG/HTML/office macro risks, SSRF through previewers, archive bombs, race conditions, replayed upload intents, cache leakage, cross-tenant object confusion, unsafe redirects, raw errors, and log leakage.
- Validate all mutations with Zod and server-side allowlists.
- Use atomic/transactional state changes where needed.
- Audit all sensitive operations, retaining only proportionate metadata.
- Never expose private storage keys, direct URLs, secrets, scan internals, other tenant records, or confidential filenames to unauthorized users.

J. Demo behavior
- Current files are demo fixtures unless audit proves otherwise.
- Demo seeding must be explicit and opt-in.
- Demo mode must be server-enforced and visibly labelled outside production.
- Demo files/metadata must never reach production storage, public pages, real client portals, emails, exports, analytics, scan providers, or shares.
- Do not delete/reset files during audit.

K. Accessibility and quality
- Semantic tables/forms/headings.
- Keyboard-accessible upload/dialog/filter/action controls.
- Visible focus states, reduced-motion support, responsive layout.
- Accessible progress, pending, quarantine, error, confirmation, success, empty, no-results, and forbidden states.
- Do not rely only on colour for file security state.
- Type-safe API contracts, no fake security telemetry, and clear recovery guidance.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Upload/security pipeline
- Unauthorized or cross-tenant uploads fail.
- Upload intent is short-lived, scoped, rate-limited, and idempotent.
- Declared MIME, magic bytes, sizes, archive limits, and forbidden formats are validated server-side.
- Files remain inaccessible while validating/scanning, on scan error, or when flagged/quarantined.
- Only clean/available assets pass to approved storage and receive previews/download grants.
- SHA-256 matches final stored bytes.
- Scan/job retries are idempotent and cannot cross tenant boundaries.
- Duplicate listing/upload behavior is fixed and tested.

2. Access and sharing
- Unauthenticated users cannot list/download/preview/share assets.
- Client portal users see only explicitly visible AVAILABLE assets for their own active organization/project.
- Guessed IDs, storage keys, old signed grants, and revoked/expired shares cannot access files.
- Archived/quarantined/purged files cannot be downloaded/previewed/shared.
- Private keys/direct URLs never appear in API responses, pages, logs, or errors.
- Unsafe file types cannot execute in browser previews.

3. Retention and audit
- Normal users cannot permanently delete assets.
- Archive preserves versions, dependencies, and audit record.
- Purge requires elevated authorization, retention/dependency checks, confirmation, and audit event.
- Download/share/revoke/security-state events are auditable.
- Membership loss and permission changes revoke future access.

4. UI and quality
- Scanning rows cannot show active download/share actions.
- Duplicate/version grouping renders correctly.
- Empty/loading/error/no-results/forbidden states render.
- Keyboard and responsive flows work.
- Typecheck, lint, unit, integration, security, storage-boundary, tenant-isolation, upload-validation, scan-state, sharing/revocation, retention, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Storage/data migration plan
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

ANALYTICS COCKPIT:___________________________________________________________________________________________________

You are a principal full-stack engineer, web-analytics/data-platform architect, GA4 and Google Search Console integration engineer, privacy-and-consent engineer, multi-tenant SaaS security engineer, product analytics designer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this analytics administration module and the directly required GA4, Google Search Console, consent-aware first-party conversion tracking, ingestion, aggregation, authorization, and reporting support:

/admin/analytics
Analytics APIs/server actions/jobs used directly by this page
GA4 and Google Search Console connector code only where directly required
First-party inquiry/conversion event tracking only where directly required for truthful dashboard metrics
Settings integration only where required to surface non-secret connection status and authorized setup flows

Important context:
All current sessions, visitors, pageviews, conversions, traffic channels, device shares, cities, page metrics, rankings, queries, clicks, impressions, CTR, average positions, growth percentages, consent labels, benchmark claims, links, and telemetry states are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat demo fixtures as dishonest public claims. However, demo analytics must be opt-in, local/demo-only, visibly labelled outside production, and must never be used in production dashboards, reports, exports, CRM automation, alerts, AI prompts, pricing/eligibility decisions, public marketing claims, public pages, analytics tracking, Google API calls, emails, or real financial/operational decisions.

Do not modify database reset scripts, administrator bootstrap, email OTP, billing/payment implementation, unrelated CRM/content/delivery modules, broad public-site redesigns, Docker/DevOps infrastructure files, or unrelated admin modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/analytics route/page, all components, charts/tables/cards, refresh actions, source-state banners, date-range controls, filters, exports, and error/loading states
   - Analytics APIs, server actions, repositories, aggregation jobs, scheduled tasks, cache/revalidation, rate limiting, and normalized data models
   - GA4 connector/authentication/configuration code and Search Console connector/authentication/configuration code
   - Settings integration and secret-handling paths, but do not reveal, read, log, or alter secret values
   - Website analytics tag/consent loading code and first-party conversion/inquiry tracking paths
   - Prisma models/migrations for AnalyticsConnection, AnalyticsSyncRun, AnalyticsAggregate, ConversionEvent, ConsentState/Preference, DataExport, User, OrganizationMembership, AuditLog, and connector credentials references
   - Current authorization, organization scoping, user-role/capability logic, data retention, export, logs, and demo seeds/tests

2. Classify every visible label, metric, claim, chart/table entry, data-source state, city/query/page value, action, and integration claim as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether demo-mode figures can enter production dashboards, exports, reports, CRM workflows, AI prompts, alerts, or public claims
   - Whether “real-time telemetry,” “Consent Mode v2 Compliant,” and “GA4 Enhanced Measurement Active” are true, verified, and accurately state current configuration
   - Whether GA4/GSC are connected, what credentials/scopes/property selection are used, and whether credentials leak to clients/logs/settings
   - Whether manual refresh causes direct quota-heavy API calls, concurrent syncs, stale cache, missing backoff, or rate-limit problems
   - Whether date ranges, comparison periods, timezone, sampling, attribution, bot/internal-traffic exclusions, consent limitations, and data freshness are correctly represented
   - Whether sessions, users, pageviews, events, inquiries, CRM leads, conversions, and revenue are improperly combined or double-counted
   - Whether conversion events come from successful server-side persistence or client-side clicks and whether they contain personal/confidential data
   - Whether city/region, query, referral, page, device, and low-volume data create privacy/re-identification risk
   - Whether Search Console average position is accurately described and scoped
   - Whether “industry top 5%,” “bounce resistance,” “high-conversion,” “maximum engagement,” “organic growth,” location targeting, ranking, or other performance language is evidence-backed
   - Whether data is adequately tenant-scoped, role-scoped, export-scoped, and protected from IDOR/BOLA
   - Whether raw Google responses, tokens, IDs, PII, URLs with parameters, or query data leak through browser payloads/logs/errors
   - Whether data retention, deletion/consent withdrawal, cache invalidation, and access audit behavior exist

4. Return an audit report with:
   - Files inspected
   - Current analytics architecture/data flow
   - Current GA4/GSC connection and credential-handling findings
   - Current event/conversion/tracking and consent findings
   - Current data schema/aggregation/cache/sync findings
   - Current metric/calculation/attribution/data-quality findings
   - Current geography/query/privacy/retention findings
   - Current authorization/tenant-isolation/export/audit findings
   - Current demo-data behavior
   - Security/privacy/accuracy risks
   - UI/UX findings
   - Unsupported/misleading labels and claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Data retention/deletion plan
   - Cache/sync/quota plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, migrate/reset data, connect Google accounts, read/write secret values, send Google API requests, activate tracking, modify consent settings, export data, create alerts, call AI providers, alter production analytics, or invalidate caches during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, privacy-aware, secure analytics workflow.

A. Naming and source-state accuracy
Use:

Title: “Analytics”
Subtitle: “Review authorized website and search-performance data.”

Remove or qualify:
- “Real-time telemetry tracking”
- “high-conversion specimens”
- “Consent Mode v2 Compliant”
- “GA4 Enhanced Measurement Active”
- “Industry top 5%”
- “Bounce resistance”
- “maximum engagement duration”
- “Regional Audience Hubs”
- “Search Engine Organic Rankings”
- “conversion velocity”
- other claims not backed by selected source, metric definition, and evidence

Use:
- Simulated analytics for interface testing only, in DEMO mode
- Source status: Demo / Not connected / Syncing / Connected / Stale / Error / Disabled
- Data freshness
- Eligible sessions
- Tracked inquiry submissions
- Inquiry conversion rate
- Engagement rate / bounce rate
- Approximate geographic distribution
- Google Search performance
- Average position
- Metric definitions and data-quality notes

B. Data-source state model
Implement server-enforced source states:
- DEMO
- NOT_CONNECTED
- AUTHORIZING
- SYNCING
- CONNECTED
- STALE
- ERROR
- DISABLED

Rules:
- Demo data is explicitly opt-in, environment-gated, labelled, isolated, and blocked from production uses/exports/automation.
- Not-connected state has setup guidance and no fabricated figures.
- Connected state displays source, selected property/site, reporting timezone, last successful sync, date range, and freshness.
- Stale/error state clearly labels prior data with last successful sync and safe error guidance; it never appears current.
- No UI client flag can change integration state or enable demo data in production.

C. Secure GA4 and GSC connectors
- Use least-privilege OAuth/server-side credential references; never expose credential values in browser code, API payloads, logs, URLs, exports, or generic settings pages.
- Require authorized staff and organization scope for connection setup, property/site selection, disconnect, and refresh.
- Validate property/site ownership and prevent cross-organization connector use.
- Store encrypted credential references or secret-manager identifiers only.
- Record scopes, connector status, authorized user, expiry/rotation status, selected property/site identifiers, and last successful sync.
- Fetch through rate-limited queued/background jobs with idempotency, lock/concurrency protection, pagination, retry/backoff, quota handling, and normalized aggregate storage.
- Manual refresh requests a controlled sync; it does not issue unbounded immediate provider calls.
- Separate GA4 and GSC data models; do not falsely join their metrics without defined attribution methodology.
- Audit connect/disconnect/property selection/sync/refresh/export/privileged views and configuration changes without logging secrets.

D. Metric definitions and data quality
- Define every displayed metric, source, calculation, date range, comparison range, timezone, freshness timestamp, filters, exclusions, and limitations.
- Use GA4-compatible terminology: sessions, active users, views, engagement rate/bounce rate, average engagement time, and configured events.
- Do not show real-time data unless supported by actual source, rate, and freshness.
- Define inquiry conversion rate as verified/deduplicated allowed inquiry events divided by eligible sessions, and display exclusions/limitations.
- Keep form submissions, inquiries, qualified leads, proposals, won deals, revenue, invoice payments, and payouts separate unless documented secure linking/deduplication exists.
- Do not show arbitrary “industry top 5%,” composite performance scores, growth descriptors, or ranking promises without credible documented source/method.
- Describe GSC “average position” correctly; do not call it a fixed ranking.
- Mark sampled/thresholded/incomplete/anonymized data accurately.

E. Privacy, consent, and retention
- Do not claim consent compliance unless implementation/configuration is verified and approved.
- Implement/configure consent-aware loading and event collection where required by applicable policy/law; respect consent updates/withdrawal.
- Do not store raw IP addresses, email, phone, message content, credentials, payment information, or client-confidential data in analytics events/aggregates.
- Use an allowlisted analytics event schema and parameter schema; reject free-form user/client-provided event properties.
- Apply configurable minimum thresholds and aggregation to sensitive low-volume geography, query, referral, conversion, and device data.
- Restrict sensitive analytics views/exports by role and organization.
- Define retention, deletion, consent-withdrawal handling, export policy, and incident procedures.
- Do not use analytics data for automated high-impact decisions.

F. First-party conversion events
Allow only approved events such as:
- inquiry_form_started
- inquiry_form_submitted
- inquiry_submission_confirmed
- calendar_request_started
- calendar_request_confirmed
- proposal_request_submitted

Rules:
- Count confirmed conversion only after successful server-side validation/persistence.
- Do not include raw form content or direct identifiers in event payloads.
- Use pseudonymous/session-scoped identifiers where appropriate.
- Deduplicate retries/bots/replays.
- Document cross-domain/cross-device attribution limitations.
- Keep CRM and finance lifecycle states separate from web analytics events.

G. Dashboard UX
Header:
- Analytics
- Source status
- Last successful sync
- Reporting timezone
- Date range/comparison range
- Refresh cached data

Not-connected state:
- Explain data source is not connected and show authorized setup action.
- No synthetic production metrics.

Connected dashboard sections:
- Data quality and exclusions
- GA4: Acquisition and engagement
- GA4: Tracked inquiry events
- GA4: Devices and approximate geography
- Search Console: Search performance

Summary cards, real/sourced only:
- Eligible sessions
- Tracked inquiry submissions
- Inquiry conversion rate
- Google Search clicks
- Data freshness

Clearly label mock/demo, sampled, partial, stale, thresholded, and unavailable values. Do not rely on color alone. Include accessible loading/error/empty/no-access states and keyboard-accessible filters/actions.

H. Authorization, tenant isolation, audit
- Require authenticated authorized staff for analytics administration.
- Scope every dashboard/query/filter/date range/page/query/region/export/connector/sync action by organization and staff capability.
- Protect against IDOR/BOLA, mass assignment, CSRF where applicable, cross-tenant connector access, data leakage through caches, query injection, CSV injection, raw error exposure, prompt injection if AI summaries exist, and over-fetching.
- Validate all mutable inputs server-side using Zod and allowlists.
- Audit sensitive actions and privileged data views.
- Do not expose tokens, raw API responses, client identifiers, internal IDs, consent records, low-volume personal data, or another tenant’s analytics data in browser responses.

I. Demo behavior
- Existing analytics are local demo fixtures.
- Demo data must be opt-in, environment-gated, server-enforced, and visibly labelled.
- Demo data must never appear in production dashboard data, exports, reports, CRM automation, alerts, AI prompts, public marketing, pages, analytics, Google APIs, customer emails, billing, or real decisions.
- Do not reset/delete demo data during audit.

J. Accessibility and quality
- Semantic headings/tables/forms and accessible data summaries.
- Keyboard-accessible date-range, filter, refresh, connection, and export controls.
- Visible focus states and reduced-motion support.
- Non-color-only source/freshness/error states.
- Responsive layout.
- Accessible empty/loading/error/stale/forbidden/success states.
- Type-safe schemas and no fake telemetry or unsupported benchmark claims.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Source state and demo isolation
- Demo state is environment/server-gated and cannot be enabled by client input in production.
- Demo figures never flow to exports, reports, AI, CRM automation, alerts, public claims, or live Google API operations.
- Not-connected/syncing/stale/error states do not fabricate live values.
- Connected state displays correct source/property/site/timezone/freshness metadata.

2. Connector security and sync
- Only authorized, tenant-scoped staff can connect/disconnect/select property/site/refresh/export.
- Tokens/secrets never appear in browser payloads, URLs, logs, errors, or exports.
- Provider scopes are least privilege and connector ownership/property validation works.
- Background sync is rate-limited, idempotent, quota-aware, retry-safe, and prevents concurrent duplicate runs.
- GA4 and GSC data remain separate unless an explicit tested attribution layer is used.

3. Metrics, conversions, and privacy
- Metric calculations use defined ranges/timezones/exclusions and do not double-count.
- Conversion events contain no raw PII/confidential content and confirmed events require server-side persistence.
- Sensitive low-volume query/location/referral/conversion data is thresholded.
- Consent changes and withdrawal are respected according to configured policy.
- Unsupported compliance, benchmark, ranking, performance, or real-time labels do not render.

4. Authorization and quality
- Guessed IDs/filter manipulation cannot expose another organization’s connector or analytics data.
- Exports and cached responses remain tenant/role scoped.
- Empty/loading/stale/error/no-access states render accessibly.
- Typecheck, lint, unit, integration, security, tenant-isolation, connector, sync, metric-calculation, conversion, consent/privacy, cache, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Connector setup/data-retention plan
- Backfill/data cleanup plan
- Cache/sync/quota plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

AI SEARCH _______________________________________________________________________________________________________

You are a principal full-stack engineer, research-data product manager, AI-search observation methodology designer, advertising-claims risk reviewer, privacy engineer, multi-tenant SaaS security engineer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this internal AI-search/GEO observation module and directly required observation, evidence, authorization, aggregation, archival, and audit support:

/admin/geo
/admin/geo/[protocolId] or observation detail routes only if they exist or are strictly required
AI-search observation APIs, server actions, repositories, schemas, evidence attachment, and aggregate calculation paths directly used by this module

Important context:
All displayed AI provider names, model names, model tiers, prompt phrases, regions, countries, “cited” states, recommendation shares, rank scores, global index values, descriptions, claims, and buttons on this page are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat demo fixtures as factual AI-provider recommendations, endorsements, rankings, search results, citations, or marketing claims. Demo data must be opt-in, local/demo-only, visibly labelled outside production, and prevented from appearing in production dashboards, exports, reports, sales material, public pages, marketing claims, client portals, analytics, alerts, CRM automation, emails, AI prompts, or decision systems.

Do not modify database reset scripts, administrator bootstrap, email OTP, finance/payment systems, unrelated CRM/content/delivery modules, broad public-site code, Docker/DevOps files, or unrelated admin routes during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/geo route/page, query ledger, filters, summary cards, score calculation, buttons, dialogs, empty/loading/error states, and any detail pages
   - API routes, server actions, services, repositories, validation schemas, types, aggregation logic, export logic, evidence upload/rendering, and audit logging
   - Any provider integration, scraping, browser automation, API client, scheduled job, or “sync” code; do not trigger providers or external automation
   - Prisma models/migrations for tracked query/protocol, observation/run, provider configuration, evidence file, review, aggregate/score, user, organization membership, audit log, and retention policy
   - Existing authorization, organization scoping, demo seeds, and tests

2. Classify every visible label, metric, prompt, provider/model name, status, score, button, evidence record, and data flow as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “Sync Radar” performs scraping, prohibited automation, direct provider calls, browser automation, or unsupported result collection
   - Whether “Simulate prompt verification” is a demo-only action and whether it can affect production data
   - Whether “CITED” means brand mention, recommendation, returned source link, source citation, or a fabricated state
   - Whether global index, recommendation share, and rank score have documented formulas, sample-size/context warnings, versioning, and validity boundaries
   - Whether results are date-stamped with provider/product/model/mode, locale, language, account context, web-search setting, final prompt, test method, and evidence
   - Whether prompts or descriptions make unsupported claims about CYBERSTYLE, client work, performance, uptime, 24/7 support, SEO, security, privacy, ranking, local presence, or provider endorsement
   - Whether provider/model names are hardcoded and can become outdated or inaccurate
   - Whether raw outputs, screenshots, prompts, account/session information, personal data, third-party content, or credentials leak through UI, APIs, exports, logs, or AI tooling
   - Whether observations/protocols/evidence are tenant-scoped, role-scoped, export-scoped, protected against IDOR/BOLA, and auditable
   - Whether deletion destroys research history/evidence/audit records
   - Whether external provider terms, rate limits, access controls, and automation policies are respected

4. Return an audit report containing:
   - Files inspected
   - Current module architecture and data flow
   - Current protocol/observation/evidence/review/score schema findings
   - Current provider collection/sync/automation findings
   - Current terminology and claim-risk findings
   - Current aggregate/score methodology findings
   - Current evidence, review, retention, and archive/delete findings
   - Current authorization/privacy/tenant-isolation/export/audit findings
   - Current demo-data behavior
   - Security/privacy/terms/advertising-claims risks
   - UI/UX findings
   - Unsupported/misleading labels and claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Retention plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, call AI providers, automate web interfaces, scrape provider products, create/modify observations, upload/download evidence, export data, send messages, change external integration settings, or modify production/public content during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement an honest, secure internal AI-search observation workflow.

A. Product naming and terminology
Use:

Title: “AI search observations”
Subtitle: “Record and review periodic observations from selected AI products.”

Required method note:
“Results are point-in-time observations, not rankings, endorsements, or guarantees.”

Replace/remove:
- “Generative Engine Optimization (GEO)” unless clearly framed as experimental internal research
- “AI SEARCH RADAR” without “Manual research log”
- “Monitor and optimize visibility, brand citations, and recommendation ranking”
- “Global AI Index”
- “recommendation share”
- “rank score”
- vague `CITED` statuses
- “Sync Radar” if it implies live/automated collection
- “Simulate prompt verification”
- “Delete tracked query”
- marketing/technical/performance/security/ranking/availability claims within default test prompts
- hardcoded provider/model/plan labels presented as durable facts

Use:
- Test protocol
- Observation
- Brand mention observed
- Recommendation observed
- Source citation/link observed
- Reviewed observation
- Test-set summary
- Manual research
- Create test protocol
- Add observation
- Archive protocol

B. Protocol and observation model
Separate reusable test protocols from individual point-in-time observations.

Protocol:
- id
- organizationId
- title
- promptTemplate
- purpose: BRAND_MENTION | SERVICE_DISCOVERY | CONTENT_DISCOVERY
- language
- intendedLocale, optional
- methodologyVersion
- active
- createdById
- archivedAt, optional
- createdAt
- updatedAt

Observation:
- id
- protocolId
- organizationId
- provider: OPENAI | PERPLEXITY | GOOGLE | ANTHROPIC | OTHER
- productName
- modelOrMode, optional
- providerConfigurationLabel, optional
- testMethod: MANUAL | APPROVED_AUTOMATION
- observedAt
- locale, optional
- language
- accountContext: ANONYMOUS | STANDARD_TEST_ACCOUNT | OTHER
- webSearchEnabled, optional
- finalPrompt
- brandMentioned
- recommendationObserved, optional
- sourceCitationObserved, optional
- sourceUrls, validated/limited
- resultSummary, redacted/plain text
- evidenceFileId, optional/private
- reviewStatus: DRAFT | REVIEWED | REJECTED
- reviewedById, optional
- reviewedAt, optional
- notes, restricted
- createdAt
- updatedAt

Do not store credentials, API keys, session cookies, private chat history, hidden reasoning, unnecessary personal data, raw sensitive screenshots, or unrestricted third-party content.

C. Observation method and provider safety
- Default to manual observation.
- Do not scrape, automate, bypass provider controls, or use browser automation unless the provider explicitly permits the exact collection method and it is approved.
- Do not represent data as a live feed unless a documented authorized integration actually supports it.
- If any provider API is used later, use server-side secret management, least privilege, rate limits, terms review, bounded input/output, and transparent source labels.
- Model/provider/version/mode labels must be date-stamped and editable/configured, not hardcoded guarantees.
- Do not fabricate observations or simulate provider endorsements outside explicit local demo mode.

D. Results and aggregate methodology
- Do not display an overall rank or global index by default.
- Show raw reviewed observation counts and sample size.
- If an aggregate is enabled, name it “Observed mention rate in configured test set” and show:
  - numerator and denominator
  - date range
  - protocol IDs/count
  - providers/modes
  - locale/language
  - methodology version
  - inclusion/exclusion rules
  - limitations text
- Do not call provider output a citation unless a source citation/link was actually returned.
- Keep brand mentions, recommendations, and returned source links as separate boolean/classified outcomes.
- Do not use results as proof of provider endorsement, broad market visibility, quality, search ranking, or future recommendation behavior.
- Never turn a five-prompt sample into a percentage claim without clear sample-size context and internal-only limitation labels.

E. Claim safety
- Test prompts and observation descriptions must not serve as unreviewed marketing claims.
- Require claim review for statements about best-in-market status, client results, conversion, revenue, security, privacy, compliance, AI capabilities, uptime, response times, performance, Core Web Vitals, SEO, search ranking, geographic presence, or provider recommendations.
- A provider mention does not validate any embedded claim.
- Prefer neutral prompts and factual descriptions.
- Do not publish provider names/logos/output/quotes/screenshots as endorsements without explicit legal/commercial approval.
- Keep all observations internal by default and prohibit use in public content, sales claims, reports, testimonial/case-study evidence, or automated decisions without a separately approved workflow.

F. Evidence, review, retention, archive
- Require date-stamped evidence for a reviewed observation, using minimal/redacted text or private screenshot/file storage.
- Treat third-party output as untrusted content; sanitize all display and file rendering.
- Permit reviewers to correct classifications and add restricted notes.
- Replace standard deletion with archive/deactivate protocol behavior.
- Preserve observations, minimal evidence metadata, and audit history according to retention policy.
- Archive/restrict evidence safely if its retention expires or consent/terms require removal.
- Do not expose internal research evidence to clients or public users.

G. Authorization, tenancy, privacy, audit
- Require authenticated authorized staff access.
- Client portal users and public users cannot access observation pages, APIs, exports, prompts, evidence, providers, or aggregates.
- Scope protocol/observation/evidence/list/search/filter/pagination/export/detail paths by organization and role.
- Protect against IDOR/BOLA, mass assignment, XSS, unsafe URLs, CSV injection, CSRF where applicable, prompt injection, cross-tenant data mixing, raw errors, logs, and cache leaks.
- Validate all inputs server-side using Zod and allowlists.
- Audit protocol creation/change/archive, observation creation/edit, evidence attachment, reviewer classification, export, and privileged views.
- Do not expose account context, evidence files, private notes, provider settings, internal IDs, or raw output beyond authorized staff roles.

H. Demo behavior
- Existing prompts/observations/scores are local demo fixtures.
- Demo mode must be explicit, opt-in, environment-gated, server-enforced, and visibly labelled.
- Demo observations must never appear in production dashboards, public pages, sales collateral, exports, CRM automation, reports, analytics, external AI requests, emails, or decision systems.
- Do not reset/delete demo data during audit.

I. UX and accessibility
Header:
- AI search observations
- Method: Manual research
- Results are point-in-time observations, not rankings, endorsements, or guarantees.
- Create test protocol
- Add observation
- Search/filter by provider, locale, date, review status, and protocol

Summary cards, reviewed real data only:
- Reviewed observations
- Active protocols
- Observation date range
- Configured provider coverage

Table/list:
- Protocol
- Provider/model or mode
- Observed date
- Locale/language
- Brand mention observed
- Recommendation observed
- Source citation/link observed
- Evidence status
- Review status
- Actions

Use accessible, responsive, keyboard-operable controls. Do not rely on color alone. Include clear empty, loading, error, demo, archived, restricted, and forbidden states. Do not use decorative rank scores or fake live telemetry.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Demo/isolation/source integrity
- Demo observations are environment/server-gated and cannot enter production, exports, reports, sales material, public pages, analytics, AI prompts, or automated decisions.
- No action can fabricate/simulate provider results outside demo mode.
- Provider integration/automation is absent or blocked unless explicitly approved and permitted.
- Provider/model/mode/date/method context is retained for every observation.

2. Protocol/observation/review lifecycle
- Protocol and observation fields validate server-side.
- Archive/deactivate preserves history; standard permanent delete is absent.
- Reviewed observations require evidence or configured documented exception.
- Brand mention, recommendation, and source citation/link outcomes remain distinct.
- Aggregate/test-set summaries use only eligible reviewed observations and disclose sample/method/date limitations.
- Unsupported rank/index/share claims do not render.

3. Security/privacy
- Public/client users cannot access internal AI-search routes/data/evidence.
- Guessed IDs, filters, exports, and evidence links cannot cross organizations.
- Prompts, output summaries, source URLs, screenshots, and notes are sanitized, size-limited, retention-controlled, and protected from XSS/prompt injection/unsafe URL handling.
- Credentials/session data/private account context never appear in browser payloads/logs/exports.
- Audit events are recorded without excessive sensitive content.

4. UI/quality
- Empty/loading/error/demo/archived/restricted/forbidden states render.
- Filters, forms, dialogs, and tables are keyboard accessible and responsive.
- Typecheck, lint, unit, integration, security, tenant-isolation, methodology, review/evidence, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Backfill/data cleanup plan
- Retention plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

MONITORING PAGE _____________________________________________________________________________________________-

You are a principal full-stack engineer, SRE/observability architect, uptime-and-incident-management workflow designer, SSRF/egress-security engineer, multi-tenant SaaS security architect, privacy engineer, contract/SLA measurement specialist, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this monitoring administration module and directly required safe watch creation, target validation, scheduled checks, change detection, incident handling, authorized client visibility, retention, and audit support:

/admin/monitoring
/admin/monitoring/[watchId] and incident/detail routes only where they exist or are strictly required
Monitoring APIs, server actions, repositories, jobs/workers, validation schemas, storage of probe results/diffs, and notification paths only where directly required

Important context:
All visible workspaces, client names, monitored URLs, endpoint paths, schedules, event counts, uptime figures, SLA values, guarantees, incidents, change-feed entries, severities, notifications, and integration states are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat demo fixtures as real monitoring, uptime telemetry, client authorization, SLA evidence, contract performance, incidents, endpoint inventories, or public claims. Demo monitoring must be opt-in, local/demo-only, visibly labelled outside production, and prevented from appearing in production dashboards, client portals, reports, exports, invoices, SLA calculations, alerts, public pages, sales material, analytics, AI prompts, or operational decisions.

Do not modify database reset scripts, administrator bootstrap, email OTP, payment/billing systems, unrelated CRM/content/delivery modules, broad public-site code, Docker/DevOps infrastructure files, or unrelated admin routes during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/monitoring route/page, watch list/detail forms, target creation, schedule controls, change feed, diff view, incident actions, client/infrastructure/backups tabs, alerts, and loading/error states
   - All monitoring APIs, server actions, repositories, schema validation, background jobs/workers, queues, scheduler/cron configuration, retries, locks, caching, result storage, diff generation, notification delivery, and audit logging
   - Network/HTTP fetch utilities, DNS resolution, redirect handling, proxy/egress configuration, timeout/body-size policies, authentication/header handling, and logging behavior
   - Prisma models/migrations for MonitoringWatch, MonitoringTarget, ProbeResult, ChangeSnapshot, ChangeDiff, Incident, IncidentTimelineEvent, SLAAgreement/SupportTerms, ClientOrganization, Project, User, OrganizationMembership, AlertPolicy, Notification, RetentionPolicy, and AuditLog
   - Existing client-portal monitoring access, report/SLA integrations, authorization, organization scoping, and demo seeds/tests

2. Classify every visible label, claim, metric, target, URL, schedule, event, SLA indicator, incident action, diff, notification, and data flow as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “CHANGEDETECTION ACTIVE,” “real-time,” “uptime telemetry,” “client SLA verification,” “SLA protected,” “99.98%,” and “Exceeds 99.9% guarantee” are actually implemented, measured, contract-backed, and accurate
   - Whether demo watches/results can enter production client portals, reports, invoices, SLA calculation, alerts, exports, analytics, public claims, AI prompts, or operations workflows
   - Whether arbitrary monitored URLs introduce SSRF through protocols, DNS resolution, IPv4/IPv6 private ranges, redirects, DNS rebinding, metadata services, nonstandard ports, proxy behavior, headers, authentication, or cloud credentials
   - Whether external fetches run in a restricted egress environment with timeouts, response-size limits, rate limits, concurrency controls, audit logging, and safe error handling
   - Whether target ownership/client authorization is required and recorded
   - Whether DOM snapshots/diffs can contain secrets, tokens, personal data, authentication flows, internal URLs, client content, or stored XSS and whether they are sanitized/redacted/retention-controlled
   - Whether login/auth redirect and other sensitive operational changes are overexposed to broad staff/client audiences
   - Whether raw cron expressions, schedules, and watch intervals are safely validated and role-restricted
   - Whether probe results distinguish timeout, DNS, TLS, HTTP status, expected-content failure, scheduled maintenance, probe failure, and target outage
   - Whether uptime/availability calculations have source methodology, coverage windows, maintenance exclusions, incident rules, clock source, missing-probe policy, regions, and agreement-specific scope
   - Whether aggregate SLA cards improperly combine targets/clients/contracts or expose a guarantee without valid agreement evidence
   - Whether resolve/acknowledge/incident transitions are authorized, reasoned, auditable, and preserve history
   - Whether list/search/filter/pagination/detail/diff/export/notification/client portal routes remain organization and role scoped and resist IDOR/BOLA
   - Whether infrastructure/backups monitoring leaks privileged systems, secrets, backup metadata, or controls to normal users
   - Whether monitor jobs, target data, logs, diffs, alerts, and error messages leak sensitive internal URLs, credentials, storage keys, provider tokens, or tenant data

4. Return an audit report containing:
   - Files inspected
   - Current monitoring/checking/incident architecture and data flow
   - Current watch/target/probe/diff/incident/SLA schema findings
   - Current target-authorization and SSRF/egress findings
   - Current scheduler/job/retry/concurrency findings
   - Current uptime/SLA methodology findings
   - Current change-detection/diff/redaction/retention findings
   - Current incident/alert/notification findings
   - Current client-portal/infrastructure/backups authorization findings
   - Current demo-data behavior
   - Security/privacy/reliability/contractual risks
   - UI/UX findings
   - Unsupported/misleading labels and claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Monitoring-data retention plan
   - Alert/noise-management plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, create/edit/activate watches, send probes, fetch external URLs, inspect private endpoints, generate diffs, trigger alerts, send notifications, modify schedules, alter SLA values, access client infrastructure/backups, delete monitoring data, or change external integrations during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, tenant-safe monitoring and incident-management workflow.

A. Naming and claim accuracy
Use:

Title: “Monitoring”
Subtitle: “Review authorized service checks and change observations.”

Use a source/method note:
“Monitoring is operational evidence, not SLA compliance unless an agreement is linked.”

Replace/remove unless verified:
- “CHANGEDETECTION ACTIVE”
- “Real-time DOM change detection”
- “uptime telemetry”
- “client SLA verification”
- “SLA PROTECTED”
- “AGGREGATE SLA UPTIME”
- “Exceeds 99.9% guarantee”
- “Production Uptime Endpoint” where endpoint disclosure is unnecessary
- “Sync” or other live/automatic labels where jobs are not actually enabled
- normal delete actions

Use:
- Demo monitoring data
- Source status: Demo / Not configured / Active / Paused / Stale / Error
- Scheduled page-change checks
- HTTPS availability check
- Operational monitoring
- Measurement pending review
- Linked agreement, where applicable
- Archive watch
- View authorized incident details

B. Watch, probe, and incident models
Implement server-enforced watch lifecycle:
- DRAFT
- PENDING_AUTHORIZATION
- VALIDATING_TARGET
- ACTIVE
- PAUSED
- ARCHIVED

Implement incident lifecycle:
- OPEN
- ACKNOWLEDGED
- INVESTIGATING
- MITIGATED
- RESOLVED
- CLOSED

Support:
- organizationId
- projectId, optional
- client authorization reference
- safe display name
- private normalized target URL
- check type: HTTPS_AVAILABILITY | EXPECTED_CONTENT | DOM_CHANGE | CERTIFICATE_EXPIRY | OTHER_APPROVED
- allowed protocol/host/port
- interval preset
- expected status/content rule, optional
- timeout and response size policies
- client visibility setting
- sensitivity classification
- status/source freshness
- last check/last successful check
- retention policy
- created/approved/archived metadata

Probe result fields:
- status/outcome
- started/finished timestamps
- duration
- normalized error category
- HTTP/TLS/DNS summary where permitted
- response hash/size, optional
- region/worker label
- availability eligibility
- source/probe version
- redacted metadata only

Incident fields:
- linked watch/probe events
- severity
- client visibility
- owner
- acknowledgement/resolution reason
- timeline events
- mitigation/postmortem references
- timestamps
- audit records

C. Target authorization and SSRF defense
- Require explicit owner/client authorization before activating a target.
- Allow HTTPS only by default; reject file, data, gopher, FTP, localhost, link-local, private/internal IPv4/IPv6, cloud metadata, Kubernetes/internal DNS, and disallowed ports.
- Normalize/validate URLs server-side; validate DNS resolution before fetch and every redirect hop.
- Defend against DNS rebinding and redirect-based SSRF.
- Use a dedicated sandboxed monitoring worker with deny-by-default egress rules, no ambient cloud credentials, no inbound access, strict DNS controls, no cookies/auth headers by default, and separate network identity.
- Set connect/read/total timeouts, response-size/content-type limits, redirect limits, concurrency/rate/quota limits, circuit breakers, and retry/backoff.
- Do not permit unbounded user-defined cron; offer validated interval presets and authorized advanced schedules only if needed.
- Do not log raw sensitive target URLs, response bodies, authorization headers, cookies, or credentials.

D. Change detection and diffs
- Permit DOM/content monitoring only for authorized targets.
- Store hashes and minimal sanitized snapshots; normalize known volatile content before comparison.
- Set size/depth/retention limits and redact secrets, tokens, PII, internal URLs, auth data, forms, scripts, and dangerous content.
- Treat remote HTML/DOM and diffs as untrusted; use safe server-side parsing and text/structural diffs, never browser-executable raw HTML.
- Require restricted authorization for sensitive auth/security diffs.
- Add noise suppression, debounce, maintenance windows, expected-change acknowledgement, deduplication, severity rules, and alert rate limiting.
- Do not automatically classify all DOM changes as incidents.
- Separate content observations from outages and security-sensitive changes.

E. Availability and SLA methodology
- Do not show aggregate SLA uptime or guarantee-exceeded cards.
- Operational availability must display target, source, probe interval, data range, regions, freshness, exclusions, failures/missing probes, and methodology version.
- SLA calculations are allowed only per agreement/service after verifying signed agreement reference, covered service, coverage/business hours/timezone, maintenance exclusions, measurement period, probe methodology, incident/manual override policy, and reviewer.
- Keep technical probe availability separate from SLA compliance status.
- If criteria are incomplete, show:
  “SLA measurement is not configured for this watch.”
- Do not use monitoring data alone to create credits, invoices, contractual breaches, client promises, or payment changes.

F. Client visibility and infrastructure
- Client portal shows only client-visible operational summaries for its own active organization/project and only after staff approval.
- Never expose raw endpoint URLs, internal architecture, health routes, full diffs, logs, security-sensitive incidents, staff-only notes, provider identifiers, or other tenants’ data.
- Separate infrastructure/backups monitoring into a higher-privilege, non-client-facing area with explicit capability checks, secrets isolation, and no broad list exposure.
- Do not represent backup jobs as successful without verified completion and restore-test evidence.

G. Admin UX
Header:
- Monitoring
- Source status
- Method note
- Add watch
- Filters: client, status, check type, interval, incident state

Summary cards, real data only:
- Active watches
- Watches with stale data
- Open incidents
- Checks awaiting review

List columns:
- Client / authorized scope
- Watch name
- Check type
- Status
- Interval
- Last check
- Current outcome
- Client visibility
- Linked agreement
- Actions

Watch detail:
- Overview
- Authorization and scope
- Check configuration
- Operational results
- Change observations
- Incident timeline
- Client-visible summary
- Agreement/SLA measurement, if configured
- Retention
- Activity/audit history
- Archive/pause controls

Use confirmations/reasons for activating, pausing, archiving, changing target/schedule, acknowledging/resolving/closing incidents, changing client visibility, or adding agreement linkage. Do not rely on colour alone.

H. Authorization, privacy, audit
- Require authenticated authorized staff for all admin monitoring operations.
- Clients/public users cannot access admin monitoring routes.
- Enforce explicit organization/project/watch/incident/diff/result/alert/export scope in every backend query and mutation.
- Protect against IDOR/BOLA, SSRF, DNS rebinding, open redirects, stored XSS, response-body leakage, mass assignment, CSRF where applicable, cross-tenant data leakage, queue abuse, cache leakage, raw errors, and log leakage.
- Validate mutations with Zod and strict field allowlists.
- Audit watch creation/edit/authorization/activation/pause/archive, target validation failures, schedule changes, probe dispatch/results, diff access, incident transitions, client-visibility changes, agreement linkage, exports, alerts, and privileged views.
- Never expose endpoint URLs, infrastructure metadata, raw diff content, secrets, headers, credentials, provider tokens, audit notes, or another organization’s monitoring data to unauthorized users.

I. Demo behavior
- Current monitoring targets/events/metrics are local demo fixtures.
- Demo data must be opt-in, environment-gated, server-enforced, and visibly labelled outside production.
- Demo data must never enter production dashboards, client portals, reports, invoices, SLA calculations, alerts, public content, sales material, exports, analytics, AI prompts, emails, or operational decisions.
- Do not reset/delete demo data during audit.

J. Accessibility and quality
- Semantic tables/forms/headings and accessible incident timeline/diff summaries.
- Keyboard-accessible filters, watch controls, incident actions, dialogs, and review states.
- Visible focus states, reduced-motion support, responsive layout.
- Clear non-colour status indicators.
- Accessible loading, empty, stale, error, restricted, confirmation, and success states.
- Type-safe APIs, idempotent jobs, and no fake uptime/SLA telemetry.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Watch activation and SSRF safety
- Unauthorized users cannot create/activate watches.
- Target authorization is required.
- Private, loopback, link-local, metadata, internal-DNS, unsupported-scheme, disallowed-port, DNS-rebinding, and redirect-to-private targets are rejected.
- Workers have restricted egress/no ambient credentials and enforce timeout/body-size/redirect/concurrency/rate limits.
- Cron/interval validation and rate limits work.

2. Probe/change-detection safety
- Scanning/checking jobs are idempotent and tenant-scoped.
- Probe states distinguish target failure, worker failure, timeout, DNS/TLS, expected-content mismatch, and maintenance.
- Raw response bodies/diffs cannot execute as HTML and secrets/PII are redacted.
- Sensitive auth/security diffs require elevated authorization.
- Noise suppression, deduplication, maintenance windows, and alert-rate limits work.

3. Incident/SLA integrity
- Valid incident transitions work; invalid transitions fail.
- Acknowledgement/resolution/closure require authorized actor, reason, and audit event.
- Operational availability does not render as SLA compliance by default.
- SLA measurement renders only with agreement/service/methodology/period/coverage evidence and remains per agreement/watch.
- Aggregate SLA and unsupported guarantee claims do not render.
- Monitoring cannot automatically alter credits, invoices, payments, or contract state.

4. Authorization and client visibility
- Client users cannot access admin monitoring.
- Client-visible summaries show only authorized own-organization/public-scope data.
- Guessed IDs cannot expose another organization’s watch, endpoint, result, diff, incident, alert, or agreement.
- Internal URLs, raw diffs, staff notes, provider data, and infrastructure/backups remain restricted.
- Lists/search/filters/pagination/exports/caches remain tenant and role scoped.

5. Quality
- Demo state is server/environment gated and cannot feed production uses.
- Empty/loading/error/stale/restricted/no-results states render.
- Keyboard and responsive flows work.
- Typecheck, lint, unit, integration, SSRF/egress, security, tenant-isolation, job-idempotency, incident, SLA, client-visibility, cache, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Monitoring-data retention plan
- Alert/noise-management plan
- Backfill/data cleanup plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”


OPENSEO ________________________________________________________________________________________________________________

You are a principal full-stack engineer, technical-SEO and web-performance engineer, Core Web Vitals measurement specialist, structured-data engineer, search-data methodology reviewer, SSRF/egress-security engineer, privacy engineer, multi-tenant SaaS security architect, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only the SEO technical-observation module and directly required authorized audit-scope, URL validation, audit execution, technical-evidence, keyword-observation, finding workflow, structured-data validation, authorization, retention, and audit support:

/admin/seo
/admin/seo/[auditId] and finding/detail routes only if they exist or are strictly required
SEO audit APIs, server actions, repositories, schemas, queued jobs/workers, evidence storage, keyword-observation paths, and structured-data validation paths only where directly required

Important context:
All visible domain/client names, audit scores, severity labels, keyword positions, “top 5/top 10” summaries, Core Web Vitals grades, audit findings, remediation text, Gemini labels, schema claims, HSTS states, timestamps, and source/integration labels are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat demo fixtures as real client audits, rankings, Google results, Core Web Vitals evidence, schema compliance, indexation status, security posture, or service/SLA performance. Demo SEO data must be opt-in, local/demo-only, visibly labelled outside production, and prevented from appearing in production dashboards, client portals, reports, exports, proposals, invoices, sales material, public claims, analytics, AI prompts, alerts, CRM automation, emails, or operational decisions.

Do not modify database reset scripts, administrator bootstrap, email OTP, finance/payment systems, unrelated CRM/content/delivery modules, broad public-site code, Docker/DevOps infrastructure files, or unrelated admin routes during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/seo route/page, client/domain selector, run-audit action, summary cards, audit list/detail, findings, keyword table, score calculation, status transitions, exports, and loading/error states
   - SEO audit APIs, server actions, services, repositories, validation schemas, types, background workers/jobs, queues, scheduling, caching, rate limiting, evidence storage, and audit logging
   - Any Lighthouse/PageSpeed/CrUX/Search Console/structured-data validation/Gemini or other AI connector code; do not trigger external calls
   - Target URL/domain ownership/authorization logic, HTTP fetch/DNS/redirect/network helpers, authentication/header handling, and worker egress configuration
   - Prisma models/migrations for SEOAuditScope, SEOAuditRun, SEOAuditEvidence, SEOFinding, FindingVerification, KeywordProtocol, KeywordObservation, StructuredDataValidation, ClientOrganization, Project, User, OrganizationMembership, DataSourceConnection, RetentionPolicy, and AuditLog
   - Existing client portal/report/proposal/export integrations, authorization, demo seeds, and tests

2. Classify every visible label, metric, score, audit/finding, keyword, domain/client record, integration claim, source state, action, and data flow as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “GEMINI 3.7 AUDITOR ACTIVE,” “automated Core Web Vitals audits,” “Schema.org compliance,” “keyword rank tracking for client retainers,” “Google Core Web Vitals Grade,” and “SEO Health Score” are real, sourced, methodologically defined, and accurately labelled
   - Whether demo audit scores/findings/keywords can enter production client portals, reports, proposals, invoices, exports, CRM, alerts, AI prompts, public claims, or operating decisions
   - Whether Run Technical Audit can request arbitrary URLs and creates SSRF risks through protocol/scheme, DNS, IPv4/IPv6 private ranges, cloud metadata, redirects, DNS rebinding, ports, proxies, headers, authentication, or egress credentials
   - Whether targets require documented client/owner authorization and organization/project scoping
   - Whether audit runners are sandboxed/rate-limited and prevent crawling authentication pages, internal endpoints, sensitive routes, forms, or unbounded URLs
   - Whether Core Web Vitals claims have a clear source distinction: CrUX field data, PageSpeed field data, lab/Lighthouse results, or unavailable
   - Whether lab tests record URL, tool/runner version, date, device/network profile, cache state, test location, repeat runs, and source artifacts
   - Whether GSC/Search Console terms, property authorization, metric meaning, average-position caveats, keyword collection method, locale/language/device/date, and low-volume privacy restrictions are correct
   - Whether SEO health score formulas are documented, versioned, source-bounded, non-deceptive, and isolated from Google-branded claims
   - Whether manual ranking observations document search engine, query, locale, language, device, logged-out/account context, result type, timestamp, evidence, and reviewer
   - Whether audit findings/recommendations make unsupported claims about rankings, indexing, traffic, Core Web Vitals, rich results, Knowledge Graph, performance, HSTS, security, compliance, or client outcomes
   - Whether HSTS and preload recommendations account for domain-wide subdomain HTTPS readiness, ownership, risk, rollback, and actual configuration verification
   - Whether structured-data validation distinguishes syntax, content eligibility, policy, deployment, and actual search display; and whether it protects against XSS/unsafe JSON-LD
   - Whether AI receives private target content, page source, client information, credentials, analytics, or evidence without permission; whether it can approve or publish findings
   - Whether all list/detail/filter/export/evidence/client-facing routes are organization/role scoped and protected from IDOR/BOLA, injection, SSRF, XSS, cache leakage, raw errors, and log leakage
   - Whether audit/finding/keyword records retain source/evidence/reviewer/history and are archived rather than normally deleted

4. Return an audit report containing:
   - Files inspected
   - Current audit/evidence/finding/keyword architecture and data flow
   - Current data-source/integration/credential-handling findings
   - Current target authorization and SSRF/egress findings
   - Current CWV/lab/field methodology findings
   - Current keyword/search-observation methodology findings
   - Current score, labels, claims, and finding-verification findings
   - Current structured-data/HSTS/security findings
   - Current AI-assistance/privacy findings
   - Current authorization/tenant-isolation/client-portal/export/audit findings
   - Current demo-data behavior
   - Security/privacy/accuracy/contractual risks
   - UI/UX findings
   - Unsupported or misleading labels and claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Evidence-retention plan
   - Cache/job/quota plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, run audits, fetch URLs, crawl domains, call Google/CrUX/PageSpeed/Search Console/AI APIs, read/write secrets, change headers, modify JSON-LD, send reports/emails, export data, invalidate caches, or alter production/public content during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, client-authorized SEO technical-observation workflow.

A. Naming and accuracy
Use:

Title: “SEO technical observations”
Subtitle: “Review client-authorized technical and search-performance evidence.”

Method note:
“Results describe point-in-time observations, not rankings, indexing, rich-result, or performance guarantees.”

Replace/remove unless supported by selected source and documented methodology:
- “OpenSEO & Technical Health Cockpit”
- “GEMINI 3.7 AUDITOR ACTIVE”
- “Automated Core Web Vitals audits”
- “Schema.org compliance”
- “keyword rank position tracking for client retainers”
- “Google Core Web Vitals Grade”
- “SEO Health Score” presented as a Google/industry measure
- “Top 5 positions,” “Page 1 organic results,” or other achievement labels without full observation context
- “enhances … rich snippets in Google Knowledge Graph”
- “eliminate LCP delay”
- universal HSTS/preload recommendations
- normal delete actions

Use:
- Data source: Sample / Not connected / Queued / Running / Evidence review / Ready / Stale / Error
- Lab performance observation
- Field performance data, where available
- Structured-data validation finding
- Manual keyword observation
- Internal technical-review score, only if methodology is versioned and visible
- Finding requires re-test
- Verified resolved
- Archive audit

B. Audit scope/run/evidence/finding lifecycle
Audit scope:
- DRAFT_SCOPE
- PENDING_CLIENT_AUTHORIZATION
- APPROVED_SCOPE
- PAUSED
- ARCHIVED

Audit run:
- QUEUED
- RUNNING
- EVIDENCE_REVIEW
- FINDINGS_READY
- ERROR
- ARCHIVED

Finding lifecycle:
- OPEN
- MITIGATION_CLAIMED
- RE_TEST_REQUIRED
- VERIFIED_RESOLVED
- ACCEPTED_RISK
- ARCHIVED

Rules:
- Require verified client/owner authorization, organization/project scope, allowed domain/URL patterns, purpose, data-source permission, and retention setting before a run.
- Every run must store source/method, runner/tool version, target URL or URL group, date/time, relevant locale/device/network configuration, evidence references, limitations, and reviewer.
- AI may assist with drafting hypotheses but cannot independently approve, resolve, publish, or certify findings.
- Findings require evidence, owner, severity rationale, remediation guidance, and re-test evidence before verified resolution.
- Archive rather than standard delete; preserve audit history/evidence under retention policy.

C. Evidence sources and methodology
- Keep CrUX/PageSpeed field data, lab/Lighthouse results, Search Console reports, structured-data validation, manual SERP observations, and AI-generated suggestions separate in schema, UI, exports, and language.
- Field data: record available URL/URL-group context, collection window, source timestamp, data sufficiency, and metric distributions.
- Lab data: record exact target, runner/tool version, device/network profile, test region if known, cache state, repeat-run policy, timestamp, raw artifact reference, and known limitations.
- Do not call a lab score a Google “grade.”
- Search Console: use authorized server-side connection, state source/property/date range, and describe average position correctly.
- Manual SERP snapshots: record engine, query, language, locale, device, account/logged-out context, timestamp, observed result type/position, evidence, reviewer, and a limitation label.
- Do not present one snapshot as a universal rank or a contractual service level.
- Any internal composite score must show formula/version, inputs, missing-data behavior, date range, and limitations, and must never be branded as a Google score.

D. Target safety and runner controls
- Require an approved target scope; default to only public HTTPS client-owned/authorized URLs.
- Reject local/private/link-local/internal/metadata/DNS-rebinding/unsupported-scheme/disallowed-port targets and revalidate redirects/DNS.
- Use sandboxed workers with deny-by-default egress, no ambient credentials, strict DNS policy, no cookies/auth headers by default, timeouts, body-size/resource limits, rate/concurrency/quota limits, and retry/backoff.
- Never crawl authenticated content, admin routes, internal endpoints, forms, search routes, upload routes, arbitrary query values, or client-specific data unless separately explicitly authorized and engineered.
- Avoid storing raw pages, full headers, cookies, credentials, tokens, query parameters, or unnecessary page content.
- Show safe target display labels; do not expose sensitive endpoints broadly.

E. Technical performance/CWV findings
- Clearly distinguish field data, lab measurement, and unavailable/no-data states.
- Store/display actual metrics: LCP, INP, CLS, FCP, TTFB, and relevant diagnostics only with source and conditions.
- Avoid universal score/grade/good/bad statements unless the source definition and URL-group condition are clear.
- Frame fixes as hypotheses to test; require re-test after deployment.
- Do not state a code change will eliminate delay or guarantee passing Core Web Vitals.
- Record configuration/version and artifacts sufficient for reproducibility, within privacy/retention constraints.

F. Structured data and security findings
- Validate JSON-LD syntax, permitted types/properties, content-to-visible-page consistency, entity ownership, deployment, and relevant search-engine guidelines.
- Never promise rich results, Knowledge Graph inclusion, indexing, ranking, or traffic.
- Only recommend schema types after verified entity/content review; avoid generic FinancialService/Organization assumptions.
- Serialize JSON-LD safely to prevent injection.
- Treat security observations, especially HSTS, with a separate change-review workflow.
- Before HSTS/includeSubDomains/preload recommendation, require domain inventory, HTTPS readiness evidence, owner approval, service dependency check, environment plan, and rollback/incident plan.
- Mark configuration as verified only after authorized evidence/re-test.

G. Keyword observations
- Use a `KeywordProtocol` plus dated `KeywordObservation` model.
- Require source/method: MANUAL or approved provider integration.
- Record query, engine/provider, locale, language, device, account context, search feature/result type, timestamp, target page if observed, position if applicable, evidence, reviewer, and review status.
- Do not expose low-volume queries or sensitive competitive research to unauthorized roles/clients.
- Use “Observed position in configured snapshots,” not rank guarantees.
- Aggregate only reviewed, comparable observations and display sample size, methodology, date range, inclusion rules, and limitations.
- Do not call results “top 5/top 10” achievements without showing their defined protocol/context.

H. AI assistance
- AI output is untrusted draft text only.
- Do not send private pages, raw source, credentials, analytics, client data, or sensitive audit evidence to AI without explicit approval and data-minimization controls.
- Prompt injection defenses: treat crawled page text and remote content as untrusted; isolate it from tool instructions and do not allow it to trigger actions.
- Human technical review is mandatory for any finding, remediation, client-facing output, score, or public content.
- Record AI-use provenance without storing unnecessary prompts or sensitive source material.

I. Authorization, privacy, audit
- Require authenticated authorized staff for audit/keyword management.
- Scope all domains, audit runs, sources, evidence, findings, keywords, lists, filters, exports, client summaries, and jobs by organization/project/role.
- Protect against IDOR/BOLA, SSRF, DNS rebinding, open redirects, XSS, unsafe JSON-LD, mass assignment, CSRF where applicable, query injection, CSV injection, prompt injection, cache leakage, raw errors, and log leakage.
- Validate mutations server-side using Zod and strict allowlists.
- Audit scope authorization, target changes, run requests, findings, evidence view/export, mitigation claims, verification, client visibility, source connections, and archive actions.
- Never expose private URLs, raw artifacts, headers, credentials, staff notes, internal IDs, other-tenant data, or unreviewed/AI draft findings to clients/public users.

J. Demo behavior
- Existing SEO metrics/findings/keywords are local demo fixtures.
- Demo mode must be explicit, opt-in, environment-gated, server-enforced, and visibly labelled.
- Demo values must never enter production dashboards, client portals, reports, exports, proposals, invoices, public pages, marketing claims, analytics, AI prompts, alerts, CRM, emails, or real business decisions.
- Do not reset/delete demo data during audit.

K. UX and quality
Header:
- SEO technical observations
- Method/source status
- Client/authorized target selector
- Create audit scope
- Run authorized check
- Source/date/status filters

Summary cards, sourced data only:
- Runs awaiting evidence review
- Open verified findings
- Findings requiring re-test
- Reviewed keyword observations
- Connected sources

Audit/table fields:
- Client / authorized target
- Source and method
- URL or URL group
- Observed date
- Data freshness
- Finding severity
- Finding state
- Reviewer
- Actions

Include source-specific limitations and metric definitions. Use semantic, accessible tables/forms/dialogs, keyboard support, visible focus states, responsive design, and clear empty/loading/error/stale/forbidden/demo states. Do not rely on colour alone. Do not render unsupported grades, autonomous-auditor claims, fake telemetry, or implied ranking guarantees.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Demo/source integrity
- Demo records are server/environment gated and cannot enter production, client views, reports, proposals, exports, billing, CRM, public claims, analytics, AI prompts, alerts, or emails.
- Unavailable/stale/error sources do not render fabricated live metrics or implied current status.
- AI draft output cannot be approved/published/resolved without qualified human review.

2. Audit safety and authorization
- Only authorized tenant-scoped staff can create scope/run audits/view evidence/manage findings.
- Scope authorization is required before execution.
- Private/loopback/link-local/metadata/internal/DNS-rebinding/unsupported-scheme/disallowed-port/redirect-to-private targets are rejected.
- Workers enforce egress isolation, timeout/resource/rate/concurrency limits and never send auth headers/cookies by default.
- Guessed IDs and manipulated filters cannot expose another tenant’s scopes/runs/evidence/findings/keywords/exports.

3. Methodology and finding integrity
- Lab/field/GSC/manual/AI evidence stays distinct and is accurately labelled.
- CWV claims include source/conditions and do not render universal Google grades.
- Manual keyword observations store required context and never display as universal rankings.
- Scores require versioned visible methodology or are not displayed.
- Structured-data findings do not promise rich results/Knowledge Graph/rankings.
- HSTS findings require verified domain-readiness/approval/re-test evidence.
- Findings cannot become verified resolved without re-test evidence and authorized reviewer.

4. Security and quality
- No secrets/private URLs/raw artifacts/headers/cookies/credentials/internal notes leak via UI/API/export/cache/log/error.
- Stored evidence, URLs, keyword text, AI output, and JSON-LD are sanitized and protected from XSS/injection/CSV injection/prompt injection.
- Archive preserves history; standard delete is absent.
- Empty/loading/error/stale/forbidden/demo states render accessibly.
- Typecheck, lint, unit, integration, security, SSRF/egress, tenant-isolation, source-methodology, score, keyword-observation, structured-data, HSTS, cache, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Evidence-retention plan
- Backfill/data cleanup plan
- Runner/job/quota plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

CLIENT MESSAGES : _______________________________________________________________________________________________________________

You are a principal full-stack engineer, secure-messaging and multi-tenant SaaS architect, privacy/records-retention engineer, application-security engineer, attachment-security workflow designer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this client-messaging module and the directly required thread, message, participant, visibility, attachment, notification, export, retention, authorization, and audit support:

/admin/messages
Client portal message routes/components/APIs only where strictly required
Message/thread APIs, server actions, repositories, validation schemas, notification paths, attachment-linking and secure-download paths only where directly required

Important context:
The development banner, workspace/client names, project context, role labels, thread messages, test messages, “encrypted mesh” language, polling label, attachment prompt, and all visible message/notification data are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat demo fixtures as real client communications, encryption guarantees, delivery/read confirmation, authorized file delivery, project status, contractual statements, security capabilities, or operational evidence. Demo message data must be opt-in, local/demo-only, visibly labelled outside production, and prevented from appearing in production threads, client portals, notifications, emails, exports, reports, analytics, AI prompts, CRM history, search indexes, alerts, or real customer accounts.

Do not modify database reset scripts, administrator bootstrap, email OTP, finance/payment implementation, unrelated CRM/content/delivery modules, broad public-site code, Docker/DevOps infrastructure files, or unrelated admin modules during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/messages route/page, thread list, search/filter, new-thread flow, context linking, participant selection, send composer, internal-note toggle, attachment flow, polling/realtime code, close/reopen, edit/delete, export, and empty/loading/error states
   - Any client portal thread/message UI and APIs
   - Message/thread/participant/visibility/attachment/export/notification APIs, server actions, repositories, queues/jobs, search indexing, caching, validation, and audit logging
   - Media/file attachment integration, access controls, delivery/preview/download paths, retention logic, and notification/email delivery
   - Prisma models/migrations for MessageThread, Message, MessageRevision, MessageParticipant, MessageAttachment, ThreadContext, MessageExport, Notification, ClientOrganization, Project, Invoice, Lead, User, OrganizationMembership, RetentionPolicy, LegalHold, and AuditLog
   - Existing encryption/key-management descriptions and implementation boundaries, without exposing secrets
   - Existing demo seeds/tests and cross-tenant access controls

2. Classify every visible label, security claim, message, thread, role, context, action, attachment control, polling/realtime state, export behavior, deletion behavior, and data flow as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “PHASE 4 // ENCRYPTED MESH” means encryption in transit, encryption at rest, true end-to-end encryption, or merely marketing copy
   - Whether “authenticated asset streaming” is implemented and whether attachment links enforce status, tenant, thread, project, classification, recipient, expiry, and revocation at issuance and access
   - Whether 3.5-second polling is truly active, tenant-scoped, rate-limited, efficient, resilient, and accurately labelled
   - Whether demo/test messages can enter production/client portals/notifications/exports/AI/CRM/search/analytics
   - Whether internal notes can leak through API serialization, thread list previews, counts, search, notifications, emails, exports, browser/cache/prefetch payloads, SSE/polling, activity streams, or client portal routes
   - Whether thread/project/invoice/lead context is only descriptive or properly authorization-scoped
   - Whether editing silently rewrites messages and whether deletion destroys records/evidence/history
   - Whether roles/participant changes, organization membership changes, project closure, client offboarding, or contract termination revoke access correctly
   - Whether message bodies, filenames, links, markdown, HTML, images, PDFs, and file previews can cause stored XSS, MIME confusion, unsafe URLs, active-content execution, attachment malware, data leakage, or prompt injection
   - Whether message creation, internal notes, attachment IDs, export parameters, thread IDs, client IDs, context IDs, participants, search filters, and role labels are protected against mass assignment, IDOR/BOLA, CSRF, injection, and cross-tenant access
   - Whether exports properly filter client-visible versus staff-only content, restrict attachments, prevent CSV/formula injection, watermark/classify sensitive exports if needed, and are auditable
   - Whether notifications/email previews leak content, internal notes, confidential project names, or attachments
   - Whether data retention, redaction, legal holds, archive/purge, and audit trails exist
   - Whether encrypted-search/export/backups/logging assumptions contradict any claimed encryption model

4. Return an audit report containing:
   - Files inspected
   - Current message/thread/participant/context architecture and data flow
   - Current encryption/key-management claim findings
   - Current polling/realtime/notification findings
   - Current visibility/internal-note/client-portal isolation findings
   - Current attachment/upload/download/share findings
   - Current edit/revision/delete/redaction/retention findings
   - Current export/search/cache/logging findings
   - Current authorization/tenant-isolation/role-revocation findings
   - Current demo-data behavior
   - Security/privacy/records-management risks
   - UI/UX findings
   - Unsupported or misleading labels and claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Attachment/data retention plan
   - Notification/realtime plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, create/send/edit/delete/redact/export messages, add/remove participants, upload/download/share files, inspect secrets, send notifications/emails, call AI providers, change polling, alter client access, or modify production/public content during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, tenant-safe client-messaging workflow.

A. Naming and claim accuracy
Use:

Title: “Client messages”
Subtitle: “Communicate with authorized client contacts and keep internal notes separate.”

Use:
- Data mode: Development sandbox, when applicable
- Updates: Polling every 3.5 seconds, only if actually active
- Secure client messaging
- Authorized file attachment
- Client-visible message
- Internal note — not shown to clients
- Restricted staff note
- Request redaction
- Archive thread

Replace/remove unless independently verified:
- “PHASE 4 // ENCRYPTED MESH”
- “encrypted messaging”
- “authenticated asset streaming”
- “realtime” when only polling is used
- generic “Delete Message (Admin)”
- claims that messages/attachments/read states/delivery are guaranteed

If the application server can access message content, do not claim E2EE. Use:
“Messages are protected in transit and stored with access controls.”

B. Thread/message/context/visibility model
Support server-enforced entities:

Thread:
- id
- organizationId
- clientOrganizationId
- contextType: PROJECT | INVOICE | LEAD | GENERAL
- contextId, optional
- title
- status: OPEN | WAITING_ON_CLIENT | WAITING_ON_STAFF | RESOLVED | CLOSED | ARCHIVED
- clientVisibility
- retentionPolicyId, optional
- createdById
- closedAt/archivedAt, optional
- createdAt/updatedAt

Message:
- id
- threadId
- organizationId
- visibility: CLIENT_VISIBLE | INTERNAL_ADMIN | RESTRICTED_STAFF
- bodyPlainText or sanitized limited markup
- status: DRAFT | SENT | DELIVERED | READ | REDACTED | RETENTION_PENDING_PURGE | PURGED
- sentAt/deliveredAt/readAt, optional
- createdById
- redactionReason/revision metadata, restricted
- createdAt/updatedAt

MessageRevision:
- messageId
- revisionNumber
- body snapshot
- editedById
- editReason
- createdAt

Participant:
- threadId
- user/contactId
- participant role
- visibility/access scope
- added/removed metadata

Attachment:
- messageId
- fileAssetId
- attachment visibility
- approved/available status reference
- attachedById
- createdAt

Rules:
- Organization and client context are immutable or tightly controlled after thread creation.
- Thread context is not an access-control substitute; enforce linked-record authorization separately.
- Message visibility is server-set/validated and cannot be broadened by client input.
- Client-visible threads and APIs never serialize internal/restricted messages, notes, staff-only attachment metadata, audit logs, private participant data, or unrelated records.
- Internal notes require explicit authorized staff capabilities and obvious persistent labels.
- Messages are immutable after sending by default; edits create revisions and an audit trail.
- Use redaction/archive/purge policy—not ordinary permanent delete.

C. Attachments
- Integrate with the approved private media lifecycle; do not create a parallel unscanned upload path.
- New attachments upload to private quarantine and become attachable/client-visible only when validated, scanned, checksum-complete, classified, and AVAILABLE.
- Enforce organization/project/thread/message/recipient/classification/status checks on every attachment list/preview/download/share operation.
- Prevent scanning/flagged/quarantined/archived/purged assets from attachment exposure.
- Do not expose storage keys, permanent links, direct object URLs, scan internals, or file metadata beyond authorization.
- Define allowed type/size/category policies; block active/untrusted formats or force safe download/isolated preview.
- Audit all attachment actions and revoke access on membership/role/context/file-status changes.

D. Realtime, notifications, and delivery
- Use polling only when it is actually active; state interval and data freshness honestly.
- If polling, query only minimal tenant-scoped updates since a cursor; rate-limit and back off when inactive/backgrounded.
- Do not expose hidden messages through unread counts, typing indicators, previews, notifications, email, caches, SSE/websocket events, or search.
- Notification delivery should be queue-backed, idempotent, consent/preference-aware, and status-tracked.
- Notifications must minimize sensitive content; internal note notifications never reach clients.
- Do not present message delivery/read receipt states without a defined, verifiable event model.

E. Security, authorization, privacy, audit
- Require authenticated authorized staff for admin views and authorized active client contacts for client portal views.
- Enforce organization, client organization, context, participant, role/capability, visibility, and retention checks on every backend operation.
- Defend against IDOR/BOLA, mass assignment, CSRF where applicable, stored XSS, unsafe links, file malware, MIME confusion, prompt injection, search/cache leakage, cross-tenant notification leakage, export leakage, raw error/log leakage, and abuse/spam.
- Validate all mutations with Zod and strict field allowlists.
- Rate-limit sends, new threads, attachment intents, search, polling, exports, and privileged actions.
- Audit thread creation/changes, participant changes, sends/failures, edits/revisions, internal-note actions, visibility changes, attachment actions, exports, close/reopen/archive/redaction/purge, notifications, and privileged reads.
- Do not expose internal IDs, staff notes, message revision history, security metadata, client data, attachments, raw errors, or another tenant’s content to unauthorized roles.
- Apply data minimization, retention, legal hold, export, and subject-access/deletion policies appropriate to the organization.

F. Edit, redaction, retention, export
- Sent messages are immutable by default.
- Editing requires reason and creates a versioned revision; clients see an honest edited indicator where relevant.
- Redaction requires privilege, reason, confirmation, and audit record; preserve restricted historical evidence subject to policy/legal hold.
- Archive threads rather than routine delete.
- Purge only after retention/legal-hold/dependency checks, elevated authorization, confirmation, and minimal retained audit record.
- Exports are role-scoped, tenant-scoped, visibility-filtered, attachment-policy-aware, access-expiring, auditable, and protected against CSV/formula injection.
- Client exports never include internal/restricted notes, staff-only identities/notes, private attachments, audit records, or unrelated context.

G. Demo behavior
- Current client/thread/message data are demo fixtures.
- Demo mode is explicit, opt-in, environment-gated, server-enforced, and visibly labelled outside production.
- Demo records must never enter production messages, client portals, notification/email delivery, exports, CRM, reports, analytics, AI prompts, search indexes, alerts, or real customer accounts.
- Do not reset/delete demo records during audit.

H. UX and accessibility
Header:
- Client messages
- New thread
- Search
- Needs reply/status/context/client filters
- Data-mode/update status, when applicable

Thread detail:
- Client/context/participants/status/retention metadata
- Persistent non-colour visibility badges
- Client-visible conversation and staff-only note treatment
- Approved attachment state and access explanation
- Clear close/reopen/archive/redaction paths
- Audit/history access restricted by role

Composer:
- Client-visible versus internal note choice with a default safe visibility policy
- Explicit recipients/context confirmation before sending
- Attachment scan/availability state
- Draft/save/send error/retry states
- Keyboard accessible send/control behaviour

Support semantic headings/forms/lists, keyboard navigation, screen-reader labels, visible focus, responsive layout, reduced motion, and accessible empty/loading/error/forbidden/no-results/success states. Do not rely on colour alone.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Visibility and tenant isolation
- Public/unauthenticated users cannot access messages.
- Client users see only their own organization’s authorized threads and only CLIENT_VISIBLE messages/attachments.
- Internal/restricted notes never appear in client APIs, thread previews, counts, search, notifications, emails, SSE/polling, caches, exports, prefetch/static payloads, or logs.
- Guessed IDs, manipulated filters/context IDs, and participant changes cannot cross tenant or visibility boundaries.
- Membership/role/context removal revokes future access.

2. Message lifecycle and audit
- Valid thread/message status transitions work; invalid transitions fail.
- Sent message edits create revisions, preserve history, require actor/reason, and do not silently rewrite.
- Redaction/archive/purge require correct privilege, retention/legal-hold/dependency checks, confirmation, and audit events.
- Standard permanent deletion is absent.
- Thread/context/participant changes are authorized and auditable.

3. Attachment safety
- Attachments follow quarantine/validation/scan/availability workflow.
- Scanning/flagged/quarantined/archived/purged files cannot be exposed in messages, previews, downloads, exports, or notifications.
- Cross-tenant/guessed attachment IDs/direct URLs/revoked access fail.
- Unsafe content cannot execute through previews/messages.

4. Notifications/realtime/export
- Polling is cursor-based, tenant-scoped, rate-limited, and contains no hidden data.
- Notification/email previews respect visibility/preferences and never leak internal content.
- Exports are visibility/tenant/role-filtered, CSV-safe, expiry-controlled, and audited.
- Demo messages cannot enter production operations or external delivery.

5. Quality
- Empty/loading/error/forbidden/no-results/offline/send-failure states render.
- Keyboard and responsive messaging flows work.
- Typecheck, lint, unit, integration, security, tenant-isolation, visibility, attachment, notification, export, retention, cache, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Attachment and message-retention plan
- Backfill/data cleanup plan
- Notification/polling plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”

EMAIL CENTER PAGE: __________________________________________________________________________________________________________________

You are a principal full-stack engineer, secure-email and deliverability architect, Gmail API/OAuth and SMTP integration engineer, inbound-email/webhook engineer, privacy-and-records-retention engineer, multi-tenant SaaS security architect, CRM workflow designer, UX designer, and QA engineer.

You are working inside the CYBERSTYLE monorepo.

Review and improve only this email administration module and the directly required sender-profile, draft, template, outbound queue, provider-transport, inbound-threading, delivery-event, CRM-context, attachment, suppression/consent, export, authorization, retention, and audit support:

/admin/email
Client portal email/thread routes only where strictly required
Email APIs, server actions, repositories, queue/jobs, provider adapters, webhook handlers, validation schemas, and attachment-linking paths only where directly required

Important context:
The development banner, SMTP mode, Gmail API/OAuth claims, failover claims, thread counts, templates, composer defaults, test messages, entity options, inbox data, communication playbooks, transport labels, sync labels, audit entries, and other visible email data are intentional local development/demo fixtures unless confirmed otherwise by audit.

Do not treat demo fixtures as real production email, Gmail/API connection, SMTP failover, authenticated sender, client correspondence, deliverability, inbound-sync evidence, project completion confirmation, invoice status, consent state, or audit evidence. Demo email data must be opt-in, local/demo-only, visibly labelled outside production, and prevented from sending to real recipients, connecting to providers, receiving webhooks, appearing in client portals, exports, reports, CRM histories, analytics, AI prompts, notifications, public pages, or real business decisions.

Do not modify database reset scripts, administrator bootstrap, email OTP/authentication flows, finance/payment implementation, unrelated CRM/content/delivery modules, broad public-site code, Docker/DevOps infrastructure files, or unrelated admin routes during this task.

==================================================
PHASE 1 — AUDIT ONLY, NO CODE CHANGES
==================================================

Before editing any file:

1. Inspect:
   - /admin/email route/page, composer, recipient/sender/context controls, templates/playbooks, drafts, threads, inbox, sync status, transport settings, delivery activity, export, archive/delete actions, and empty/loading/error states
   - Outbound email APIs, server actions, repositories, queue/jobs, scheduling, retries, idempotency, provider adapters, Gmail API/OAuth, SMTP configuration/adapter, fallback/failover logic, rate limiting, and audit logging
   - Inbound email polling/webhook handlers, provider-signature verification, MIME/header parsing, thread matching, bounce/complaint/delivery/read events, attachment handling, and notification paths
   - Sender profiles, domain verification, SPF/DKIM/DMARC status representations, reply-to/alias restrictions, consent/suppression/unsubscribe paths, and template/version approval flows
   - CRM entity linking, organization/client/contact/project/proposal/invoice authorization, attachment/media integration, client portal visibility, export/search/cache logic
   - Prisma models/migrations for EmailMessage, EmailThread, EmailParticipant, EmailContext, EmailDraft, EmailTemplate, SenderProfile, EmailTransportConnection, DeliveryAttempt, ProviderEvent, SuppressionEntry, ConsentPreference, EmailAttachment, EmailExport, RetentionPolicy, LegalHold, User, OrganizationMembership, and AuditLog
   - Existing demo seeds/tests and security controls

2. Classify every visible label, security/delivery/integration claim, transport state, composer field, template, message, recipient/action, inbox/thread entry, entity link, audit item, and data flow as:
   - Real database-backed
   - Demo/seed data
   - Hardcoded UI
   - Derived data
   - Mocked/unimplemented
   - Unsupported or misleading

3. Specifically investigate:
   - Whether “Professional Gmail API OAuth dispatch,” “Google SMTP failover,” “bi-directional client threads,” “executive outreach workflows,” “Sync Engine,” and “Audit Ledger” are actually implemented and accurately labelled
   - Whether sandbox/demo messages can route to real recipients, providers, webhooks, client portals, reports, exports, CRM records, search, analytics, AI prompts, or notifications
   - Whether Gmail OAuth/SMTP credentials, refresh tokens, sender identity, DKIM keys, provider IDs, raw MIME, headers, or email contents leak through client bundles, settings, APIs, logs, errors, exports, or caches
   - Whether raw HTML input/rendering allows XSS, unsafe URLs, phishing-like content, tracking pixels, event handlers, active content, CSS abuse, or client-side-only sanitization
   - Whether free-form recipients permit unauthorized outreach, accidental disclosure, recipient-domain spoofing, invalid addresses, mass mailing, BCC abuse, or consent/suppression bypass
   - Whether free-form entity IDs permit IDOR/BOLA, cross-tenant linking, wrong-recipient invoice/project disclosure, or mass assignment
   - Whether sender/reply-to/alias selection is tied to verified sender profiles and domain policy
   - Whether sends are queued/idempotent/rate-limited and how Gmail/API versus SMTP failover avoids duplicate email delivery
   - Whether provider acceptance, delivery, bounce, complaint, and read events are accurately distinguished and securely webhook-verified/deduplicated
   - Whether inbound email parsing and threading can be spoofed through headers/subjects, expose internal threads, or introduce HTML/attachment malware
   - Whether marketing/outreach flow separates transactional/service email from consent/suppression/unsubscribe requirements
   - Whether attachments follow the approved private quarantine/scan/availability workflow
   - Whether export, search, notifications, client portal, analytics, AI prompts, cache, retention, legal-hold, archive/delete, and audit behavior protect confidential email data
   - Whether all list/detail/thread/send/export/connection/webhook paths are tenant- and role-scoped and resist IDOR/BOLA, CSRF, injection, XSS, request smuggling where applicable, raw-error, and log leakage

4. Return an audit report containing:
   - Files inspected
   - Current email/outbound/inbound/thread/transport architecture and data flow
   - Current Gmail OAuth/SMTP/sender-domain credential and delivery findings
   - Current composer/template/HTML/link safety findings
   - Current recipient/context/CRM/invoice authorization findings
   - Current queue/idempotency/failover/rate-limit findings
   - Current inbound/webhook/threading/delivery-event findings
   - Current consent/suppression/marketing-versus-transactional findings
   - Current attachment/export/search/cache/notification findings
   - Current archive/revision/retention/legal-hold/audit findings
   - Current authorization/tenant-isolation/demo-data findings
   - Security/privacy/deliverability/compliance risks
   - UI/UX findings
   - Unsupported or misleading labels and claims
   - Proposed changes
   - Exact files proposed for modification
   - Migration impact
   - Backfill/data cleanup plan
   - Deliverability/transport plan
   - Retention plan
   - Rollback plan
   - Required tests
   - Questions requiring my decision

End with exactly:
“WAITING FOR APPROVAL — NO FILES HAVE BEEN MODIFIED.”

Do not edit code, run migrations, reset data, send/queue/schedule/cancel email, contact recipients, connect Gmail, read/write OAuth or SMTP secrets, send provider requests, receive/process webhooks, alter sender/domain configuration, export data, change suppression lists, upload/download attachments, call AI providers, invalidate caches, or modify production/public content during the audit.

==================================================
TARGET PRODUCT REQUIREMENTS
==================================================

After approval, implement a truthful, secure, tenant-safe email workflow.

A. Naming and source-state accuracy
Use:

Title: “Email center”
Subtitle: “Draft, review, and send authorized business communications.”

Use:
- Transport status: Sandbox / Not connected / Authorizing / Connected / Degraded / Error / Disabled
- Sender profile
- Threaded email records
- Email activity log
- Connection status
- Authorized contact
- Queue send
- Create draft
- Archive record

Replace/remove unless verified:
- “Email & Communication Command Hub”
- “Professional Gmail API OAuth dispatch”
- “Google SMTP failover”
- “bi-directional client threads”
- “executive outreach workflows”
- “Sync Engine”
- “Audit Ledger”
- generic `MODE: smtp`
- unrestricted “HTML SUPPORTED”
- standard permanent delete actions
- project/invoice/delivery claims used as default template text

B. Transport, sender, and delivery model
Server-enforced transport states:
- SANDBOX
- NOT_CONNECTED
- AUTHORIZING
- CONNECTED
- DEGRADED
- ERROR
- DISABLED

Message lifecycle:
- DRAFT
- PENDING_REVIEW
- QUEUED
- SENDING
- ACCEPTED_BY_PROVIDER
- DELIVERED
- BOUNCED
- COMPLAINED
- FAILED
- SUPPRESSED
- CANCELLED
- ARCHIVED
- RETENTION_PENDING_PURGE
- PURGED

Rules:
- Sandbox delivery is restricted to explicit allowlisted test recipients or local capture; it cannot fall through to real delivery.
- Not-connected state permits drafts/onboarding but no live sends.
- Outbound sends happen only in idempotent background jobs, never directly from browser requests.
- Sender profiles are organization-scoped, verified, approved, and restrict from/reply-to/alias domains.
- Use a per-message idempotency key and provider-message ID; retries/fallback cannot duplicate sends.
- Gmail/API and SMTP must be behind one policy-controlled transport abstraction; fallback is explicit, logged, and safe.
- Provider acceptance, delivery, bounce, complaint, and read events are distinct and never overstated.
- Archive/redact/purge under retention/legal-hold rules; no routine permanent deletion.

C. Recipient, context, consent, and template controls
- Use an authorized contact picker; validate email addresses and recipient relationship server-side.
- Do not trust free-form entity IDs. Use a type-safe authorized context picker for lead/client/project/proposal/invoice/general.
- Verify organization/client/contact/context relationships before queueing.
- Invoice/project/proposal emails require correct authorized client contact and context-specific permission.
- Separate transactional, client-service, marketing, and internal messages.
- Enforce suppression/unsubscribe/consent rules for marketing/outreach; do not bypass global suppression or complaints.
- For transactional/client-service messages, require a documented business purpose and authorized relationship.
- Use versioned/reviewed templates; default templates must not assert project completion, payment status, availability, security, rankings, or technical outcomes without verified linked data and approval.
- Require human review/approval thresholds for finance, contract, legal, high-volume, or high-risk outbound mail.

D. HTML, links, content, attachments
- Accept plain text or a limited safe editor only. Sanitize server-side into a strict allowlist.
- Block scripts, forms, iframes, SVG, event handlers, arbitrary style, external CSS, meta refresh, data URLs, javascript URLs, active embeds, and uncontrolled tracking pixels.
- Generate a plain-text alternative.
- Validate/allowlist links, use HTTPS by default, prevent open redirects, and flag unfamiliar domains.
- Rate-limit recipients/messages/attachments and enforce organization/sender quotas.
- Attach only approved AVAILABLE assets from the secure media lifecycle, with organization/context/classification/recipient/status checks on every send/view/download.
- Never expose storage keys, direct object URLs, scan internals, or confidential attachment metadata to unauthorized users.

E. Gmail, SMTP, inbound, and events
- Store OAuth refresh tokens, SMTP credentials, DKIM keys, and provider secrets only in server-side secret management/encrypted credential references; never expose them in browser code, logs, errors, URLs, exports, or generic settings.
- Use least-privilege OAuth scopes and a verified sender mailbox/domain.
- Expose only safe connection metadata: status, sender profile, allowed scopes summary, expiry/rotation state, selected mailbox/domain, last successful health check.
- Configure SPF, DKIM, DMARC, sender-domain alignment, and provider webhook authentication before production use; do not portray connection alone as deliverability assurance.
- Use queue concurrency/rate limits, retries/backoff, provider-idempotency where supported, duplicate-event detection, and safe fallback policy.
- Authenticate/verify inbound and event webhooks, deduplicate them, validate payload size/schema, and segregate tenant processing.
- Parse inbound MIME/header/body content safely; treat all content/attachments as untrusted.
- Thread using provider IDs plus In-Reply-To/References after participant/tenant validation, not subject matching alone.
- Do not show read/open tracking unless lawful, configured, accurately implemented, and clearly disclosed.

F. Security, privacy, export, retention, audit
- Require authenticated authorized staff for admin email; client users see only explicitly authorized client-visible correspondence if a portal view exists.
- Scope every draft/message/thread/recipient/context/template/sender/transport/attachment/search/export/event path by organization and capability.
- Protect against IDOR/BOLA, mass assignment, CSRF where applicable, stored XSS, unsafe links, prompt injection, header injection, MIME abuse, attachment malware, cross-tenant data leakage, cache leakage, raw error/log leakage, CSV injection, and email abuse.
- Server-side Zod validation and strict allowlists for all mutations.
- Encrypt appropriately in transit/storage, but do not claim end-to-end encryption if application servers can read content.
- Audit drafts, approvals, send queue/cancel/retry, delivery events, bounces/complaints, sender/transport changes, inbound processing, thread merge/split, attachments, exports, retention/legal-hold/redaction/purge, and privileged views.
- Exports must be role-scoped, tenant-scoped, visibility-filtered, safe-format, expiry-controlled, and audited.
- Define data-minimization, retention, legal-hold, redaction, subject-access, and deletion processes appropriate to the organization.

G. Demo behavior
- Current composer defaults, templates, threads, transport claims, and records are demo fixtures.
- Demo mode is explicit, opt-in, environment-gated, server-enforced, and visibly labelled outside production.
- Demo email data cannot reach real recipients, Gmail/SMTP, providers, webhooks, client portals, notifications, exports, CRM history, reports, analytics, AI prompts, search, public pages, sales material, or real operational decisions.
- Do not reset/delete demo records during audit.

H. UX and accessibility
Header:
- Email center
- Transport status
- Sender profile
- Connection status
- New email
- Drafts
- Threads
- Templates
- Activity

Composer:
- Verified sender selector
- Authorized recipients
- Type-safe context picker
- Communication type
- Subject/body with safe formatting
- Approved attachment selector
- Explicit recipient/context/suppression/attachment/transport preflight status
- Save draft, request review, queue send, schedule, sandbox test, cancel queued send

Use semantic labels, accessible keyboard flows, visible focus states, responsive layout, reduced-motion support, and accessible draft/queued/sending/delivered/bounced/failed/suppressed/offline/error/forbidden states. Do not rely on colour alone.

==================================================
REQUIRED TESTS AFTER APPROVAL
==================================================

1. Demo and transport states
- Demo/sandbox is server/environment-gated and cannot send to real recipients or invoke production providers/webhooks.
- Not-connected/degraded/error states cannot silently fall back to another transport or send live mail.
- Connection metadata is accurate and contains no secrets.
- Demo data cannot appear in client views, exports, reports, CRM, analytics, AI prompts, notifications, or public content.

2. Outbound integrity
- Only authorized staff can draft/approve/queue/send/cancel/resend, with tenant/sender/context/recipient checks.
- Free-form entity IDs cannot create cross-tenant links.
- Recipient, suppression, consent, and message-class checks are enforced.
- Finance/contract/high-risk templates require configured review.
- Queue jobs are idempotent; retries, provider errors, and Gmail/SMTP fallback cannot create duplicates.
- Provider acceptance/delivery/bounce/complaint/read states remain correctly distinct.

3. Content and attachment security
- HTML/markdown sanitization removes XSS, unsafe links, tracking abuse, injection, and active content.
- Plain-text alternate is generated.
- Header injection, recipient/BCC abuse, URL/open-redirect risks, and mass-mailing rate limits are blocked.
- Attachments must be AVAILABLE, scanned, tenant/context/visibility-authorized; unsafe/scanning/revoked files cannot be sent or accessed.
- Incoming MIME/HTML/attachments are sanitized and restricted.

4. Inbound/webhook/threading
- Webhook signatures are verified; events are schema-validated, replay-protected, idempotent, and tenant-scoped.
- Inbound content cannot spoof/merge into another client thread through subject/header manipulation.
- Internal email content cannot leak through client portal/search/notifications/exports/caches.
- Provider tokens, raw MIME, headers, and confidential data do not leak via UI/API/log/error/export.

5. Retention, audit, quality
- Archive/redaction/purge follow role, retention, legal-hold, dependency, confirmation, and audit rules; routine permanent delete is absent.
- Exports are tenant/role/visibility scoped, injection-safe, expiry-controlled, and audited.
- Empty/loading/error/no-access/sandbox/draft/queued/sending/delivered/bounced/failed states render accessibly.
- Typecheck, lint, unit, integration, security, tenant-isolation, queue/idempotency, provider-event, inbound-threading, consent/suppression, attachment, retention, cache, and production-build tests pass.

At the end of approved implementation, provide:
- Summary of changes
- Files changed
- Database migration details
- Demo-data behavior
- Sender-domain/deliverability plan
- Transport/queue/failover plan
- Backfill/data cleanup plan
- Retention plan
- Rollback plan
- Test results
- Manual verification checklist
- Known limitations
- “WAITING FOR APPROVAL FOR THE NEXT PHASE.”


USER & ROLES: ____________________________________________________________________________________________
This Users & Roles page is a **high-risk administrative control surface**. It has a clear purpose and shows role, 2FA, account status, and administrative actions, but it should not be considered production-ready until privilege escalation, recovery flows, tenant separation, session revocation, and auditability are verified. [localhost](http://localhost:3000/admin/users)

## What works

The page clearly identifies itself as **Identity & User Management**, separates administrators from client-portal users, and exposes useful security states such as `ENFORCED`, `PENDING`, and `ACTIVE`. [localhost](http://localhost:3000/admin/users)

The development-environment banner is helpful, especially because the page contains administrative identities and privileged controls. However, the sandbox must be enforced server-side so test users cannot affect real accounts or authentication systems. [localhost](http://localhost:3000/admin/users)

## Immediate blockers

| Current item | Risk | Required correction |
|---|---|---|
| `SUPER_ADMIN` and `ADMIN` roles | Broad labels may hide excessive permissions | Define granular capabilities and display effective permissions |
| “Reset 2FA” | Can become an account-takeover path | Require recent re-authentication, step-up MFA, reason, confirmation, recovery policy, and immutable audit event |
| “Issue Temp Pass” | Temporary credentials can be intercepted, reused, or forgotten | Prefer one-time expiring recovery links; never display passwords; force MFA/password setup on first use |
| 2FA `PENDING` with `ACTIVE` status | Active accounts without completed MFA may access privileged areas | Use `MFA_SETUP_REQUIRED` or restrict access until enrollment completes |
| Duplicate Alex Rivera admin accounts | Possible fixture duplication, account confusion, or identity-collision risk | Show immutable user ID, verified identity, created date, last login, and clearly distinguish test accounts |
| Visible email addresses | Sensitive identity information exposed to every admin viewer | Mask by role where possible and avoid exposing client emails in broad lists |
| “Invite Admin” | High-impact privilege-granting action | Use approved role templates, invitation expiry, domain/organization checks, and two-person approval for privileged roles |
| “Quick Create” | Ambiguous and potentially dangerous | Replace with explicit actions: **Invite staff user**, **Invite client user**, or **Create service account** |
| “Refresh Users” | Could imply live synchronization without a defined source | Show the actual data source and last refresh time |
| “Client Portal Users” | May mix external identities with internal staff | Separate identity domains, organizations, permissions, and lifecycle policies |
| `ACTIVE` status | Too broad; does not distinguish invited, locked, suspended, deactivated, or pending deletion | Add explicit lifecycle states |
| No visible last login/session information | Makes compromised or abandoned accounts difficult to identify | Show last login, last authentication method, active sessions, and session-revocation controls |
| No obvious disable/revoke action | Lost or compromised accounts may remain usable | Add **Suspend**, **Deactivate**, **Revoke sessions**, and emergency lockout workflows |
| Admin identity management | Changes can affect every module | Require least privilege, approval, audit logging, and prevention of self-lockout |
| Development fixture users | Test accounts could receive real credentials or reach real data | Server-block fixture accounts from production and real authentication/provider paths |

The page currently displays six administrator records, including multiple similarly named Alex Rivera accounts, two `SUPER_ADMIN` accounts, four accounts with enforced 2FA, and two accounts with pending 2FA. [localhost](http://localhost:3000/admin/users)

## Safer account lifecycle

```text
INVITED
→ INVITATION_ACCEPTED
→ MFA_SETUP_REQUIRED
→ ACTIVE
→ SUSPENDED
→ DEACTIVATED
→ PURGE_PENDING
→ PURGED
```

Additional states should be explicit:

```text
LOCKED
PASSWORD_RESET_REQUIRED
MFA_RESET_PENDING_REVIEW
SERVICE_ACCOUNT
DEMO_ONLY
```

Rules:

- `MFA_SETUP_REQUIRED` users should not receive unrestricted admin access.
- Suspension immediately revokes sessions, refresh tokens, API tokens, active password-reset links, and pending invitations.
- Deactivation preserves audit history but blocks authentication.
- Purging requires retention and legal-hold checks; do not delete the identity if audit records depend on it.
- Demo accounts must be marked `DEMO_ONLY` and rejected by production authentication and authorization.

## Role model

Avoid relying only on `ADMIN` and `SUPER_ADMIN`. Use capability-based permissions such as:

```text
users.view
users.invite
users.suspend
users.revoke_sessions
users.reset_mfa
users.issue_recovery
roles.assign
roles.manage
audit_logs.view
client_users.manage
billing.view
billing.manage
production_settings.manage
```

High-risk capabilities should be separated:

- Reset MFA.
- Issue account recovery.
- Assign `SUPER_ADMIN`.
- Modify authorization policies.
- Manage production settings.
- View sensitive audit logs.
- Export user or client data.

A user should not be able to grant themselves additional permissions, assign a role they do not possess, or remove the final active security administrator. Privileged changes should require re-authentication and, ideally, approval from another authorized administrator.

## Secure recovery controls

For **Reset 2FA**:

1. Require recent password/MFA authentication.
2. Display the affected user and organization clearly.
3. Require a reason and confirmation.
4. Invalidate existing sessions and recovery tokens.
5. Mark the account `MFA_SETUP_REQUIRED`.
6. Send a security notification through a trusted channel.
7. Require new MFA enrollment before privileged access resumes.
8. Write an immutable audit event containing actor, target, reason, timestamp, and result.

For **Issue Temp Pass**, replace passwords with a single-use, short-lived recovery link. If a temporary password must exist, generate it server-side, show it once, prevent logging/storage in plaintext, expire it quickly, require immediate rotation, and block sensitive actions until MFA is configured.

## Tenant and identity separation

The page distinguishes administrators from client-portal users, but the backend must enforce that separation on every route and mutation—not only through tabs or labels. [localhost](http://localhost:3000/admin/users)

Check all of the following:

- Admin users cannot be accidentally exposed through client APIs.
- Client users can manage only identities in their own organization.
- A client user cannot invite an administrator or alter staff roles.
- Organization membership changes revoke permissions immediately.
- Role changes invalidate cached authorization decisions and active sessions where appropriate.
- User IDs, invitation IDs, organization IDs, and role IDs are not trusted from browser input.
- Search, pagination, exports, counts, caches, notifications, and audit logs are organization-scoped.
- Service accounts are separately identified, restricted, rotated, and prevented from interactive login unless explicitly required.

## Better table

```text
Identity and access
Manage authorized staff and client users with audited, least-privilege controls.

Data mode: Development sandbox
Last refreshed: [server timestamp]
[Invite staff] [Invite client user] [Filter] [Search]
```

Recommended columns:

```text
Name / masked email
Account type
Organization
Role profile
MFA state
Account state
Last login
Active sessions
Invitation expiry
Created
Actions
```

Recommended actions:

```text
View access
Edit role
Suspend
Revoke sessions
Reset MFA
Resend invitation
View audit history
```

Place destructive or security-sensitive actions behind confirmation dialogs. Each dialog should state the exact effect, whether sessions and tokens will be revoked, whether the user will be notified, and what recovery path remains.

## Demo-data handling

The page contains obvious test-style identities, including addresses with `admin_e2e` and `admin_ai_tester` patterns. Treat these as fixtures until explicitly verified otherwise; they should be impossible to use against real authentication, email, client data, API tokens, or production settings. [localhost](http://localhost:3000/admin/users)

Use server-side protections:

- Environment-gate demo identities.
- Add a `demoOnly` or equivalent immutable marker.
- Reject demo accounts in production login and invitation flows.
- Prevent them from receiving real recovery email or MFA challenges.
- Exclude them from client-facing user counts, reports, exports, analytics, and audit summaries.
- Make test-user creation available only in explicitly isolated development environments.

## Priority before production

1. Replace broad role labels with granular, auditable permissions.  
2. Prevent active access while MFA is pending for privileged users.  
3. Harden MFA reset and temporary-access recovery with step-up authentication, expiry, session revocation, and audit trails.  
4. Add suspend, deactivate, revoke-session, and account-lockout controls.  
5. Separate staff, client, service, and demo identities at the schema and authorization layers.  
6. Add last-login, active-session, invitation, and recovery status visibility.  
7. Require approval or strong safeguards for `SUPER_ADMIN` assignment.  
8. Ensure test identities cannot reach real authentication, mail, data, or production configuration.  

The page is a reasonable administrative starting point, but its current controls are powerful enough that a mistake in 2FA reset, temporary credentials, role assignment, or tenant scoping could compromise the entire application. [localhost](http://localhost:3000/admin/users)

AUDIT LOGS PAGE: ____________________________________________________________________________________________________________________

This Audit Logs page is **high-risk and currently misleading**. It presents itself as an “IMMUTABLE AUDIT TRAIL” and “SECURITY COMPLIANCE ENCLAVE,” but the visible records look like simulated development data, including localhost addresses and a “System Daemon” actor.[9]

## What works

The page has the right basic purpose: it centralizes security and system events with timestamps, actions, actors, IP addresses, and metadata inspection. The visible events include an admin login, lead conversion, and session rotation.[9]

The development-environment banner also clearly says that metrics, notifications, and integrations are simulated and that live customer data is isolated. That should be reflected in the page title and behavior, rather than paired with absolute claims of immutability and compliance.[9]

## Immediate blockers

| Current item | Risk | Required correction |
|---|---|---|
| “IMMUTABLE AUDIT TRAIL” | May be false if records can be edited/deleted by administrators or database operators | Use **Audit event history** until append-only guarantees are verified |
| “SECURITY COMPLIANCE ENCLAVE” | Implies compliance certification and strong isolation | Remove unless supported by a defined compliance framework and evidence |
| “Inspect Metadata” | Could reveal credentials, tokens, request bodies, private URLs, or personal data | Show a redacted, role-scoped metadata view with field allowlists |
| `127.0.0.1` | Indicates local/demo traffic, not meaningful production client IP evidence | Label as **Development source** or suppress IP display in demo mode |
| `System Daemon` / `internal` | Ambiguous actor identity | Use a stable service identity and show the job/service name |
| No event ID | Makes individual events difficult to reference or verify | Add an immutable event ID and correlation/request ID |
| No filters or search visible | Makes incident investigation inefficient | Add event type, actor, resource, organization, time range, outcome, and correlation filters |
| No pagination or retention indicator | Large logs can become slow or impossible to review | Add cursor pagination, retention status, archival state, and export controls |
| “ADMIN_LOGIN_SUCCESS” | Login events need outcome, authentication method, session/device context, and risk result | Add structured authentication metadata with sensitive fields redacted |
| “LEAD_CONVERTED_TO_CLIENT” | Lacks target/resource identity and before/after context | Show authorized resource summary and linked correlation ID |
| “SESSION_ROTATED” | Session security events need reason and affected scope | Show safe session event details without exposing session tokens |
| Visible administrator email | Sensitive identity data may be exposed too broadly | Mask or restrict actor details based on role |
| IP address column | Personal data and potentially sensitive infrastructure data | Apply access controls, retention policy, masking, and region/legal requirements |
| Development records | Can contaminate production audit reports or compliance evidence | Hard server-side separation between demo and production event stores |

The displayed records are timestamped around September 15, 2026 and include `admin@cyberstyle.net`, localhost `127.0.0.1`, and an internal system actor, all consistent with sandbox or development fixtures rather than verified production evidence.[9]

## What an audit event needs

A useful event should contain structured fields such as:

```text
Event ID: evt_...
Occurred at: server timestamp
Action: ADMIN_LOGIN_SUCCESS
Outcome: SUCCESS
Actor: user_...
Actor type: HUMAN
Organization: org_...
Resource: user_...
Resource type: USER
Request/correlation ID: req_...
Authentication method: PASSWORD + TOTP
Source: DEVELOPMENT
IP: masked or restricted
User agent: redacted summary
Reason: optional/required by action
Metadata: allowlisted and redacted
```

Do not store unrestricted request bodies, authorization headers, cookies, passwords, MFA secrets, access tokens, full payment details, raw email contents, or arbitrary external response data in audit metadata.

## Append-only design

“Immutable” should mean more than hiding an edit button. Use:

- Server-side event creation only; no ordinary update route.
- No standard delete route.
- Append-only database permissions for the application role.
- Restricted archival/purge process governed by retention and legal hold.
- Stable event IDs, timestamps, actor/resource references, and correlation IDs.
- Hash chaining or signed event batches if tamper evidence is genuinely required.
- Separate, protected storage or export sink for high-value security events.
- Alerts for attempted modification, deletion, bulk export, clock anomalies, and logging failures.
- A documented policy for correcting mistakes: append a compensating event rather than altering the original.

If operators or database administrators can directly modify the table, the page should say **tamper-evident** only if detection controls exist—not “immutable.”

## Required event coverage

The log should capture security-sensitive events across the application:

- Login success/failure, logout, password reset, MFA enrollment/reset/failure.
- Session creation, rotation, revocation, timeout, and suspicious reuse.
- Invitation creation, acceptance, expiry, cancellation, and resend.
- Role, permission, organization-membership, and client-access changes.
- User suspension, reactivation, deactivation, and recovery actions.
- Message sends, internal notes, edits, redactions, exports, and attachment access.
- Email queueing, provider responses, bounces, complaints, suppression, and inbound webhook processing.
- Monitoring target creation, execution, incident changes, and sensitive diff access.
- SEO audit scope approval, evidence access, finding verification, and exports.
- Invoice, payment, proposal, client, project, and financial-record changes.
- Settings, integration, API key, webhook, and sender-profile changes.
- Export creation/download, privileged searches, bulk actions, and audit-log access itself.

Each event needs a defined action taxonomy. Avoid arbitrary free-form action names that make detection and reporting inconsistent.

## Access control

Audit logs are sensitive because they reveal user behavior, clients, infrastructure, and security events. Implement separate capabilities:

```text
audit.view
audit.view_sensitive_metadata
audit.export
audit.manage_retention
audit.verify_integrity
audit.view_cross_organization
```

Rules:

- Most staff should see only events for their organization and permitted resources.
- Client users should see only explicitly approved client-visible activity, not the global audit log.
- Viewing sensitive metadata should itself create an audit event.
- Export requires reason, scope, expiration, watermark/classification where appropriate, and download logging.
- Search, filters, counts, pagination, exports, and cached responses must use the same authorization scope.
- Never trust organization, actor, resource, or date-range filters supplied by the browser.

## Better UI

```text
Audit event history
Review security and operational events. Records are append-only under the configured retention policy.

Data mode: Development sandbox
Source: Simulated events
Last event: [server timestamp]

[Search] [Action] [Actor] [Resource] [Outcome] [Organization] [Time range]
```

Recommended table columns:

```text
Time
Action
Outcome
Actor
Resource
Organization
Source
Correlation ID
Details
```

For every row, provide:

```text
Event ID
Server timestamp and timezone
Actor type
Resource type/identifier
Safe metadata
Redaction indicator
Retention/archival state
Integrity status
```

Use clear states such as:

```text
Simulated
Recorded
Archived
Redacted
Integrity check pending
Integrity verified
```

Avoid “compliance” or “immutable” badges unless the system can substantiate them.

## Priority before production

1. Replace absolute “immutable” and “security compliance” claims with accurate source and integrity states.  
2. Separate demo events from production audit storage and reports at the server level.  
3. Add stable event IDs, correlation IDs, structured outcomes, resource references, and source/environment labels.  
4. Redact sensitive metadata and restrict actor/IP visibility by capability.  
5. Make events append-only, remove routine deletion/editing, and use compensating events for corrections.  
6. Add tenant-aware search, pagination, retention, export, and access logging.  
7. Capture authentication, authorization, data-access, messaging, email, monitoring, finance, and integration events consistently.  
8. Ensure viewing sensitive audit details generates its own audit record.  

The page is a good starting shell, but its current language overstates what the visible data proves. Treat it as a **development audit-event viewer** until append-only storage, integrity verification, tenant-scoped access, redaction, retention, and comprehensive event coverage are implemented.[9]


SETTINGS PAGE:

This Settings page is **a high-impact control panel and should not be considered production-ready yet**. It contains organization identity, authentication-policy switches, and integration-status claims, but the development banner conflicts with labels such as **Stripe CONNECTED**, **Nodemailer SMTP ACTIVE**, and **Gemini AI Engine READY**. [localhost](http://localhost:3000/admin/settings)

## What works

The page concentrates important configuration in one place:

- Legal agency name.
- Primary production domain.
- Mandatory first-login TOTP enforcement.
- Server-side session rotation after password or 2FA changes.
- Integration health indicators.
- A clearly visible development-environment notice. [localhost](http://localhost:3000/admin/settings)

The two security defaults are sensible: requiring administrator TOTP before dashboard access and rotating sessions after password changes or 2FA resets. They still need server-side enforcement; a checked checkbox alone is not a security control. [localhost](http://localhost:3000/admin/settings)

## Immediate blockers

| Current item | Risk | Required correction |
|---|---|---|
| `CYBERSTYLE LLC` editable legal name | May alter contracts, invoices, emails, reports, or legal documents | Add change impact warning, authorization, audit event, and effective-date history |
| `cyberstyle.net` editable production domain | Can affect links, callbacks, email sender identity, OAuth redirects, cookies, CORS, and public URLs | Require domain verification, DNS/ownership proof, environment separation, and staged rollout |
| “Strict First-Login TOTP 2FA Enforcement” | UI state may not match actual middleware enforcement | Enforce on every privileged route and server action; show policy version and effective scope |
| “Automatic Server-Side Session Rotation” | Session revocation may be incomplete | Revoke/rotate sessions, refresh tokens, API tokens, remembered devices, and cached authorization state |
| Stripe `CONNECTED` | Could imply real payment access in a sandbox | Show environment, account ID suffix, capability state, last health check, and test/live mode |
| Nodemailer SMTP `ACTIVE` | Could permit real outbound email despite sandbox status | Show transport mode and enforce sandbox recipient allowlists |
| Gemini `READY` | Could imply live AI access and unrestricted data processing | Show provider, model policy, data-sharing status, quota, last check, and disabled/sandbox state |
| “Save System Configuration” | One broad save action can change unrelated security and integration settings together | Separate settings by risk, require per-section validation and confirmation |
| No visible change history | Security settings need traceability | Add before/after audit events, actor, reason, timestamp, effective time, and rollback |
| No environment selector | Production and development settings can be confused | Make environment explicit and server-derived; never allow a browser field to select production |
| No re-authentication | Changing domain, identity, authentication, or integrations is privileged | Require recent step-up authentication and possibly second-admin approval |
| No pending/failed state | Saves and integrations may be asynchronous | Show `PENDING`, `APPLYING`, `ACTIVE`, `DEGRADED`, `FAILED`, and `ROLLBACK_REQUIRED` |
| Broad “service health” label | A configured credential does not prove the service works end-to-end | Show the exact checked capability and last verified time |

The current page reports the sandbox as operational while displaying Stripe as connected, Nodemailer as active, and Gemini as ready. Those statuses must be environment-aware and backed by verified server-side health checks. [localhost](http://localhost:3000/admin/settings)

## Safer settings model

Separate configuration into distinct domains:

### Agency identity

```text
Legal name
Public display name
Primary domain
Support email
Billing address
Invoice identity
Effective date
Verification state
```

### Authentication policy

```text
MFA requirement
Allowed MFA methods
Session lifetime
Refresh-token lifetime
Session rotation policy
Recovery policy
Remembered-device policy
```

### Integration connections

```text
Provider
Environment: Sandbox / Test / Production
Connection state
Account or mailbox suffix
Granted scopes/capabilities
Credential expiry/rotation state
Last health check
Owner
```

### Delivery and AI policy

```text
Outbound email mode
Allowed recipients
AI data-sharing policy
Permitted data classes
Model/provider restrictions
Quota/rate limits
Retention policy
```

Do not put irreversible identity, security, payment, email, and AI changes behind one undifferentiated save button.

## Authentication requirements

For the TOTP policy:

- Enforce it in server middleware and privileged server actions.
- Require enrollment before access to sensitive modules, not merely before the dashboard shell.
- Ensure recovery and MFA-reset flows cannot bypass the policy.
- Require step-up authentication for settings changes.
- Revoke active sessions and refresh tokens when a user’s MFA state or role changes.
- Test API routes, background jobs, exports, client portal routes, and direct deep links—not just navigation from the dashboard.
- Show who changed the policy, what changed, when it takes effect, and whether existing users are grandfathered.

For session rotation, define whether the policy invalidates:

```text
Browser sessions
Refresh tokens
Remembered devices
API tokens
Service credentials
WebSocket/SSE connections
Cached permission decisions
```

The visible text currently says session tokens are invalidated after password change or 2FA reset, but does not state whether refresh tokens, remembered devices, API credentials, or other sessions are covered. [localhost](http://localhost:3000/admin/settings)

## Integration safety

### Stripe

Show:

```text
Stripe
Environment: Test
Account: acct_••••1234
Capabilities: Payments / Connect
Last health check: [timestamp]
Status: Test connection verified
```

Prevent test credentials from creating real charges, transfers, refunds, invoices, or webhook side effects. Verify webhook signatures, enforce idempotency, and keep live/test account identifiers separate.

### SMTP

“ACTIVE” is insufficient. Show whether the connection is:

```text
Sandbox capture
Allowlisted test delivery
Production delivery disabled
```

Store credentials only in server-side secret management. Never expose passwords, OAuth tokens, connection strings, or provider responses through the settings page, logs, browser payloads, or audit metadata.

### Gemini

“READY” should not imply that arbitrary CRM records, emails, client messages, page content, or financial data can be sent to an AI provider. Define:

- Which modules may call the provider.
- Which data classes may leave the application.
- Whether prompts/responses are retained.
- Whether client authorization is required.
- Which users may invoke AI.
- Rate and spend limits.
- Model/version pinning.
- Failure and fallback behavior.
- Prompt-injection and untrusted-content handling.

Use a status such as **Sandbox provider configured — live client data disabled** until those controls are verified.

## Better UI

```text
System settings
Manage organization identity, authentication policy, and approved integrations.

Environment: Development sandbox
Live customer data: Isolated
Last configuration change: [timestamp]
[View change history]
```

Cards should be separated:

```text
Agency identity
[Edit identity]

Authentication policy
MFA: Enforced
Session rotation: Enforced
[Review policy]

Payment integrations
Stripe: Test connection verified
[Manage connection]

Email delivery
SMTP: Sandbox capture only
[Manage transport]

AI services
Gemini: Sandbox / client data disabled
[Manage AI policy]
```

Each section should have its own save flow, validation, impact warning, and audit event.

## Configuration-change workflow

```text
DRAFT
→ PENDING_REAUTHENTICATION
→ PENDING_APPROVAL
→ APPLYING
→ ACTIVE
```

Failure path:

```text
APPLYING
→ FAILED
→ ROLLBACK_REQUIRED
→ ROLLED_BACK
```

Every change should record:

```text
Setting name
Old value and new value, with secrets redacted
Actor
Reason
Environment
Approval, if required
Effective time
Result
Rollback reference
Correlation ID
```

Sensitive values should be write-only. The UI should display only metadata such as “configured,” “expires soon,” or a masked account suffix—not the secret itself.

## Priority before production

1. Make environment and integration status server-derived and explicit.  
2. Replace `CONNECTED`, `ACTIVE`, and `READY` with capability-specific health states.  
3. Require re-authentication and audit logging for every privileged settings change.  
4. Separate identity, authentication, payment, email, and AI configuration into independent workflows.  
5. Verify TOTP and session rotation in middleware, APIs, background jobs, and recovery paths.  
6. Keep Stripe, SMTP, and Gemini in sandbox/test mode until live-data and side-effect controls are verified.  
7. Add configuration history, approval, rollback, secret redaction, and failure states.  
8. Prevent demo settings and test integrations from affecting real email, payments, AI processing, or public domains.  

This page is a good foundation, but it is effectively a **root-control panel**. A mistaken domain change, integration activation, or authentication-policy edit could affect the whole application, so every setting needs explicit scope, re-authentication, auditability, and rollback. [localhost](http://localhost:3000/admin/settings)
