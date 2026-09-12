'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, RefreshCw, Sparkles } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { apiRequest } from '@/lib/api';

interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  industry: string;
  serviceCategory: string;
  summary: string;
  metric: string;
  metricLabel: string;
  geoCity?: string;
  geoCountry?: string;
}

const fallbackCaseStudies: CaseStudyItem[] = [
  {
    id: 'cs-1',
    slug: 'nexus-logistics-ai-routing',
    title: '24/7 AI Lead Assistant That Turns Inquiries Into Booked Calls',
    clientName: 'Nexus Global Logistics',
    industry: 'Logistics & Shipping',
    serviceCategory: 'ai',
    summary: 'Replaced slow manual email replies with an instant 30-second AI receptionist that qualifies leads and automatically books appointments on the team calendar.',
    metric: '+340%',
    metricLabel: 'More Booked Leads',
    geoCity: 'Chicago, IL',
    geoCountry: 'US',
  },
  {
    id: 'cs-2',
    slug: 'apex-capital-web-experience',
    title: 'High-Converting Website That Loads in Under 1 Second',
    clientName: 'Apex Capital Advisory',
    industry: 'Financial Advisory',
    serviceCategory: 'web',
    summary: 'Redesigned an outdated website into an ultra-fast, premium sales engine that doubled customer inquiries and looks stunning on every mobile phone.',
    metric: '2.4x',
    metricLabel: 'More Paying Clients',
    geoCity: 'New York, NY',
    geoCountry: 'US',
  },
  {
    id: 'cs-3',
    slug: 'lumina-saas-client-portal',
    title: 'Private Client Portal That Saves 20+ Hours Every Week',
    clientName: 'Lumina Digital Systems',
    industry: 'Business Services',
    serviceCategory: 'saas',
    summary: 'Built a centralized customer dashboard with automated credit card payments, project milestones, and zero monthly software subscription fees.',
    metric: '20 hrs/wk',
    metricLabel: 'Saved in Manual Work',
    geoCity: 'Dubai',
    geoCountry: 'AE',
  },
];

export default function WorkIndexPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>(fallbackCaseStudies);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'ai' | 'saas'>('all');

  useEffect(() => {
    async function loadWork() {
      try {
        const res = await apiRequest<{ caseStudies: any[] }>('/case-studies');
        if (res.success && Array.isArray(res.data?.caseStudies) && res.data.caseStudies.length > 0) {
          const mapped: CaseStudyItem[] = res.data.caseStudies.map((cs) => {
            let catType = 'web';
            const catLower = (cs.serviceCategory || '').toLowerCase();
            if (catLower.includes('ai') || catLower.includes('auto')) catType = 'ai';
            else if (catLower.includes('saas') || catLower.includes('cloud')) catType = 'saas';

            // Extract primary metric
            let metricVal = '+340%';
            let metricLab = 'Impact Growth';
            if (Array.isArray(cs.metrics) && cs.metrics.length > 0 && cs.metrics[0]?.value) {
              metricVal = cs.metrics[0].value;
              metricLab = cs.metrics[0].label || 'Growth';
            }

            return {
              id: cs.id,
              slug: cs.slug,
              title: cs.title,
              clientName: cs.clientName,
              industry: cs.clientIndustry || 'Enterprise',
              serviceCategory: catType,
              summary: cs.summary,
              metric: metricVal,
              metricLabel: metricLab,
              geoCity: cs.geoCity,
              geoCountry: cs.geoCountry,
            };
          });
          setCaseStudies(mapped);
        }
      } catch (err) {
        console.warn('Using fallback showcase studies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadWork();
  }, []);

  const filteredStudies =
    activeFilter === 'all'
      ? caseStudies
      : caseStudies.filter((cs) => cs.serviceCategory === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Real Client Results"
        title="Websites & AI Systems Built to Make You More Money."
        description="Explore how we turned slow websites, lost leads, and manual busywork into 24/7 client booking machines and real revenue growth."
      />

      {/* Filter Tabs */}
      <section className="py-12 px-6 bg-[#08090C] border-b border-white/10 sticky top-16 z-20 backdrop-blur-md bg-black/80">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'web', label: 'Websites That Sell' },
              { id: 'ai', label: '24/7 AI Assistants' },
              { id: 'saas', label: 'Custom Portals & Tools' },
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

          <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
            {loading && <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />}
            Showing {filteredStudies.length} of {caseStudies.length} client success stories
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study) => (
            <Link key={study.id} href={`/work/${study.slug}`} className="group block focus:outline-none">
              <Card
                variant="dark"
                hoverEffect
                className="h-full flex flex-col justify-between p-8 bg-[#0B0E16] border border-white/10 group-hover:border-[#00F0FF]/50 transition-all duration-300"
              >
                <div className="space-y-6">
                  {/* Category & Status Banner */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#00F0FF] uppercase tracking-wider">{study.industry}</span>
                    {study.geoCity && (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                        <MapPin className="w-3 h-3 text-cyan-400" />
                        {study.geoCity}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-2xl text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                    {study.title}
                  </h3>

                  <p className="text-sm text-neutral-400 leading-relaxed font-sans line-clamp-3">
                    {study.summary}
                  </p>
                </div>

                <div className="pt-6 mt-8 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <div className="font-display font-bold text-3xl text-white flex items-baseline gap-1">
                      {study.metric}
                    </div>
                    <div className="text-xs font-mono text-neutral-500 uppercase">{study.metricLabel}</div>
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
