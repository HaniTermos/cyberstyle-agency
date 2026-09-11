# CYBERSTYLE Agency OS — Master Dashboard & System Architecture Report

**Version:** 2.0 Enterprise  
**Generated:** September 2026  
**Architecture:** Next.js 15 App Router (Frontend) + Express TypeScript (API) + PostgreSQL / Prisma ORM + Redis / BullMQ + Stripe + Google Analytics 4 / Google Search Console / Gmail API

---

## Executive Summary

CYBERSTYLE Agency OS is an integrated, full-cycle digital agency management platform designed specifically for high-ticket web engineering, generative AI automation, and interactive 3D WebGL experiences. It unifies:
1. **High-converting public pages** with sub-second performance, JSON-LD rich snippets, and Google Analytics 4 / Google Search Console telemetry.
2. **An Executive Admin Command Center** (27+ pages) managing leads, proposals, client projects, retainers, invoices, email dispatch, content, SEO, and Generative Engine Optimization (GEO).
3. **A Self-Service Client Portal** (12+ pages) providing enterprise clients with transparent milestone tracking, Stripe-powered invoice settlements, file collaboration, and SLA monitoring.
4. **Automated Intelligence & Communication Hubs** integrating Gmail API OAuth (with Nodemailer SMTP failover), BullMQ background job queues, and real-time AI search visibility tracking across ChatGPT, Perplexity, Gemini, and Claude.

---

## 1. Complete Admin Command Center Directory

The Admin Console (`/admin`) is gated by Argon2id password hashing, JWT session cookies, and strict Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`).

### A. Overview & Strategy
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/dashboard`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/dashboard/page.tsx) | Executive command HUD displaying top-line metrics: MRR, active clients, pipeline valuation, project SLA status, and recent activity streams. | `GET /api/admin/metrics`, PostgreSQL `Project`, `Invoice`, `Lead` tables. | Quick links to new proposals, lead conversions, system health indicators, real-time alert dispatch. |
| [`/admin/roadmap`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/roadmap/page.tsx) | Strategic agency product roadmap and architectural development milestones. | Static & PostgreSQL `RoadmapItem`. | Track quarter-by-quarter deliverables (Q1-Q4), feature statuses (`PLANNED`, `IN_PROGRESS`, `SHIPPED`), priority reordering. |

### B. CRM & Lead-to-Proposal Pipeline
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/leads`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/leads/page.tsx) | High-ticket inbound lead management, Tampermonkey Google Maps scraper ingestion, and qualification scores. | `Lead`, `LeadAudit` tables via `/api/admin/leads`. | Filter by qualification score (0-100), stage transitions (`NEW` &rarr; `CONTACTED` &rarr; `QUALIFIED` &rarr; `PROPOSAL_SENT` &rarr; `WON`), quick compose email, Tampermonkey bulk scraper sync. |
| [`/admin/proposals`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/proposals/page.tsx) | Interactive client proposal generation, scope-of-work formulation, and acceptance status. | `Proposal`, `ClientOrganization` via `/api/admin/proposals`. | Create tiered scopes ($15k / $35k / $75k), attach PDF contracts, generate unique shareable token links for client approval, auto-convert accepted proposals into active `Projects`. |
| [`/admin/contacts`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/contacts/page.tsx) | Inbound public form submissions from the `/contact` and `/start-project` funnels. | `ContactSubmission` via `/api/admin/contacts`. | Review incoming project inquiries, budget selections, technical requirements; 1-click convert into active CRM `Lead`. |
| [`/admin/clients`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/clients/page.tsx) | Multi-tenant organization profiles, key stakeholder contacts, and lifetime value (LTV). | `ClientOrganization`, `User` via `/api/admin/clients`. | Provision client portal access, manage client domain associations, review active contracts and historical invoices. |

### C. Delivery & Engineering
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/projects`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/projects/page.tsx) | Technical delivery oversight for active web and AI builds. | `Project`, `User` via `/api/admin/projects`. | Track project health, repository links, staging URLs, budget burn rate, assigned engineers, project stage progression. |
| [`/admin/milestones`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/milestones/page.tsx) | Granular sprint deliverables, sign-off gates, and escrow trigger points. | `Milestone`, `Project` via `/api/admin/milestones`. | Set milestone due dates, approve deliverables, trigger automated client notification emails and milestone invoices. |

