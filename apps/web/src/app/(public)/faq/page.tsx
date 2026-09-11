'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { SectionGradient } from '@/components/ui/SectionGradient';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: 'Pricing & Investment',
    q: 'What is the starting price for CYBERSTYLE services?',
    a: 'Our bespoke websites start from $800, AI & business automation systems from $1,200, and full-stack custom SaaS/MVPs from $3,000. Exact pricing is scoped transparently based on your functional specifications, 3D complexity, and timeline.',
  },
  {
    category: 'Pricing & Investment',
    q: 'What payment terms and methods do you accept?',
    a: 'Standard projects are structured with a 50% upfront deposit to commence discovery and architecture, with the remaining 50% due upon staging approval and prior to production deployment. We accept credit cards via Stripe and direct wire transfers.',
  },
  {
    category: 'Performance & 3D Engineering',
    q: 'Will custom 3D WebGL and Silk backgrounds affect mobile loading times?',
    a: 'No. We engineer our shaders with lazy compilation, power-preference tuning, frame throttling, and automatic CSS gradient fallbacks for low-power or reduced-motion environments. We target 90+ Lighthouse Core Web Vitals on every build.',
  },
  {
    category: 'Performance & 3D Engineering',
    q: 'Do you design with accessible contrast and keyboard navigation?',
    a: 'Yes. All interactive controls feature high-contrast visible focus rings (:focus-visible), WCAG 2.2 AA compliant color contrast ratios across both dark and light surfaces, and ARIA landmarks.',
  },
  {
    category: 'AI & Business Automation',
    q: 'How does AI lead qualification work in practice?',
    a: 'When an inquiry is submitted, our backend pipeline parses the payload through custom Gemini/OpenAI evaluation pipelines to score budget, timeline, and urgency, saving the structured record to PostgreSQL and dispatching notifications with drafted responses.',
  },
  {
    category: 'Ownership & Delivery',
    q: 'Do we own 100% of the code, assets, and database upon completion?',
    a: 'Yes. Upon final invoice settlement, complete ownership of all source code repositories, design files, database schemas, and Docker deployment scripts is transferred to your organization.',
  },
  {
    category: 'Ownership & Delivery',
    q: 'Where are the web applications deployed?',
    a: 'We configure modern Linux VPS deployments via Docker Compose (PostgreSQL 16, Redis 7, Express API, Next.js Web, Nginx reverse proxy with automated Let’s Encrypt TLS renewal) for zero vendor lock-in.',
  },
];

export default function FaqPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Knowledge Base"
        title="Frequently Answered Questions"
        description="Clear answers regarding our engineering standards, investment tiers, 3D performance, AI automations, and delivery process."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-black/10 bg-[#F8F9FB] p-6 transition-all duration-200"
            >
              <button
                onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-display font-bold text-lg text-black focus:outline-none"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    {faq.category}
                  </span>
                  <span>{faq.q}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-500 transition-transform duration-200 shrink-0 ml-4 ${
                    activeIdx === idx ? 'rotate-180 text-[#0080FF]' : ''
                  }`}
                />
              </button>
              {activeIdx === idx && (
                <p className="mt-4 text-sm text-neutral-700 leading-relaxed font-sans border-t border-black/5 pt-4">
                  {faq.a}
                </p>
              )}
            </div>
          ))}

          <div className="pt-12 text-center space-y-4">
            <h3 className="font-display font-bold text-2xl text-black">Have a question not listed here?</h3>
            <a href="mailto:hello@cyberstyle.net">
              <Button variant="secondary" size="md" icon={<ArrowUpRight className="w-4 h-4" />}>
                Ask Directly: hello@cyberstyle.net
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
