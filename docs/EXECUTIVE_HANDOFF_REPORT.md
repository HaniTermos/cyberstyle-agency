# CYBERSTYLE Agency OS — Executive Handoff & Technical Architecture Report

**Prepared for:** Team Lead & Executive Engineering Leadership  
**Project:** CYBERSTYLE Full-Stack Agency Operating System  
**Date:** September 10, 2026  
**Status:** Feature-Complete, Database-Connected, Verified

---

## 1. Executive Summary

CYBERSTYLE Agency OS is an all-in-one, enterprise-grade digital agency platform built to unify client acquisition, automated lead qualification, proposal generation, Stripe billing, milestone-driven delivery, real-time messaging, monthly client reporting, automated website monitoring, and OpenSEO tracking.

The system is organized as a monorepo consisting of:
- **`apps/web`**: Next.js 15 (React 19, TypeScript, Tailwind CSS, Lucide Icons, Cyberpunk Dark Aesthetic) providing both the **Public Agency Showcase**, **Executive Admin Operations Console**, and **Client Collaboration Portal**.
- **`apps/api`**: Express.js, TypeScript, Prisma ORM, PostgreSQL, Redis/BullMQ, Nodemailer (Google/Custom SMTP), Stripe SDK, PDFKit, and Google Gemini AI integration.
- **`packages/config`**: Shared Zod schemas, type definitions, and environment validation tokens.
- **`googleMapsScraper.js`**: Tampermonkey Userscript browser research assistant with automated USA multi-city niche scanner, auto-feed harvester, and direct 1-click CRM synchronization.

---

## 2. Complete Page & Module Directory

### A. Public Client-Facing Portal
| Route | Feature & Purpose |
| :--- | :--- |
| `/` | Hero section, dynamic 3D Silk background, animated service tiers, interactive packages, social proof, and instant conversion triggers. |
| `/services` | Detailed breakdown of agency capabilities (Next.js 15 web engineering, AI automations, 3D configurators, custom SaaS). |
| `/case-studies` | Interactive portfolio showcase displaying deliverables, architecture diagrams, and client ROI metrics. |
| `/pricing` | Transparent pricing calculators, scope estimators, and deposit checkout flows. |
| `/contact` | Lead capture intake form storing submissions directly into PostgreSQL with automated admin notifications. |
| `/reviews` | Verified client testimonials and rating submissions with moderation gates. |

---

### B. Executive Operations Console (`/admin`)
| Route | Capabilities & Database Controls |
| :--- | :--- |
| `/admin/dashboard` | Executive command center with real-time financial KPIs (MRR, Pipeline Value, Invoices Paid/Due, Conversion Rate), active projects, milestone radar, and quick audit ledger. |
| `/admin/leads` | **High-Converting Growth & Opportunity Pipeline**: 7 real-time deficit KPI cards (Total Leads, No Website %, Social Only, No Socials, Digital Ghosts, HOT 80+ Score, Contact Ready), interactive filter chips, multi-angle AI pitch generator drawer, AI auto-scoring, and 1-click project conversion. |
| `/admin/proposals` | Proposal authoring engine with human approval gate (`DRAFT` → `REVIEW` → `APPROVED` → `SENT`), scope items, investment tiers, and 1-click client delivery. |
| `/admin/invoices` | Billing ledger with Stripe payment checkout sessions, manual bank wire settlement, and **PDFKit binary PDF invoice download engine**. |
| `/admin/payments` | Stripe transaction audit log, dispute tracking, and payment method verification. |
| `/admin/clients` | Organization tenant directory, assigned client account users, active contracts, and aggregate spend telemetry. |
| `/admin/projects` | Delivery engine with Kanban board (`TODO`, `IN_PROGRESS`, `WAITING_ON_CLIENT`, `DONE`), milestone progression, and automated **Health Scoring Engine (0–100 score with deduction factors)**. |
| `/admin/retainers` | Monthly retainer contracts, allocated hours vs logged hours, SLA tracking, and recurring billing sync. |
| `/admin/reports` | Automated monthly client delivery rollups, executive summaries, deliverable logs, and printable/downloadable executive reports. |
| `/admin/messages` | Multi-context threaded communication hub (`PROJECT`, `LEAD`, `INVOICE`, `CLIENT`) with internal private notes, attachments, and real-time polling. |
| `/admin/email` | **Executive Email & Dispatch Center**: Diagnostic test dispatcher targeting `hanitormos45@gmail.com`, Google/Gmail SMTP transport manager, outgoing delivery ledger, and broadcast templates. |
| `/admin/monitoring` | Automated website uptime monitoring, HTTP status checks, visual DOM change detection, and alert logs. |
| `/admin/seo` | OpenSEO workspace with on-page SEO audits, keyword rank tracking snapshots, and competitor visibility reports. |
| `/admin/roadmap` | Agency product & feature development roadmap board with drag-and-drop status progression. |
| `/admin/reviews` | Client testimonial moderation queue (Approve, Reject, Feature on homepage). |
| `/admin/audit-logs` | Immutable security audit trail recording all admin logins, financial edits, and data mutations. |
| `/admin/settings` | System-wide configuration, API keys, webhook URLs, and organization preferences. |