### D. Finance & Revenue Operations
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/invoices`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/invoices/page.tsx) | Enterprise billing, Stripe PaymentIntent generation, and NET-30 aging reports. | `Invoice`, `ClientOrganization` via `/api/admin/invoices`. | Generate itemized invoices, auto-calculate tax/discounts, generate Stripe checkout sessions, trigger automated overdue reminders. |
| [`/admin/payments`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/payments/page.tsx) | Settled financial transactions, Stripe webhook event ledger, and wire transfer logs. | `Payment`, `Invoice` via `/api/admin/payments`. | View Stripe settlement IDs, fee breakdowns, net payouts, refund processing, manual bank wire reconciliations. |
| [`/admin/retainers`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/retainers/page.tsx) | Recurring monthly engineering retainers, SLA maintenance agreements, and hour rollover. | `Retainer`, `ClientOrganization` via `/api/admin/retainers`. | Track allocated vs used engineering hours, monthly billing cycle renewers, SLA response guarantees (e.g. 2-hour emergency window). |
| [`/admin/reports`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/reports/page.tsx) | Revenue analytics, EBITDA estimates, cash flow forecasting, and project profitability. | Aggregate financial queries via `/api/admin/reports`. | Export CSV/PDF financial summaries, filter by client LTV, calculate gross margin per engineering tier. |

### E. Content & Brand Management
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/reviews`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/reviews/page.tsx) | Client testimonial moderation, verified rating curation, and social proof. | `Review`, `ClientOrganization` via `/api/admin/reviews`. | Approve/feature client reviews, display on public `/reviews` and home page hero slider, calculate aggregate 4.9/5 star ratings. |
| [`/admin/case-studies`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/case-studies/page.tsx) | Interactive portfolio case study editor with WebGL specimen embeds and performance stats. | `CaseStudy` table via `/api/admin/case-studies`. | Full CRUD: title, slug, client, hero media, metrics (e.g. "+340% Conversions"), tech stack badges, schema markup. |
| [`/admin/blog`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/blog/page.tsx) | Thought-leadership articles, Next.js architecture playbooks, and SEO content engine. | `BlogPost`, `User` via `/api/admin/blog`. | Markdown/HTML authoring, meta description generator, reading time calculator, publishing status (`DRAFT`, `PUBLISHED`). |
| [`/admin/faqs`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/faqs/page.tsx) | Enterprise sales FAQ management and FAQPage JSON-LD schema feeds. | `FAQ` via `/api/admin/faqs`. | Add/reorder sales objection-handling questions, categorize by pricing, technical stack, warranty, and client portal. |
| [`/admin/media`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/media/page.tsx) | Digital asset manager for hero renders, WebP images, client brand logos, and contract PDFs. | Local storage / Cloud storage ledger via `/api/admin/media`. | Upload assets, copy CDN URLs, inspect image dimensions and file sizes, delete obsolete assets. |

### F. Growth, Performance & Intelligence
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/analytics`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/analytics/page.tsx) | **Executive Analytics Cockpit**: Real-time traffic, acquisition channels, device breakdown, top 10 pages, top countries, and Google Search Console performance. | `GET /api/admin/analytics/overview`, `AnalyticsCache`, Google Analytics 4 fallback. | Switch timeframes (7/30/90 days), monitor pulse users, track conversion rates, audit top search queries and impressions. |
| [`/admin/geo`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/geo/page.tsx) | **Generative Engine Optimization (GEO) Radar**: AI Search recommendation tracker across ChatGPT, Perplexity, Gemini, and Claude. | `GeoQuery` table via `/api/admin/geo/queries`. | Track Global AI Presence Index (%), toggle model appearance citations, edit rank scores (0-100), launch LLM prompt simulation. |
| [`/admin/seo`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/seo/page.tsx) | OpenSEO auditing hub, meta tag validators, XML sitemap verification, and JSON-LD schema inspect. | Route scanners and sitemap generator via `/api/admin/seo`. | Audit canonical URLs, OpenGraph previews, robots.txt directives, and structured data validity across all public routes. |
| [`/admin/monitoring`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/monitoring/page.tsx) | Uptime telemetry, BullMQ queue health, database connection pool, and error rate monitors. | Redis queue metrics, system health probes via `/api/health`. | Inspect active/failed jobs, trigger queue flushes, view memory usage and database transaction latencies. |

### G. Communication & Email Center
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/email`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/email/page.tsx) | **Executive Email Command Hub (5 Tabs)**: Outreach composer, interactive threads, agency copy playbooks, transport settings, and delivery logs. | `EmailAccount`, `EmailThread`, `EmailMessage`, Gmail API OAuth, Nodemailer SMTP via `/api/admin/email`. | Compose targeted emails with CRM entity links, reply in existing client threads, load agency playbooks, run diagnostic tests, view audit logs. |
| [`/admin/messages`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/messages/page.tsx) | Portal direct messaging stream between agency engineers and authenticated client stakeholders. | `Message`, `User` via `/api/admin/messages`. | Send project updates, receive client feedback, attach deliverable links, maintain transparent timestamped records. |

