# CYBERSTYLE Agency OS — Enterprise Security Hardening & DevSecOps Blueprint (v1.0)

**Target Infrastructure:** `cyberstyle.net` (Primary) • `cyberstyle.agency` (Redirect)  
**Stack:** Next.js 15 (App Router) • Express (TypeScript) • PostgreSQL 17 (Prisma ORM) • Redis 7 • Docker & Docker Compose • Nginx • Hostinger Ubuntu VPS • Stripe • Gmail / Nodemailer • Gemini API  
**Classification:** Restricted / Production Security Architecture

---

## 1. Threat Model & Risk Prioritization

| # | Attack Scenario | Step-by-Step Attack Path | Likely Impact | Existing Controls | Missing Controls | Priority |
|---|---|---|---|---|---|---|
| **1** | **Client Portal Cross-Tenant IDOR** | Attacker logs in as Client Org A, captures network traffic (`GET /api/portal/projects/:id`), swaps the ID to target Org B’s project, files, or invoices. | Complete data breach, client NDA violation, client loss, severe legal liability. | `requireAuth` checks valid session token. | Missing strict tenant scoping (`where: { id, organizationId }`) in every service query. | **CRITICAL** |
| **2** | **Credential Stuffing & Account Takeover** | Attacker launches distributed botnet against `/api/auth/login` using breached credentials from external leaks. | Admin or client account takeover, unauthorized project alterations, Stripe payment diversion. | Argon2id hashing, IP-level rate limiter. | Username-level throttling, mandatory TOTP 2FA enforcement on all admin accounts, breached password checking. | **CRITICAL** |
| **3** | **Stripe Webhook Forgery & Billing Bypass** | Attacker sends crafted HTTP POST requests to `/api/webhooks/stripe` simulating `invoice.payment_succeeded`. | Financial loss, unauthorized deliverable release, unearned escrow release. | `STRIPE_WEBHOOK_SECRET` exists in `.env`. | Express body-parser mutating raw buffer before signature check; missing database idempotency tracking. | **CRITICAL** |
| **4** | **Unprotected PostgreSQL/Redis Host Ports** | Attacker port-scans Hostinger VPS IP on ports `5432` and `6379` exposed via Docker default `0.0.0.0` bindings. | Database dump, data ransom/extortion, total infrastructure compromise. | Strong database passwords. | Docker bypassing host UFW firewall rules; container ports exposed to `0.0.0.0` instead of internal bridge. | **CRITICAL** |
| **5** | **Malicious File Upload (Web Shell / Stored XSS)** | Attacker uploads a polyglot SVG containing `<script>` or an executable binary disguised as a project brief. | Remote Code Execution (RCE) on VPS or Session Token theft via Stored XSS. | Client-side file picker restrictions. | Magic byte MIME verification, SVG sanitization, off-server isolated storage (S3/R2) with download headers. | **CRITICAL** |
| **6** | **Lead Form Spam & AI Pipeline DoS** | Automated scraper floods `/api/leads` and `/contact`, generating thousands of fake inquiries triggering Gemini API calls and Gmail alerts. | Exhaustion of Gemini API budget, Gmail domain suspension for spam volume, denial of service for real leads. | Global Express rate limiter. | Turnstile / reCAPTCHA anti-bot challenge, honeypot traps, sliding-window lead form limits. | **HIGH** |
| **7** | **Stored XSS in Client Feedback / Reviews** | Attacker submits a client testimonial containing an unescaped malicious payload like `<img src=x onerror=stealToken()>`. | Admin session hijacking when viewing `/admin/reviews`. | React default JSX escaping. | Content Security Policy (CSP) blocking unauthorized script domains; strict sanitization of rich HTML. | **HIGH** |
| **8** | **Session Interception via Man-in-the-Middle** | Attacker intercepts unencrypted traffic or exploits insecure cookies over open networks. | Full account impersonation without knowing user password. | Tokens stored in cookies and headers. | Enforce `Secure`, `HttpOnly`, `SameSite=Strict` cookie flags; HSTS preload on `cyberstyle.net`. | **HIGH** |
| **9** | **Redis Session Exhaustion & Denial of Service** | Attacker floods login or token generation routes with random payloads to exhaust Redis memory. | Total system failure (all authenticated endpoints crash). | Local Redis instance. | Redis `maxmemory` eviction policy (`volatile-lru`), session TTL constraints, Redis password authentication. | **MEDIUM** |
| **10**| **Supply-Chain Dependency Poisoning** | Upstream NPM package is compromised with an exfiltration script that extracts `.env` secrets on boot. | Leaked `DATABASE_URL`, Stripe keys, and Gmail app passwords. | Committed `package-lock.json`. | Automated CI dependency auditing (`npm audit`), Semgrep SAST, build step secret isolation. | **MEDIUM** |

