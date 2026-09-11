import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Layers, Cpu, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Services & Capabilities',
  description:
    'Explore CYBERSTYLE capabilities: Premium Web Experiences, AI Workflow Automations, and Custom SaaS Engineering.',
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Core Capabilities"
        title="Digital Systems Engineered to Move Business Forward."
        description="We design and build bespoke high-conversion websites, 3D interactive experiences, intelligent AI automation pipelines, and custom SaaS platforms."
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
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">01 // Flagship Build</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  Premium Web Development & 3D Experiences
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Elevate your brand beyond generic templates. We build bespoke Next.js 15 web experiences incorporating fluid Three.js/Silk 3D shaders, sub-second Core Web Vitals, and conversion funnels engineered to convert visitors into qualified leads.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Custom 3D & Silk Canvas Shaders</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Self-Hosted Headless CMS</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 90+ Lighthouse Performance Score</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> 100% Code & Asset Ownership</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Starting Investment</div>
                <div className="font-display font-bold text-3xl text-white mt-1">From $800</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Final pricing depends on 3D depth, custom animations, integrations, and content scope.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/premium-web">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Service Details
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    Inquire About This Build
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
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF]">02 // Intelligent Systems</span>
                <h2 className="font-display font-bold text-3xl sm:text-4xl text-white">
                  AI & Business Workflow Automation
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Transform manual business operations into automated 24/7 revenue drivers. We implement AI prospect qualification pipelines, automated CRM syncing, customized email drafting, and operational dashboards.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Automated 24/7 Lead Routing</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Gemini / OpenAI API Integrations</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Smart Follow-Up Email Triggers</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Custom Internal Telemetry UI</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Starting Investment</div>
                <div className="font-display font-bold text-3xl text-white mt-1">From $1,200</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Tailored to your CRM endpoints, custom prompt engineering, database volume, and notification rules.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/ai-automation">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Service Details
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    Inquire About Automation
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
                  Custom SaaS Platforms & Client Portals
                </h2>
              </div>
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed">
                Full-stack web application engineering from conception to production VPS deployment. Scalable architecture powered by Next.js, Express, PostgreSQL, Prisma, self-hosted authentication, and Stripe payments.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300 pt-2 font-medium">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Multi-Tenant Architecture & RBAC</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Self-Hosted Auth with Argon2id</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Invoicing, Line Items & Stripe Webhooks</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00F0FF]" /> Docker Compose Production VPS Ready</span>
              </div>
            </div>
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-2xl bg-black/60 border border-white/10 space-y-6">
              <div>
                <div className="text-xs font-mono text-neutral-400">Starting Investment</div>
                <div className="font-display font-bold text-3xl text-white mt-1">From $3,000</div>
                <p className="text-xs text-neutral-400 mt-2">
                  Full product build covering data modeling, API services, security auditing, and deployment automation.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link href="/services/custom-saas">
                  <Button variant="outline" className="w-full justify-center" icon={<ArrowRight className="w-4 h-4" />}>
                    Explore Service Details
                  </Button>
                </Link>
                <Link href="/start-project">
                  <Button variant="electric" className="w-full justify-center" icon={<ArrowUpRight className="w-4 h-4" />}>
                    Inquire About SaaS Build
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
