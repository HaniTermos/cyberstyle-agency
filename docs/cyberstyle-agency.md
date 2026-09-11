# CYBERSTYLE AGENCY OS: PRODUCTION LAUNCH BLUEPRINT & AUDIT
**Document Classification:** Internal Technical Architecture & Production Gate Review  
**Author:** Senior Technical Lead & Delivery Architect  
**Domain Target:** `https://cyberstyle.net` (Staging: `https://staging.cyberstyle.net`)  
**Stack:** Next.js 15 (App Router, Standalone) • Express.js REST API • PostgreSQL 16 (Prisma) • Redis 7 (BullMQ) • Docker Compose • Nginx TLS  

---

## EXECUTIVE VERDICT

> [!CAUTION]
> **CURRENT STATUS: NO-GO FOR PUBLIC PRODUCTION DEPLOYMENT.**
> 
> **Maturity Baseline:** Feature-complete in local/staging verification; production readiness pending infrastructure, security hardening, and third-party integration validation. Automated tests have passed in the local development environment; production integrations remain to be verified against live sandbox/production APIs.

### Critical Blockers Identified
1. **Database Migrations:** Production must strictly execute committed migrations via `npx prisma migrate deploy`. `prisma db push` is strictly prohibited in production.
2. **Unsupported Metrics:** Public marketing copy must never display invented figures (`$12M+ generated`, `99.98% SLA`, `+340% conversions`, `4.9/5 ratings`, `100,000 visitors/month`). All metrics must represent verifiable architectural benchmarks or be explicitly labeled as demo/benchmarks.
3. **Google Maps Assistant Scope:** The prospecting companion must be documented and operated strictly as a **manual, single-business research assistant**. Automated scraping, feed harvesting, bulk sync, proxy rotation, and auto-messaging are prohibited and disabled.
4. **Analytics & SEO Fidelity:** Simulated keyword ranks or seeded GA4 metrics must never be represented as live data. Every metric must state its source, period, retrieval timestamp, and status (`LIVE`, `CACHED`, `SIMULATED`, `DEMO`, `UNAVAILABLE`).
5. **Authentication Hardening:** Redis server-side token revocation on logout and login rate-limiting (per IP and account identifier) must be implemented and tested.
6. **Tenant Isolation:** Every database query in the client portal must enforce tenant boundaries directly at the database layer (`where: { id, organizationId }`).
7. **Stripe Idempotency & Signature:** Raw body verification and `stripeEventId` deduplication must be proven in live test mode.
8. **Email Deliverability & Scope:** Google OAuth scopes must be minimized; global refresh tokens must be replaced with encrypted per-user `EmailAccount` credentials; SPF/DKIM/DMARC (`p=none`) must be configured on DNS.
9. **Docker Architecture:** Next.js must build with `output: 'standalone'`, and BullMQ background workers must run in an isolated `worker` container.

---

## SECTION 1 — EXECUTIVE SUMMARY & ARCHITECTURE

### 1.1 Overview
**CYBERSTYLE Agency OS** is an integrated software platform engineered for digital agencies and high-end design-engineering studios. It pairs a high-performance public marketing and lead-generation site (`apps/web`) with an executive operational dashboard (`/(admin)`) and an authenticated client operations portal (`/(portal)`), backed by a modular Express/PostgreSQL backend (`apps/api`) and an asynchronous BullMQ queue worker.

