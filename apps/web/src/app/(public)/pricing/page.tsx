import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, Info, ShieldCheck, Wrench } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Silk from '@/components/backgrounds/Silk';
import {
  SERVICES,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  AI_LIMITATIONS_DISCLOSURE,
  SUPPORT_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Pricing & Project Build Fees // CYBERSTYLE',
  description:
    'Transparent build fees for responsive websites, AI enquiry automation, and custom digital software. Clear written scope and complete deliverables handoff.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Project Investments"
        title="Transparent Build Fees Based on Scope."
        description="Every project includes a written proposal with fixed milestone pricing. Build fees cover design and engineering deliverables without proprietary agency licensing."
      />

      {/* 3-Tier Grid */}
      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1 */}
            <Card variant="light" className="p-8 flex flex-col justify-between bg-white border border-black/10">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Tier 01</span>
                  <h3 className="font-display font-bold text-2xl text-black mt-1">{SERVICES.web.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">For businesses requiring a modern, responsive website.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-4xl text-black">{SERVICES.web.startingPrice}</div>
                  <span className="text-xs text-neutral-500 font-mono">Baseline build fee</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  {SERVICES.web.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  {CTA_LABELS.primary}
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
                      <h3 className="font-display font-bold text-2xl text-white mt-1">{SERVICES.ai.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1">For teams looking to automate common customer enquiries.</p>
                    </div>
                    <Badge variant="electric">Popular Scope</Badge>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-4xl text-white">{SERVICES.ai.startingPrice}</div>
                    <span className="text-xs text-[#00F0FF] font-mono">Baseline build fee</span>
                  </div>
                  <ul className="space-y-3 text-xs text-neutral-200 pt-4 border-t border-white/10">
                    {SERVICES.ai.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/start-project" className="relative z-10 mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    {CTA_LABELS.primary}
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3 */}
            <Card variant="light" className="p-8 flex flex-col justify-between bg-white border border-black/10">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Tier 03</span>
                  <h3 className="font-display font-bold text-2xl text-black mt-1">{SERVICES.saas.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">For businesses building custom portals or workflows.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-4xl text-black">{SERVICES.saas.startingPrice}</div>
                  <span className="text-xs text-neutral-500 font-mono">Baseline build fee</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  {SERVICES.saas.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  {CTA_LABELS.primary}
                </Button>
              </Link>
            </Card>
          </div>

          {/* Pricing Disclosures & Scope Guidance */}
          <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4 text-xs text-neutral-300 max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-[#00F0FF] font-mono font-semibold uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Scope &amp; Ongoing Cost Terms</span>
            </div>
            <p>
              <strong>Build Fees vs. Operating Costs:</strong> {ONGOING_COSTS_DISCLOSURE}
            </p>
            <p>
              <strong>Deliverables &amp; Code Ownership:</strong> {OWNERSHIP_DISCLOSURE}
            </p>
            <p>
              <strong>AI &amp; Automation Operational Notice:</strong> {AI_LIMITATIONS_DISCLOSURE}
            </p>
            <p>
              <strong>Optional Ongoing Support:</strong> {SUPPORT_DISCLOSURE}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
