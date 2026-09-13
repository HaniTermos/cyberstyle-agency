'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  Zap,
  ChevronDown,
  Clock,
  Code2,
} from 'lucide-react';
import Silk from '@/components/backgrounds/Silk';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { PartnerLogos } from '@/components/ui/PartnerLogos';
import {
  PRIMARY_MESSAGE,
  SERVICES,
  CTA_LABELS,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  AI_LIMITATIONS_DISCLOSURE,
} from '@/lib/constants/brand';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#00F0FF] selection:text-black">
      {/* =====================================================================
          1. HERO SECTION (Black Canvas + Fluid Silk Dynamics)
          ===================================================================== */}
      <section className="relative min-h-[92vh] flex items-center pt-32 pb-20 overflow-hidden bg-black">
        {/* Silk Ambient Wave Shader */}
        <Silk className="opacity-60" speed={0.7} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline & Strategic Positioning */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
                  Digital Agency &amp; Systems Studio
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white">
                Websites and digital systems built around real business needs.
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl leading-relaxed font-normal">
                {PRIMARY_MESSAGE}
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/start-project">
                  <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                    {CTA_LABELS.primary}
                  </Button>
                </Link>
                <Link href="/services">
                  <Button variant="outline" size="lg">
                    {CTA_LABELS.secondary}
                  </Button>
                </Link>
              </div>

              {/* Micro Outcome Signals */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg text-xs font-mono text-neutral-400">
                <div>
                  <span className="text-white font-semibold block text-sm">Clear Scope</span>
                  <span>Defined in writing</span>
                </div>
                <div>
                  <span className="text-[#00F0FF] font-semibold block text-sm">Responsive Design</span>
                  <span>Tested across devices</span>
                </div>
                <div>
                  <span className="text-white font-semibold block text-sm">From $800</span>
                  <span>Build fee baseline</span>
                </div>
              </div>
            </div>

            {/* Right Column: Precision Glassmorphic System Architecture Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF]/30 to-white/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />
                <Card variant="highlight" className="p-8 backdrop-blur-2xl relative bg-[#07090E]/90 border border-white/15">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">
                        SYSTEM ARCHITECTURE OVERVIEW
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Production Ready
                    </span>
                  </div>

                  <div className="py-8 space-y-6">
                    <div className="space-y-2">
                      <div className="text-xs text-neutral-400 font-mono">Frontend Engineering</div>
                      <div className="text-2xl font-display font-bold text-white flex items-baseline gap-2">
                        Next.js &amp; TypeScript
                        <span className="text-xs text-emerald-400 font-mono font-normal">Responsive &amp; Accessible</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#00F0FF]" /> Automated Enquiry Routing
                        </span>
                        <span className="text-emerald-400 font-mono">Calendar &amp; CRM</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">
                        Pre-qualifies incoming visitor questions and syncs bookings with email and calendar tools.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#00F0FF]" /> Project Deliverables
                        </span>
                        <span className="text-white font-mono">Full Handoff</span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-normal">
                        Full source code, production assets, and deployment documentation delivered upon completion.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 text-[11px] font-mono text-neutral-400 leading-normal">
                    Third-party hosting, domains, and API services billed separately by providers.
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools and Integrations We Work With */}
      <PartnerLogos />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-48 sm:h-64 lg:h-72" />

      {/* =====================================================================
          2. EDITORIAL STATEMENT / ABOUT (Transition to Pure White Canvas)
          ===================================================================== */}
      <section id="about" className="bg-white text-black pt-4 pb-28 px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Main Statement */}
          <div className="space-y-6 max-w-5xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Core Philosophy
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-black leading-[1.1] tracking-tight">
              A business website should make your capabilities clear and make it simple for clients to contact you.
            </h2>
          </div>

          {/* Multi-Column Supporting Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-black/10 text-neutral-700 text-base sm:text-lg leading-relaxed">
            <p>
              If your website is confusing on mobile screens, takes too long to load, or fails to communicate what makes your business unique, prospective clients will look elsewhere. First impressions in business are established in seconds.
            </p>
            <p>
              We build clean, responsive websites and practical automation tools. We focus on clear layout, strong typography, and reliable integrations so your visitors can easily understand your services, trust your professionalism, and take the next step.
            </p>
          </div>

          {/* Architecture Standards & Engineering Benchmarks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-black/10">
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-3xl sm:text-4xl text-black">Written Scope</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Milestones Defined Upfront</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-3xl sm:text-4xl text-black">Modern Stack</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Next.js &amp; TypeScript</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-3xl sm:text-4xl text-black">Rapid Routing</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Automated Enquiry Workflows</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-3xl sm:text-4xl text-black">Direct Handoff</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Code &amp; Assets Delivered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          3. SERVICES PREVIEW (Editorial Light Surface)
          ===================================================================== */}
      <section id="services" className="bg-[#F8F9FB] text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
                Capabilities &amp; Solutions
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
                Focused Digital Services for Growing Businesses.
              </h2>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-sans">
              Straightforward solutions that make it easier for clients to evaluate your business, book consultations, and complete transactions.
            </p>
          </div>

          {/* 3 Service Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Service 1 */}
            <Card variant="light" className="p-8 flex flex-col justify-between h-full hover:border-black/30 hover:shadow-lg transition-all">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs text-neutral-500">01 // Web Development</span>
                  <h3 className="font-display font-bold text-2xl text-black">{SERVICES.web.name}</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {SERVICES.web.description}
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  {SERVICES.web.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-xl text-black">{SERVICES.web.startingPrice}</span>
                  <span className="text-[11px] text-neutral-500 block font-mono">Build fee baseline</span>
                </div>
                <Link href="/services/premium-web">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 2 */}
            <Card variant="light" className="p-8 flex flex-col justify-between h-full hover:border-black/30 hover:shadow-lg transition-all">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black">
                  <Cpu className="w-6 h-6 text-[#0080FF]" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs text-neutral-500">02 // Enquiry Automation</span>
                  <h3 className="font-display font-bold text-2xl text-black">{SERVICES.ai.name}</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {SERVICES.ai.description}
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  {SERVICES.ai.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-xl text-black">{SERVICES.ai.startingPrice}</span>
                  <span className="text-[11px] text-neutral-500 block font-mono">Build fee baseline</span>
                </div>
                <Link href="/services/ai-automation">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Service 3 */}
            <Card variant="light" className="p-8 flex flex-col justify-between h-full hover:border-black/30 hover:shadow-lg transition-all">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs text-neutral-500">03 // Custom Software</span>
                  <h3 className="font-display font-bold text-2xl text-black">{SERVICES.saas.name}</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {SERVICES.saas.description}
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  {SERVICES.saas.inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <div>
                  <span className="font-display font-bold text-xl text-black">{SERVICES.saas.startingPrice}</span>
                  <span className="text-[11px] text-neutral-500 block font-mono">Build fee baseline</span>
                </div>
                <Link href="/services/custom-saas">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Details
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          <p className="text-xs text-neutral-500 text-center font-mono">
            {ONGOING_COSTS_DISCLOSURE}
          </p>
        </div>
      </section>

      {/* Atmospheric Light-to-White Gradient */}
      <SectionGradient direction="light-to-white" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          4. HOW WE WORK (Operational Process)
          ===================================================================== */}
      <section id="how-we-work" className="bg-white text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Engagement Process
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
              A Structured, 4-Step Project Delivery Model.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 01</span>
              <h4 className="font-display font-bold text-lg text-black">Initial Discovery Call</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We review your business goals, current digital setup, required functionality, and establish clear technical requirements.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 02</span>
              <h4 className="font-display font-bold text-lg text-black">Design &amp; Architecture</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                You review and approve interactive design previews, user flows, and written specifications before development begins.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 03</span>
              <h4 className="font-display font-bold text-lg text-black">Engineering &amp; Testing</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We build the project using clean code, configure third-party integrations, and verify responsiveness across modern devices.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 04</span>
              <h4 className="font-display font-bold text-lg text-black">Deployment &amp; Handoff</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We deploy to your live environment, hand over your source code and assets, and provide clear operational instructions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          5. PRICING & ENGAGEMENT GRID
          ===================================================================== */}
      <section id="pricing" className="bg-[#F8F9FB] text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
                Project Investments
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
                Transparent Build Fees Based on Scope.
              </h2>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-sans">
              Every project includes a written proposal with fixed milestone pricing. Build fees cover our design and engineering work.
            </p>
          </div>

          {/* 3-Tier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1 */}
            <Card variant="light" className="p-8 flex flex-col justify-between border border-black/15 bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-black">{SERVICES.web.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">For businesses requiring a modern, responsive website.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-3xl text-black">{SERVICES.web.startingPrice}</div>
                  <span className="text-xs text-neutral-500 font-mono">One-time build fee baseline</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Custom UI design tailored to your branding</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Responsive layouts tested on mobile, tablet, &amp; desktop</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Fast asset loading and clean semantic HTML structure</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Contact forms routed directly to your email</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Full code and asset delivery upon completion</li>
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Request a Project Call
                </Button>
              </Link>
            </Card>

            {/* Tier 2: AI & Growth Partnership (HIGHLIGHTED DARK CARD WITH SILK) */}
            <div className="relative rounded-2xl p-[1px] bg-gradient-to-b from-[#00F0FF]/50 to-white/10 shadow-[0_0_40px_rgba(0,240,255,0.18)]">
              <Card variant="dark" className="p-8 h-full flex flex-col justify-between relative overflow-hidden bg-[#06080D]">
                {/* Embedded Silk Wave inside middle card */}
                <Silk className="opacity-30" speed={0.5} />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-white">{SERVICES.ai.name}</h3>
                      <p className="text-xs text-neutral-400 mt-1">For teams looking to automate common customer enquiries.</p>
                    </div>
                    <Badge variant="electric">Popular Scope</Badge>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-3xl text-white">{SERVICES.ai.startingPrice}</div>
                    <span className="text-xs text-[#00F0FF] font-mono">One-time build fee baseline</span>
                  </div>

                  <ul className="space-y-3 text-xs text-neutral-200 pt-4 border-t border-white/10">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" /> Everything in High-Performing Website</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" /> Custom conversational assistant trained on your docs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" /> Clear operating guardrails and escalation to human staff</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" /> Integrated calendar booking link and lead capture forms</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF] flex-shrink-0" /> Direct email or webhook alerts for qualified enquiries</li>
                  </ul>
                </div>

                <Link href="/start-project" className="relative z-10 mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    Request a Project Call
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3 */}
            <Card variant="light" className="p-8 flex flex-col justify-between border border-black/15 bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-black">{SERVICES.saas.name}</h3>
                  <p className="text-xs text-neutral-500 mt-1">For businesses building custom portals or workflows.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-3xl text-black">{SERVICES.saas.startingPrice}</div>
                  <span className="text-xs text-neutral-500 font-mono">One-time build fee baseline</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Secure user authentication and role-based permissions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Custom administrative dashboards and data reporting</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Payment integration via Stripe or chosen provider</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Relational database architecture (PostgreSQL / Redis)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> Complete codebase repository transfer and documentation</li>
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Request a Project Call
                </Button>
              </Link>
            </Card>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/10 text-xs text-neutral-600 space-y-2">
            <p><strong>Note on Project Scope &amp; Ongoing Costs:</strong> {ONGOING_COSTS_DISCLOSURE}</p>
            <p>{OWNERSHIP_DISCLOSURE}</p>
          </div>
        </div>
      </section>

      {/* Atmospheric Light-to-White Gradient */}
      <SectionGradient direction="light-to-white" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          6. PROJECT STANDARDS & COMMITMENTS (Replaces fabricated testimonial)
          ===================================================================== */}
      <section className="bg-white text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Our Commitments
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
              How CYBERSTYLE Approaches Client Engagements.
            </h2>
            <p className="text-neutral-600 text-base leading-relaxed">
              We believe in honest communication, verifiable deliverables, and transparent processes without fabricated marketing claims.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-black/10 bg-[#FBFBFC] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-black">Defined Scope &amp; Milestones</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Before writing any code, we document all deliverables, timeline targets, and acceptance criteria in your project agreement.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-[#FBFBFC] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-black">Interactive Staging Previews</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                You receive access to a private staging environment so you can test features, review copy, and give feedback before launch.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-black/10 bg-[#FBFBFC] space-y-4">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-xl text-black">Full Source Code Delivery</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Upon project completion and final payment, you receive complete source code repositories, deployment scripts, and asset archives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          7. FAQ SECTION
          ===================================================================== */}
      <section id="faq" className="bg-[#F8F9FB] text-black pt-8 pb-28 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Common Inquiries
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How long does a website project typically take?',
                a: 'Most standard website builds take between 2 to 4 weeks, depending on the number of pages, content availability, and review turnaround times. Complex custom web applications or multi-step integrations may take longer, which will be specified in your written project schedule.',
              },
              {
                q: 'How do you ensure websites perform well on mobile devices?',
                a: 'We design mobile-first with responsive layouts, compressed assets, and modern Next.js rendering so that pages load efficiently across smartphones, tablets, and desktop browsers.',
              },
              {
                q: 'What can an AI enquiry assistant do, and what are its limits?',
                a: `An AI assistant can answer common business questions based on your approved documentation, collect contact details, and schedule appointments via calendar integrations. As an important note: ${AI_LIMITATIONS_DISCLOSURE}`,
              },
              {
                q: 'Do I own the website and source code once the project is finished?',
                a: `${OWNERSHIP_DISCLOSURE} Ongoing infrastructure costs (like hosting, domain renewal, or third-party API subscriptions) are paid directly to your chosen service providers.`,
              },
              {
                q: 'What ongoing maintenance or support is required after launch?',
                a: 'Modern web applications require hosting and domain renewal to remain online. We provide deployment documentation for your team, and we also offer optional maintenance agreements if you prefer ongoing software updates, backups, and technical support handled by us.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-black/10 bg-white p-6 transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between text-left font-display font-bold text-lg text-black focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-500 transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180 text-[#0080FF]' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <p className="mt-4 text-sm text-neutral-600 leading-relaxed font-sans border-t border-black/5 pt-4">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          8. FINAL CONVERSION CTA (Atmospheric Gradient Transition to Black)
          ===================================================================== */}
      <SectionGradient direction="light-to-black" heightClass="h-44 sm:h-60 lg:h-72" />

      <section id="start-project" className="bg-black text-white pt-6 pb-28 px-6 relative overflow-hidden">
        <Silk className="opacity-40" speed={0.5} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
            Ready to Build a Better Digital System for Your Business?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Schedule an introductory call with CYBERSTYLE to discuss your project requirements, scope, timeline, and budget.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/start-project">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                {CTA_LABELS.primary}
              </Button>
            </Link>
            <a href="mailto:contact@cyberstyle.net">
              <Button variant="outline" size="lg">
                Email: contact@cyberstyle.net
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