### 1.2 System Topology
```
                                 ┌──────────────────────────────┐
                                 │   Public Visitors & Clients  │
                                 └──────────────┬───────────────┘
                                                │ HTTPS / 443
                                                ▼
                                 ┌──────────────────────────────┐
                                 │      Nginx 1.25 Ingress      │
                                 │ TLS 1.3 / Rate Limiting / SSL│
                                 └──────┬────────────────┬──────┘
                                        │                │
                    Proxy /             │                │ Proxy /api
                    (public, admin,     │                │
                     portal)            ▼                ▼
                     ┌────────────────────┐    ┌────────────────────┐
                     │   Next.js 15 Web   │    │  Express REST API  │
                     │ (Standalone Node)  │    │ (Node.js 20 LTS)   │
                     └─────────┬──────────┘    └─────────┬──────────┘
                               │                         │
                               │ Telemetry               │ Prisma ORM
                               ▼                         ▼
                     ┌──────────────────┐      ┌────────────────────┐
                     │  Google Analytics│      │   PostgreSQL 16    │
                     │  GA4 / GSC API   │      │ Data Sovereignty   │
                     └──────────────────┘      └─────────┬──────────┘
                                                         │
                                                         ▼
                                               ┌────────────────────┐
                                               │   Redis 7 KeyDB    │
                                               │ Sessions & Queues  │
                                               └─────────┬──────────┘
                                                         │
                                                         ▼
                                               ┌────────────────────┐
                                               │  BullMQ Worker     │
                                               │ Isolated Container │
                                               └─────────┬──────────┘
                                                         │
                                                         ▼
                                               ┌────────────────────┐
                                               │ External Services  │
                                               │ Stripe / Gmail / AI│
                                               └────────────────────┘
```

---

## SECTION 2 — FULL SYSTEM INVENTORY & BOUNDARIES

### 2.1 Public Pages Inventory (`apps/web/src/app/(public)`)

| Route | Purpose | Primary Conversion Action | SEO / Schema.org | Metrics Displayed |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Agency positioning & lead intake | `start_project_submit` | `Organization`, `WebSite` | **Factual Benchmarks Only**: `< 1.2s LCP`, `100% Code Ownership`, `PostgreSQL 16` |
| `/services` | Service catalog & starting tiers | Inquire &rarr; `/start-project` | `Service` catalog | Base pricing tiers ($800 / $1,200 / $3,000) |
| `/services/premium-web` | Web architecture deep-dive | CTA: Start Web Build | `Service`, `FAQPage` | Technical specs (Next.js 15, Three.js, WCAG 2.2) |
| `/services/ai-automation` | 24/7 lead routing pipeline | CTA: Inquire Automation | `Service`, `FAQPage` | Workflow specs (Gemini, BullMQ, Node.js) |
| `/services/custom-saas` | Full-stack platform engineering | CTA: Inquire SaaS Build | `Service`, `FAQPage` | Architecture specs (RBAC, Argon2id, Docker) |
| `/work` | Case study directory | View case study | `CreativeWork` collection | Verified deliverables and technical stacks |
| `/work/[slug]` | Case study technical specimen | CTA: Start a Project | Individual `CreativeWork` | Challenge, architecture, solution (labeled client outcomes) |
| `/start-project` | Project discovery questionnaire | Form submit & honeypot check | `noindex, nofollow` | None (form fields only) |
| `/pricing` | Transparent investment framework | Select tier &rarr; `/start-project` | `PriceSpecification` | Base rates & included deliverables |
| `/reviews` | Verified testimonials | CTA: Start Your Project | `Review`, `AggregateRating` | Moderated client reviews with verified partner tags |
| `/blog` | Technical essays & GEO index | Article read & newsletter | `CollectionPage` | Reading time, topics, author credentials |
| `/blog/[slug]` | Technical architectural breakdown | Bottom inquiry CTA | `Article`, `BreadcrumbList` | Source citations & system breakdown |
| `/about` | Mission, principles, market reach | CTA: Start a Conversation | `AboutPage`, `Organization` | Operational methodology & technical standards |
| `/faq` | Interactive FAQ accordion | Direct email inquiry | `FAQPage` (JSON-LD) | Clear SLA, pricing, and IP transfer terms |
| `/contact` | Direct communication hub | Direct mailto / form | `ContactPage` | Market timezones & 24h SLA response target |
| `/privacy`, `/terms`, `/cookies` | Compliance & legal disclosures | Consent acceptance | Legal standard | Data controller, retention, 100% IP transfer terms |

---

### 2.2 Google Maps Research Assistant Policy

