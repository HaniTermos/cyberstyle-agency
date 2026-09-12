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
  title: 'Pricing & Packages That Pay for Themselves // CYBERSTYLE',
  description:
    'Clear, transparent pricing for high-converting websites, 24/7 AI sales assistants, and custom software. You own 100% of your assets with zero monthly software rent. Starting from $800.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Transparent Investments"
        title="Simple, Predictable Pricing That Pays for Itself."
        description="No hidden fees. No endless monthly rental bills. Just clear investments designed to bring you more customers and save your team dozens of hours every week."
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
                  <h3 className="font-display font-bold text-2xl text-black mt-1">High-Converting Website</h3>
                  <p className="text-xs text-neutral-500 mt-1">For businesses ready to look like the #1 choice in their market.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-4xl text-black">From $800</div>
                  <span className="text-xs text-neutral-500 font-mono">One-time investment</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Custom Luxury Design That Builds Instant Trust</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Opens in Under 1 Second on Any Mobile Phone</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Built-in Google &amp; AI Search Optimization</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Every Inquiry Sent Straight to Your Phone &amp; Email</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Own 100% of the Website Forever</li>
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Get Your Website
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
                      <h3 className="font-display font-bold text-2xl text-white mt-1">AI Sales &amp; Booking Machine</h3>
                      <p className="text-xs text-neutral-400 mt-1">For businesses that want clients booked automatically 24/7.</p>
                    </div>
                    <Badge variant="electric">Most Popular</Badge>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <div className="font-display font-bold text-4xl text-white">From $1,200</div>
                    <span className="text-xs text-[#00F0FF] font-mono">One-time investment</span>
                  </div>
                  <ul className="space-y-3 text-xs text-neutral-200 pt-4 border-t border-white/10">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Everything in High-Converting Website</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 24/7 AI Receptionist Answers in Under 30s</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automatically Qualifies Budgets &amp; Client Needs</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Direct Calendar Booking Straight Into Your Schedule</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Saves Your Team 20+ Hours of Phone Calls Every Week</li>
                  </ul>
                </div>
                <Link href="/start-project" className="relative z-10 mt-8">
                  <Button variant="electric" className="w-full justify-center">
                    Get Your AI Sales Machine
                  </Button>
                </Link>
              </Card>
            </div>

            {/* Tier 3 */}
            <Card variant="light" className="p-8 flex flex-col justify-between bg-white border border-black/10">
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono uppercase text-neutral-500">Tier 03</span>
                  <h3 className="font-display font-bold text-2xl text-black mt-1">Custom Client Portals &amp; Tools</h3>
                  <p className="text-xs text-neutral-500 mt-1">For companies that want their own custom software platform.</p>
                </div>
                <div className="pt-4 border-t border-black/10">
                  <div className="font-display font-bold text-4xl text-black">From $3,000</div>
                  <span className="text-xs text-neutral-500 font-mono">Complete custom platform</span>
                </div>
                <ul className="space-y-3 text-xs text-neutral-700 pt-4 border-t border-black/10">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Private Client Portals for Project Updates &amp; Files</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Automatic Online Credit Card Billing &amp; Invoicing</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Replace 5 to 10 Expensive Monthly Software Subscriptions</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Clean, Simple Business Dashboard Your Whole Team Can Use</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> You Own 100% of the Code — Zero Monthly User Rent</li>
                </ul>
              </div>
              <Link href="/start-project" className="mt-8">
                <Button variant="secondary" className="w-full justify-center">
                  Build Your Custom Tool
                </Button>
              </Link>
            </Card>
          </div>

          {/* Pricing Disclaimer Note */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-neutral-400 text-center max-w-3xl mx-auto">
            * Note: All prices are base starting rates in USD. You will receive a clear, fixed-price proposal before we start, so you always know exactly what you are investing.
          </div>
        </div>
      </section>
    </div>
  );
}
