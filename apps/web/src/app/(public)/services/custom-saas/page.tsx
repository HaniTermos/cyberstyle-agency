import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Zap, Server, ShieldCheck, Database, Check, Wrench } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { DynamicFaqAccordion } from '@/components/faq/DynamicFaqAccordion';
import {
  SERVICES,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Custom Web Applications, Client Portals & MVPs // CYBERSTYLE',
  description:
    'Tailored web applications, client dashboards, and custom internal tools engineered with Next.js, Node.js, and PostgreSQL.',
};

export default function CustomSaaSServicePage() {
  const deliverables = [
    'Client Portals: Dedicated login areas for clients to review milestones, documents, and project status.',
    'Payment & Invoicing Integration: Configured with Stripe or selected gateway for secure card processing.',
    'Custom Business Dashboards: Focused interfaces that organize your operational data clearly.',
    'No Per-Seat Agency Licensing: You own the application code without recurring per-user software licensing from us.',
    'Modern Security Architecture: Role-based authorization, encrypted session handling, and HTTPS enforcement.',
    'Automated Database Backups: Backup routines configured to preserve transactional data on schedule.',
    'Full Codebase Handoff: Source repositories, database schemas, and documentation delivered upon project completion.',
    'Responsive Desktop & Mobile Views: Optimized layouts for phones, tablets, and office workstations.',
  ];

  const faqs = [
    {
      q: 'What is included in a custom application build?',
      a: 'We build a production-ready application tailored to your specifications: user authentication, secure database schema (PostgreSQL), admin management views, payment gateway integration, and server deployment scripts.',
    },
    {
      q: 'How does custom software differ from SaaS subscriptions?',
      a: 'Subscription software often requires your business to adapt its workflows to their rigid templates and charges increasing monthly fees as you add users. Custom applications are built around your exact operational rules and you retain ownership of the software codebase.',
    },
    {
      q: 'What ongoing infrastructure costs will I need to pay?',
      a: `${ONGOING_COSTS_DISCLOSURE} You pay these directly to infrastructure providers like Hostinger, AWS, or Supabase.`,
    },
    {
      q: 'Do I own the software code once delivered?',
      a: `${OWNERSHIP_DISCLOSURE} All custom code, database migrations, and design assets are transferred to your company.`,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black">
      <PageBanner
        badgeText="SERVICE // 03"
        title={SERVICES.saas.name}
        description={SERVICES.saas.description}
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Custom Systems</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Software built around how your business actually functions.
              </h2>
            </div>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
              When pre-packaged software fails to support your workflows or charges excessive recurring seat fees, custom digital tools offer a focused alternative. We build responsive, database-backed web applications tailored to your requirements.
            </p>

            {/* Workflow */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Delivery Process</span>
              <h3 className="font-display font-bold text-2xl text-white">
                Structured Engineering Milestones
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">1</div>
                  <h4 className="text-sm font-semibold text-white">Architecture &amp; Scope</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We define data models, user roles, screen flows, and written acceptance criteria before starting code.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">2</div>
                  <h4 className="text-sm font-semibold text-white">Interactive Preview</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    You review interactive UI components and test features on a private staging server as milestones complete.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">3</div>
                  <h4 className="text-sm font-semibold text-white">Database &amp; Payments</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We configure relational database schemas, secure session management, and payment gateway webhooks.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                  <div className="w-6 h-6 rounded-md bg-[#00F0FF]/10 text-[#00F0FF] text-xs font-mono flex items-center justify-center font-bold">4</div>
                  <h4 className="text-sm font-semibold text-white">Deployment &amp; Handoff</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    We deploy to your production server, transfer complete Git repositories, and deliver documentation.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display font-bold text-xl text-white">What’s Included in the Build</h3>
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

          <div className="lg:col-span-5 space-y-6">
            <Card variant="highlight" className="p-8 space-y-6 sticky top-28 bg-[#0C0F17]">
              <div>
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">PROJECT INVESTMENT</span>
                <div className="font-display font-bold text-4xl text-white mt-1">{SERVICES.saas.startingPrice}</div>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  One-time build fee covering user authentication, database design, dashboard interfaces, and payment integrations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between"><span>Delivery Timeline:</span><span className="text-white">3–6 Weeks Typical</span></div>
                <div className="flex justify-between"><span>Code Ownership:</span><span className="text-[#00F0FF] font-bold">Full Handoff</span></div>
                <div className="flex justify-between"><span>Agency Software Rent:</span><span className="text-emerald-400 font-bold">$0</span></div>
              </div>

              <p className="text-[11px] text-neutral-400 font-mono">
                {ONGOING_COSTS_DISCLOSURE}
              </p>

              <Link href="/start-project">
                <Button variant="electric" size="lg" className="w-full justify-center" icon={<ArrowUpRight className="w-5 h-5" />}>
                  {CTA_LABELS.primary}
                </Button>
              </Link>
            </Card>

            {/* Optional Maintenance */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-[#00F0FF]/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">OPTIONAL MAINTENANCE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20">
                  CANCEL ANYTIME
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-2xl text-white">$30</span>
                <span className="text-xs text-neutral-400 font-mono">/ month</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Ongoing technical oversight to keep your application operational, patched, and backed up.
              </p>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Scheduled database backups and restore testing</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Dependency updates &amp; security patches</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Uptime monitoring and error alert logging</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00F0FF] shrink-0" />
                  <span>Priority technical response for platform inquiries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* FAQs */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <DynamicFaqAccordion
            page="custom-saas"
            subtitle="PRACTICAL ANSWERS"
            title="Questions About Custom Software"
            fallbackFaqs={faqs}
            variant="light"
          />
        </div>
      </section>

      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
