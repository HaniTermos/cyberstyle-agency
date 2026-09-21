# CYBERSTYLE LLC — Integrations & Environment Configuration Specification

**Document Version:** 1.0.0  
**Date:** September 21, 2026  
**Status:** Canonical Reference

---

## 1. Environment Architecture & Security Boundaries

The CYBERSTYLE platform operates on a single validated typed configuration system implemented via Zod (`packages/config/src/env.ts` and `apps/api/src/config/env.ts`). Variables are segregated into two distinct security classifications:

1. **Client-Safe Public Variables (`NEXT_PUBLIC_*`)**: Bundled into Next.js browser assets. Must contain **zero secrets, zero passwords, and zero private keys**.
2. **Server-Only Critical Secrets**: Bound strictly to the Express API, BullMQ worker, and internal Docker networks. Must fail fast on application boot in production if missing, invalid, or containing insecure default placeholders.

---

## 2. Master Environment Variable Reference

### 2.1 Core Platform & Networking

| Variable Name | Realm | Required in Prod? | Allowed Format / Example | Default / Development Fallback | Purpose & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `NODE_ENV` | Global | **Yes** | `production` \| `development` \| `test` | `development` | Enables optimization, strict secret enforcement, and security headers. |
| `PORT` | API | **Yes** | Integer (`4000`, `4001`) | `4000` | Local container binding port. |
| `APP_URL` | Global | **Yes** | Fully-qualified URL (`https://cyberstyle.net`) | `http://localhost:3000` | Canonical origin for outbound emails, auth redirects, and OpenGraph URLs. |
| `NEXT_PUBLIC_API_URL` | Web | **Yes** | URL (`https://cyberstyle.net/api`) | `http://localhost:4000/api` | Public browser API gateway endpoint. |
| `INTERNAL_API_URL` | Web (SSR)| **Yes** | URL (`http://api:4000/api`) | `http://localhost:4000/api` | Internal Docker bridge DNS for server-rendered page fetches. |
| `CORS_ORIGINS` | API | **Yes** | Comma-delimited origins | `http://localhost:3000` | Whitelist for `Access-Control-Allow-Origin`. |
| `COOKIE_DOMAIN` | API | Optional | `.cyberstyle.net` | `undefined` (host-only) | Domain scope for session cookies. Omit in local/staging. |
| `LOG_LEVEL` | API / Worker| No | `info` \| `debug` \| `warn` \| `error` | `info` | Logging verbosity for Pino logger. |

### 2.2 Database & Cache (PostgreSQL 16 & Redis 7)

| Variable Name | Realm | Required in Prod? | Allowed Format / Example | Default / Development Fallback | Purpose & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | API / Worker| **Yes** | `postgresql://user:pass@host:5432/db?schema=public` | Local dev database URL | Primary PostgreSQL connection string. Must use random password. |
| `POSTGRES_USER` | Docker | **Yes** | Alphanumeric string (`postgres`) | None | PostgreSQL superuser username. |
| `POSTGRES_PASSWORD` | Docker | **Yes** | Min 24-character cryptographic string | **FAIL-FAST IN PROD** | PostgreSQL superuser password. |
| `POSTGRES_DB` | Docker | **Yes** | Database name (`db_agency_prod`) | `db_agency` | Target database catalog name. |
| `REDIS_URL` | API / Worker| **Yes** | `redis://:pass@host:6379` | `redis://localhost:6379` | BullMQ queue and cache Redis connection. |
| `REDIS_PASSWORD` | Docker | **Yes** | Min 24-character cryptographic string | **FAIL-FAST IN PROD** | Redis AUTH password. |

### 2.3 Authentication, Sessions & Cryptographic Secrets

| Variable Name | Realm | Required in Prod? | Allowed Format / Example | Default / Development Fallback | Purpose & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `AUTH_SECRET` | API / Worker| **Yes** | 64-character hex string (256 bits) | **FAIL-FAST IN PROD** | Cryptographic key for session token signing and verification. |
| `SESSION_SECRET`| API / Worker| **Yes** | 64-character hex string (256 bits) | **FAIL-FAST IN PROD** | Encryption key for signed file HMAC downloads and cookie seals. |
| `JWT_SECRET` | API / Worker| **Yes** | 64-character hex string (256 bits) | **FAIL-FAST IN PROD** | JWT signing key. Replaces insecure fallback string. |
| `SESSION_TTL_DAYS`| API | No | Integer (`7`, `14`, `30`) | `7` | Sliding expiration window for active user sessions. |
| `INVITATION_TOKEN_TTL_HOURS`| API| No | Integer (`24`, `72`) | `72` | One-time invitation link expiration window. |
| `PASSWORD_RESET_TOKEN_TTL_MINUTES`| API| No| Integer (`15`, `30`, `60`) | `30` | One-time password reset token expiration window. |

### 2.4 Transactional Email (Hostinger Mailbox SMTP)

