# CYBERSTYLE LLC — Environment Variable Matrix

This reference specifies every environment variable, the consuming service, its classification (Public vs. Secret), and its default value.

| Variable Name | Consuming Service | Classification | Description | Default / Example |
|---|---|---|---|---|
| `NODE_ENV` | All | Config | Runtime environment (`development`, `production`, `test`) | `development` |
| `PORT` | API | Config | Port Express listens on | `4000` |
| `API_URL` | API & Web | Public / Internal | Base URL for API service | `http://localhost:4000` |
| `NEXT_PUBLIC_APP_URL` | Web | **Public** | Public client domain | `http://localhost:3000` |
| `NEXT_PUBLIC_API_URL` | Web | **Public** | Client-side API route | `http://localhost:4000/api` |
| `DATABASE_URL` | API & Prisma | **Secret** | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/cyberstyle_db` |
| `REDIS_URL` | API & Workers | **Secret** | Redis connection string | `redis://localhost:6379` |
| `AUTH_SECRET` | API | **Secret** | Encryption secret for auth tokens & Argon2id | 64-char random hex string |
| `SESSION_SECRET` | API | **Secret** | Encryption secret for HttpOnly sessions | 64-char random hex string |
| `COOKIE_DOMAIN` | API | Config | Cookie domain scope | `localhost` / `.cyberstyle.net` |
| `CORS_ORIGINS` | API | Config | Comma-separated allowed origins | `http://localhost:3000,https://cyberstyle.net` |
| `GOOGLE_CLIENT_ID` | API | Config | Google OAuth SSO App ID | *empty* |
| `GOOGLE_CLIENT_SECRET` | API | **Secret** | Google OAuth SSO Secret | *empty* |
| `MICROSOFT_CLIENT_ID` | API | Config | Microsoft Azure AD App ID | *empty* |
| `MICROSOFT_CLIENT_SECRET`| API | **Secret** | Microsoft Azure AD Secret | *empty* |
| `SMTP_HOST` | Email Worker | Config | SMTP host provider | `smtp.mailgun.org` / `email-smtp.us-east-1.amazonaws.com` |
| `SMTP_PORT` | Email Worker | Config | SMTP port (587 or 465) | `587` |
| `SMTP_USER` | Email Worker | **Secret** | SMTP username | *empty* |
| `SMTP_PASSWORD` | Email Worker | **Secret** | SMTP password | *empty* |
| `EMAIL_FROM` | Email Worker | Config | Default sender address | `CYBERSTYLE <hello@cyberstyle.net>` |
| `ADMIN_NOTIFICATION_EMAILS`| API | Config | Comma-separated admin alert recipients | `admin@cyberstyle.net` |
| `STRIPE_SECRET_KEY` | API | **Secret** | Stripe private API key | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | API | **Secret** | Stripe webhook signing secret | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Web | **Public** | Stripe publishable key | `pk_test_...` |
| `NEXT_PUBLIC_GTM_ID` | Web | **Public** | Google Tag Manager ID | `GTM-XXXXXXX` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Web | **Public** | GA4 Measurement ID | `G-XXXXXXXXXX` |
| `SENTRY_DSN` | API & Web | Public / Config | Error tracking DSN | *empty* |
