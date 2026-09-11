import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Zap, Server, ShieldCheck, Database } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Custom SaaS & Platform Engineering',
  description:
    'Full-stack custom SaaS, internal business operations tools, and client portals built with Next.js, Express, PostgreSQL, and Docker. Starting from $3,000.',
};

export default function CustomSaaSServicePage() {
  const deliverables = [
    'Full-Stack Architecture: Next.js 15 App Router + Express REST API + PostgreSQL',
    'Self-Hosted Authentication & RBAC (Argon2id, Session rotation, TOTP 2FA)',
    'Multi-Tenant Data Partitioning & Security Scoping',
    'Stripe Invoicing, Hosted Checkouts & Idempotent Webhook Verification',
    'Client Portals with Real-Time Milestone Tracking & Deliverable Vaults',
    'Redis Caching & BullMQ Background Job Architecture',
    'Docker Compose VPS Deployment Scripts with Nginx & Let’s Encrypt TLS',
    'Automated Nightly Encrypted Database Backups & Restore Runbooks',
  ];

  const faqs = [
    {
      q: 'What is included in a $3,000 Custom SaaS/MVP build?',
      a: 'We deliver a production-ready software foundation: normalized PostgreSQL schema, secure authentication and RBAC, core business workflows, Stripe payment integration, client/admin dashboards, and VPS deployment scripts.',
    },
    {
      q: 'Why self-host auth and database instead of using third-party managed services?',
      a: 'Self-hosting on a high-performance Linux VPS eliminates expensive per-user pricing (like Clerk or Firebase Auth tier jumps), ensures 100% data sovereignty, and keeps your operational costs predictable as you scale.',
    },
    {
      q: 'Do you provide maintenance and ongoing development?',
      a: 'Yes. We offer continuous growth and maintenance partnerships to ship new features, monitor server health, and scale database performance.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Service // 03"
        title="Custom SaaS & Platform Engineering"
        description="We engineer bespoke full-stack SaaS applications, client portals, and internal tools built for security, scalability, and long-term business value. Starting from $3,000."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Custom Software</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Off-the-shelf software rarely fits unique business models. We build platforms you own.
              </h2>
            </div>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
              When standard tools limit your operational efficiency or client experience, custom software creates an enduring competitive advantage. We engineer modular, secure, high-performance web applications ready for enterprise workloads.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display font-bold text-xl text-white">Full-Stack Architecture Scope</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card variant="highlight" className="p-8 space-y-6 sticky top-28 bg-[#0C0F17]">
              <div>
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">Investment Framework</span>
                <div className="font-display font-bold text-4xl text-white mt-1">From $3,000</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Full product MVP engineering covering data modeling, REST API, authentication, Stripe billing, and VPS containerization.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between"><span>Timeline:</span><span className="text-white">3–6 Weeks</span></div>
                <div className="flex justify-between"><span>Database:</span><span className="text-white">PostgreSQL 16 + Prisma</span></div>
                <div className="flex justify-between"><span>Auth & Security:</span><span className="text-white">Argon2id + 2FA</span></div>
              </div>

              <Link href="/start-project">
                <Button variant="electric" size="lg" className="w-full justify-center" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Start SaaS Architecture Build
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Frequently Asked</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
              Questions About Custom SaaS
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <h4 className="font-display font-bold text-lg text-black">{faq.q}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