---

### C. Authenticated Client Portal (`/portal`)
| Route | Features & Tenant Partitioning |
| :--- | :--- |
| `/portal/dashboard` | Tenant-isolated overview of active projects, milestone deadlines, unread messages, and outstanding balances. |
| `/portal/projects` | Milestone review and client sign-off engine. |
| `/portal/invoices` | Client invoice list with 1-click Stripe hosted checkout and PDF download. |
| `/portal/messages` | Direct client-to-agency threaded communication channel. |
| `/portal/reports` | Client view of monthly retainer rollups and SEO health metrics. |

---

## 3. Core Integrations & Technologies

```mermaid
graph TD
    A[Google Maps / Tampermonkey HUD] -->|1-Click Sync / Scrape| B(CYBERSTYLE API)
    C[Client Contact & Booking Forms] -->|Lead Capture| B
    B --> D[(PostgreSQL via Prisma)]
    B --> E[Stripe Gateway]
    B --> F[Google / SMTP Nodemailer]
    B --> G[PDFKit Engine]
    B --> H[Google Gemini AI]
    B --> I[OpenSEO & Uptime Monitors]
    B --> J[Next.js 15 Web App]
    F -->|Test & Alert Dispatch| K[hanitormos45@gmail.com]
    E -->|Webhooks & Checkout| J
```

1. **Database & ORM**: PostgreSQL database (`db_agency`) managed via Prisma with 24+ normalized models and transactional integrity.
2. **Stripe Payments**: Automated checkout session creation, webhook listeners (`checkout.session.completed`), and wire transfer ledger.
3. **Google & Business Email (Nodemailer)**:
   - Configured for Gmail SMTP (`smtp.gmail.com`) and custom business SMTP.
   - Built-in diagnostic test dispatching verified and targeting `hanitormos45@gmail.com`.
4. **PDFKit Invoice & Report Engine**: High-fidelity PDF generation streaming directly from memory to browser downloads.
5. **Google Maps Growth Intelligence Engine (`googleMapsScraper.js` v9.0.0 Unbeatable Edition)**:
   - Runs directly in Google Maps via Tampermonkey.
   - **Global Discovery Engine**: Preloaded with major metros, states, and nationwide targets across **USA, Canada, MEA & GCC (UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, Egypt, Lebanon), UK & Europe, Australia & NZ**, plus arbitrary custom global queries worldwide.
   - **Deep Data Harvester**: Extracts phone numbers, business emails, full street addresses, working hours/status, review counts, star ratings, and exact coordinates.
   - **Bidirectional Sorting**: Real-time sorting (Lowest to Highest / Highest to Lowest) by Lead Quality Score (0–100), Star Rating, Total Review Count, Name, or Date.
   - **Complete CSV & JSON Data Export**: Exports 30+ structured columns including all contact data, social media links, digital ghost tags, and tailored outreach pitch hooks.
   - **One-Click CRM Sync**: Directly synchronizes leads with the agency PostgreSQL database via `/api/v1/admin/leads`.

---

