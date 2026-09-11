# CYBERSTYLE LLC — REST API Specification

Base URL: `https://cyberstyle.net/api` (Production) or `http://localhost:4000/api` (Development).

---

## 1. System Health & Probes

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Liveness probe returning process status and uptime |
| `/api/ready` | GET | Public | Readiness probe executing a live PostgreSQL ping (`SELECT 1`) |

### Example Response: `/api/health`
```json
{
  "status": "ok",
  "timestamp": "2026-09-02T20:48:35.000Z",
  "service": "cyberstyle-api",
  "uptime": 142.3
}
```

### Example Response: `/api/ready`
```json
{
  "status": "ready",
  "database": "connected",
  "timestamp": "2026-09-02T20:48:35.000Z",
  "service": "cyberstyle-api"
}
```

---

## 2. API Routes Matrix (Planned Across Phases)

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/verify-email`, `/api/auth/reset-password`, `/api/auth/magic-link`
- **Leads & Contacts**: `/api/leads` (POST public inquiry), `/api/contact` (POST submission), `/api/admin/leads` (GET/PATCH CRM stages)
- **Projects & Portal**: `/api/portal/projects`, `/api/portal/projects/:id`, `/api/portal/feedback`, `/api/portal/deliverables`
- **Invoices & Billing**: `/api/invoices`, `/api/invoices/:id/checkout`, `/api/webhooks/stripe`
- **Content & CMS**: `/api/content/posts`, `/api/content/case-studies`, `/api/content/reviews`, `/api/content/faqs`
- **Admin Email Center**: `/api/admin/emails/send-adhoc`, `/api/admin/emails/logs`
