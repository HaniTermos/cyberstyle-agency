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
  HelpCircle,
  Clock,
  Check,
  Wrench
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Premium Web Development, SEO & 3D Experiences // CYBERSTYLE',
  description:
    'Custom high-speed websites with Google SEO, AI GEO optimization, and modern interactive designs. Starting from $800 with $30/month maintenance.',
};

export default function PremiumWebServicePage() {
  const plainEnglishDeliverables = [
    {
      title: 'Google SEO (Search Engine Optimization)',
      desc: 'We optimize your website’s code, keywords, and meta tags so your business appears at the top of Google searches when people look for your services.',
      icon: Search,
    },
    {
      title: 'AI GEO (Generative Engine Optimization)',
      desc: 'We structure your content so AI assistants (like ChatGPT, Perplexity, Claude, and Gemini) recommend your business to users asking questions online.',
      icon: Globe2,
    },
    {
      title: 'Blazing Fast Page Speeds',
      desc: 'Your pages load in under 1.2 seconds, ensuring visitors never bounce away and Google rewards your site with higher rankings.',
      icon: Zap,
    },
    {
      title: 'Flawless Mobile & Tablet Design',
      desc: 'Designed custom for iPhones, Androids, iPads, and desktop screens so every visitor gets a smooth, premium experience.',
      icon: Smartphone,
    },
    {
      title: 'Zero-Code Content Management',
      desc: 'You get a clean, self-hosted dashboard where you can easily update text, images, and news anytime without writing any code or paying monthly CMS fees.',
      icon: Layers,
    },
    {
      title: 'Bulletproof Security & Protection',
      desc: 'Equipped with SSL security certificates, firewall defense, and automated backups so your website is safe from hackers 24/7.',
      icon: ShieldCheck,
    },
  ];

  const workflows = [
    {
      step: '01',
      title: 'Discovery & Plain-English Strategy',
      desc: 'We hold a kickoff conversation to understand your business goals, target clients, and design tastes. No confusing technical talk—just clear objectives.',
    },
    {
      step: '02',
      title: 'Interactive Design & Preview',
      desc: 'You review visual prototypes and layouts of your site before any code is finalized. You give feedback, and we refine until you love it.',
    },
    {
      step: '03',
      title: 'Speed, Security & SEO Engineering',
      desc: 'We build your high-speed site, embed Google SEO & AI GEO tags, and test rigorously across all phones, tablets, and computers.',
    },
    {
      step: '04',
      title: 'Live Launch & Simple Video Walkthrough',
      desc: 'We connect your domain, run live health checks, and provide a short, simple video walkthrough showing you how to update anything in minutes.',
    },
  ];

  const faqs = [
    {
      q: 'What is the difference between SEO and GEO?',
      a: 'SEO (Search Engine Optimization) ensures your site ranks on traditional search engines like Google and Bing. GEO (Generative Engine Optimization) structures your content with schema data and clear facts so AI search engines like ChatGPT, Perplexity, and Gemini cite and recommend your business when users ask AI for recommendations.',
    },
    {
      q: 'What is the $30/month Maintenance & Support package?',
      a: 'For only $30/month, our engineering team handles all server updates, security patches, 24/7 uptime monitoring, weekly automated backups, and minor text/photo updates. It gives you 100% peace of mind with zero contract—you can cancel anytime.',
    },
    {
      q: 'Will 3D effects slow down mobile phones?',
      a: 'No. We use adaptive graphics that automatically adjust performance depending on the device. On mobile phones and low-battery settings, your website remains ultra-fast with zero lag.',
    },
    {
      q: 'Do I own my website and code 100%?',
      a: 'Yes, absolutely. Once final delivery is complete, 100% of the code, domain ownership, and design assets belong to you. We never lock you in.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500 selection:text-black font-sans">
      <PageBanner
        badgeText="SERVICE // 01"
        title="Premium Web Development & AI Search Visibility"
        description="We build fast, visually unforgettable websites that convert visitors into paying clients—optimized for Google SEO, AI recommendations, and mobile devices."
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
                A website should be an automated sales asset, not just an online business card.
              </h2>
              <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                Most websites look like generic templates, load slowly on phones, and never show up when people search for services. We engineer bespoke platforms that capture attention with modern interactive design, rank on Google, and get recommended by AI tools.
              </p>
            </div>

            {/* Plain English Deliverables */}
            <div className="space-y-4 pt-4 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>What’s Included (In Plain English)</span>
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

            {/* Clear Non-Technical Workflow */}
            <div className="space-y-4 pt-6 border-t border-zinc-800">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-cyan-400" />
                <span>How We Work Together (Step-by-Step)</span>
              </h3>
              <p className="text-xs text-zinc-400">
                You will always know exactly what stage your project is in without any confusion.
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
                <div className="text-4xl font-bold text-white mt-1">From $800</div>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  Complete design, build, Google SEO setup, AI GEO tags, mobile optimization, and cloud deployment.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2 text-xs font-mono text-zinc-300">
                <div className="flex justify-between"><span>Delivery Time:</span><span className="text-cyan-400 font-bold">1–3 Weeks</span></div>
                <div className="flex justify-between"><span>Google & AI SEO:</span><span className="text-emerald-400 font-bold">Included</span></div>
                <div className="flex justify-between"><span>Ownership:</span><span className="text-white font-bold">100% Client Owned</span></div>
              </div>

              <Link href="/start-project" className="block">
                <Button variant="electric" size="lg" className="w-full justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold">
                  <span>Start This Project</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </Card>

            {/* Dedicated $30/Month Maintenance & Support Card */}
            <div className="p-6 rounded-2xl bg-[#0C0E17] border border-cyan-500/20 space-y-4 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                    MAINTENANCE & SUPPORT
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CANCEL ANYTIME
                </span>
              </div>

              <div>
                <div className="text-2xl font-bold text-white">$30 <span className="text-xs text-zinc-400 font-normal">/ month only</span></div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Carefree ongoing upkeep. We keep your website fast, safe, and up to date every single day.
                </p>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>24/7 Website Uptime & SSL Monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Weekly Automated Cloud Backups</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Security Patches & Server Upgrades</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Minor Text, Photo & Contact Info Updates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Direct Priority Email & Portal Support</span>
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
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">PLAIN QUESTIONS & ANSWERS</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <h4 className="font-bold text-base text-black">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmospheric Transition Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-32 sm:h-44" />
    </div>
  );
}