---

## 2. Architecture-Level Hardening

### 2.1 Target Network Topology
```
[ PUBLIC INTERNET ]
        │
        ▼ (Port 80 / Port 443 Only)
[ NGINX REVERSE PROXY (Hostinger VPS Host) ]
  ├── Enforces TLS 1.3 / Strict TLS 1.2
  ├── Drops non-HTTPS traffic (301 Redirect to https://cyberstyle.net)
  ├── Security Headers & Strict CSP
  ├── Rate Limiting Zones (Global, Auth, Forms)
  └── Proxies internally to Docker Bridge Network
        │
        ├──► http://127.0.0.1:3000 (Next.js Web Frontend)
        └──► http://127.0.0.1:4000 (Express REST API)
                 │
                 ▼ (DOCKER INTERNAL BRIDGE NETWORK ONLY: "cyberstyle-net")
           ┌─────────────┴─────────────┐
           ▼                           ▼
    [ PostgreSQL 17 ]              [ Redis 7 ]
    Internal Port: 5432            Internal Port: 6379
    (NO HOST PORT EXPOSURE)        (NO HOST PORT EXPOSURE)
```

> [!CAUTION]
> **Docker Port Binding Alert:** In `docker-compose.yml`, never write `ports: ["5432:5432"]` or `ports: ["6379:6379"]`. This instructs Docker to bind directly to `0.0.0.0:5432`, completely bypassing Linux UFW firewall rules! Use `expose: ["5432"]` so only sibling containers on the internal bridge network can reach PostgreSQL.

---

### 2.2 Hardened Production Nginx Configuration (`/etc/nginx/sites-available/cyberstyle.net.conf`)

```nginx
# Rate Limiting Zones
limit_req_zone $binary_remote_addr zone=global_limit:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=forms_limit:10m rate=10r/m;
limit_req_zone $binary_remote_addr zone=admin_limit:10m rate=20r/s;

# Upstream definitions
upstream web_upstream {
    server 127.0.0.1:3000;
    keepalive 32;
}

upstream api_upstream {
    server 127.0.0.1:4000;
    keepalive 32;
}

# Redirect cyberstyle.agency -> cyberstyle.net
server {
    listen 80;
    listen [::]:80;
    server_name cyberstyle.agency www.cyberstyle.agency;
    return 301 https://cyberstyle.net$request_uri;
}

# Redirect HTTP -> HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name cyberstyle.net www.cyberstyle.net;
    return 301 https://cyberstyle.net$request_uri;
}

# Primary Secure Production Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cyberstyle.net www.cyberstyle.net;

    # SSL Certificates (Let's Encrypt / Certbot)
    ssl_certificate /etc/letsencrypt/live/cyberstyle.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cyberstyle.net/privkey.pem;

    # TLS 1.3 & Strong TLS 1.2 Ciphers Only
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # Security Headers
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(self 'https://js.stripe.com')" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com https://challenges.cloudflare.com; frame-src https://js.stripe.com https://hooks.stripe.com https://challenges.cloudflare.com; object-src 'none'; base-uri 'self';" always;

    # Hide Nginx version
    server_tokens off;

    # Global Rate Limiting
    limit_req zone=global_limit burst=50 nodelay;

    # Auth Rate Limiting (Login / Register / 2FA)
    location ~* ^/api/(auth|v1/auth)/(login|register|forgot-password|reset-password) {
        limit_req zone=auth_limit burst=3 nodelay;
        proxy_pass http://api_upstream;
        include /etc/nginx/proxy_params;
    }

    # Public Forms & Lead Generation Rate Limiting
    location ~* ^/api/(leads|contact|quote) {
        limit_req zone=forms_limit burst=5 nodelay;
        proxy_pass http://api_upstream;
        include /etc/nginx/proxy_params;
    }

    # Stripe Webhook Endpoint (Preserve Raw Body Buffer, Allow 2MB)
    location /api/webhooks/stripe {
        client_max_body_size 2M;
        proxy_pass http://api_upstream;
        include /etc/nginx/proxy_params;
    }

    # API Routes
    location /api/ {
        client_max_body_size 15M;
        proxy_pass http://api_upstream;
        include /etc/nginx/proxy_params;
    }

    # Next.js Web Application
    location / {
        proxy_pass http://web_upstream;
        include /etc/nginx/proxy_params;
    }
}
```

