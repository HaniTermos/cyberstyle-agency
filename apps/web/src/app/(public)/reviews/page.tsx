import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Star, ShieldCheck } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Client Reviews & Reputation',
  description:
    'Read verified reviews and client outcomes from organizations partnered with CYBERSTYLE LLC.',
};

interface ReviewItem {
  id: string;
  clientName: string;
  clientTitle: string;
  companyName: string;
  quote: string;
  fullReview: string;
  rating: number;
}

const verifiedReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    clientName: 'Franklin Miller',
    clientTitle: 'Managing Director',
    companyName: 'Apex Capital Advisory',
    quote: 'CYBERSTYLE turned a complex offering into a clear, credible brand. The new positioning and website improved how we looked and how prospects understood our value.',
    fullReview: 'We needed a digital presence that matched our high-end advisory services. The team delivered a bespoke 3D web experience with sub-second performance. We saw an immediate surge in qualified inbound consultations.',
    rating: 5,
  },
  {
    id: 'rev-2',
    clientName: 'Elena Rostova',
    clientTitle: 'Head of Growth',
    companyName: 'Nexus Logistics Global',
    quote: 'The automated AI qualification system alone saved our operations team over 15 hours a week while boosting lead responsiveness to under 30 seconds.',
    fullReview: 'CYBERSTYLE built both our marketing web platform and the background AI lead intake pipeline. Their engineering quality, communication, and speed exceeded expectations.',
    rating: 5,
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Verified Outcomes"
        title="Client Reviews & Trust"
        description="Every review on this page is verified and submitted by active or completed client partners of CYBERSTYLE LLC."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Moderation Transparency Strip */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-mono text-neutral-400 max-w-2xl mx-auto text-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
            <span>Strict Moderation Policy: We publish only genuine, verified client reviews.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {verifiedReviews.map((rev) => (
              <Card key={rev.id} variant="dark" className="p-8 md:p-10 space-y-6 bg-[#0E1118] border border-white/10 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-1 text-[#00F0FF]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <blockquote className="font-display font-bold text-xl text-white leading-snug">
                    “{rev.quote}”
                  </blockquote>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    {rev.fullReview}
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="text-white font-semibold">{rev.clientName}</div>
                    <div className="text-neutral-500">{rev.clientTitle} // {rev.companyName}</div>
                  </div>
                  <span className="text-emerald-400">Verified Partner</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-12 text-center space-y-4">
            <h3 className="font-display font-bold text-2xl text-white">Ready to partner with us?</h3>
            <Link href="/start-project">
              <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                Start Your Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
