import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, HelpCircle } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Silk from '@/components/backgrounds/Silk';

export const metadata: Metadata = {
  title: 'Pricing & Investment Framework',
  description:
    'Transparent pricing structure for CYBERSTYLE web experiences, AI automation pipelines, and custom SaaS platforms. Starting from $800.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Investment Structure"
        title="Predictable Pricing Engineered for Measurable ROI."
        description="We believe in transparent starting rates. Final investment depends on 3D depth, custom workflows, API integrations, and timeline requirements."
      />

      {/* 3-Tier Grid (Matching Reference Direction) */}
      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1 */}
            <Card variant="light" className="p-8 flex flex-col justify-between bg-white border border-black/10">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Tier 01</span>
                  <h3 className="font-display font-bold text-2xl text-black mt-1">Strategy & Web Build</h3>
                  <p className="text-xs text-neutral-500 mt-1">For brands needing a high-converting digital identity.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-4xl text-black">From $800</div>
                  <span className="text-xs text-neutral-500 font-mono">Custom project scope</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bespoke High-End Design System</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Next.js 15 App Router Architecture</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sub-second Core Web Vitals</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-Hosted Headless CMS</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Code & Asset Transfer</li>
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Start Web Build
                </Button>
              </Link>
            </Card>

            {/* Tier 2: Highlighted Dark Silk */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#00F0FF]/50 to-white/10 shadow-[0_0_40px_rgba(0,240,255,0.18)]">
              <Card variant="dark" className="p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[#06080D]">
                <Silk className="opacity-30" speed={0.5} />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-[#00F0FF]">Tier 02</span>
                      <h3 className="font-display font-bold text-2xl text-white mt-1">Growth & AI Automation</h3>
                      <p className="text-xs text-neutral-400 mt-1">For businesses seeking automated qualification & 3D flair.</p>
                    </div>
                    <Badge variant="electric">Most Popular</Badge>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-4xl text-white">From $1,200</div>
                    <span className="text-xs text-[#00F0FF] font-mono">Custom automation scope</span>
                  </div>
                  <ul className="space-y-3 text-xs text-neutral-200 pt-4 border-t border-white/10">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Everything in Strategy & Web</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Custom 3D / Silk Wave Shaders</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 24/7 AI Prospect Qualification</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automated Email Follow-ups via Nodemailer</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> CRM & Webhook Integrations</li>
                  </ul>
                </div>
                <Link href="/start-project" className="relative z-10 mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    Start Growth Build
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3 */}
            <Card variant="light" className="p-8 flex flex-col justify-between bg-white border border-black/10">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Tier 03</span>
                  <h3 className="font-display font-bold text-2xl text-black mt-1">Custom SaaS & MVPs</h3>
                  <p className="text-xs text-neutral-500 mt-1">For companies engineering proprietary web platforms.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-4xl text-black">From $3,000</div>
                  <span className="text-xs text-neutral-500 font-mono">Full-stack platform build</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Full-Stack Next.js + Express + Postgres</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-Hosted Auth, RBAC & TOTP 2FA</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Client Portals & Stripe Invoicing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Redis BullMQ Background Queues</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Docker Compose Production VPS Deployment</li>
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Discuss Custom Scope
                </Button>
              </Link>
            </Card>
          </div>

          {/* Pricing Disclaimer Note */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-400 text-center max-w-3xl mx-auto">
            * Note: All prices are base starting indicators in USD. Final project proposals are provided after discovery based on exact functional specifications, integrations, timeline, and asset readiness.
          </div>
        </div>
      </section>
    </div>
  );
}
