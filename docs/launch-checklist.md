# CYBERSTYLE LLC — Production Launch & DevOps Runbook

---

## 1. Pre-Flight Verification Checklist

### 1.1 Infrastructure & Environment Variables
- [ ] PostgreSQL 16 initialized with all 32 Prisma models: `npx prisma db push` or `npx prisma migrate deploy`.
- [ ] Super Admin and seed data populated: `npx prisma db seed`.
- [ ] Redis 7 instance active and reachable by BullMQ workers on port 6379.
- [ ] Production `.env` validated in both `apps/api` and `apps/web`:
  - `NODE_ENV=production`
  - `DATABASE_URL` (PostgreSQL connection pool)
  - `REDIS_URL`
  - `AUTH_SECRET` & `SESSION_SECRET` (64-byte random hex)
  - `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM=hello@cyberstyle.net`

### 1.2 Security & Headers Verification
- [ ] Nginx TLS 1.3 configured with Let's Encrypt certificates (`/etc/letsencrypt/live/cyberstyle.net/`).
- [ ] HTTP strictly redirects to HTTPS (Port 80 $\rightarrow$ Port 443 301 Redirect).
- [ ] Strict-Transport-Security (HSTS) header enabled (`max-age=63072000; includeSubDomains; preload`).
- [ ] Content Security Policy (CSP) enabled allowing Next.js bundles, Three.js WebGL blobs, and Stripe payment frames.
- [ ] Anti-spam honeypot active on `/start-project` and `/contact`.
- [ ] Strict rate limiters active on `/api/auth/*` and `/api/leads`.

### 1.3 Core Web Vitals & Performance
- [ ] Largest Contentful Paint (LCP) < 1.8s across all pages.
- [ ] First Input Delay / Interaction to Next Paint (INP) < 50ms.
- [ ] Cumulative Layout Shift (CLS) = 0.
- [ ] Three.js Silk canvas throttled to `devicePixelRatio` clamped at `[1, 1.5]` and disabled gracefully for `prefers-reduced-motion`.

---

## 2. Production Docker Deployment Commands

```bash
# 1. Clone repository on VPS
git clone https://github.com/cyberstyle/agency-platform.git /var/www/cyberstyle
cd /var/www/cyberstyle

# 2. Configure production environment files
cp .env.production.example apps/api/.env
cp .env.production.example apps/web/.env

# 3. Build and launch all production containers
docker compose -f docker-compose.prod.yml up --build -d

# 4. Verify running services
docker compose -f docker-compose.prod.yml ps

# 5. Check API health
curl -f https://cyberstyle.net/api/health
```

---

## 3. Automated Database Backup & Recovery

Nightly backups run automatically via cron at 02:00 UTC:

```bash
# Manual immediate backup
bash infra/scripts/backup.sh

# Restore database from archive
bash infra/scripts/restore.sh /var/backups/cyberstyle/backup-2026-09-02.sql.gz
```

---

## 4. Rollback Plan

If critical defects are identified post-launch:
1. Revert to previous Docker image tags:
   ```bash
   docker compose -f docker-compose.prod.yml down
   docker compose -f docker-compose.prod.yml up -d --no-build
   ```
2. In the event of schema corruptions, restore the latest verified snapshot using `bash infra/scripts/restore.sh`.
