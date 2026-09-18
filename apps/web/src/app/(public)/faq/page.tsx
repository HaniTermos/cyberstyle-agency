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
  CONTACT_EMAIL,
} from '@/lib/constants/brand';
import { apiRequest } from '@/lib/api';

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
  const [items, setItems] = useState<FaqItem[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  React.useEffect(() => {
    let isMounted = true;
    apiRequest<{ faqs: Array<{ question: string; answer: string; category: string }> }>('/faqs?page=faq')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.data?.faqs) && res.data.faqs.length > 0) {
          setItems(
            res.data.faqs.map((f) => ({
              q: f.question,
              a: f.answer,
              category: f.category || 'General',
            }))
          );
        } else {
          setItems([]);
        }
      })
      .catch(() => {
        if (isMounted) setItems([]);
      })
      .finally(() => {
        if (isMounted) setHasLoaded(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageBanner
        badgeText="Common Inquiries"
        title="Frequently Asked Questions."
        description="Clear, honest answers regarding pricing, code ownership, AI workflows, and project timelines—explained in plain English."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-16 sm:pb-24 px-4 sm:px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {!hasLoaded ? (
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 sm:h-20 rounded-xl sm:rounded-2xl bg-black/[0.03] border border-black/10 animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="py-14 sm:py-20 text-center border border-dashed border-black/10 rounded-xl sm:rounded-2xl p-6 sm:p-8 bg-black/[0.02]">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400 mx-auto mb-2 sm:mb-3" />
              <p className="text-neutral-600 text-sm sm:text-base font-display font-bold">
                No frequently asked questions published yet.
              </p>
              <p className="text-neutral-400 text-xs font-mono mt-1">
                Please check back shortly or reach out to our team directly.
              </p>
            </div>
          ) : (
            items.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl sm:rounded-2xl border border-black/10 bg-[#F8F9FB] p-4 sm:p-6 transition-all duration-200"
            >
              <button
                type="button"
                aria-expanded={activeIdx === idx}
                data-testid="faq-accordion-button"
                onClick={() => setActiveIdx(activeIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-display font-bold text-base sm:text-lg text-black focus:outline-none gap-3"
              >
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                    {faq.category || 'General Scope'}
                  </span>
                  <span className="break-words leading-snug">{faq.q}</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center shrink-0">
                  <ChevronDown
                    className={`w-4 h-4 text-black transition-transform duration-200 ${
                      activeIdx === idx ? 'rotate-180 text-[#0080FF]' : ''
                    }`}
                  />
                </div>
              </button>

              {activeIdx === idx && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-black/10 text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
                  {faq.a}
                </div>
              )}
            </div>
          ))
          )}

          <div className="pt-12 text-center space-y-4">
            <h3 className="font-display font-bold text-2xl text-black">Have a specific question not listed here?</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Reach out to our team directly or schedule an introductory project call.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/start-project" className="w-full sm:w-auto">
                <Button variant="electric" size="md" className="w-full sm:w-auto justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                  {CTA_LABELS.primary}
                </Button>
              </Link>
              <a href={`mailto:${CONTACT_EMAIL}`} className="w-full sm:w-auto">
                <Button variant="secondary" size="md" className="w-full sm:w-auto justify-center text-xs sm:text-sm">
                  Email: {CONTACT_EMAIL}
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