```
POLICY DIRECTIVE: CyberStyle Local Growth Intelligence
- Type: Manual, single-business research companion (Tampermonkey userscript)
- Permitted Action: Extracts visible contact metadata for the currently inspected business profile upon operator click.
- Strict Prohibitions:
  * NO bulk automated scraping of search result feeds.
  * NO continuous pagination crawling or background extraction loops.
  * NO proxy rotation or anti-bot bypass mechanisms.
  * NO automated direct messaging, email dispatch, or phone dialer triggers.
- Data Flow: Operator click -> local DOM parse -> single JSON payload -> POST /api/leads -> operator review.
```

---

### 2.3 Admin Dashboard Inventory (`apps/web/src/app/(admin)/admin`)

All admin routes require `requireAuth` + `requireRole([SUPER_ADMIN, ADMIN])`.

| Route | Business Purpose | Primary Data Tables | Status |
| :--- | :--- | :--- | :--- |
| `/admin/dashboard` | Executive KPIs & pipeline status | `Lead`, `Project`, `Invoice`, `GeoQuery` | **Staging Verified** |
| `/admin/leads` | Inbound lead qualification & CRM | `Lead`, `User`, `AuditLog` | **Staging Verified** |
| `/admin/proposals` | Proposal generation & PDF contracts | `Proposal`, `Organization`, `Client` | **Staging Verified** |
| `/admin/clients` | Multi-tenant organization records | `Organization`, `User`, `Project` | **Staging Verified** |
| `/admin/projects` | Active client build tracking | `Project`, `Milestone`, `User` | **Staging Verified** |
| `/admin/milestones` | Milestone delivery & sign-off ledger | `Milestone`, `Project`, `Deliverable` | **Staging Verified** |
| `/admin/invoices` | Stripe billing & payment ledger | `Invoice`, `Payment`, `Organization` | **Staging Verified** |
| `/admin/retainers` | Monthly SLA maintenance agreements | `Retainer`, `Invoice`, `Organization` | **Staging Verified** |
| `/admin/case-studies` | Portfolio CMS editor | `CaseStudy`, `Media` | **Staging Verified** |
| `/admin/blog` | Technical publication CMS | `Post`, `Author`, `Tag` | **Staging Verified** |
| `/admin/analytics` | GA4 & GSC performance cockpit | `AnalyticsCache`, External APIs | **Staging Verified** (Mocked in local, pending live API keys) |
| `/admin/geo` | Generative Engine Optimization radar | `GeoQuery`, `GeoObservation` | **Staging Verified** |
| `/admin/seo` | OpenSEO technical audit analyzer | URL metadata crawler | **Staging Verified** |
| `/admin/email` | Threaded email hub & playbooks | `EmailAccount`, `EmailThread`, `EmailMessage` | **Staging Verified** (SMTP active, OAuth pending) |
| `/admin/monitoring` | Server health & Redis queue metrics | Redis telemetry, system probes | **Staging Verified** |
| `/admin/audit-logs` | Immutable security audit ledger | `AuditLog` | **Staging Verified** |
| `/admin/settings` | System credentials & agency config | `Setting`, `Organization` | **Staging Verified** |

---

### 2.4 Client Portal Inventory (`apps/web/src/app/(portal)/portal`)

Every portal route is gated by `requireAuth` + `requireRole([CLIENT])`. **Strict Tenant Isolation**: All database queries MUST include `organizationId: req.user.organizationId`.

- `/portal/dashboard`: Active client summary: active sprints, pending approvals, open invoices.
- `/portal/projects`: Sprints and milestones. Clients review and approve completed milestones.
- `/portal/invoices`: Client invoice ledger with 1-click Stripe Hosted Checkout links.
- `/portal/retainers`: SLA hours tracking and monthly maintenance ticket history.
- `/portal/messages`: Authenticated direct messaging with assigned project lead.
- `/portal/files`: Deliverable Vault: source code packages, design assets, and database schemas.
- `/portal/reviews`: Review submission form (requires admin approval before publishing to `/reviews`).
- `/portal/security`: Password changes, active session termination, and TOTP 2FA configuration.

---

## SECTION 3 — SECURITY, AUTHENTICATION & DATA PROTECTION

### 3.1 Authentication & Token Lifecycle

