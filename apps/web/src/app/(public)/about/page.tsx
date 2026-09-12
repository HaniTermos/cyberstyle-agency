import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Cpu, Layers, Sparkles } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'About CYBERSTYLE | Websites & AI That Grow Your Revenue',
  description:
    'We build websites and AI assistants that bring in real customers and save business owners dozens of hours every week. 100% ownership, zero monthly rent.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Who We Are"
        title="We Build Digital Assets That Bring in Real Customers."
        description="CYBERSTYLE was founded on one simple truth: your website should be an automated sales machine that makes you money, not an expensive brochure that nobody reads."
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
                “Transform business websites into customer-generating machines that bring in qualified leads 24/7.”
              </h2>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Our Vision</span>
              <p className="text-neutral-700 text-base sm:text-lg leading-relaxed font-sans">
                “Help growing businesses look like multi-million dollar market leaders, win more clients, and automate daily busywork so founders and teams can focus on what they do best.”
              </p>
            </div>
          </div>

          {/* Core Engineering Principles */}
          <div className="pt-16 border-t border-black/10 space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">What Guides Us</span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-black">
                Our Core Promises to You
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="font-display font-bold text-xl text-black">Real Revenue Over Fluff</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  We don’t build fancy designs that confuse your visitors. Every single headline, button, and layout is built to make people trust you and hire you on the spot.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="font-display font-bold text-xl text-black">100% You Own Everything</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Once built, your website, code, customer data, and design files belong 100% to you. We never lock your business in or charge monthly hostage rent.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-[#F8F9FB] border border-black/10 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-black text-[#00F0FF] flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="font-display font-bold text-xl text-black">Speed Customers Love</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Your pages load in under 1 second on any mobile phone or computer. When your site is this fast, customers stay, browse, and book instead of bouncing away.
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
          <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">Who We Serve</span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white">
            Helping Ambitious Businesses Across the United States &amp; Worldwide
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-base">
            From high-ticket local medical clinics and service companies to growing e-commerce brands and innovative startups.
          </p>
          <div className="pt-6">
            <Link href="/start-project">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                Get Your 15-Minute Free Gameplan
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
