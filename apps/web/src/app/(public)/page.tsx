'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ChevronDown,
} from 'lucide-react';
import Silk from '@/components/backgrounds/Silk';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { PartnerLogos } from '@/components/ui/PartnerLogos';

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
            {/* Left Column: Monumental Headline & Strategic Positioning */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">
                  Engineered for High-Conversion & Scale
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white">
                Websites Engineered to Move Business Forward.
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl leading-relaxed font-normal">
                We elevate standard business websites into premium, 3D-driven digital systems and AI automations that increase leads, bookings, and revenue.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="#start-project">
                  <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                    Start a Project
                  </Button>
                </Link>
                <Link href="#work">
                  <Button variant="outline" size="lg">
                    Explore Capabilities
                  </Button>
                </Link>
              </div>

              {/* Micro Outcome Signals */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg text-xs font-mono text-neutral-400">
                <div>
                  <span className="text-white font-semibold block text-sm">From $800</span>
                  <span>Premium Web</span>
                </div>
                <div>
                  <span className="text-[#00F0FF] font-semibold block text-sm">From $1,200</span>
                  <span>AI Automation</span>
                </div>
                <div>
                  <span className="text-white font-semibold block text-sm">From $3,000</span>
                  <span>Custom SaaS</span>
                </div>
              </div>
            </div>

            {/* Right Column: Precision Glassmorphic Interactive Art Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="w-full max-w-md relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00F0FF]/30 to-white/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500" />
                <Card variant="highlight" className="p-8 backdrop-blur-2xl relative bg-[#07090E]/90 border border-white/15">
                  <div className="flex items-center justify-between pb-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">
                        CYBERSTYLE // COMMAND CORE
                      </span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">v3.0</span>
                  </div>

                  <div className="py-8 space-y-6">
                    <div className="space-y-2">
                      <div className="text-xs text-neutral-400 font-mono">Performance Benchmark</div>
                      <div className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
                        &lt; 1.2s <span className="text-xs text-emerald-400 font-mono font-normal">Target LCP Speed</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#00F0FF]" /> AI Lead Qualification
                        </span>
                        <span className="text-emerald-400 font-mono">Active</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00F0FF] h-full w-[88%]" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" /> Core Web Vitals
                        </span>
                        <span className="text-white font-mono">99 / 100</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>3D Silk Engine Active</span>
                    <span className="text-[#00F0FF]">60 FPS</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos in Black Canvas (matching user reference) */}
      <PartnerLogos />

      {/* Atmospheric Black-to-White Scrim Gradient (matching user reference) */}
      <SectionGradient direction="black-to-white" heightClass="h-48 sm:h-64 lg:h-72" />

      {/* =====================================================================
          3. EDITORIAL STATEMENT / ABOUT (Transition to Pure White Canvas)
          ===================================================================== */}
      <section id="about" className="bg-white text-black pt-4 pb-28 px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Main Statement */}
          <div className="space-y-6 max-w-5xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              About CYBERSTYLE
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-black leading-[1.1] tracking-tight">
              We partner with startups, growing companies, and established organizations to build digital systems that increase leads, bookings, and revenue.
            </h2>
          </div>

          {/* Multi-Column Supporting Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-black/10 text-neutral-700 text-base sm:text-lg leading-relaxed">
            <p>
              Traditional websites are often digital brochures that cost money without generating momentum. We approach web development as operational systems engineering: pairing memorable visual distinction and 3D interactivity with rigorous conversion funnels and automated lead workflows.
            </p>
            <p>
              From custom SaaS MVPs and AI routing pipelines to high-ticket service agency platforms, our work bridges the gap between captivating design and measurable business outcomes.
            </p>
          </div>

          {/* Architecture Standards & Engineering Benchmarks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-black/10">
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">&lt; 1.2s</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Core Web Vitals LCP</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">100%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Code & Asset Ownership</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">PG 16</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Self-Hosted PostgreSQL</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">24/7</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Automated AI Routing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          4. SERVICES PREVIEW (Editorial Light Surface)
          ===================================================================== */}
      <section id="services" className="bg-[#F8F9FB] text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
                Capabilities & Offerings
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
                Engineered for High-Impact Outcomes.
              </h2>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-sans">
              Every build is customized to your exact operational requirements. Starting prices indicate base scope.
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
                  <span className="font-mono text-xs text-neutral-500">01 // Web Architecture</span>
                  <h3 className="font-display font-bold text-2xl text-black">Premium Web Experiences</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  High-converting, responsive, interactive, and 3D websites tailored for brands ready to differentiate and dominate their market.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 3D WebGL / Silk Interactive Art</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sub-second Core Web Vitals</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-hosted CMS & Lead Routing</li>
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <span className="font-display font-bold text-xl text-black">From $800</span>
                <Link href="#start-project">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Inquire
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
                  <span className="font-mono text-xs text-neutral-500">02 // Automation Engine</span>
                  <h3 className="font-display font-bold text-2xl text-black">AI & Business Workflows</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Automate lead qualification, CRM routing, client follow-ups, and operational tasks using Gemini and custom AI pipelines.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 24/7 AI Prospect Qualification</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automated Email & CRM Pipelines</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Internal Dashboards</li>
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <span className="font-display font-bold text-xl text-black">From $1,200</span>
                <Link href="#start-project">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Inquire
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
                  <span className="font-mono text-xs text-neutral-500">03 // Product Engineering</span>
                  <h3 className="font-display font-bold text-2xl text-black">Custom SaaS & MVPs</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  End-to-end web applications, client portals, internal operations platforms, and SaaS MVPs ready for production deployment.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Next.js 15 + PostgreSQL + Express</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-hosted Auth & Stripe Invoicing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Docker VPS Deployment Ready</li>
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <span className="font-display font-bold text-xl text-black">From $3,000</span>
                <Link href="#start-project">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Inquire
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Atmospheric Light-to-White Gradient */}
      <SectionGradient direction="light-to-white" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          5. HOW WE WORK (Operational Process)
          ===================================================================== */}
      <section id="how-we-work" className="bg-white text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="space-y-4 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Methodology
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
              Deliberate, Transparent Execution.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-neutral-400 block">STEP 01</span>
              <h4 className="font-display font-bold text-lg text-black">Discovery & Strategy</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We analyze your business model, customer friction, conversion bottlenecks, and define the technical roadmap.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-neutral-400 block">STEP 02</span>
              <h4 className="font-display font-bold text-lg text-black">Experience Direction</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Design system creation, editorial typography pairing, 3D/Silk canvas art direction, and interactive prototypes.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-neutral-400 block">STEP 03</span>
              <h4 className="font-display font-bold text-lg text-black">Build & Integrations</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Full-stack Next.js/Express implementation, PostgreSQL schema setup, AI workflow automation, and client portal wiring.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-neutral-400 block">STEP 04</span>
              <h4 className="font-display font-bold text-lg text-black">Launch & Iteration</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                VPS Docker deployment, SSL setup, GA4/GTM telemetry verification, and post-launch conversion monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          6. PRICING & ENGAGEMENT GRID (Screenshot Reference Alignment)
          ===================================================================== */}
      <section id="pricing" className="bg-[#F8F9FB] text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-black/10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2 block">
                Investment Structure
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
                Flexible Engagements Built for Growth.
              </h2>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-sans">
              Transparent starting rates. Final scope, timeline, integrations, and 3D depth determine total investment.
            </p>
          </div>

          {/* 3-Tier Grid matching Reference Screenshot (Middle card Dark Obsidian + Silk) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Web Foundation */}
            <Card variant="light" className="p-8 flex flex-col justify-between border border-black/15 bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-black">Strategy & Web Build</h3>
                  <p className="text-xs text-neutral-500 mt-1">For brands requiring a high-converting digital presence.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-3xl text-black">From $800</div>
                  <span className="text-xs text-neutral-500 font-mono">Custom project scope</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bespoke High-End Design System</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Next.js 15 App Router Architecture</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sub-second Performance & Technical SEO</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> CMS & Lead Capture Integration</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Code & Asset Transfer</li>
                </ul>
              </div>
              <Link href="#start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Build Your Web System
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
                      <h3 className="font-display font-bold text-2xl text-white">Growth & AI Automation</h3>
                      <p className="text-xs text-neutral-400 mt-1">For growing businesses that need intelligent workflows.</p>
                    </div>
                    <Badge variant="electric">Popular</Badge>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-3xl text-white">From $1,200</div>
                    <span className="text-xs text-[#00F0FF] font-mono">Custom automation scope</span>
                  </div>

                  <ul className="space-y-3 text-xs text-neutral-200 pt-4 border-t border-white/10">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Everything in Web Build</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 3D WebGL / Silk Interactive Layers</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> AI Lead Qualification & Smart Routing</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automated Email Follow-ups & CRM</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Priority Support & Analytics Dashboard</li>
                  </ul>
                </div>

                <Link href="#start-project" className="relative z-10 mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    Start Growth Build
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3: Custom SaaS & MVP */}
            <Card variant="light" className="p-8 flex flex-col justify-between border border-black/15 bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-black">Custom SaaS & MVPs</h3>
                  <p className="text-xs text-neutral-500 mt-1">For companies building proprietary platforms or tools.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-3xl text-black">From $3,000</div>
                  <span className="text-xs text-neutral-500 font-mono">Full-stack platform build</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Full-Stack App (Next.js + Express + Postgres)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-Hosted Auth, RBAC & 2FA</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Stripe Invoicing & Webhooks</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Client Portals & Deliverable Vaults</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Docker VPS Deployment & Backup Setup</li>
                </ul>
              </div>
              <Link href="#start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Discuss Custom Scope
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Atmospheric Light-to-White Gradient */}
      <SectionGradient direction="light-to-white" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          7. EDITORIAL TESTIMONIAL (Light Canvas Quotation)
          ===================================================================== */}
      <section className="bg-white text-black pt-8 pb-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-8 space-y-8">
            <span className="font-display text-6xl text-neutral-300 block leading-none select-none">“</span>
            <blockquote className="font-display font-bold text-2xl sm:text-4xl text-black leading-snug">
              CYBERSTYLE transformed our complex offering into an unmistakable, high-converting digital brand. The 3D experience and automated routing increased our qualified client inquiries immediately.
            </blockquote>
            <div className="pt-4 flex items-center justify-between border-t border-black/10">
              <div>
                <div className="font-display font-bold text-base text-black">Franklin Miller</div>
                <div className="text-xs font-mono text-neutral-500">Managing Director // High-Growth Enterprise</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-neutral-400">01 / 03</span>
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded border border-black/20 hover:bg-black/5" aria-label="Previous review">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded border border-black/20 hover:bg-black/5" aria-label="Next review">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="w-64 h-80 rounded-2xl bg-neutral-900 border border-black/10 overflow-hidden relative shadow-lg flex items-center justify-center text-neutral-500 font-mono text-xs">
              <div className="text-center p-6 space-y-2">
                <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-white text-xl font-bold">
                  FM
                </div>
                <div className="text-white font-semibold">Franklin Miller</div>
                <div className="text-[11px] text-neutral-400">Verified Client Partner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Light Gradient */}
      <SectionGradient direction="white-to-light" heightClass="h-20 sm:h-28" />

      {/* =====================================================================
          8. ENGINEERING FAQ (Editorial White Canvas)
          ===================================================================== */}
      <section id="faq" className="bg-[#F8F9FB] text-black pt-8 pb-28 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              Engineering & Scope
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black tracking-tight">
              Frequently Answered Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What is the starting investment for a CYBERSTYLE website?',
                a: 'Our premium websites start from $800. Final investment is based on scope, custom 3D/Silk interactive requirements, CMS setup, and third-party integrations.',
              },
              {
                q: 'How do 3D and Silk shaders affect mobile speed and Core Web Vitals?',
                a: 'We engineer our Three.js shaders with lazy rendering, power-preference tuning, and instant CSS static fallbacks for low-power or reduced-motion environments, maintaining 90+ Lighthouse performance.',
              },
              {
                q: 'What does your AI & Business Automation service deliver?',
                a: 'Starting from $1,200, we engineer custom 24/7 lead qualification pipelines, CRM workflows, automated email routing, and operational dashboards tailored to your business.',
              },
              {
                q: 'Do we own 100% of the code and deliverables?',
                a: 'Yes. Upon final invoice completion, complete ownership, code repositories, custom design assets, and VPS Docker configurations are transferred to your company.',
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
          9. FINAL CONVERSION CTA (Atmospheric Gradient Transition to Black)
          ===================================================================== */}
      <SectionGradient direction="light-to-black" heightClass="h-44 sm:h-60 lg:h-72" />

      <section id="start-project" className="bg-black text-white pt-6 pb-28 px-6 relative overflow-hidden">
        <Silk className="opacity-40" speed={0.5} />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight">
            Have an Idea, an Old Website, or a Process Slowing You Down?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Let’s build an unmistakable digital experience that moves your business forward with speed, conversion precision, and modern systems.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:hello@cyberstyle.net">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                Start a Project with Us
              </Button>
            </a>
            <a href="mailto:hello@cyberstyle.net">
              <Button variant="outline" size="lg">
                Email Directly: hello@cyberstyle.net
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
