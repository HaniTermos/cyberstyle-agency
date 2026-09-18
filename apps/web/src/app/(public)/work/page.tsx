'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Layers, Cpu, Zap, FolderKanban } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { apiRequest } from '@/lib/api';

export interface WorkCaseItem {
  id: string;
  slug: string;
  title: string;
  conceptType: string;
  industry: string;
  serviceCategory: 'web' | 'ai' | 'saas' | string;
  summary: string;
  highlight: string;
  highlightLabel: string;
  techStack?: string[];
  liveUrl?: string;
  clientName?: string;
  coverImage?: string;
}

export default function WorkIndexPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'web' | 'ai' | 'saas'>('all');
  const [caseStudies, setCaseStudies] = useState<WorkCaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiRequest<{ caseStudies: any[] }>('/content/case-studies')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.caseStudies) {
          const mapped: WorkCaseItem[] = res.data.caseStudies.map((cs) => {
            const rawCat = (cs.serviceCategory || '').toLowerCase();
            let cat: 'web' | 'ai' | 'saas' = 'web';
            if (rawCat.includes('ai') || rawCat.includes('automation')) cat = 'ai';
            else if (rawCat.includes('saas') || rawCat.includes('portal') || rawCat.includes('cloud')) cat = 'saas';

            return {
              id: cs.id,
              slug: cs.slug,
              title: cs.title,
              conceptType: cs.serviceCategory || 'Production Specimen',
              industry: cs.clientIndustry || 'Enterprise Technology',
              serviceCategory: cat,
              summary: cs.summary,
              highlight: Array.isArray(cs.techStack) && cs.techStack.length > 0 ? cs.techStack[0] : 'Verified Build',
              highlightLabel: cs.clientName ? `Client: ${cs.clientName}` : 'Engineering Specimen',
              techStack: Array.isArray(cs.techStack) ? cs.techStack : [],
              liveUrl: cs.liveUrl || undefined,
              clientName: cs.clientName,
              coverImage: cs.coverImage || undefined,
            };
          });

          // Pure database items
          setCaseStudies(mapped);
        }
      })
      .catch(() => {
        if (isMounted) setCaseStudies([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredConcepts =
    activeFilter === 'all'
      ? caseStudies
      : caseStudies.filter((cs) => cs.serviceCategory === activeFilter);

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Selected Work"
        title="Production Systems & Architectural Blueprints"
        description="Explore custom full-stack web architectures, AI enquiry intake pipelines, and operations software engineered by CYBERSTYLE."
      />

      {/* Filter Tabs */}
      <section className="py-8 px-6 bg-black border-b border-white/10 sticky top-16 z-20 backdrop-blur-md bg-black/90">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'web', label: 'Web Architecture' },
              { id: 'ai', label: 'AI & Automation' },
              { id: 'saas', label: 'Custom Portals & Apps' },
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
            Showing {filteredConcepts.length} of {caseStudies.length} deliverables
          </div>
        </div>
      </section>

      {/* Deliverables Grid */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="min-h-[380px] sm:min-h-[420px] rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 animate-pulse p-6" />
              ))}
            </div>
          ) : filteredConcepts.length === 0 ? (
            <div className="py-14 sm:py-24 text-center border border-dashed border-white/10 rounded-xl sm:rounded-2xl p-6 sm:p-12">
              <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-600 mx-auto mb-2 sm:mb-3" />
              <p className="text-neutral-400 text-xs sm:text-sm font-mono">No case studies found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredConcepts.map((item) => (
                <Link key={item.id} href={`/work/${item.slug}`} className="group block focus:outline-none">
                  <Card
                    variant="dark"
                    hoverEffect
                    className="h-full flex flex-col justify-between overflow-hidden p-0 bg-[#0B0E16] border border-white/10 group-hover:border-[#00F0FF]/50 transition-all duration-300"
                  >
                    {/* Visual Cover Image Header if present */}
                    {item.coverImage && (
                      <div className="w-full h-44 sm:h-52 relative overflow-hidden bg-black/40 border-b border-white/10">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // Gracefully hide broken images
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-transparent to-transparent opacity-80 pointer-events-none" />
                      </div>
                    )}

                    <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-between space-y-3 sm:space-y-6">
                      <div className="space-y-2.5 sm:space-y-4">
                        {/* Category Banner */}
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#00F0FF] uppercase tracking-wider font-semibold">
                            {item.industry}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-neutral-400 border border-white/10">
                            {item.clientName ? item.clientName : 'Case Study'}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-lg sm:text-xl md:text-2xl text-white group-hover:text-[#00F0FF] transition-colors leading-snug break-words">
                          {item.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-3">
                          {item.summary}
                        </p>

                        {item.techStack && item.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2">
                            {item.techStack.slice(0, 3).map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded bg-white/5 text-neutral-400 text-[10px] font-mono border border-white/5"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Footer Details */}
                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-mono text-neutral-400 uppercase">
                            {item.highlightLabel}
                          </div>
                          <div className="text-xs font-mono text-white font-semibold flex items-center gap-1.5 mt-0.5">
                            {item.serviceCategory === 'ai' ? (
                              <Zap className="w-3.5 h-3.5 text-[#00F0FF]" />
                            ) : item.serviceCategory === 'saas' ? (
                              <Layers className="w-3.5 h-3.5 text-[#00F0FF]" />
                            ) : (
                              <Cpu className="w-3.5 h-3.5 text-[#00F0FF]" />
                            )}
                            <span>{item.highlight}</span>
                          </div>
                        </div>

                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-400 group-hover:bg-[#00F0FF] group-hover:text-black group-hover:border-[#00F0FF] transition-all duration-300">
                          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
