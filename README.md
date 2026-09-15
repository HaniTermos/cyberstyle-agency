# CYBERSTYLE LLC — Enterprise Agency & Client Operations Platform

A modern, high-conversion web platform, client operations portal, and internal CRM mission control engineered with **Next.js 15 App Router**, **Three.js WebGL Shaders**, **Express.js**, **PostgreSQL 16 (Prisma ORM)**, and **Redis BullMQ Workers**.

---

## 🌟 Quick Links & System Overview

- **Public Showcase & Marketing**: `http://localhost:3000`
- **Interactive Project Onboarding Funnel**: `http://localhost:3000/start-project`
- **Dedicated Admin Login**: `http://localhost:3000/admin/login`
- **Executive Operations Console**: `http://localhost:3000/admin/dashboard`
- **Client Operations Portal**: `http://localhost:3000/portal`
- **Client Invoices Ledger**: `http://localhost:3000/portal/invoices`
- **Backend REST API**: `http://localhost:4000/api`

---

## 🔐 Initial Account Bootstrap

> [!IMPORTANT]
> For security, default credentials are not pre-packaged. Generate your initial local administrator credentials using the secure CLI seed script:
> ```bash
> npm run prisma:seed
> ```
> This creates a unique development administrator account and outputs credentials strictly to your local terminal. In production, administrator accounts must be provisioned through secure invitation tokens with mandatory TOTP MFA enrollment.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js >= 20.0.0
- Docker & Docker Compose (or local PostgreSQL 16 + Redis 7 instances)

### 2. Installation & Setup
```bash
# 1. Install all dependencies across monorepo workspaces
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Initialize database schema & seed demo data
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. Start full-stack development environment (Next.js + Express API)
npm run dev
```

---

## 📚 Complete Technical Documentation

For in-depth architecture, code inventories, security specifications, and DevOps runbooks, see the [`docs/`](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs) directory:

- 📖 [**Full System Specification & Code Inventory**](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/SYSTEM_SPECIFICATION_REPORT.md)
- 🏗️ [**Architecture & System Diagrams**](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/architecture.md)
- 🔌 [**REST API Documentation**](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/api.md)
- 🔐 [**Security & Cryptographic Standards**](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/security.md)
- 🌐 [**Environment Variable Matrix**](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/env-var-reference.md)
- 🚢 [**Production Launch & DevOps Runbook**](file:///c:/Users/Hani/OneDrive/Desktop/agency%20project/docs/launch-checklist.md)