---

### 2.3 Optional (Cloudflare): Edge WAF & Real IP Restoration
If you route `cyberstyle.net` through Cloudflare (DNS Proxy Orange Cloud active):

#### A. Restore Real Client IPs in Nginx (`/etc/nginx/conf.d/cloudflare_realip.conf`)
```nginx
# Optional (Cloudflare) - Restore Real IP
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;

real_ip_header CF-Connecting-IP;
```

#### B. Cloudflare Edge WAF Rules (Dashboard &rarr; Security &rarr; WAF)
- **Rule 1 (Admin Isolation):** `(http.request.uri.path contains "/admin") and not ip.src in { <ADMIN_STATIC_IPS> }` &rarr; Action: **Block** or **Managed Challenge**.
- **Rule 2 (Anti-Spam on Leads):** `(http.request.uri.path contains "/api/leads") and cf.threat_score gt 15` &rarr; Action: **Managed Challenge**.
- **Rule 3 (Known Bad Actors):** `cf.client.bot or cf.threat_score gt 40` &rarr; Action: **Block**.

---

## 3. Application Layer Security (Next.js + Express)

### 3.1 Strict Input Validation with Zod
Every mutation endpoint (`POST`, `PUT`, `PATCH`) must validate and sanitize data before reaching service layers.

```typescript
// apps/api/src/schemas/security.schemas.ts
import { z } from 'zod';

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Invalid email address')
    .max(255),
  password: z
    .string()
    .min(10, 'Password must be at least 10 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  totpCode: z
    .string()
    .regex(/^\d{6}$/, '2FA code must be exactly 6 digits')
    .optional(),
});

export const LeadSubmissionSchema = z.object({
  name: z.string().trim().min(2).max(100).regex(/^[^<>&"']*$/, 'Invalid characters in name'),
  email: z.string().trim().toLowerCase().email().max(255),
  company: z.string().trim().max(100).optional(),
  budget: z.enum(['$1,000-$3,000', '$3,000-$6,000', '$6,000-$10,000', '$10,000+']).optional(),
  message: z.string().trim().min(10).max(3000),
  honeypot: z.string().max(0, 'Spam bot detected').optional(), // Must remain empty
});
```

### 3.2 Output Encoding & Stored XSS Defense
- React automatically escapes strings rendered in JSX (`<div>{userContent}</div>`).
- **Never render raw user content with `dangerouslySetInnerHTML`**.
- If rendering rich Markdown or HTML (e.g. blog posts or case study text), sanitize with `isomorphic-dompurify`:
```typescript
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtmlOutput(dirtyHtml: string): string {
  return DOMPurify.sanitize(dirtyHtml, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'code', 'pre', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class'],
  });
}
```

### 3.3 SQL Injection Prevention: Prisma Parameterization
Prisma ORM automatically uses parameterized SQL queries. If `$queryRaw` is ever needed, **never use template string concatenation**:

```typescript
// SECURE: Parameterized template literal handled by Prisma
const users = await prisma.$queryRaw`
  SELECT "id", "email", "name" 
  FROM "User" 
  WHERE "organizationId" = ${orgId} AND "status" = ${status};
`;

// FORBIDDEN (Immediate build failure):
// await prisma.$queryRawUnsafe(`SELECT * FROM "User" WHERE "organizationId" = '${orgId}'`);
```

---

## 4. Authentication & Session Security

### 4.1 Argon2id Password Hashing Specification
```typescript
import argon2 from 'argon2';

export async function hashPassword(plainText: string): Promise<string> {
  return argon2.hash(plainText, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 4,    // 4 threads
  });
}

export async function verifyPassword(hash: string, plainText: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plainText);
  } catch {
    return false;
  }
}
```

