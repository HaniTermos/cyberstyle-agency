import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import Silk from '@/components/backgrounds/Silk';
import {
  SERVICES,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  INCLUDED_SCOPE_DISCLOSURE,
  AI_LIMITATIONS_DISCLOSURE,
  SUPPORT_DISCLOSURE,
  VALUE_EXTRAS,
  PROJECT_PROCESS_STEPS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Pricing & Project Build Fees // CYBERSTYLE',
  description:
    'Transparent build fees for business websites, smart enquiry automation, and custom growth systems. Clear written scope and complete deliverables handoff.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00F0FF] selection:text-black">
      <PageBanner
        badgeText="Project Investments"
        title="Transparent Build Fees Based on Scope."
        description="Every project includes a written proposal with fixed milestone pricing. Build fees cover design and engineering deliverables without proprietary agency licensing or surprise monthly vendor lock-in."
      />

      {/* 3-Tier Grid */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {/* Tier 1: Business Website Launch */}
            <Card variant="light" className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between bg-white border border-black/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono uppercase text-neutral-500">Tier 01</span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-black mt-1">{SERVICES.web.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{SERVICES.web.description}</p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-black">{SERVICES.web.startingPrice}</div>
                  <span className="text-[11px] sm:text-xs text-neutral-500 font-mono">Baseline build fee</span>
                </div>
                <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-700 pt-3 sm:pt-4 border-t border-black/10">
                  {SERVICES.web.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 sm:pt-4 border-t border-black/10 text-xs font-sans text-neutral-600">
                  <span className="font-semibold text-black block mb-1">Best for:</span>
                  {SERVICES.web.bestFor}
                </div>
              </div>
              <Link href="/start-project" className="mt-6 sm:mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  {SERVICES.web.ctaText}
                </Button>
              </Link>
            </Card>

            {/* Tier 2: Website + Smart Enquiry System (Highlighted Dark Silk) */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#00F0FF]/50 to-white/10 shadow-[0_0_40px_rgba(0,240,255,0.18)]">
              <Card variant="dark" className="p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[#06080D]">
                <Silk className="opacity-30" speed={0.5} />
                <div className="relative z-10 space-y-4 sm:space-y-6">
                  <div className="space-y-2.5 sm:space-y-3 text-center">
                    <div className="flex justify-center">
                      <Badge variant="electric" className="px-3 py-1 text-xs">
                        Popular Scope
                      </Badge>
                    </div>
                    <div>
                      <span className="text-[11px] sm:text-xs font-mono uppercase text-[#00F0FF]">Tier 02</span>
                      <h3 className="font-display font-bold text-xl sm:text-2xl text-white mt-1">{SERVICES.ai.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1">{SERVICES.ai.description}</p>
                    </div>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white">{SERVICES.ai.startingPrice}</div>
                    <span className="text-[11px] sm:text-xs text-[#00F0FF] font-mono">Baseline build fee</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-200 pt-3 sm:pt-4 border-t border-white/10">
                    {SERVICES.ai.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 sm:pt-4 border-t border-white/10 text-xs font-sans text-neutral-300">
                    <span className="font-semibold text-white block mb-1">Best for:</span>
                    {SERVICES.ai.bestFor}
                  </div>
                </div>
                <Link href="/start-project" className="relative z-10 mt-6 sm:mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    {SERVICES.ai.ctaText}
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3: Custom Business Growth System */}
            <Card variant="light" className="p-4 sm:p-6 lg:p-8 flex flex-col justify-between bg-white border border-black/10 shadow-sm hover:shadow-md transition-shadow">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <span className="text-[11px] sm:text-xs font-mono uppercase text-neutral-500">Tier 03</span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl text-black mt-1">{SERVICES.saas.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{SERVICES.saas.description}</p>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-black">{SERVICES.saas.startingPrice}</div>
                  <span className="text-[11px] sm:text-xs text-neutral-500 font-mono">Baseline build fee</span>
                </div>
                <ul className="space-y-2 sm:space-y-2.5 text-xs text-neutral-700 pt-3 sm:pt-4 border-t border-black/10">
                  {SERVICES.saas.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 sm:pt-4 border-t border-black/10 text-xs font-sans text-neutral-600">
                  <span className="font-semibold text-black block mb-1">Best for:</span>
                  {SERVICES.saas.bestFor}
                </div>
              </div>
              <Link href="/start-project" className="mt-6 sm:mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  {SERVICES.saas.ctaText}
                </Button>
              </Link>
            </Card>
          </div>

          {/* Unique Extras Included With Every Plan */}
          <div className="pt-10 sm:pt-16 border-t border-white/10 space-y-6 sm:space-y-8">
            <div className="max-w-2xl">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#00F0FF] mb-1.5 sm:mb-2 block">
                Standard In Every Engagement
              </span>
              <h3 className="font-display font-bold text-xl sm:text-3xl text-white break-words">
                Persuasive extras that remove anxiety and keep your project on track.
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {VALUE_EXTRAS.map((extra, idx) => (
                <div key={idx} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <h4 className="font-display font-bold text-sm sm:text-base text-white">{extra.title}</h4>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans pl-6">
                    {extra.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Improved Plain-Language Pricing Guidance */}
          <div className="p-5 sm:p-8 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10 space-y-4 sm:space-y-6 max-w-4xl mx-auto text-xs sm:text-sm text-neutral-300">
            <div className="space-y-2">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                What is included in the project price?
              </h4>
              <p className="text-xs text-neutral-400 pl-6 leading-relaxed font-sans">
                {INCLUDED_SCOPE_DISCLOSURE}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#00F0FF]" />
                What may cost extra?
              </h4>
              <p className="text-xs text-neutral-400 pl-6 leading-relaxed font-sans">
                {ONGOING_COSTS_DISCLOSURE}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Deliverables &amp; Code Ownership
              </h4>
              <p className="text-xs text-neutral-400 pl-6 leading-relaxed font-sans">
                {OWNERSHIP_DISCLOSURE}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              <h4 className="font-display font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Post-Launch Support Guarantee
              </h4>
              <p className="text-xs text-neutral-400 pl-6 leading-relaxed font-sans">
                {SUPPORT_DISCLOSURE}
              </p>
            </div>
          </div>

          {/* Technical Proof Link */}
          <div className="text-center pt-2">
            <Link
              href="/delivery-standards"
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5 underline underline-offset-4"
            >
              <span>Need technical details for your team? View our delivery standards</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* What Happens Next? Process Strip */}
          <div className="pt-16 border-t border-white/10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
                Transparent Process
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                Starting a project is simple
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Clear milestones from day one with no technical jargon or surprise scope changes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PROJECT_PROCESS_STEPS.map((step) => (
                <div key={step.step} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 relative">
                  <span className="text-xs font-mono text-[#00F0FF] font-bold">
                    STEP {step.step}
                  </span>
                  <h4 className="font-display font-bold text-base text-white">
                    {step.title}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
