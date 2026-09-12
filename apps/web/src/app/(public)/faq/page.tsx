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
    q: 'How much does a project with CYBERSTYLE cost?',
    a: 'High-converting websites start from $800, 24/7 AI Lead Assistants start from $1,200, and custom business tools/client portals start from $3,000. You get a clear, flat-rate price upfront before we write a single line of code—no hidden fees, no hourly surprises, and no sudden price hikes.',
  },
  {
    category: 'Pricing & Investment',
    q: 'How do payments work?',
    a: 'We keep it simple: 50% upfront to start your project, and the remaining 50% only when you review, test, and 100% approve everything on your private preview link. You can pay securely with any major credit card via Stripe or bank transfer.',
  },
  {
    category: 'Speed & Mobile Experience',
    q: 'How fast will my new website load on mobile phones?',
    a: 'In under 1 second. Most websites lose over half their customers because they take 4 to 6 seconds to open on phones. We make sure your site pops open instantly on any phone, tablet, or slow cellular connection so prospective customers never bounce away to your competitors.',
  },
  {
    category: '24/7 AI Lead Assistant',
    q: 'How does the 24/7 AI Assistant actually bring me more customers?',
    a: 'Think of it as your best full-time receptionist who never sleeps, never takes a break, and responds in under 30 seconds. When an interested buyer visits your website or messages you at 10 PM on a Sunday, the AI greets them warmly, answers questions about your services accurately, collects their contact info, and books an appointment directly onto your calendar.',
  },
  {
    category: '100% Ownership & Zero Rent',
    q: 'Do I really own 100% of everything forever?',
    a: 'Yes, 100%. When we hand over your project, you own all the files, designs, databases, and assets. You are never trapped paying monthly "software rent" to keep your own website online. If you ever decide to move, everything is yours to take.',
  },
  {
    category: 'Timeline & Delivery',
    q: 'How long does it take from our first call to launch?',
    a: 'Most premium websites are built, reviewed, and launched in 7 to 14 days. AI lead systems take 2 to 3 weeks. We work fast with zero fluff so you can start capturing paying customers right away.',
  },
  {
    category: 'Ongoing Support & Care',
    q: 'What happens after my website or AI assistant is launched?',
    a: 'You can either manage it yourself with zero ongoing fees, or let us handle everything for a simple $30/month VIP Care plan (daily automatic backups, security monitoring, and instant updates). You also get an easy guide so anyone on your team can make updates in seconds.',
  },
  {
    category: 'Getting Started',
    q: 'What do I need to prepare before we get started?',
    a: 'Nothing at all! You do not need any technical knowledge. Just tell us about your business, who your ideal customers are, and what you want to achieve. We handle all the design, copywriting guidance, setup, and launch for you.',
  },
];

export default function FaqPage() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Common Questions"
        title="Everything You Need to Know."
        description="Clear, honest answers about pricing, speed, 24/7 AI assistants, and 100% asset ownership—no confusing technical jargon."
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
            <h3 className="font-display font-bold text-2xl text-black">Ready to grow your business?</h3>
            <p className="text-sm text-neutral-600 max-w-md mx-auto">
              Book a quick, zero-pressure 15-minute Gameplan Call or email us anytime.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a href="/start-project">
                <Button variant="electric" size="md" icon={<ArrowUpRight className="w-4 h-4" />}>
                  Get Your Free Gameplan
                </Button>
              </a>
              <a href="mailto:hello@cyberstyle.net">
                <Button variant="secondary" size="md">
                  Email Us: hello@cyberstyle.net
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
