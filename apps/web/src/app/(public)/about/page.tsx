import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Code2, Smartphone, Layers, CheckCircle2 } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import {
  BRAND_NAME,
  BRAND_STATEMENT,
  PRIMARY_MESSAGE,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'About CYBERSTYLE // Web Engineering & Systems Studio',
  description:
    'CYBERSTYLE designs and builds modern websites, enquiry automation workflows, and custom digital software for growing businesses.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Studio Background"
        title="Engineering Digital Systems That Solve Real Operational Needs."
        description={PRIMARY_MESSAGE}
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Mission & Principles Section (Editorial White) */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Our Purpose</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-black leading-tight">
                {BRAND_STATEMENT}
              </h2>
            </div>
            <div className="space-y-4 text-neutral-700 text-base sm:text-lg leading-relaxed font-sans">
              <p>
                Too many businesses struggle with slow, disjointed websites that fail to communicate their true competence, or pay expensive recurring subscription fees for rigid tools that do not fit their operations.
              </p>
              <p>
                We focus on straightforward digital craftsmanship: responsive layouts, fast page rendering, sensible enquiry routing, and custom software where standard tools fall short.
              </p>
            </div>
          </div>

          {/* Guiding Principles */}
          <div className="pt-16 border-t border-black/10 space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">How We Operate</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-black">
                Our Core Engineering Principles
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="font-display font-bold text-xl text-black">Clear Scope &amp; Honest Milestones</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We outline every deliverable, technical component, and timeline milestone in a written scope before starting work so expectations are always clear.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="font-display font-bold text-xl text-black">Full Code &amp; Asset Delivery</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Upon completion, you receive full ownership of your custom source code and design deliverables. We do not charge recurring agency software rent.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="font-display font-bold text-xl text-black">Responsive &amp; Accessible Design</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We build with modern web frameworks (Next.js &amp; TypeScript) to ensure fast rendering, semantic HTML hierarchy, and clean mobile navigation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />

      {/* Client Profile */}
      <section className="pt-6 pb-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Who We Work With</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
            Partnering With Growth-Minded Businesses
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-base">
            From B2B consultancies and professional service firms to high-ticket local practices and specialized online brands that rely on dependable web systems.
          </p>
          <div className="pt-6">
            <Link href="/start-project">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                {CTA_LABELS.primary}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