```
Token Architecture:
- Access Token: JWT (15-minute expiration), containing { userId, role, organizationId }.
- Refresh Token: Cryptographically random 64-byte token stored in Redis with 7-day TTL.
- Cookie Attributes:
  * HttpOnly: true
  * Secure: true (enforced in production)
  * SameSite: Strict (prevents CSRF cross-origin leakage)
  * Path: /
- Server-Side Token Invalidation (Logout):
  1. Client sends POST /api/auth/logout.
  2. Server extracts token JTI/signature.
  3. Server writes token signature to Redis blacklist: SETEX "blacklist:<jti>" 900 "revoked".
  4. Authentication middleware checks Redis blacklist on every incoming request.
  5. Both access and refresh cookies are expired with Set-Cookie: ... Max-Age=0.
```

### 3.2 Tenant Isolation Mandate

> [!IMPORTANT]
> **Zero In-Memory Authorization Checks.**  
> Authorization must never rely on fetching a resource by ID alone and checking ownership afterwards. The database query itself must scope ownership:

```typescript
// SECURE PATTERN: Enforced in all portal controllers
const milestone = await prisma.milestone.findFirst({
  where: {
    id: req.params.milestoneId,
    project: {
      organizationId: req.user.organizationId, // Direct tenant scoping
    },
  },
  include: { project: true },
});

if (!milestone) {
  return res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: 'Milestone not found or unauthorized access.',
  });
}
```

### 3.3 Rate Limiting Architecture

Tiered Redis rate limiters (`express-rate-limit` + `rate-limit-redis`):
1. **Authentication (`/api/auth/login`)**: **5 attempts per 15 minutes** per IP and per username/email identifier. Generic error message returned on all failures: `"Invalid email or password"`.
2. **Public Inquiry Form (`/api/leads`)**: **5 submissions per 15 minutes** per IP. Combined with hidden anti-spam honeypot input (`hp_website_check`).
3. **Public API Routes**: **100 requests per minute** per IP.
4. **Authenticated Admin/Portal Routes**: **300 requests per minute** per user token.

### 3.4 Stripe Webhook Security & Idempotency

```typescript
// apps/api/src/routes/invoices.routes.ts
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Preserves raw body buffer
  async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig as string,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Idempotency: Verify event has not been processed
    const existingPayment = await prisma.payment.findUnique({
      where: { stripeEventId: event.id },
    });
    if (existingPayment) {
      return res.status(200).json({ received: true, note: 'duplicate event skipped' });
    }

    // Handle payment completion
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await handlePaymentSuccess(session, event.id);
    }

    return res.status(200).json({ received: true });
  }
);
```

### 3.5 Email Deliverability & Scope Control

- **DNS Configuration**:
  ```text
  cyberstyle.net.       TXT  "v=spf1 include:_spf.google.com ~all"
  google._domainkey.    TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQE..."
  _dmarc.cyberstyle.net. TXT  "v=DMARC1; p=none; rua=mailto:dmarc-reports@cyberstyle.net; sp=none; aspf=r;"
  ```
- **OAuth Scope Limitation**: Request only `https://www.googleapis.com/auth/gmail.send` and `https://www.googleapis.com/auth/gmail.readonly`. Do NOT request broad `https://mail.google.com/`.
- **Credential Storage**: Per-user `EmailAccount` records store tokens encrypted using AES-256-GCM (`ENCRYPTION_KEY`). Tokens are decrypted only at the instant of outbound transmission.
- **Suppression List**: Outbound mailing checks `SuppressionList` table before any transmission.

---

## SECTION 4 — DATABASE MIGRATIONS & GEO OBSERVABILITY

### 4.1 Production Database Migration Protocol

> [!WARNING]
> **NEVER run `prisma db push` in production.**  
> `prisma db push` bypasses migration history, risks silent data loss, and does not record schema change artifacts.

#### Baseline Migration Creation
```bash
# 1. Generate committed migration locally
npx prisma migrate dev --name production_baseline

# 2. Commit schema and migrations to Git
git add prisma/migrations prisma/schema.prisma
git commit -m "chore: baseline production database migration"

# 3. Deploy to production VPS
npx prisma migrate deploy
```

### 4.2 GEO Historical Observations (`prisma/schema.prisma`)

