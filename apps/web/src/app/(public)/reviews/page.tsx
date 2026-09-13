import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Clock, Code2, MessageSquare, CheckCircle2 } from 'lucide-react';
import { PageBanner } from '@/components/layout/PageBanner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  SUPPORT_DISCLOSURE,
  CTA_LABELS,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Client Project Standards & Delivery Approach // CYBERSTYLE',
  description:
    'Explore how CYBERSTYLE manages web engineering and automation projects: transparent scopes, private staging previews, and complete code handoff.',
};

export default function ReviewsPage() {
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
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Project Commitments"
        title="How CYBERSTYLE Approaches Client Projects."
        description="We believe in honest communication, verifiable deliverables, and transparent processes without fabricated marketing testimonials."
      />

      <section className="py-24 px-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Policy & Confidentiality Notice */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-3xl mx-auto text-xs text-neutral-300 leading-relaxed space-y-2">
            <div className="flex items-center gap-2 text-[#00F0FF] font-mono uppercase tracking-wider font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Our Policy on Client Confidentiality &amp; Reviews</span>
            </div>
            <p>
              Many of our client projects involve proprietary internal tools, trade operations, or confidential business workflows protected under non-disclosure agreements. We do not fabricate testimonials, invent client logos, or publish unverified star ratings.
            </p>
            <p>
              To evaluate our capabilities, explore our interactive system demonstrations on the <Link href="/work" className="text-[#00F0FF] underline underline-offset-2">Work page</Link> or schedule an introductory call to review real code specimens and technical architecture.
            </p>
          </div>

          {/* Delivery Standards Grid */}
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

          {/* Project Disclosures Banner */}
          <div className="p-6 rounded-2xl bg-black border border-white/10 space-y-2 text-xs text-neutral-400">
            <p><strong>Ongoing Infrastructure:</strong> {ONGOING_COSTS_DISCLOSURE}</p>
            <p><strong>Optional Maintenance:</strong> {SUPPORT_DISCLOSURE}</p>
          </div>

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
