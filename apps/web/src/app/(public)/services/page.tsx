import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Layers, Cpu, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Services & Solutions That Drive Revenue',
  description:
    'Explore CYBERSTYLE services: High-Converting Websites, 24/7 AI Sales Assistants, and Custom Business Software you own 100%.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="What We Do"
        title="Digital Solutions Built to Get You More Customers and Save You Time."
        description="We don't build generic brochures. We build websites that turn visitors into paying clients, 24/7 AI assistants that capture leads while you sleep, and custom software that saves your team hours every day."
      />

      {/* Services Detail Grid */}
      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Service 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 rounded-3xl bg-[#0F1118] border border-white/10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">01 // High-Converting Web</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  Premium Websites That Turn Visitors Into Clients
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Stop losing customers to slow, outdated websites. We build sleek, lightning-fast websites that build instant trust and make customers want to buy from you instead of your competitors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Luxury Design That Builds Instant Trust</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Opens in Under 1 Second on Any Mobile Phone</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Rank Higher on Google &amp; AI Search</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 100% Code &amp; Asset Ownership Forever</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Starting Investment</div>
                <div className="font-display font-bold text-3xl text-white mt-1">From $800</div>
                <p className="text-xs text-neutral-400 mt-2">
                  One-time build fee. Final price depends on page count, custom visuals, and forms.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/premium-web">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    See What's Included
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    Get Your Website
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 rounded-3xl bg-[#0F1118] border border-white/10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">02 // 24/7 AI Sales Assistant</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  AI Lead &amp; Appointment Booking Assistants
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Never miss another customer inquiry because you were busy. Our smart AI receptionist answers questions, qualifies customer budgets, and books appointments onto your calendar in under 30 seconds.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Instant 24/7 Replies in Under 30 Seconds</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automatic Calendar Booking Without Back-and-Forth</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Instant SMS &amp; Email Alerts to Your Phone</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Saves Your Team 20+ Hours of Phone Calls</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Starting Investment</div>
                <div className="font-display font-bold text-3xl text-white mt-1">From $1,200</div>
                <p className="text-xs text-neutral-400 mt-2">
                  One-time build fee. Custom-trained on your business FAQs, prices, and booking rules.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/ai-automation">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    See How AI Works
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    Get Your AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 rounded-3xl bg-[#0F1118] border border-white/10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">03 // Custom Business Software</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  Custom Client Portals &amp; Operations Tools
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Stop paying thousands every year for 10 different software subscriptions that don't fit your business. We build custom client portals, billing dashboards, and tools built just for you that you own forever.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Private Portals for Clients to Check Project Status</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automatic Credit Card Invoicing &amp; Online Payments</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Everything in One Simple, Clean Dashboard</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> You Own 100% of the Code — Zero Monthly Rent</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Starting Investment</div>
                <div className="font-display font-bold text-3xl text-white mt-1">From $3,000</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Complete custom software build with authentication, billing, and team permissions.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/custom-saas">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    See Software Capabilities
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    Build Your Custom Tool
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
