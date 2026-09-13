'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { SectionGradient } from '@/components/ui/SectionGradient';
import {
  SERVICES,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  AI_LIMITATIONS_DISCLOSURE,
  SUPPORT_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

interface FaqItem {
  q: string;
  a: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: 'Build Fees & Scope',
    q: 'How are CYBERSTYLE project fees structured?',
    a: `Our projects are priced as fixed one-time build fees based on documented scope: ${SERVICES.web.name} starts from ${SERVICES.web.startingPrice}, ${SERVICES.ai.name} starts from ${SERVICES.ai.startingPrice}, and ${SERVICES.saas.name} starts from ${SERVICES.saas.startingPrice}. Every proposal details deliverables in writing before work begins.`,
  },
  {
    category: 'Build Fees & Scope',
    q: 'How do milestone payments work?',
    a: 'Standard projects typically follow a 50% initial milestone payment to initiate design and architecture, with the remaining 50% due upon review, staging acceptance, and final deployment approval. Payments are processed securely via Stripe or bank transfer.',
  },
  {
    category: 'Performance & Engineering',
    q: 'How do you ensure websites perform well on mobile phones?',
    a: 'We engineer using Next.js and TypeScript, serving pre-rendered HTML and automatically optimizing image formats (WebP/AVIF). We avoid bloated third-party plugin suites to help pages load quickly and navigate smoothly across diverse mobile network connections.',
  },
  {
    category: 'Automation & AI',
    q: 'What does an AI enquiry workflow do, and what are its limits?',
    a: `An automated enquiry assistant can greet visitors, answer routine questions about your services based on approved documentation, and provide links to book consultation calls. Importantly: ${AI_LIMITATIONS_DISCLOSURE}`,
  },
  {
    category: 'Ownership & Infrastructure',
    q: 'Do I own the code and design files once the project is finished?',
    a: `${OWNERSHIP_DISCLOSURE} Ongoing operating costs (like domain renewal, web hosting, and third-party API usage) are billed separately by respective providers.`,
  },
  {
    category: 'Timelines & Delivery',
    q: 'What are typical project timelines from kickoff to launch?',
    a: 'Standard website builds typically take 2 to 4 weeks, depending on page volume and feedback turnaround. Custom web applications and multi-step automation pipelines typically require 3 to 6 weeks. Target dates are documented in your project schedule.',
  },
  {
    category: 'Ongoing Maintenance',
    q: 'What ongoing support or maintenance is needed after launch?',
    a: `${SUPPORT_DISCLOSURE} You can also choose to manage hosting and updates internally with full access to your deployment repository.`,
  },
  {
    category: 'Getting Started',
    q: 'What information should we prepare before our first call?',
    a: 'It is helpful to have an idea of your primary business goals, your existing website URL (if applicable), key features you require, and a rough target timeline. We will guide you through the technical scoping questions during our call.',
  },
];

export default function FaqPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageBanner
        badgeText="Common Inquiries"
        title="Frequently Asked Questions."
        description="Clear, honest answers regarding pricing, code ownership, AI workflows, and project timelines—explained in plain English."
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
            <h3 className="font-display font-bold text-2xl text-black">Have a specific question not listed here?</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Reach out to our team directly or schedule an introductory project call.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/start-project">
                <Button variant="electric" size="md" icon={<ArrowUpRight className="w-4 h-4" />}>
                  {CTA_LABELS.primary}
                </Button>
              </Link>
              <a href="mailto:contact@cyberstyle.net">
                <Button variant="secondary" size="md">
                  Email: contact@cyberstyle.net
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
