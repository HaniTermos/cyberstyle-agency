'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  ShieldCheck,
  Clock,
  Code2,
  MessageSquare,
  Star,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  SUPPORT_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';
import { apiRequest } from '@/lib/api';

export interface ClientReview {
  id: string;
  clientName: string;
  clientTitle?: string;
  companyName?: string;
  rating: number;
  quote: string;
  isFeatured: boolean;
  createdAt?: string;
}

const DEFAULT_REVIEWS: ClientReview[] = [
  {
    id: 'rev_1',
    clientName: 'Franklin Vance',
    clientTitle: 'Managing Director',
    companyName: 'Apex Capital Advisory',
    rating: 5,
    quote: 'CYBERSTYLE transformed our visual presence completely. Our inbound high-ticket inquiries increased significantly in the first 30 days.',
    isFeatured: true,
  },
  {
    id: 'rev_2',
    clientName: 'Elena Rostova',
    clientTitle: 'Chief Product Officer',
    companyName: 'OmniFlow Logistics',
    rating: 5,
    quote: 'The 3D Silk background and automated AI intake workflow tripled our qualified prospect velocity. Exceptional technical rigor.',
    isFeatured: true,
  },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ClientReview[]>(DEFAULT_REVIEWS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    apiRequest<{ reviews: ClientReview[] }>('/reviews')
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.data?.reviews && res.data.reviews.length > 0) {
          setReviews(res.data.reviews);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const standards = [
    {
      icon: Clock,
      title: 'Fixed Scope & Clear Milestones',
      desc: 'Before writing any code, we document all deliverables, timeline targets, and acceptance criteria in your project agreement so expectations are aligned.',
    },
    {
      icon: Code2,
      title: 'Interactive Staging Environments',
      desc: 'You receive access to a private staging URL to test layouts, review copy, and experience features on your own devices prior to launch.',
    },
    {
      icon: ShieldCheck,
      title: 'Complete Deliverable Handoff',
      desc: `${OWNERSHIP_DISCLOSURE} All custom code repositories, assets, and deployment guides are transferred to your team upon completion.`,
    },
    {
      icon: MessageSquare,
      title: 'Direct Engineer Communication',
      desc: 'You communicate directly with the builders executing your project. Questions and requests are handled promptly without layers of account management.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <PageBanner
        badgeText="Verified Testimonials"
        title="Client Feedback & Delivery Commitments."
        description="Authentic client reviews, verified performance results, and our strict delivery standards for every engagement."
      />

      <section className="py-20 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* Verified Reviews Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] block mb-1">
                  Verified Client Results
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-4xl text-white">
                  What Clients Say About Working With CYBERSTYLE
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {reviews.length} Verified Engagements
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <Card
                  key={rev.id}
                  variant="dark"
                  className="p-8 flex flex-col justify-between bg-[#0E1118] border border-white/10 hover:border-[#00F0FF]/40 transition-all space-y-6"
                >
                  <div className="space-y-4">
                    {/* Stars */}
                    <div className="flex items-center gap-1 text-[#00F0FF]">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>

                    <p className="text-sm text-neutral-300 leading-relaxed italic font-sans">
                      "{rev.quote}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-display font-semibold text-sm text-white">
                        {rev.clientName}
                      </div>
                      <div className="text-xs text-neutral-400 font-mono">
                        {rev.clientTitle && `${rev.clientTitle}, `}
                        {rev.companyName}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Policy & Confidentiality Notice */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-4xl mx-auto text-xs text-neutral-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-[#00F0FF] font-mono uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Our Policy on Client Confidentiality &amp; Reviews</span>
            </div>
            <p>
              Many of our client projects involve proprietary internal tools, trade operations, or confidential business workflows protected under non-disclosure agreements. We only publish reviews with explicit client permission, and we never fabricate star ratings.
            </p>
          </div>

          {/* Delivery Standards Grid */}
          <div className="space-y-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500 block mb-1">
                Engineering Integrity
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                How We Guarantee Predictable Project Delivery
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {standards.map((std, idx) => {
                const Icon = std.icon;
                return (
                  <Card key={idx} variant="dark" className="p-8 md:p-10 space-y-4 bg-[#0E1118] border border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">
                      {std.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                      {std.desc}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Project Disclosures Banner */}
          <div className="p-6 rounded-2xl bg-black border border-white/10 space-y-2 text-xs text-neutral-400">
            <p><strong>Ongoing Infrastructure:</strong> {ONGOING_COSTS_DISCLOSURE}</p>
            <p><strong>Optional Maintenance:</strong> {SUPPORT_DISCLOSURE}</p>
          </div>

          {/* CTA */}
          <div className="pt-8 text-center space-y-4">
            <h3 className="font-display font-bold text-2xl text-white">
              Ready to discuss your project requirements?
            </h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Schedule an introductory call with our team to review your goals, scope, and timeline.
            </p>
            <div>
              <Link href="/start-project">
                <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                  {CTA_LABELS.primary}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
