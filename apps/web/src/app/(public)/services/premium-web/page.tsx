import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Sparkles, Zap, Layers } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Premium Web Development & 3D Experiences',
  description:
    'High-converting, interactive, and 3D websites tailored for brands ready to differentiate and increase qualified client leads. Starting from $800.',
};

export default function PremiumWebServicePage() {
  const deliverables = [
    'Bespoke Next.js 15 App Router Architecture with strict TypeScript',
    'Custom Three.js / React Three Fiber Silk shader canvases',
    'Sub-second Core Web Vitals (LCP < 1.2s, CLS 0, FID < 100ms)',
    'Self-hosted Headless CMS (Payload CMS) for complete content control',
    'Conversion funnels & automated lead capture pipelines',
    'Full SEO optimization (Schema.org JSON-LD, OpenGraph, dynamic sitemaps)',
    'WCAG 2.2 AA compliant keyboard navigation & high contrast accessibility',
    '100% Code & Asset Transfer upon project completion',
  ];

  const faqs = [
    {
      q: 'What is included in the $800 starting tier?',
      a: 'The starting tier includes a bespoke, high-conversion multi-section web system with customized typography, responsive layout, contact pipeline, and SEO readiness. Additional 3D depth, custom animations, and CMS collections are scoped transparently.',
    },
    {
      q: 'Will 3D WebGL elements slow down mobile devices?',
      a: 'No. We configure strict DPR throttling (1.0 to 1.5), lazy shader compilation, and instant static CSS fallbacks for low-power and reduced-motion environments.',
    },
    {
      q: 'Can we edit content after launch without developer intervention?',
      a: 'Yes. Every build connects to a self-hosted Payload CMS where your team can modify text, case studies, media, and site settings with zero recurring monthly subscription fees.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Service // 01"
        title="Premium Web Experiences & 3D Interactivity"
        description="We build high-converting, unforgettable web platforms that combine editorial visual distinction with rigorous technical performance. Starting from $800."
      />

      {/* Scope, Outcome & Value Proposition */}
      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">The Business Problem</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                Most websites look like generic templates and fail to convert high-ticket buyers.
              </h2>
            </div>
            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
              In a crowded market, generic Shopify themes or template builders communicate commodity status. CYBERSTYLE engineers web systems that command respect, captivate high-value prospects with tasteful 3D/Silk motion, and guide visitors through deliberate conversion funnels.
            </p>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <h3 className="font-display font-bold text-xl text-white">Key Deliverables & Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Inquiry Action Box */}
          <div className="lg:col-span-5">
            <Card variant="highlight" className="p-8 space-y-6 sticky top-28 bg-[#0C0F17]">
              <div>
                <span className="text-xs font-mono text-[#00F0FF] uppercase tracking-wider">Investment Framework</span>
                <div className="font-display font-bold text-4xl text-white mt-1">From $800</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Scope covers discovery, architecture, design system, build, CMS, and VPS deployment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono text-neutral-300">
                <div className="flex justify-between"><span>Timeline:</span><span className="text-white">1–3 Weeks</span></div>
                <div className="flex justify-between"><span>Deployment:</span><span className="text-white">Linux VPS / Docker</span></div>
                <div className="flex justify-between"><span>Tech Stack:</span><span className="text-white">Next.js 15, Tailwind, Three.js</span></div>
              </div>

              <Link href="/start-project">
                <Button variant="electric" size="lg" className="w-full justify-center" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Start This Project
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      {/* Service-Specific FAQs */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Frequently Asked</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-black">
              Questions About Web Development
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <h4 className="font-display font-bold text-lg text-black">{faq.q}</h4>
                <p className="text-sm text-neutral-600 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
