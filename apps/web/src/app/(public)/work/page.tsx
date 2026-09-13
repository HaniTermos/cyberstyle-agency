'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Info, Layers, Cpu, Zap } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { CONCEPT_DEMO_DISCLAIMER, CTA_LABELS } from '@/lib/constants/brand';

interface ConceptItem {
  id: string;
  slug: string;
  title: string;
  conceptType: string;
  industry: string;
  serviceCategory: 'web' | 'ai' | 'saas';
  summary: string;
  highlight: string;
  highlightLabel: string;
}

const concepts: ConceptItem[] = [
  {
    id: 'concept-1',
    slug: 'logistics-lead-routing-concept',
    title: 'Automated Enquiry Intake & Dispatch Architecture',
    conceptType: 'Interactive Automation Prototype',
    industry: 'Logistics & Supply Chain',
    serviceCategory: 'ai',
    summary:
      'A prototype intake system designed to process complex freight requests, categorize volume specifications, and route qualified enquiries directly to dispatcher calendars.',
    highlight: 'Automated Triage',
    highlightLabel: 'Workflow Blueprint',
  },
  {
    id: 'concept-2',
    slug: 'professional-services-web-concept',
    title: 'Responsive Multi-Page Advisory Web Platform',
    conceptType: 'Web Architecture Demonstration',
    industry: 'B2B Professional Services',
    serviceCategory: 'web',
    summary:
      'A modern web architecture demonstration featuring semantic SEO hierarchies, optimized responsive layouts, and friction-free consultation booking paths.',
    highlight: 'Next.js & TypeScript',
    highlightLabel: 'Engineering Stack',
  },
  {
    id: 'concept-3',
    slug: 'operations-portal-concept',
    title: 'Operations Dashboard & Client Milestone Portal',
    conceptType: 'Software Architecture Prototype',
    industry: 'Business Operations',
    serviceCategory: 'saas',
    summary:
      'A centralized dashboard prototype showcasing role-based user authentication, mock Stripe payment integration, and real-time deliverable tracking.',
    highlight: 'Role-Based RBAC',
    highlightLabel: 'System Architecture',
  },
];

export default function WorkIndexPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'ai' | 'saas'>('all');

  const filteredConcepts =
    activeFilter === 'all'
      ? concepts
      : concepts.filter((cs) => cs.serviceCategory === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Engineering Demonstrations"
        title="Selected Concepts &amp; System Demonstrations"
        description="Explore technical architecture blueprints, prototype interfaces, and automation workflows engineered by CYBERSTYLE to showcase how we solve common business challenges."
      />

      {/* Concept Disclaimer Alert */}
      <section className="bg-[#0B0E14] border-y border-white/10 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-neutral-300 font-mono">
          <Info className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Demonstration Notice:</strong> {CONCEPT_DEMO_DISCLAIMER}
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 px-6 bg-black border-b border-white/10 sticky top-16 z-20 backdrop-blur-md bg-black/90">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Demonstrations' },
              { id: 'web', label: 'Web Architecture' },
              { id: 'ai', label: 'Automation Workflows' },
              { id: 'saas', label: 'Software Prototypes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all select-none cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#00F0FF] text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-mono text-neutral-400">
            Showing {filteredConcepts.length} of {concepts.length} system specimens
          </div>
        </div>
      </section>

      {/* Demonstrations Grid */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredConcepts.map((item) => (
            <Link key={item.id} href={`/work/${item.slug}`} className="group block focus:outline-none">
              <Card
                variant="dark"
                hoverEffect
                className="h-full flex flex-col justify-between p-8 bg-[#0B0E16] border border-white/10 group-hover:border-[#00F0FF]/50 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Category Banner */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#00F0FF] uppercase tracking-wider">{item.industry}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-neutral-400 border border-white/10">
                      Concept
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-sans line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-6 mt-8 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="font-display font-bold text-xl text-white">
                      {item.highlight}
                    </div>
                    <div className="text-xs font-mono text-neutral-500 uppercase">{item.highlightLabel}</div>
                  </div>

                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-white group-hover:bg-[#00F0FF] group-hover:text-black transition-all">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