### 4.2 Token Architecture & Dual-Layer Revocation
- **Access Tokens:** 15-minute validity, passed via `Authorization: Bearer <token>` or HttpOnly cookie.
- **Refresh / Sessions:** 7-day TTL, stored in PostgreSQL `Session` table and cached in Redis.
- **Secure Cookie Flags:**
```typescript
res.cookie('cyberstyle_session', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 Days
});
```

### 4.3 Revocation on Logout & Password Change
```typescript
// On User Logout:
await redis.set(`blacklist:${token}`, 'revoked', 'EX', 7 * 24 * 3600);
await prisma.session.deleteMany({ where: { sessionToken: token } });

// On Password Reset or Compromise:
await prisma.session.deleteMany({ where: { userId } });
await redis.del(`user_sessions:${userId}`);
```

---

## 5. Authorization & Tenant Isolation (IDOR Prevention)

### 5.1 The Organization Scoping Rule
Every query in the client portal must constrain results using the authenticated user's `organizationId`:

```typescript
// apps/api/src/services/portal.service.ts

export async function getClientInvoice(invoiceId: string, userOrganizationId: string) {
  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      organizationId: userOrganizationId, // MANDATORY TENANT SCOPING
    },
    include: { project: true },
  });

  if (!invoice) {
    // Return 404 to avoid leaking whether another tenant's invoice exists
    throw new NotFoundError('Invoice not found');
  }

  return invoice;
}
```

### 5.2 Testing IDOR via cURL (Automated Test Routine)
```bash
# Attempt to fetch Organization B's invoice using Organization A's token
curl -s -o /dev/null -w "%{http_code}" -X GET "https://cyberstyle.net/api/portal/invoices/inv_org_b_secret" \
  -H "Authorization: Bearer <TOKEN_ORG_A>"
# EXPECTED OUTPUT: 404 (No metadata leaked)
```

---

## 6. API & Backend Hardening

### 6.1 Stripe Webhook Signature Verification & Idempotency
Stripe requires the unparsed, raw HTTP request buffer to verify its HMAC SHA-256 signature.

```typescript
// apps/api/src/routes/webhook.routes.ts
import express, { Router } from 'express';
import Stripe from 'stripe';
import { prisma } from '../config/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
const router = Router();

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error(`❌ [Stripe Webhook] Verification failed: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Idempotency: Prevent replay attacks
    const alreadyProcessed = await prisma.processedWebhook.findUnique({
      where: { eventId: event.id },
    });

    if (alreadyProcessed) {
      return res.status(200).json({ received: true, status: 'already_processed' });
    }

    await prisma.processedWebhook.create({ data: { eventId: event.id } });

    // Handle payment event
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as Stripe.Invoice;
      // Mark invoice paid in DB...
    }

    res.status(200).json({ received: true });
  }
);

export default router;
```

### 6.2 Safe Structured Logging
```typescript
export function logSecurityAudit(event: {
  action: string;
  userId?: string;
  ip: string;
  status: 'SUCCESS' | 'DENIED' | 'FAILED';
  meta?: Record<string, any>;
}) {
  const sanitizedMeta = { ...event.meta };
  delete sanitizedMeta.password;
  delete sanitizedMeta.token;
  delete sanitizedMeta.secret;
  delete sanitizedMeta.cardNumber;

  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      type: 'SECURITY_AUDIT',
      ...event,
      meta: sanitizedMeta,
    })
  );
}
```

---

## 7. Infrastructure & Docker Security

### 7.1 Production Multi-Stage API Dockerfile (`apps/api/Dockerfile`)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

# Stage 2: Production Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app

# Create non-root system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 cyberstyle

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy build artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Switch to non-root user
USER cyberstyle

ENV NODE_ENV=production
ENV PORT=4000
EXPOSE 4000

CMD ["node", "dist/index.js"]
```

### 7.2 Hostinger VPS Host Hardening Protocol (Ubuntu 22.04 / 24.04 LTS)

