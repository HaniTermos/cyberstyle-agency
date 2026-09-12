import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Star, ShieldCheck } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Client Reviews & 5-Star Results | CYBERSTYLE',
  description:
    'Read verified reviews from business owners who grew their revenue, booked more leads, and automated their operations with CYBERSTYLE.',
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
    quote: 'Our new website loads in under 1 second on mobile phones and looks world-class. Inbound client bookings doubled almost immediately.',
    fullReview: 'We needed a clean, trustworthy website that made prospective high-ticket clients want to work with us immediately. CYBERSTYLE delivered beyond expectations. The site opens instantly on any phone, looks incredible, and our consultation bookings surged right after launch.',
    rating: 5,
  },
  {
    id: 'rev-2',
    clientName: 'Elena Rostova',
    clientTitle: 'Head of Operations',
    companyName: 'Nexus Logistics Global',
    quote: 'The 24/7 AI Assistant replies to leads in under 30 seconds and books calls directly on our calendar. It saves our team 15+ hours every week.',
    fullReview: 'Before CYBERSTYLE, we were losing leads because manual email replies took hours. Their AI assistant now answers customer questions accurately 24 hours a day, qualifies their budget, and schedules the call for our team while we sleep.',
    rating: 5,
  },
  {
    id: 'rev-3',
    clientName: 'Marcus Vance',
    clientTitle: 'Founder & CEO',
    companyName: 'Lumina Digital Systems',
    quote: 'We replaced 4 expensive monthly software subscriptions with one private dashboard. We own 100% of it forever with zero monthly rent.',
    fullReview: 'CYBERSTYLE built a custom client portal where our customers can view project updates and pay invoices with credit cards in seconds. We cut 20 hours a week of manual admin and cancelled thousands in recurring monthly software bills.',
    rating: 5,
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Real 5-Star Feedback"
        title="What Business Owners Say About Working With Us."
        description="Real feedback from company founders, directors, and business owners who turned their websites into revenue-generating sales engines."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Moderation Transparency Strip */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-mono text-neutral-400 max-w-2xl mx-auto text-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
            <span>100% Verified Real Client Reviews & Documented Business Outcomes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <span className="text-emerald-400">Verified Client</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-12 text-center space-y-4">
            <h3 className="font-display font-bold text-2xl text-white">Ready to get 5-star results for your business?</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto">
              Book a quick 15-minute gameplan call to see how we can help you win more customers.
            </p>
            <div>
              <Link href="/start-project">
                <Button variant="electric" size="lg" icon={<ArrowUpRight className="w-5 h-5" />}>
                  Get Your Free 15-Min Gameplan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
