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
                  Stop Losing Customers to Your Competitors
                </span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white">
                Websites &amp; AI Systems Built to Make You More Money.
              </h1>

              <p className="text-lg sm:text-xl text-neutral-300 max-w-2xl leading-relaxed font-normal">
                We turn slow, outdated websites into customer-generating machines. Plus, our 24/7 AI assistants answer questions and book qualified clients into your calendar in under 30 seconds — even while you sleep.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="#start-project">
                  <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                    Get Your Free Growth Gameplan
                  </Button>
                </Link>
                <Link href="#services">
                  <Button variant="outline" size="lg">
                    See How We Help You Win
                  </Button>
                </Link>
              </div>

              {/* Micro Outcome Signals */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg text-xs font-mono text-neutral-400">
                <div>
                  <span className="text-white font-semibold block text-sm">From $800</span>
                  <span>High-Converting Web</span>
                </div>
                <div>
                  <span className="text-[#00F0FF] font-semibold block text-sm">From $1,200</span>
                  <span>24/7 AI Sales Assistant</span>
                </div>
                <div>
                  <span className="text-white font-semibold block text-sm">From $3,000</span>
                  <span>Custom Business Tools</span>
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
                        YOUR DIGITAL GROWTH DASHBOARD
                      </span>
                    </div>
                    <span className="text-xs font-mono text-emerald-400">Live &amp; Selling</span>
                  </div>

                  <div className="py-8 space-y-6">
                    <div className="space-y-2">
                      <div className="text-xs text-neutral-400 font-mono">Customer Page Speed</div>
                      <div className="text-3xl font-display font-bold text-white flex items-baseline gap-2">
                        &lt; 1.0s <span className="text-xs text-emerald-400 font-mono font-normal">Instant Load on Any Phone</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-[#00F0FF]" /> 24/7 AI Receptionist
                        </span>
                        <span className="text-emerald-400 font-mono">Active (20s reply)</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#00F0FF] h-full w-[94%]" />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" /> Customer Satisfaction
                        </span>
                        <span className="text-white font-mono">100% 5-Star Reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                    <span>You Own 100% of Everything</span>
                    <span className="text-[#00F0FF]">Zero Monthly Rent</span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos in Black Canvas */}
      <PartnerLogos />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-48 sm:h-64 lg:h-72" />

      {/* =====================================================================
          3. EDITORIAL STATEMENT / ABOUT (Transition to Pure White Canvas)
          ===================================================================== */}
      <section id="about" className="bg-white text-black pt-4 pb-28 px-6 transition-colors duration-500">
        <div className="max-w-7xl mx-auto space-y-20">
          {/* Main Statement */}
          <div className="space-y-6 max-w-5xl">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block">
              The Real Problem
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-black leading-[1.1] tracking-tight">
              Most websites look okay, but they don't make a single dime. We fix that.
            </h2>
          </div>

          {/* Multi-Column Supporting Editorial Text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-black/10 text-neutral-700 text-base sm:text-lg leading-relaxed">
            <p>
              If your website takes longer than 2 seconds to load, looks confusing on phones, or makes people search for how to hire you, you are quietly handing paying customers to your competitors every single day.
            </p>
            <p>
              We don't build useless digital brochures. We engineer complete growth machines: stunning websites that make you look like a multi-million dollar company, paired with smart 24/7 AI assistants that answer questions and book appointments while you sleep.
            </p>
          </div>

          {/* Architecture Standards & Engineering Benchmarks */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-black/10">
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">&lt; 1.0s</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Instant Phone Speed</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">100%</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">You Own Everything Forever</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">30s</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">AI Customer Reply Time</div>
            </div>
            <div className="space-y-1 border-l-2 border-black pl-4">
              <div className="font-display font-bold text-4xl sm:text-5xl text-black">24/7</div>
              <div className="text-xs font-mono uppercase tracking-wider text-neutral-500">Automatic Lead Booking</div>
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
                How We Make You Win
              </span>
              <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
                Simple, Powerful Services Built for Maximum Profit.
              </h2>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-sans">
              No confusing technical jargon. Just clear solutions that get you more customers and save you dozens of hours every week.
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
                  <span className="font-mono text-xs text-neutral-500">01 // High-Converting Websites</span>
                  <h3 className="font-display font-bold text-2xl text-black">Premium Websites That Sell</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Stop losing leads to outdated templates. We build gorgeous, lightning-fast websites that make you look like the #1 choice in your city or industry.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Looks like a multi-million-dollar brand</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Opens in under 1 second on any mobile phone</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rank higher on Google so local clients find you first</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> You own 100% of the website forever</li>
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <span className="font-display font-bold text-xl text-black">From $800</span>
                <Link href="#start-project">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Get Started
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
                  <span className="font-mono text-xs text-neutral-500">02 // 24/7 AI Sales Assistant</span>
                  <h3 className="font-display font-bold text-2xl text-black">AI Lead &amp; Booking Assistant</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Never miss another customer inquiry. Our smart AI receptionist answers questions, confirms customer budgets, and books appointments on your calendar 24/7.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Answers customer questions in under 30 seconds</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automatically books appointments into your calendar</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sends immediate alerts straight to your phone</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Saves your staff 20+ hours of repetitive phone calls</li>
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <span className="font-display font-bold text-xl text-black">From $1,200</span>
                <Link href="#start-project">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Get Started
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
                  <span className="font-mono text-xs text-neutral-500">03 // Custom Business Software</span>
                  <h3 className="font-display font-bold text-2xl text-black">Custom Client Portals &amp; Tools</h3>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Ditch messy spreadsheets and expensive monthly software rent. We build custom dashboards, client portals, and billing tools built just for your company.
                </p>
                <ul className="space-y-2.5 text-xs text-neutral-700 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Private portals for clients to check project status</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Get paid easily with automatic credit card billing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> All your business data in one simple dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> You own the software 100% — zero monthly rental fees</li>
                </ul>
              </div>
              <div className="pt-8 mt-8 border-t border-black/10 flex items-center justify-between">
                <span className="font-display font-bold text-xl text-black">From $3,000</span>
                <Link href="#start-project">
                  <Button variant="secondary" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Get Started
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
              How Simple It Is
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-5xl text-black tracking-tight">
              4 Easy Steps to Grow Your Business.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 01</span>
              <h4 className="font-display font-bold text-lg text-black">15-Min Free Gameplan</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We look at your current website and business, find where you're losing customers, and give you an exact roadmap to fix it.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 02</span>
              <h4 className="font-display font-bold text-lg text-black">Interactive Preview</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                You get to see and test your new website design before we build it. You approve every detail so you know exactly what you're getting.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 03</span>
              <h4 className="font-display font-bold text-lg text-black">Fast Build &amp; AI Setup</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                We build your site, connect your calendar, hook up your payment links, and train your 24/7 AI assistant until everything runs smoothly.
              </p>
            </div>
            <div className="space-y-3 p-6 rounded-xl border border-black/10">
              <span className="font-mono text-xs text-[#0080FF] font-bold block">STEP 04</span>
              <h4 className="font-display font-bold text-lg text-black">Launch &amp; Start Winning</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Your new platform goes live. You immediately start capturing more leads, saving hours of manual work, and owning your software 100%.
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
                Simple, Transparent Investments That Pay for Themselves.
              </h2>
            </div>
            <p className="text-neutral-600 text-sm max-w-md font-sans">
              No hidden fees. No endless monthly rental bills. Just clear investments designed to bring you more customers and save your team hours every day.
            </p>
          </div>

          {/* 3-Tier Grid matching Reference Screenshot (Middle card Dark Obsidian + Silk) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Tier 1: Web Foundation */}
            <Card variant="light" className="p-8 flex flex-col justify-between border border-black/15 bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-black">High-Converting Website</h3>
                  <p className="text-xs text-neutral-500 mt-1">For businesses ready to look like the #1 choice in their market.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-3xl text-black">From $800</div>
                  <span className="text-xs text-neutral-500 font-mono">One-time investment</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Luxury Design That Builds Instant Trust</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Opens in Under 1 Second on Any Mobile Phone</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Built-in Google &amp; AI Search Optimization</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Every Lead Sent Straight to Your Phone &amp; Email</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Own 100% of the Website Forever</li>
                </ul>
              </div>
              <Link href="#start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Get Your Website
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
                      <h3 className="font-display font-bold text-2xl text-white">AI Sales &amp; Booking Machine</h3>
                      <p className="text-xs text-neutral-400 mt-1">For businesses that want clients booked automatically 24/7.</p>
                    </div>
                    <Badge variant="electric">Most Popular</Badge>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-3xl text-white">From $1,200</div>
                    <span className="text-xs text-[#00F0FF] font-mono">One-time investment</span>
                  </div>

                  <ul className="space-y-3 text-xs text-neutral-200 pt-4 border-t border-white/10">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Everything in High-Converting Website</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 24/7 AI Receptionist Answers in Under 30s</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automatically Qualifies Budgets &amp; Needs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Direct Calendar Booking Straight Into Your Schedule</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Saves Your Team 20+ Hours of Phone Calls Every Week</li>
                  </ul>
                </div>

                <Link href="#start-project" className="relative z-10 mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    Get Your AI Sales Machine
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3: Custom SaaS & MVP */}
            <Card variant="light" className="p-8 flex flex-col justify-between border border-black/15 bg-white">
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-2xl text-black">Custom Client Portals &amp; Tools</h3>
                  <p className="text-xs text-neutral-500 mt-1">For companies that want their own custom software platform.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-3xl text-black">From $3,000</div>
                  <span className="text-xs text-neutral-500 font-mono">Complete custom platform</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Private Client Portals for Project Updates &amp; Files</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automatic Online Credit Card Billing &amp; Invoicing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Replace 10 Expensive Monthly Software Subscriptions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Clean, Simple Business Dashboard You Control</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Own 100% of the Code — Zero Monthly Rent</li>
                </ul>
              </div>
              <Link href="#start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Build Your Custom Tool
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
              CYBERSTYLE made our business look like the #1 choice in our market. Within our first week, we started getting booked appointments through our website without having to chase anyone down.
            </blockquote>
            <div className="pt-4 flex items-center justify-between border-t border-black/10">
              <div>
                <div className="font-display font-bold text-base text-black">Franklin Miller</div>
                <div className="text-xs font-mono text-neutral-500">Founder &amp; Managing Director</div>
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
                <div className="text-[11px] text-emerald-400 font-mono">Verified Client Partner</div>
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
              Clear Answers
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black tracking-tight">
              Questions Business Owners Ask Us
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How fast will my new website start bringing in leads?',
                a: 'Your site is built from day one to turn visitors into phone calls and bookings. Most projects go live in 2 to 3 weeks, and you will immediately notice more qualified inquiries because the site loads instantly and is crystal-clear to navigate.',
              },
              {
                q: 'Will this work smoothly on customers’ phones?',
                a: 'Yes, absolutely. Over 70% of your customers visit on mobile. We test every page on iPhones and Androids to ensure it opens in under 1 second without any freezing or lag.',
              },
              {
                q: 'How does the 24/7 AI lead assistant actually make me money?',
                a: 'When a customer lands on your site late at night, our AI assistant responds in under 30 seconds. It answers their questions, confirms what they need, and schedules them into your calendar. You wake up to pre-sold clients ready to work with you.',
              },
              {
                q: 'Do I own 100% of my website, or am I locked into a monthly contract?',
                a: 'You own 100% of everything forever. All files, code, design, and customer data belong completely to you. We never charge monthly rent to keep your own website online.',
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
            Ready to Stop Losing Customers to Your Competitors?
          </h2>
          <p className="text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Let's build a website and AI system that turns your visitors into paying customers on autopilot. Book a quick 15-minute gameplan with us today.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/start-project">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                Get Your Free 15-Min Gameplan
              </Button>
            </Link>
            <a href="mailto:contact@cyberstyle.net">
              <Button variant="outline" size="lg">
                Email Us: contact@cyberstyle.net
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
