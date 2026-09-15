# Phase 5 Production Configuration Checklist

**Target Deployment**: CYBERSTYLE Platform (`cyberstyle.net`)  
**Evaluation Date**: September 14, 2026  
**Status Key**:
* `[VERIFIED]` — Fully implemented in code, tested in staging/local test runner, and ready for production.
* `[PARTIALLY CONFIGURED]` — Core logic and guards verified; requires live production API keys / DNS records to be plugged into environment variables at deploy time.
* `[NOT CONFIGURED]` — Intentionally left for optional post-launch milestone or non-essential feature.

---

## Production Configuration Matrix

### 1. Domain, DNS & TLS Termination
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **Canonical Domain** | `[VERIFIED]` | Configured in Next.js metadata (`metadataBase: 'https://cyberstyle.net'`), sitemaps, and robots.txt. |
| **TLS / SSL Termination** | `[PARTIALLY CONFIGURED]` | HTTPS redirection enforced via Next.js and Express reverse-proxy headers (`x-forwarded-proto`); production SSL cert managed by hosting provider (Vercel / Cloudflare / Let's Encrypt). |
| **DNS A / CNAME Records** | `[PARTIALLY CONFIGURED]` | Ready for registrar delegation: apex `cyberstyle.net` and `admin.cyberstyle.net` / `api.cyberstyle.net`. |

### 2. Stripe Payment Processing
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **Test Payment Flow** | `[VERIFIED]` | Verified in `npm run test:e2e` (Step 1.6) via canonical invoice state machine (`DRAFT` $\rightarrow$ `SENT` $\rightarrow$ `PAID`) with cent-precision conversion. |
| **Webhook Signature Guard** | `[VERIFIED]` | Implemented in [`apps/api/src/config/stripe.ts`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/api/src/config/stripe.ts) with `stripe.webhooks.constructEvent` rejecting unsigned payloads. |
| **Live Secret Keys** | `[PARTIALLY CONFIGURED]` | Code expects `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in environment variables; fallback to simulated test webhook when unconfigured. |

### 3. Outbound Email & Suppression Center
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **Idempotency & State Machine** | `[VERIFIED]` | Verified in `npm run test:phase3` Section 2: duplicate dispatches blocked via idempotency keys; templates require human approval before sending. |
| **Suppression & Bounce List** | `[VERIFIED]` | Implemented in [`apps/api/src/services/email-governance.service.ts`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/api/src/services/email-governance.service.ts): hard bounces automatically suppress future delivery. |
| **Provider API & DNS (SPF/DKIM)** | `[PARTIALLY CONFIGURED]` | Resend/SMTP transport ready; owner must add SPF (`v=spf1 include:resend.com ~all`) and DKIM TXT records to DNS upon domain launch. |

### 4. Database, Migrations & Disaster Recovery
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **PostgreSQL 16 Connection Pool** | `[VERIFIED]` | Verified via Prisma client connection pooling, strict relational constraints, and health ping telemetry. |
| **Prisma Migrations** | `[VERIFIED]` | All migrations verified; deployment runbook specifies `npx prisma migrate deploy`. |
| **Automated Backups (`.sql.gz`)** | `[VERIFIED]` | Verified in `npm run test:restore`: gzip compression level 6, automated SHA-256 sidecar checksum generation. |
| **Disaster Recovery Restore Drill** | `[VERIFIED]` | Verified in `npm run test:restore`: sandbox restore drill validates table schema, decompression, and record counts. |
| **Tamper Detection & Retention** | `[VERIFIED]` | Verified in `npm run test:restore`: tampered dumps rejected; 14-day retention pruning policy verified. |
| **Disaster Recovery Runbook** | `[VERIFIED]` | Comprehensive runbook created at [`docs/runbooks/disaster-recovery.md`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/runbooks/disaster-recovery.md). |

### 5. Error Tracking & Observability
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **Structured JSON Logging** | `[VERIFIED]` | Standardized JSON output with correlation ID tracking (`x-correlation-id`, `x-request-id`) and automatic redaction of sensitive credentials. |
| **Sentry Exception Tracker** | `[VERIFIED]` | Error tracker service captures unhandled exceptions with ring buffer for admin UI; activates remote Sentry dispatch when `SENTRY_DSN` is populated. |
| **Alerting Engine (5xx & DB Drops)** | `[VERIFIED]` | Verified in [`apps/api/src/services/alert.service.ts`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/apps/api/src/services/alert.service.ts): triggers when 5xx errors exceed 5 in 5 minutes, or on backup/restore failure. |

### 6. File Storage & Upload Quarantine
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **Private-by-Default Storage** | `[VERIFIED]` | Direct public URLs disabled; files stored in private quarantine location. |
| **Magic-Byte & MIME Validation** | `[VERIFIED]` | Verified in `npm run test:phase3`: executables (`.exe`, `.sh`, `.bat`) rejected; PDF/ZIP magic numbers verified. |
| **Asynchronous Malware Scanner** | `[VERIFIED]` | Scan state machine (`PENDING_SCAN` $\rightarrow$ `CLEAN` / `FLAGGED` / `REJECTED`) verified in E2E Journey 2. |
| **Signed Download URLs** | `[VERIFIED]` | HMAC-SHA256 tokens with 15-minute expiration and audit access logs verified in E2E tests. |

### 7. Administrative Telemetry & Monitoring Page
| Checklist Item | Status | Verification Notes |
| :--- | :--- | :--- |
| **Live Health Endpoint** | `[VERIFIED]` | `GET /api/v1/monitoring/system-health` returns DB status, latency, memory RSS/heap, 24h error counts, and backup status. |
| **Admin UI Telemetry Tab** | `[VERIFIED]` | `/admin/monitoring` renders live DB latency, process memory, recent error logs with correlation IDs, and manual trigger buttons. |
| **WCAG 2.1 AA Accessibility** | `[VERIFIED]` | Modals support Escape key dismissal, visible cyan focus rings (`focus-visible:ring-2`), and labeled inputs. |
| **Core Web Vitals Telemetry** | `[VERIFIED]` | Client-side `<WebVitals />` component integrated in Next.js layout reporting LCP, INP, and CLS. |

---

## Action Items for Platform Launch (Owner Checklist)

1. **Host Environment Variables**: Populate real production credentials in host environment (e.g., Vercel / Railway / Render / AWS):
   * `DATABASE_URL` $\rightarrow$ Managed PostgreSQL connection string.
   * `AUTH_SECRET` & `SESSION_SECRET` $\rightarrow$ 64-character random hex strings (`openssl rand -base64 32`).
   * `STRIPE_SECRET_KEY` & `STRIPE_WEBHOOK_SECRET` $\rightarrow$ Live Stripe credentials.
   * `RESEND_API_KEY` $\rightarrow$ Live email sending key.
   * `SENTRY_DSN` $\rightarrow$ Production Sentry error tracking URL.
2. **DNS & Email Records**:
   * Add SPF and DKIM records provided by Resend / Postmark.
   * Add CNAME / A records pointing to hosting provider.
3. **Database Migration**: Run `npx prisma migrate deploy` on production database before traffic cutover.