## 4. End-to-End Operational Workflows

### 1. Lead Generation & Outreach Workflow
1. Growth operator opens Google Maps and uses the **CYBERSTYLE HUD**.
2. Selects target niche (e.g., *Dentists in Austin, TX*) and clicks **Auto-Scan**.
3. HUD identifies businesses with **No Website** or **Outdated Web**.
4. Operator clicks **Push to CRM** or **Copy Pitch**.
5. Lead appears instantly in `/admin/leads` with AI qualification brief.

### 2. Proposal & Deal Closing Workflow
1. Admin generates proposal from lead brief in `/admin/proposals`.
2. Admin reviews and approves proposal.
3. System emails proposal link to client.
4. Client reviews tiers, accepts scope, and signs electronically.

### 3. Invoicing & Payment Workflow
1. Milestone-linked invoice is generated in `/admin/invoices`.
2. Client clicks Stripe Checkout link or Admin records bank wire.
3. Invoice status transitions to `PAID`.
4. Client and Admin can download official PDF receipts anytime.

### 4. Delivery, Kanban & Project Health Engine
1. Project tasks are managed across Kanban columns.
2. Project Health Score dynamically recalculates based on:
   - Overdue milestones (-15 pts)
   - Overdue invoices (-20 pts)
   - Tasks stalled in `WAITING_ON_CLIENT` (-5 pts)
   - Unanswered messages > 48h (-5 pts)
3. Band updates (`EXCELLENT`, `GOOD`, `AT_RISK`, `CRITICAL`) and logs to audit history.

---

## 5. Security & Authentication Architecture

- **Argon2id Password Hashing**: State-of-the-art resistance to GPU cracking.
- **Unified Multi-Layer Authentication**: Checks `Authorization: Bearer <token>`, `cyberstyle_session` cookie, and `localStorage`.
- **Two-Factor Authentication (2FA)**: RFC 6238 TOTP with Google Authenticator and single-use emergency backup codes.
- **Tenant Partitioning**: Client role can strictly only access records tagged with their assigned `organizationId`.
- **Immutable Audit Logging**: Captures IP address, user agent, actor ID, and exact JSON diffs for sensitive actions.

---

## 6. Current Gaps & Pre-Production Items

Before going live on a public domain, the following environment keys must be updated from local development to production:

| Item | Current Dev State | Production Requirement |
| :--- | :--- | :--- |
| **Stripe API** | Test mode (`sk_test_...`) | Replace with Live Secret Key & Webhook Secret in production `.env`. |
| **Google Workspace / SMTP** | Local Logger + Google SMTP template | Add `GMAIL_USER` & `GMAIL_APP_PASSWORD` or corporate SendGrid/SES credentials to `.env`. |
| **Google Gemini API** | Local mock fallback | Add production `GEMINI_API_KEY` for AI lead brief generation. |
| **Domain & SSL** | `localhost:3000` / `localhost:4000` | Configure custom domain (e.g. `cyberstyle.net`) with HTTPS/SSL. |

---

## 7. Production Deployment Checklist

### Step 1: Database Migration
```bash
npx prisma migrate deploy
```

### Step 2: Environment Variables
Configure the following in your production host (Vercel, Railway, AWS, or Docker):
```env
DATABASE_URL="postgresql://user:pass@host:5432/cyberstyle_prod"
JWT_SECRET="your_long_random_production_secret"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
GMAIL_USER="info@cyberstyle.net"
GMAIL_APP_PASSWORD="your_google_app_password"
EMAIL_FROM='"CYBERSTYLE Executive" <info@cyberstyle.net>'
NEXT_PUBLIC_API_URL="https://api.cyberstyle.net/api/v1"
NEXT_PUBLIC_APP_URL="https://cyberstyle.net"
```

### Step 3: Build & Launch
- **Backend API**: `npm run build` → `npm start` (Runs Node server on port 4000).
- **Frontend Web**: `npm run build` → `npm start` (Runs Next.js production server).
- **Tampermonkey Assistant**: Install `googleMapsScraper.js` into Tampermonkey on Chrome/Brave/Edge and set API URL in settings.