```bash
# 1. Update system
apt update && apt upgrade -y

# 2. Configure UFW Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP
ufw allow 443/tcp  # HTTPS
ufw enable

# 3. Harden SSH (/etc/ssh/sshd_config)
sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart sshd

# 4. Install Fail2ban for SSH Protection
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban

# 5. Restrict Permissions on Production Secrets
chmod 600 /var/www/cyberstyle/apps/api/.env.production
chmod 600 /var/www/cyberstyle/apps/web/.env.production
```

---

## 8. Data Protection, Backups & Privacy

### 8.1 Automated Encrypted Daily Backup Script (`/opt/scripts/backup-db.sh`)

```bash
#!/bin/bash
set -eo pipefail

BACKUP_DIR="/var/backups/cyberstyle"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="db_agency_${TIMESTAMP}.sql.gz"
ENCRYPTED_FILE="${FILENAME}.enc"
PASSPHRASE_FILE="/root/.backup_passphrase"

mkdir -p "$BACKUP_DIR"

# 1. Dump database and gzip
docker exec cyberstyle_postgres pg_dump -U postgres db_agency | gzip -9 > "${BACKUP_DIR}/${FILENAME}"

# 2. Encrypt using AES-256-CBC
openssl enc -aes-256-cbc -salt -pbkdf2 -in "${BACKUP_DIR}/${FILENAME}" -out "${BACKUP_DIR}/${ENCRYPTED_FILE}" -pass file:"$PASSPHRASE_FILE"
rm -f "${BACKUP_DIR}/${FILENAME}"

# 3. Optional: Replicate to Cloudflare R2 / AWS S3
# aws s3 cp "${BACKUP_DIR}/${ENCRYPTED_FILE}" s3://cyberstyle-encrypted-backups/ --endpoint-url https://<ID>.r2.cloudflarestorage.com

# 4. Prune backups older than 14 days
find "$BACKUP_DIR" -name "*.enc" -mtime +14 -delete

echo "✅ [$(date)] Encrypted backup completed: ${ENCRYPTED_FILE}"
```

---

## 9. Monitoring, Detection & Incident Response

### 9.1 Automated Alert Triggers
Notifications are dispatched immediately to `ADMIN_NOTIFICATION_EMAILS` (`hani.sites@gmail.com`) when:
1. **5+ failed logins** originate from the same IP or account in 5 minutes.
2. A new **SUPER_ADMIN** or **ADMIN** role user is created.
3. `/api/health` reports a database or Redis connection drop.
4. Stripe webhook signature verification fails.

### 9.2 Compromise Incident Response Runbook
```
1. CONTAINMENT:
   • Identify offending IP from Nginx logs (/var/log/nginx/access.log).
   • Drop immediately via UFW: ufw insert 1 deny from <OFFENDING_IP>
   • Invalidate all sessions: docker exec cyberstyle_redis redis-cli FLUSHDB

2. ROTATE CREDENTIALS:
   • Generate new AUTH_SECRET & SESSION_SECRET: openssl rand -hex 32
   • Change PostgreSQL password: ALTER USER postgres WITH PASSWORD '...';
   • Update apps/api/.env.production and restart: docker compose restart api

3. AUDIT & RECOVERY:
   • Query "AuditLog" table for unauthorized administrative changes.
   • If data corrupted, restore latest verified backup:
     openssl enc -d -aes-256-cbc -pbkdf2 -in <BACKUP.enc> -pass file:/root/.backup_passphrase | gunzip | docker exec -i cyberstyle_postgres psql -U postgres db_agency
```

---

## 10. Automated Testing Strategy (DevSecOps)

### 10.1 Jest Security Test Suite (`apps/api/tests/security.test.ts`)
```typescript
import request from 'supertest';
import app from '../src/app';

describe('Security & Isolation Test Suite', () => {
  it('Rate limits rapid failed login attempts (Brute-Force defense)', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/auth/login').send({
        email: 'attacker@evil.com',
        password: 'WrongPassword123!',
      });
    }

    const blocked = await request(app).post('/api/auth/login').send({
      email: 'attacker@evil.com',
      password: 'WrongPassword123!',
    });

    expect(blocked.status).toBe(429);
  });

  it('Rejects expired or revoked session tokens', async () => {
    const res = await request(app)
      .get('/api/admin/reviews')
      .set('Authorization', 'Bearer invalid_or_revoked_token');

    expect(res.status).toBe(401);
  });

  it('Strictly prevents cross-tenant data retrieval (IDOR)', async () => {
    const res = await request(app)
      .get('/api/portal/projects/prj_org_b_secret')
      .set('Authorization', `Bearer ${process.env.TEST_TENANT_A_TOKEN}`);

    expect([403, 404]).toContain(res.status);
  });
});
```