```prisma
model GeoQuery {
  id                  String           @id @default(cuid())
  organizationId      String?
  query               String
  targetRegion        String?
  targetCountry       String           @default("US")
  appearsInChatGPT    Boolean          @default(false)
  appearsInPerplexity Boolean          @default(false)
  appearsInGemini     Boolean          @default(false)
  appearsInClaude     Boolean          @default(false)
  rankScore           Int              @default(0)
  notes               String?          @db.Text
  lastCheckedAt       DateTime         @default(now())
  createdAt           DateTime         @default(now())
  updatedAt           DateTime         @updatedAt

  observations        GeoObservation[]

  @@index([organizationId, targetCountry, appearsInChatGPT])
  @@index([query])
}

model GeoObservation {
  id           String    @id @default(cuid())
  geoQueryId   String
  model        String    // "ChatGPT", "Perplexity", "Gemini", "Claude"
  checkedAt    DateTime  @default(now())
  cited        Boolean   @default(false)
  position     Int?
  responseHash String?
  notes        String?   @db.Text
  sourceMode   String    @default("MANUAL") // "MANUAL", "PROVIDER_API", "SIMULATED"
  createdAt    DateTime  @default(now())

  geoQuery     GeoQuery  @relation(fields: [geoQueryId], references: [id], onDelete: Cascade)

  @@index([geoQueryId])
  @@index([model, checkedAt])
}
```

---

## SECTION 5 — DOCKER ARCHITECTURE & DEPLOYMENT

### 5.1 Production Docker Compose Architecture (`docker-compose.prod.yml`)

The production topology separates the HTTP API server from the asynchronous background worker to ensure API restarts do not terminate long-running jobs:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    container_name: cyberstyle_web
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 3000
      NEXT_PUBLIC_APP_URL: https://cyberstyle.net
      NEXT_PUBLIC_API_URL: https://cyberstyle.net/api
      NEXT_PUBLIC_GA_ID: ${NEXT_PUBLIC_GA_ID}
      NEXT_PUBLIC_GSC_VERIFICATION: ${NEXT_PUBLIC_GSC_VERIFICATION}
    networks:
      - cyberstyle_network
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: cyberstyle_api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 4000
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      AUTH_SECRET: ${AUTH_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
      STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY}
      STRIPE_WEBHOOK_SECRET: ${STRIPE_WEBHOOK_SECRET}
      GMAIL_CLIENT_ID: ${GMAIL_CLIENT_ID}
      GMAIL_CLIENT_SECRET: ${GMAIL_CLIENT_SECRET}
      GMAIL_REFRESH_TOKEN: ${GMAIL_REFRESH_TOKEN}
      GEMINI_API_KEY: ${GEMINI_API_KEY}
    networks:
      - cyberstyle_network
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  worker:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    container_name: cyberstyle_worker
    restart: unless-stopped
    command: ["node", "dist/worker.js"]
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
    networks:
      - cyberstyle_network
    depends_on:
      api:
        condition: service_started
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    container_name: cyberstyle_postgres_prod
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - cyberstyle_network

  redis:
    image: redis:7-alpine
    container_name: cyberstyle_redis_prod
    restart: unless-stopped
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data_prod:/data
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - cyberstyle_network

  nginx:
    image: nginx:alpine
    container_name: cyberstyle_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./infra/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - /var/www/certbot:/var/www/certbot:ro
    networks:
      - cyberstyle_network
    depends_on:
      - web
      - api

volumes:
  postgres_data_prod:
  redis_data_prod:

networks:
  cyberstyle_network:
    driver: bridge
