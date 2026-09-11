import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Cpu, Layers, Sparkles } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'About CYBERSTYLE LLC',
  description:
    'Elevating business websites into premium, 3D-driven digital systems and AI automations that increase leads and revenue.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="About The Brand"
        title="We Engineer Digital Systems That Move Business Forward."
        description="CYBERSTYLE LLC was founded on a simple conviction: business websites should be distinctive, high-converting digital assets, not generic brochures."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Mission & Vision Section (Editorial White) */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Our Mission</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-black leading-tight">
                “Elevate business websites into premium, 3D-driven experiences that increase leads and revenue.”
              </h2>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Our Vision</span>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-sans">
                “Make immersive websites more alive and accessible in the market, helping brands own distinctive identities, digital systems, 3D models, and creativity that converts.”
              </p>
            </div>
          </div>

          {/* Core Engineering Principles */}
          <div className="pt-16 border-t border-black/10 space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">How We Operate</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-black">
                Our Core Principles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="font-display font-bold text-xl text-black">Outcome Over Hype</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We don’t chase empty design trends or buzzwords. Every visual decision, 3D shader, and AI integration is measured by its impact on client conversion and operational efficiency.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="font-display font-bold text-xl text-black">Complete Client Ownership</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  You own 100% of your source code, database models, design assets, and VPS deployments. No vendor lock-in or proprietary hostage platforms.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="font-display font-bold text-xl text-black">Industrial-Tech Aesthetics</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Controlled, deliberate, high-end editorial aesthetics. We avoid tacky cyberpunk neon overload in favor of sleek dark-to-light precision and architectural balance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />

      {/* Markets & Global Footprint */}
      <section className="pt-6 pb-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Global Presence</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
            Serving Ambitious Brands Across 3 Major Markets
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-base">
            From emerging tech companies in the USA and Canada to innovative enterprises in the Middle East and worldwide.
          </p>
          <div className="pt-6">
            <Link href="/start-project">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                Start a Conversation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