### H. System Administration & Compliance
| Page Route | Purpose | Primary Data Sources | Key Actions & Capabilities |
| :--- | :--- | :--- | :--- |
| [`/admin/users`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/users/page.tsx) | Internal staff and client portal user account provisioning and role assignments. | `User`, `ClientOrganization` via `/api/admin/users`. | Invite admins/developers, toggle active statuses, enforce password resets, revoke session tokens. |
| [`/admin/audit-logs`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/audit-logs/page.tsx) | Immutable security audit trail recording all privileged actions across the platform. | `AuditLog` table via `/api/admin/audit-logs`. | Inspect IP addresses, user agents, modified entities (`GeoQuery`, `EmailThread`, `Proposal`, `Invoice`), and timestamped diffs. |
| [`/admin/settings`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/settings/page.tsx) | Global platform configurations, API credentials, SMTP fallback credentials, and brand identities. | Environment configuration & system settings table. | Toggle maintenance mode, update default billing terms, configure notification webhooks. |

---

## 2. Self-Service Client Portal Directory (`/portal`)

Designed to deliver an effortless, high-trust experience for paying clients, minimizing status-update meetings while accelerating milestone sign-offs and invoice settlements.

| Portal Route | Purpose | Key Client Capabilities |
| :--- | :--- | :--- |
| [`/portal/dashboard`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/dashboard/page.tsx) | Client Mission Control HUD | Overview of active projects, upcoming milestones, outstanding invoice balances, and dedicated account manager contact. |
| [`/portal/projects`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/projects/page.tsx) | Architectural Project Tracking | View real-time sprint progress, staging environment links, sprint backlogs, and completed deliverables. |
| [`/portal/invoices`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/invoices/page.tsx) | Financial Settlement Center | Review itemized invoices, download official PDF receipts, and settle balances instantly via Stripe card or ACH. |
| [`/portal/retainers`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/retainers/page.tsx) | Monthly Retainer Telemetry | Inspect hours used vs remaining in current cycle, request emergency sprint hours, view SLA response times. |
| [`/portal/messages`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/messages/page.tsx) | Engineering Thread Feed | Direct messaging with lead architects and project engineers without losing context in personal inboxes. |
| [`/portal/files`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/files/page.tsx) | Secure Deliverable Vault | Download Figma design systems, architectural schemas, source code ZIP exports, and NDA/contract documents. |
| [`/portal/reports`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/reports/page.tsx) | Executive Performance Rollups | Monthly Core Web Vitals, organic search ranking enhancements, conversion lifts, and uptime certificates. |
| [`/portal/feedback`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/feedback/page.tsx) | Milestone Sign-Off & Revision Requests | Submit structured change requests or approve sprint milestones with a single click. |
| [`/portal/reviews`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/reviews/page.tsx) | Testimonial Submission | Share post-launch feedback, star ratings, and project quotes to be featured on CYBERSTYLE public specimens. |
| [`/portal/notifications`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/notifications/page.tsx) | Real-time Activity Center | Immediate alerts on milestone completions, new invoice releases, and engineer message responses. |
| [`/portal/security`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/security/page.tsx) | Account Security | Manage two-factor authentication (2FA), review active portal sessions, and rotate access credentials. |
| [`/portal/profile`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(portal)/portal/profile/page.tsx) | Stakeholder Profile | Update contact details, billing email preferences, and company entity info. |

---

## 3. High-Converting Public Pages Directory (`/(public)`)

Engineered with dark-mode cyberpunk glassmorphism, Three.js canvas shaders, sub-second Core Web Vitals (LCP < 0.8s, CLS 0.00), and automated Google Analytics 4 event tracking.