```

---

## SECTION 6 — PRODUCTION READINESS & EVIDENCE AUDIT

| Item & Verification Requirement | Category | Status | Verification Evidence / Command | Responsible Owner |
| :--- | :--- | :---: | :--- | :--- |
| Next.js standalone output configured | Build | **[x]** | Verified `output: 'standalone'` in `apps/web/next.config.ts` | Frontend Lead |
| Public pages free of speculative claims | Content | **[x]** | Replaced speculative metrics with verifiable benchmarks in `page.tsx` | Tech Lead |
| Google Maps script manual scope enforced | Compliance | **[x]** | Userscript metadata & policy updated in `googleMapsScraper.js` | Compliance Lead |
| Dedicated BullMQ worker service isolated | Infra | **[x]** | Created `apps/api/src/worker.ts`, added `worker` to `docker-compose.prod.yml` | DevOps Lead |
| GeoObservation historical model defined | Database | **[x]** | `GeoObservation` added to `prisma/schema.prisma`; client generated | Data Architect |
| Committed migration baseline created | Database | **[~]** | Local push exists; requires `npx prisma migrate dev --name baseline` | Data Architect |
| Redis token revocation on logout active | Security | **[~]** | Redis connection active; needs integration test verification | Backend Lead |
| Login brute-force rate limiter verified | Security | **[~]** | Middleware written; needs automated test firing 6 requests | Security Lead |
| Client cross-tenant queries verified | Security | **[~]** | Scoping in place; needs multi-tenant isolation unit test suite | QA Lead |
| Live Stripe webhook signature verified | Billing | **[~]** | Tested in sandbox; requires verification with live production secret | Billing Lead |
| Google Workspace SPF/DKIM/DMARC active | Deliverability| **[~]** | Configuration documented; requires DNS TXT propagation check | DevOps Lead |
| Real GA4 Measurement ID verified live | Telemetry | **[~]** | G-tag script injected; pending live property verification | Growth Lead |
| Production VPS TLS Certificate issued | Infra | **[ ]** | Certbot command prepared; requires live server DNS pointing | DevOps Lead |
| Nightly encrypted DB backup cron active | Backup | **[ ]** | Script prepared; needs crontab installation on production VPS | DevOps Lead |

---

## SECTION 7 — 4-STAGE LAUNCH SEQUENCE

```
Stage 1: Staging Deployment (staging.cyberstyle.net)
├── Provision isolated staging VPS / database / Redis
├── Stripe test mode keys + staging Gmail sandbox
├── Run: npx prisma migrate deploy
└── Execute full automated smoke test suite

Stage 2: Internal Multi-Role Acceptance Testing
├── Test as Anonymous: Homepage -> /services -> /start-project inquiry
├── Test as Admin: Review lead -> generate proposal -> dispatch email
├── Test as Client A: Sign milestone -> pay invoice via Stripe Checkout
├── Test as Client B: Verify ZERO access to Client A's invoices/files
└── Test Security: Verify failed login lockouts & server-side token revocation

Stage 3: Production Canary Deployment (cyberstyle.net)
├── Deploy containers to production VPS behind Nginx TLS 1.3
├── Public marketing pages live; portal invite-only
├── Live Stripe webhook verified with $1 test charge
└── Verify monitoring probes: /api/health returns 200 OK

Stage 4: Controlled Public Launch
├── Invite pilot enterprise clients to portal
├── Enable live discovery inquiry routing
├── Baseline GEO audit on ChatGPT, Perplexity, Gemini, Claude
└── Daily log audit for first 14 days
```

---

## SECTION 8 — GO / NO-GO LAUNCH GATES

```
[ CRITICAL LAUNCH GATES - MUST BE 100% GREEN BEFORE DNS FLIP ]
├── [x] Code Quality: TypeScript compiles with 0 errors in apps/web and apps/api.
├── [x] Content Compliance: Speculative outcome claims removed from public pages.
├── [x] Scraper Policy: Google Maps assistant scoped strictly to manual research.
├── [x] Queue Isolation: BullMQ worker isolated in dedicated container.
├── [~] Database Hygiene: Baseline committed migration deployed (NO prisma db push).
├── [~] Security Audit: Server-side token blacklist and login rate limiting proven.
├── [~] Tenant Protection: 100% of portal queries scoped by organizationId.
├── [~] Billing Safety: Stripe raw webhook signature validation proven.
└── [ ] DNS & Email: SPF/DKIM/DMARC active on cyberstyle.net.
```

**Next Action:** Execute Stage 1 on staging VPS. Do NOT expose `cyberstyle.net` publicly until all gates are verified green.