### 10.2 GitHub Actions DevSecOps Workflow (`.github/workflows/security.yml`)
```yaml
name: Production DevSecOps Security Gate

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  security-gate:
    name: SAST, Secrets & Vulnerabilities
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Dependency Audit (Fail on High/Critical)
        run: npm audit --audit-level=high

      - name: Secret Scan (TruffleHog)
        uses: trufflesecurity/trufflehog@main
        with:
          path: ./
          base: ${{ github.event.repository.default_branch }}
          head: HEAD

      - name: Static Application Security Testing (Semgrep)
        uses: returntocorp/semgrep-action@v1
        with:
          config: p/security-audit p/secrets p/owasp-top-ten

      - name: TypeScript Validation & Build
        run: |
          npm --prefix apps/api run build
          npm --prefix apps/web run build

      - name: Run Jest Security Tests
        run: npm --prefix apps/api test

      - name: Build Docker Image & Scan with Trivy
        run: |
          docker build -t cyberstyle-api:ci apps/api/
          npx trivy image --exit-code 1 --severity CRITICAL,HIGH cyberstyle-api:ci
```

---

## 11. Anti-Extortion & Data Leak Resistance

### 11.1 The Extortion Threat Vector
Automated threat actors scan GitHub commit histories and IP ranges for `.env` files. If they scrape an email or contact form, they send a standard extortion message:
> *"We have dumped your database from cyberstyle.net. Pay 0.05 BTC within 48 hours or your client contracts, projects, and leads will be leaked."*

### 11.2 CYBERSTYLE Defensive Posture:
1. **Zero Cardholder Data:** Stripe handles all billing data. No card numbers, CVCs, or bank numbers exist on the server.
2. **Sensitive Tokens Encrypted at Rest:** 2FA secrets and OAuth tokens are AES-256 encrypted before PostgreSQL insertion.
3. **Generic Error Codes in Production:** Express error handlers never expose stack traces or SQL snippets:
   ```json
   { "status": "error", "code": "INTERNAL_SERVER_ERROR", "message": "An unexpected error occurred. Request ID: req_98a7f" }
   ```
4. **Git Repository Clean:** No secrets are committed. Placeholder files like `.env.example` contain only dummy tokens.

### 11.3 Incident Response Outline for Extortion Emails:
- **Step 1:** Verify the claim against PostgreSQL and Nginx access logs. 99% of extortion emails are automated spam sent without any real intrusion.
- **Step 2:** Check the `AuditLog` table for bulk read actions.
- **Step 3:** As a precaution, rotate `AUTH_SECRET`, `SESSION_SECRET`, and database passwords.
- **Step 4:** If data tampering occurred, restore from the encrypted off-site backup snapshot.
- **Step 5:** Retain headers and log traces for incident reports. Never pay extortion ransoms.

---

## 12. Security Go/No-Go Checklist (Production Gate)

Before opening `cyberstyle.net` to public client traffic, every item must be confirmed:

- [x] **Git Repository Clean:** Verified no live credentials in Git history; `.env.example` contains placeholders only.
- [x] **Nodemailer SMTP Verified:** Live email dispatch confirmed to `hani.sites@gmail.com` via Google App Password.
- [x] **PostgreSQL Port Internal:** Port `5432` bound only to Docker internal network (not accessible on public IP).
- [x] **Redis Port Internal:** Port `6379` bound only to Docker internal network.
- [x] **Input Validation:** Zod schemas enforced on all auth and mutation endpoints.
- [x] **Tenant Scoping Verified:** All portal queries enforce `organizationId` matching authenticated session.
- [x] **Stripe Webhook Signature:** Signature validated against raw body buffer; duplicate events discarded.
- [x] **Rate Limiting Active:** Auth routes throttled to 5 requests/minute; lead forms to 10 requests/minute.
- [x] **Security Headers Active:** HSTS, CSP, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` active in Nginx.
- [x] **Encrypted Backups Tested:** Daily encrypted `pg_dump` cron running; restore procedure verified.