| Public Route | Target Audience & Goal | Key Features & Conversion Tracking |
| :--- | :--- | :--- |
| [`/` (Home)](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/page.tsx) | Enterprise tech leaders, funded startups, and luxury brands seeking tier-1 engineering. | Hero WebGL shaders, live metrics ticker ($12M+ generated, 99.98% SLA), interactive service showcase, client testimonials, and CTA triggers. |
| [`/services`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/services/page.tsx) | Prospects evaluating specific technical capabilities. | In-depth breakdown of Next.js 15 Web Systems, AI Lead Automation & Agents, Three.js 3D WebGL, and Retainer Engineering. |
| [`/work`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/work/page.tsx) | Prospects seeking proof of technical excellence. | Interactive portfolio grid with live case studies, client ROI metrics, and WebGL specimen launchers. |
| [`/start-project`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/start-project/page.tsx) | Qualified buyers ready to request a proposal. | Multi-step interactive project builder (budget, timeline, stack preferences); dispatches `start_project_submit` GA4 event. |
| [`/contact`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/contact/page.tsx) | Direct sales inquiries and partner introductions. | Clean contact form with immediate validation, auto-lead ingestion, and `contact_form_submit` GA4 event dispatch. |
| [`/pricing`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/pricing/page.tsx) | Prospects establishing budget alignment. | Transparent project and retainer tiers ($15k starter, $35k scale, $75k enterprise custom); ROI calculator. |
| [`/reviews`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/reviews/page.tsx) | Social proof validation. | Verified client quotes, ratings breakdown, and authenticated reviews synced from the client portal. |
| [`/blog`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/blog/page.tsx) | Organic SEO & GEO authority building. | Engineering articles on Next.js 15, sub-second LCP, AI search engine optimization, and BullMQ queue patterns. |
| [`/about`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/about/page.tsx) | Brand trust & engineering philosophy. | Core team bios, architectural principles, global client presence, and quality guarantees. |
| [`/faq`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(public)/faq/page.tsx) | Sales objection handling & search rich snippets. | Expandable accordion with FAQPage JSON-LD schema for Google Search rich cards. |
| `/privacy`, `/terms`, `/cookies` | Legal compliance & trust. | Enterprise Terms of Service, GDPR/CCPA privacy policy, and cookie transparency. |

---

## 4. End-to-End Lead-to-Cash Workflow

CYBERSTYLE OS automates the complete agency lifecycle across 6 distinct phases:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 1. INGESTION    │ ----> │ 2. CRM & SCOPE  │ ----> │ 3. PROPOSAL     │
│ Public Web Form │       │ Lead Scored     │       │ Tiered Pricing  │
│ Maps Scraper HUD│       │ Email Outreach  │       │ Client Token    │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
                                                             ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ 6. RETAINER     │ <---- │ 5. SETTLEMENT   │ <---- │ 4. ONBOARDING   │
│ SLA Maintenance │       │ Stripe Pay      │       │ Portal Provision│
│ Monthly Reports │       │ Ledger Audit    │       │ Sprints Active  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

### Phase 1: Ingestion & Enrichment
- **Source A (Inbound):** Visitor navigates to `/start-project` or `/contact`, selects project scope, timeline, and budget ($25k-$50k+). The submission triggers GA4 event `start_project_submit` and creates a `ContactSubmission` record in PostgreSQL.
- **Source B (Outbound Prospecting):** Admin runs the CYBERSTYLE Google Maps Scraper HUD browser script on high-ticket target niches (e.g. "luxury architects New York" or "private clinics Dubai"). Extracted leads (with phone, email, website, and rating) stream directly to `/api/admin/leads/import`.
- **Enrichment:** Automated scoring calculates lead viability (0-100) based on domain age, budget tier, and business metadata.

### Phase 2: Qualification & Outreach
- Admin opens [`/admin/leads`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/leads/page.tsx), filters leads with score > 75, and clicks **Send Outreach**.
- The system opens the **Email Command Hub** with the "High-Ticket Cold Outreach" playbook pre-filled, automatically injecting `{{contactName}}` and `{{companyName}}`.
- The email is dispatched via Gmail API OAuth (or Nodemailer SMTP fallback) and initiates an `EmailThread` linked to the `Lead` record.