| Variable Name | Realm | Required in Prod? | Allowed Format / Example | Default / Development Fallback | Purpose & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `EMAIL_PROVIDER` | API / Worker| **Yes** | `hostinger` \| `smtp` \| `test` | `test` (in dev/test) | Mail provider selection. Tests use non-transmitting mock. |
| `SMTP_HOST` | API / Worker| **Yes** | Hostname (`smtp.hostinger.com`) | `smtp.hostinger.com` | Outbound mail server hostname. |
| `SMTP_PORT` | API / Worker| **Yes** | Integer (`465` or `587`) | `465` | Outbound SMTP port. 465 = SSL, 587 = TLS. |
| `SMTP_SECURE` | API / Worker| **Yes** | Boolean (`true` for 465, `false` for 587) | `true` | NodeMailer TLS socket configuration. |
| `SMTP_USER` | API / Worker| **Yes** | Email (`info@cyberstyle.net`) | None | Hostinger mailbox authentication username. |
| `SMTP_PASS` | API / Worker| **Yes** | Mailbox password | **FAIL-FAST IN PROD** | Hostinger mailbox authentication secret. |
| `EMAIL_FROM` | API / Worker| **Yes** | RFC 5322 format (`"CYBERSTYLE" <info@cyberstyle.net>`) | `"CYBERSTYLE" <info@cyberstyle.net>` | Header `From` address. |
| `EMAIL_REPLY_TO`| API / Worker| No | Email (`info@cyberstyle.net`) | `info@cyberstyle.net` | Header `Reply-To` address. |

### 2.5 Billing & Stripe Payments

| Variable Name | Realm | Required in Prod? | Allowed Format / Example | Default / Development Fallback | Purpose & Behavior |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `STRIPE_SECRET_KEY` | API | Optional | `sk_live_...` or `sk_test_...` | None | Stripe SDK secret key. If unset, billing states show "Stripe not configured". |
| `STRIPE_WEBHOOK_SECRET`| API | Optional | `whsec_...` | None | Webhook signature verification secret. |
| `STRIPE_PUBLISHABLE_KEY`| Web | Optional | `pk_live_...` or `pk_test_...` | None | Browser publishable key for Stripe Elements. |
| `STRIPE_DEFAULT_CURRENCY`| API | No | ISO 4217 code (`USD`, `EUR`, `AED`)| `USD` | Default currency for draft invoices. |
| `STRIPE_TAX_ENABLED` | API | No | Boolean (`true` \| `false`) | `false` | Enables automated Stripe Tax calculation if configured in dashboard. |

### 2.6 Optional Modular Integrations

| Variable Name | Realm | Purpose | Behavior When Absent |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | API | AI lead qualification & proposal drafting | Graceful fallback to deterministic rule-based lead scoring; UI displays "AI Assistant Not Configured". |
| `GOOGLE_ANALYTICS_PROPERTY_ID`| API | Server-side GA4 Data API reporting | UI displays "Google Analytics Not Connected" with instructions to link Service Account. |
| `GOOGLE_APPLICATION_CREDENTIALS`| API | Path to Google Service Account JSON | GA4 client initializes in disconnected mode. |
| `GOOGLE_PLACES_API_KEY`| Web / API | Address validation & business autocomplete | Address input operates in manual text entry mode. |
| `TURNSTILE_SITE_KEY` | Web | Cloudflare Turnstile public form challenge | Public forms bypass widget verification in development; required in production. |
| `TURNSTILE_SECRET_KEY`| API | Turnstile server-side verification secret | API verifies token via `https://challenges.cloudflare.com/turnstile/v0/siteverify`. |
| `SENTRY_DSN` | API / Worker | Centralized exception and error telemetry | Errors logged to local Pino console; no external transmission. |
| `NEXT_PUBLIC_SENTRY_DSN`| Web | Browser client error reporting | Client errors captured by React ErrorBoundary locally. |
| `ALERT_PROVIDER` | API / Worker | Operational alert dispatcher (`slack` \| `discord`) | Alerts routed to local console logs. |
| `SLACK_WEBHOOK_URL` / `DISCORD_WEBHOOK_URL`| API / Worker | Webhook URL for failed jobs & critical security alerts | Operational alerts silently skipped if webhook URL unset. |

---

## 3. Provider Abstraction Architecture

Each external integration implements a strict TypeScript provider interface returning structured state (`status: 'CONNECTED' | 'NOT_CONFIGURED' | 'ERROR'`). Business logic **never** imports vendor SDKs directly.

### 3.1 Email Provider Interface (`apps/api/src/services/mail/`)
```ts
export interface MailProvider {
  name: string;
  isConfigured(): boolean;
  send(options: MailDispatchOptions): Promise<MailSendResult>;
}
```
* **HostingerSmtpProvider**: Uses Nodemailer with host `smtp.hostinger.com`, port `465`, SSL.
* **TestMailProvider**: In-memory message capture for automated CI test suites; records messages into an inspectable array without network I/O.

### 3.2 Analytics Provider Interface (`apps/api/src/services/analytics/`)
```ts
export interface AnalyticsProvider {
  name: string;
  isConfigured(): boolean;
  getOverview(dateRange: { start: Date; end: Date }): Promise<AnalyticsOverviewResult>;
}
```
* If Google credentials are not set, returns `{ configured: false, status: 'NOT_CONFIGURED', metrics: null }`. Fabricating random visitor metrics is strictly prohibited.

### 3.3 Alert Dispatcher Interface (`apps/api/src/services/alerts/`)
```ts
export interface AlertDispatcher {
  dispatch(alert: OperationalAlert): Promise<void>;
}
```
* Dispatches formatted Markdown cards to Slack or Discord for BullMQ Dead Letter Queue (DLQ) events, database backup failures, and security brute-force lockouts.
