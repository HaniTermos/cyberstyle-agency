import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  Code2,
  Database,
  Lock,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Server,
  FileCheck,
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { CTA_LABELS, OWNERSHIP_DISCLOSURE } from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Engineering Delivery Standards // CYBERSTYLE',
  description:
    'Technical architecture specifications, security benchmarks, performance standards, and code ownership policies for technical buyers and evaluating engineers.',
};

export default function DeliveryStandardsPage() {
  const standards = [
    {
      category: 'Frontend Engineering',
      icon: <Layers className="w-5 h-5 text-[#00F0FF]" />,
      headline: 'Next.js 15, TypeScript & Responsive Systems',
      details: [
        'Strict TypeScript compilation with zero implicit any types.',
        'Next.js App Router with server-side rendering and static edge optimization.',
        'Semantic HTML5 structure ensuring full keyboard and screen-reader accessibility (WCAG 2.1 AA).',
        'Tailwind CSS design token system for strict visual consistency and zero unused CSS bundle bloat.',
        'Hardware-accelerated WebGL / Three.js canvases with DPR limits [1.0, 1.5] and reduced-motion fallback.',
      ],
    },
    {
      category: 'Performance & Core Web Vitals',
      icon: <Zap className="w-5 h-5 text-emerald-400" />,
      headline: 'Sub-Second Loading & 90+ Lighthouse Target',
      details: [
        'Target Largest Contentful Paint (LCP) under 1.2 seconds across mobile 4G connections.',
        'Zero Cumulative Layout Shift (CLS < 0.05) through explicit media aspect ratios and font preloading.',
        'Next-gen image delivery in AVIF / WebP with automatic responsive srcSets.',
        'Edge CDN caching headers configured for static assets and immutable vendor bundles.',
        'Client-side JavaScript bundles aggressively tree-shaken and code-split per route.',
      ],
    },
    {
      category: 'Backend & Data Infrastructure',
      icon: <Database className="w-5 h-5 text-[#0080FF]" />,
      headline: 'PostgreSQL, Prisma & Event-Driven Workers',
      details: [
        'Relational data integrity modeled via PostgreSQL schemas with strict foreign key constraints.',
        'Prisma ORM for type-safe database migrations, schema synchronization, and deterministic querying.',
        'Redis-backed BullMQ job queues for asynchronous background tasks, email dispatch, and webhook processing.',
        'Connection pooling and transaction boundaries configured to withstand concurrent inquiry surges.',
        'Automated database snapshot backup scripts with point-in-time recovery runbooks.',
      ],
    },
    {
      category: 'Security & Authentication',
      icon: <Lock className="w-5 h-5 text-[#00F0FF]" />,
      headline: 'Argon2id Hashing, Isolation & Zero-Trust Secrets',
      details: [
        'RFC 9106 Argon2id password hashing paired with cryptographic refresh token rotation.',
        'Tenant-level isolation and strict role-based access control (RBAC) across all portal endpoints.',
        'OWASP Top 10 compliance: parameterized queries, helmet security headers, and strict CORS configuration.',
        'Runtime request validation via Zod schemas to reject malformed or malicious payloads at the edge.',
        'Zero plain-text credentials in version control; environment variables strictly validated at server startup.',
      ],
    },
    {
      category: 'API & Integrations',
      icon: <Server className="w-5 h-5 text-purple-400" />,
      headline: 'Deterministic Webhooks & Fault-Tolerant Gateways',
      details: [
        'Idempotent webhook consumers with cryptographic signature verification (e.g. Stripe, Resend).',
        'Exponential backoff and dead-letter queues to prevent data loss during third-party service outages.',
        'Clean separation between internal domain services and third-party vendor adapters.',
        'Structured JSON logging with unique correlation IDs per HTTP request for instant tracing.',
      ],
    },
    {
      category: 'Code Ownership & Handover',
      icon: <FileCheck className="w-5 h-5 text-emerald-400" />,
      headline: '100% Repository Transfer & Zero Vendor Lock-In',
      details: [
        'Complete Git repository transfer including full commit history and configuration files.',
        'Unminified, human-readable source code with inline architecture documentation.',
        'Docker Compose production manifests for turnkey self-hosting on standard Linux VPS infrastructure.',
        'Clear environment variable documentation, onboarding guides, and team handover sessions.',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00F0FF] selection:text-black">
      <PageBanner
        badgeText="Technical Specification // Delivery Standards"
        title="Engineering Quality & Delivery Standards."
        description="For CTOs, technical leads, and evaluating engineers: how CYBERSTYLE builds, tests, deploys, and secures modern web architectures."
      />

      {/* Main Specifications Section */}
      <section className="py-20 px-6 bg-[#080A0F] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
              Engineering Discipline
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
              Built for speed, durability, and complete client ownership.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              We do not build on closed proprietary platforms or bloated visual page builders. Every project is engineered using modern, open-standard technologies that your team or any qualified developer can inspect, extend, and deploy anywhere.
            </p>
          </div>

          {/* Grid of Standards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {standards.map((spec, index) => (
              <Card
                key={index}
                variant="dark"
                className="p-8 flex flex-col justify-between h-full bg-[#0B0E14] border border-white/10 hover:border-[#00F0FF]/40 transition-all duration-300"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      {spec.icon}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">
                      Spec 0{index + 1}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider block mb-1">
                      {spec.category}
                    </span>
                    <h3 className="font-display font-bold text-xl text-white">
                      {spec.headline}
                    </h3>
                  </div>

                  <ul className="space-y-2.5 text-xs text-neutral-300">
                    {spec.details.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00F0FF] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          {/* Ownership & Portability Notice */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Full Code &amp; Asset Ownership Policy</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {OWNERSHIP_DISCLOSURE}
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed font-mono">
              Deliverables are provided via private Git repository transfer with complete build scripts, Docker deployment configurations, and migration tools so your company retains total digital sovereignty.
            </p>
          </div>

          {/* Action Footer */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-bold text-xl text-white">
                Ready to review a technical scope for your project?
              </h4>
              <p className="text-xs text-neutral-400 font-sans mt-1">
                Share your requirements and we will provide a detailed milestone architecture plan.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link href="/pricing">
                <Button variant="outline" size="sm">
                  View Plan Investments
                </Button>
              </Link>
              <Link href="/start-project">
                <Button variant="electric" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                  {CTA_LABELS.primary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
