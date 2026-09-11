# CYBERSTYLE LLC — Production Security Guide

## 1. Security Architecture & Controls

### Password Hashing
- Algorithm: **Argon2id** (memory cost: 65536 KiB, time cost: 3 iterations, parallelism: 4 threads).
- Defense against GPU/ASIC brute force attacks.

### Session & Token Protection
- JWT / Session cookies issued with:
  - `HttpOnly: true` (prevents XSS cookie theft).
  - `Secure: true` (HTTPS only).
  - `SameSite: Lax` / `Strict` (CSRF mitigation).
  - Domain bound to `.cyberstyle.net`.

### Rate Limiting & Abuse Prevention
- Tier 1: Nginx IP-level rate limiting (`20r/s` burst `40`).
- Tier 2: Redis-backed endpoint limits on sensitive routes (`/api/auth/login`, `/api/auth/reset-password`, `/api/leads` - max 5 submissions per minute).

### Content Security Policy (CSP) & Headers
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN` (prevents clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Input Validation & SQL Injection Defense
- 100% of endpoints validated with **Zod**.
- **Prisma ORM** ensures parameterized SQL queries; no raw string concatenation.

### Audit Logging
- Every privilege escalation, role modification, invoice status change, or review publication is logged in the `AuditLog` table with IP and user metadata.