### Phase 3: Scope & Proposal Formulation
- Upon positive response, the lead is transitioned to `QUALIFIED`.
- In [`/admin/proposals`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/proposals/page.tsx), admin generates a custom scope with defined deliverables, milestones, and payment terms (e.g. 50% upfront, 25% mid-sprint, 25% post-launch).
- A secure review token is emailed to the client. When the client opens the proposal, the system tracks `proposal_viewed`.

### Phase 4: Acceptance & Automated Onboarding
- Client accepts the proposal and e-signs the terms.
- The system automatically:
  1. Creates an active `Project` record linked to the client.
  2. Generates corresponding `Milestone` records.
  3. Provisions a `ClientOrganization` and invites the client to the `/portal`.
  4. Generates the initial deposit `Invoice` and Stripe checkout session.

### Phase 5: Delivery & Milestone Settlement
- Engineers update milestone statuses in [`/admin/milestones`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/milestones/page.tsx).
- The client monitors sprint progress in `/portal/projects` and tests deliverables on staging links.
- When an invoice is due, the client pays via credit card or bank transfer in `/portal/invoices`. The Stripe webhook updates the invoice to `PAID`, triggers `invoice_paid` GA4 event, and logs a receipt in `/admin/payments`.

### Phase 6: Retainer Transition & Ongoing Growth
- Upon project launch, the client is transitioned to an SLA Retainer (`/admin/retainers`) for 24/7 uptime monitoring, Core Web Vitals maintenance, and monthly AI Search / SEO reporting.
- Automated monthly retainer statements are generated and delivered via the Email Hub.

---

## 5. How Analytics, Email, SEO, and GEO Work Together

The system creates an interconnected growth loop where data from every channel reinforces the others:

```
       ┌───────────────────────────────┐
       │   GEO (AI Search Visibility)  │
       │   ChatGPT / Perplexity / etc. │
       └──────────────┬────────────────┘
                      │ Recommends Brand
                      ▼
       ┌───────────────────────────────┐
       │   Public Next.js Experience   │
       │   Sub-second LCP & WebGL      │
       └──────────────┬────────────────┘
                      │ GA4 / GSC Telemetry
                      ▼
       ┌───────────────────────────────┐
       │   Admin Analytics Cockpit     │
       │   Traffic, Clicks, Conversions│
       └──────────────┬────────────────┘
                      │ Inbound Form Leads
                      ▼
       ┌───────────────────────────────┐
       │   Email & Outreach Hub        │
       │   Gmail API Playbook Close    │
       └───────────────────────────────┘
```

1. **GEO drives High-Intent Referrals:** When enterprise buyers query LLMs ("best enterprise Next.js 15 agency"), CYBERSTYLE's optimized schema, case studies, and fast LCP ensure the brand is cited. The admin monitors citation share in [`/admin/geo`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/geo/page.tsx).
2. **SEO & High Performance captivate visitors:** Visitors arriving via organic search or AI referrals experience instant page loads (< 0.8s LCP). Google Search Console indexes clean metadata and structured JSON-LD.
3. **Analytics Cockpit measures ROI:** In [`/admin/analytics`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/web/src/app/(admin)/admin/analytics/page.tsx), leadership evaluates which landing pages and search queries drive the highest conversion rates.
4. **Email Hub seals the deal:** Inbound inquiries trigger instant automated responses and allow sales executives to execute battle-tested outreach playbooks with Gmail threading.

---

## 6. Verification Checklist & Running Instructions

### Local Development
```bash
# Start PostgreSQL (port 5432) & Redis (port 6379)
docker compose up -d

# Sync Database Schema
npx prisma db push
npx prisma generate

# Run API Backend (Port 4000)
cd apps/api
npm run dev

# Run Web Frontend (Port 3000)
cd apps/web
npm run dev
```

### Verification Endpoints
- **Health Check:** `http://localhost:4000/api/health`
- **Analytics Overview:** `http://localhost:4000/api/admin/analytics/overview?days=30`
- **Email Status:** `http://localhost:4000/api/admin/email/status`
- **GEO Queries:** `http://localhost:4000/api/admin/geo/queries`
- **Web App:** `http://localhost:3000`
- **Admin Analytics:** `http://localhost:3000/admin/analytics`
- **Admin GEO Radar:** `http://localhost:3000/admin/geo`
- **Admin Email Command Hub:** `http://localhost:3000/admin/email`
