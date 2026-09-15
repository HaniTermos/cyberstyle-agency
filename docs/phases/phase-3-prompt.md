# PHASE 3 — FILES, EMAIL CENTER, AND AI GOVERNANCE MASTER SPECIFICATION

You are implementing Phase 3 only. Do not change:
- Dashboard KPI layout or overview cards (already fixed in Phase 2).
- Docker, secrets, or environment validation (already fixed in Phase 1).
- Public website structure or marketing copy (already overhauled).

Your job is to secure files/media, harden email, and govern AI assistance across the CYBERSTYLE platform.

==================================================
SCOPE
==================================================

1. FILE AND MEDIA SECURITY

Applies to: /admin/media, /portal/files, and all upload/download flows used by projects, deliverables, and messages.

Implement:

- Private-by-default storage.
- Upload quarantine:
  - Validate filename, size, MIME signature, and type.
  - Reject executables and disallowed formats.
  - Archive/zip limits and basic bomb protection.
- Malware scanning hook:
  - Async scanning service with states: PENDING_SCAN, CLEAN, FLAGGED, REJECTED.
  - Do not mark files as client-visible until CLEAN.
- Version history:
  - Each upload creates a new version with:
    - checksum (SHA-256)
    - creator userId
    - organizationId
    - projectId (if applicable)
    - folder taxonomy (project-plan, design-review, content-brand, previews, invoices-agreements, launch-handover, archive)
    - visibility (CLIENT_VISIBLE, INTERNAL_ONLY)
    - retention policy reference
    - scan state
- Short-lived signed URLs:
  - No direct object storage exposure.
  - Authorized download endpoint issues expiring URLs only after permission checks.
  - URLs must expire within minutes and be single-use if practical.
- Access logging and audit events:
  - Log who accessed which file version and when.
  - Log uploads, scan state changes, visibility changes, and deletions.
- Folder taxonomy:
  - Enforce allowed folders per project.
  - Never place backups, secrets, raw production exports, or repositories in standard client folders.

Dashboard impact:
- /admin/media becomes a secure, versioned, scanned library.
- /portal/files uses the same secure flow for client-visible files.
- No “secure vault” claims without real quarantine/signing/scanning.

2. EMAIL CENTER HARDENING

Applies to: /admin/email, /admin/email-center, and all automated notifications.

Implement:

- Template versioning and approval:
  - EmailTemplate model with versions and an approved flag.
  - Only approved templates can be used in production sends.
- Delivery state machine:
  - States: SENT, DELIVERED, BOUNCED, COMPLAINED, FAILED.
  - Track per-message events with timestamps and error codes.
- Failure handling and retries:
  - Exponential backoff, max retries, dead-letter queue for permanent failures.
- Duplicate prevention:
  - Idempotency keys for outbound campaigns and bulk sends.
- Basic bounce/suppression handling:
  - Suppression list for hard bounces and complaints.
  - Do not send to suppressed addresses without explicit manual override and audit.
- Human approval gate:
  - Outbound campaigns to clients/prospects require explicit human approval.
  - No fully automated bulk outreach.
- Audit logging:
  - Every sent message logged with:
    - template version
    - recipient
    - reason/context
    - actor userId
    - campaign id (if applicable)

Dashboard impact:
- /admin/email-center is no longer a potential spam/data-leak risk.
- Any “email performance” data shown in admin is based on real delivery states, not invented metrics.

3. AI GOVERNANCE & GUARDRAILS

Applies to: AI-assisted lead scoring, draft outreach, proposal outlines, content assistance, and any AI features in admin.

Implement:

- Clear “AI-generated draft” labels:
  - In API responses and UI for any AI-assisted content.
- Human approval required before:
  - Sending messages.
  - Publishing content.
  - Changing CRM state (lead status, project status).
  - Creating/modifying invoices or payments.
  - Changing permissions or deleting records.
- Minimal data to AI:
  - No unnecessary PII, secrets, or full message contents.
  - Summarize or redact before sending to AI where practical.
- Tenant/permission checks before RAG:
  - AI cannot retrieve data the user isn’t allowed to see.
  - Enforce organization scoping on any retrieval-augmented generation.
- Basic prompt-injection defenses:
  - Treat file contents, messages, forms, and imported leads as untrusted.
  - Do not allow user-provided text to override system instructions.
- Usage logging:
  - Log AI calls per tenant and feature:
    - model, feature, tenant, timestamp, token usage (if available).
  - Do not store sensitive prompt contents unnecessarily.
- Budget/rate limits:
  - Per-tenant and per-feature limits.
  - Graceful fallback when limits are exceeded.

Dashboard impact:
- Any AI scores, drafts, or suggestions in /admin/leads, /admin/proposals, /admin/messages, etc. are clearly labeled and safely governed.
- No hidden autonomous AI actions changing state or sending communications.
