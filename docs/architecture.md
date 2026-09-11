# CYBERSTYLE LLC — System Architecture & Technical Specification

## 1. Monorepo Structure

```
agency project/
├── apps/
│   ├── web/               # Next.js 15 App Router (Marketing, Portal, Admin)
│   └── api/               # Express.js REST API Service (Node 22 / TypeScript)
├── packages/
│   ├── config/            # Shared TypeScript & ESLint configs
│   ├── ui/                # Shared Design System tokens & primitives
│   └── email/             # Nodemailer templates and layout helpers
├── prisma/
│   ├── schema.prisma      # Normalized PostgreSQL schema (30+ models)
│   └── seed.ts            # Admin, settings, and baseline seed data
├── infra/
│   ├── docker-compose.yml # Local Docker container stack
│   ├── docker-compose.prod.yml # Production multi-container VPS configuration
│   ├── nginx/             # Nginx reverse proxy, SSL, and rate limit rules
│   └── scripts/           # Automated backup and disaster recovery scripts
└── docs/                  # Engineering specifications and guides
```

---

## 2. End-to-End System Architecture (Mermaid)

```mermaid
flowchart TB
    subgraph Public Web Traffic
        Browser[Client Browser / Mobile]
    end

    subgraph Production VPS Host
        Nginx[Nginx Reverse Proxy :80/:443]
        
        subgraph Docker Network: cyberstyle_network
            NextWeb[Next.js App Router - Web & Portal :3000]
            ExpressAPI[Express.js REST API :4000]
            Postgres[(PostgreSQL 16 Database :5432)]
            RedisCluster[(Redis 7 Cache & Queues :6379)]
            BullWorker[BullMQ Background Worker]
        end
    end

    subgraph External Services
        SMTP[SMTP Relay - Transactional Mail]
        StripeAPI[Stripe Payments API]
        S3Storage[S3 / Object Storage]
    end

    Browser -->|HTTPS TLS 1.3| Nginx
    Nginx -->|/ or /portal/*| NextWeb
    Nginx -->|/api/*| ExpressAPI
    
    NextWeb -.->|Server Component Fetch| ExpressAPI
    ExpressAPI -->|Prisma Client / Connection Pool| Postgres
    ExpressAPI -->|Session Tokens & Rate Limits| RedisCluster
    ExpressAPI -->|Dispatch Jobs| BullWorker
    
    BullWorker -->|Async Email Delivery| SMTP
    ExpressAPI -->|Hosted Checkout & Webhooks| StripeAPI
    ExpressAPI -->|Deliverables / Assets| S3Storage
```

---

## 3. Data Flow & Security Boundaries

1. **Client Isolation**: Client portal users are strictly partitioned by `organizationId`. Admin APIs enforce server-side validation against `UserRole.ADMIN` and `UserRole.SUPER_ADMIN`.
2. **Asynchronous Processing**: High-latency tasks (email dispatch, lead notifications, invoice generation) are pushed to Redis queues via BullMQ and processed by background workers to maintain <100ms API response times.
3. **Database Transactions**: All financial calculations (invoices, line items, payments) and lead captures utilize atomic Prisma transactions (`prisma.$transaction`).
