import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Layers, Cpu, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Button } from '@/components/ui/Button';
import {
  SERVICES,
  ONGOING_COSTS_DISCLOSURE,
  OWNERSHIP_DISCLOSURE,
  AI_LIMITATIONS_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Digital Services & Web Engineering // CYBERSTYLE',
  description:
    'Custom web development, AI enquiry automation, and dedicated business software built with modern engineering standards and transparent project scope.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Services &amp; Capabilities"
        title="Focused Digital Systems Built for Real Business Outcomes."
        description="We design and develop modern websites, AI-assisted enquiry workflows, and tailored business software to help you present your services clearly, capture qualified leads, and streamline operations."
      />

      {/* Services Detail Grid */}
      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Service 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 rounded-3xl bg-[#0F1118] border border-white/10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">01 // Web Engineering</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  {SERVICES.web.name}
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                {SERVICES.web.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                {SERVICES.web.inclusions.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Baseline Build Fee</div>
                <div className="font-display font-bold text-3xl text-white mt-1">{SERVICES.web.startingPrice}</div>
                <p className="text-xs text-neutral-400 mt-2">
                  One-time build fee covering agreed design and engineering scope. Third-party hosting and domains billed separately.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/premium-web">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    View Service Details
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    {CTA_LABELS.primary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 rounded-3xl bg-[#0F1118] border border-white/10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">02 // Workflow Automation</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  {SERVICES.ai.name}
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                {SERVICES.ai.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                {SERVICES.ai.inclusions.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Baseline Build Fee</div>
                <div className="font-display font-bold text-3xl text-white mt-1">{SERVICES.ai.startingPrice}</div>
                <p className="text-xs text-neutral-400 mt-2">
                  One-time build fee. Custom-configured with your business documentation and testing. Model API usage costs paid directly to provider.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/ai-automation">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    View Service Details
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    {CTA_LABELS.primary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Service 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 p-8 md:p-12 rounded-3xl bg-[#0F1118] border border-white/10 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">03 // Custom Software</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  {SERVICES.saas.name}
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                {SERVICES.saas.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                {SERVICES.saas.inclusions.map((item, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#00F0FF] shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Baseline Build Fee</div>
                <div className="font-display font-bold text-3xl text-white mt-1">{SERVICES.saas.startingPrice}</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Complete custom application build including authentication, database models, payment endpoints, and deployment setup.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/custom-saas">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    View Service Details
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    {CTA_LABELS.primary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Transparent Disclosures Box */}
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3 text-xs text-neutral-400">
            <p><strong>Project Scope &amp; Ongoing Costs:</strong> {ONGOING_COSTS_DISCLOSURE}</p>
            <p><strong>Deliverables &amp; Code Ownership:</strong> {OWNERSHIP_DISCLOSURE}</p>
            <p><strong>Automated Assistant Notice:</strong> {AI_LIMITATIONS_DISCLOSURE}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
