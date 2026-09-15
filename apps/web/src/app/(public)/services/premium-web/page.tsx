import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  Layers,
  Search,
  Globe2,
  Smartphone,
  Server,
  Clock,
  Check,
  Wrench,
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { DynamicFaqAccordion } from '@/components/faq/DynamicFaqAccordion';
import {
  SERVICES,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  SUPPORT_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Web Engineering, Technical SEO & Responsive Design // CYBERSTYLE',
  description:
    'Custom websites built with Next.js and TypeScript, optimized for search engines, mobile devices, and fast user interaction.',
};

export default function PremiumWebServicePage() {
  const plainEnglishDeliverables = [
    {
      title: 'Technical Search Engine Optimization (SEO)',
      desc: 'We structure semantic HTML, heading hierarchies, OpenGraph tags, and XML sitemaps to ensure search engines can properly index your content.',
      icon: Search,
    },
    {
      title: 'Generative Engine Optimization (GEO)',
      desc: 'We format your structured data (Schema.org JSON-LD) so AI-driven answer engines can understand and cite your business accurately.',
      icon: Globe2,
    },
    {
      title: 'Performance & Fast Asset Loading',
      desc: 'We compress media, eliminate unused scripts, and use modern server-side rendering to help pages load efficiently on all connections.',
      icon: Zap,
    },
    {
      title: 'Responsive Mobile & Desktop Layouts',
      desc: 'Tested thoroughly across iPhones, Androids, tablets, and desktop displays to ensure smooth navigation and readable typography.',
      icon: Smartphone,
    },
    {
      title: 'Modular Content Management',
      desc: 'We configure clean content structures or headless dashboards so your team can easily update copy and images without touching code.',
      icon: Layers,
    },
    {
      title: 'Modern Security Standards & SSL',
      desc: 'Configured with HTTPS SSL certificates, secure response headers, and reliable deployment protections.',
      icon: ShieldCheck,
    },
  ];

  const workflows = [
    {
      step: '01',
      title: 'Discovery & Plain-English Strategy',
      desc: 'We review your business goals, target audience, and functional requirements. Every deliverable is clearly outlined in writing.',
    },
    {
      step: '02',
      title: 'Interactive Design & Preview',
      desc: 'You review visual prototypes and layouts before code is finalized, ensuring layout and copy align with your brand.',
    },
    {
      step: '03',
      title: 'Engineering & Device Testing',
      desc: 'We build your website using Next.js and TypeScript, integrate contact forms, and test across multiple screen sizes.',
    },
    {
      step: '04',
      title: 'Live Deployment & Code Handoff',
      desc: 'We configure DNS settings, launch to your hosting provider, hand over source code repositories, and provide a walkthrough.',
    },
  ];

  const faqs = [
    {
      q: 'What is the difference between SEO and GEO?',
      a: 'SEO focuses on traditional search engine discovery (such as Google and Bing) via clean HTML, metadata, and crawlable structure. GEO (Generative Engine Optimization) adds schema markup and factual entity data to help LLM-based search tools like ChatGPT, Perplexity, and Gemini cite your business when answering queries.',
    },
    {
      q: 'What does the optional $30/month Maintenance & Support package cover?',
      a: `${SUPPORT_DISCLOSURE} It is completely optional—you may host and manage the site independently if you prefer.`,
    },
    {
      q: 'Will visual animations or shaders affect performance on mobile phones?',
      a: 'We use adaptive rendering that scales back particle and shader intensity on mobile screens and devices with reduced-motion preferences, prioritizing quick loading and battery efficiency.',
    },
    {
      q: 'Do I own my website and code once finished?',
      a: `${OWNERSHIP_DISCLOSURE} Domain registration and ongoing hosting services are paid directly to your selected third-party providers.`,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black font-sans">
      <PageBanner
        badgeText="SERVICE // 01"
        title={SERVICES.web.name}
        description={SERVICES.web.description}
      />

      {/* Main Section */}
      <section className="py-20 px-6 bg-[#080A10]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Explanations & Deliverables */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                WHY IT MATTERS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                A business website should make your services easy to understand and simple to engage.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Most web visitors make a decision within seconds. We engineer websites that present your value clearly, look sharp across devices, and guide qualified prospective clients directly to your booking or contact forms.
              </p>
            </div>

            {/* Plain English Deliverables */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>What’s Included in the Build</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plainEnglishDeliverables.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#0C0E17] border border-zinc-800/80 hover:border-cyan-500/30 transition-colors space-y-2"
                    >
                      <div className="flex items-center gap-2 text-cyan-400">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="font-bold text-xs text-white">{item.title}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Non-Technical Workflow */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>How We Deliver Your Project</span>
              </h3>
              <p className="text-xs text-zinc-400">
                Every milestone is agreed in writing so you have complete visibility throughout development.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {workflows.map((wf, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0C0E17] border border-zinc-800 space-y-2 relative overflow-hidden"
                  >
                    <span className="font-mono text-2xl font-black text-cyan-400/20 absolute top-2 right-3">
                      {wf.step}
                    </span>
                    <h4 className="text-xs font-bold text-white pr-6">{wf.title}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{wf.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Maintenance Box */}
          <div className="lg:col-span-5 space-y-6">
            {/* Base Build Card */}
            <Card variant="highlight" className="p-8 space-y-6 bg-[#0C0E17] border-cyan-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">PROJECT INVESTMENT</span>
                <div className="text-4xl font-bold text-white mt-1">{SERVICES.web.startingPrice}</div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  One-time build fee covering custom design, Next.js engineering, technical SEO, and production deployment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between"><span>Typical Delivery:</span><span className="text-cyan-400 font-bold">2–4 Weeks</span></div>
                <div className="flex justify-between"><span>Search Optimization:</span><span className="text-emerald-400 font-bold">SEO &amp; GEO Included</span></div>
                <div className="flex justify-between"><span>Code Deliverables:</span><span className="text-white font-bold">Complete Repository</span></div>
              </div>

              <p className="text-[11px] text-zinc-400 font-mono">
                {ONGOING_COSTS_DISCLOSURE}
              </p>

              <Link href="/start-project" className="block">
                <Button variant="electric" size="lg" className="w-full justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                  <span>{CTA_LABELS.primary}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>

            {/* Optional Maintenance & Support Card */}
            <div className="p-6 rounded-2xl bg-[#0C0E17] border border-cyan-500/20 space-y-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    OPTIONAL MAINTENANCE
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CANCEL ANYTIME
                </span>
              </div>

              <div>
                <div className="text-2xl font-bold text-white">$30 <span className="text-xs text-zinc-400 font-normal">/ month</span></div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Carefree ongoing upkeep so your site remains secure, updated, and monitored.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Uptime monitoring &amp; automated alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Periodic automated website backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Security patches &amp; framework updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Minor text, contact, and image updates</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Atmospheric Transition Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-32 sm:h-44" />

      {/* FAQs Section */}
      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <DynamicFaqAccordion
            page="premium-web"
            subtitle="PLAIN QUESTIONS & ANSWERS"
            title="Frequently Asked Questions"
            fallbackFaqs={faqs}
            variant="light"
          />
        </div>
      </section>

      {/* Atmospheric Transition Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-32 sm:h-44" />
    </div>
  );
}
