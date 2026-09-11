import React from 'react';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service and client engagement agreements for CYBERSTYLE LLC.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Legal & Terms"
        title="Terms of Service"
        description="Last updated: August 2026. General terms governing engagements with CYBERSTYLE LLC."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto space-y-8 text-neutral-700 text-sm leading-relaxed font-sans">
          <h2 className="font-display font-bold text-xl text-black">1. Engagement Structure & Scopes</h2>
          <p>
            All custom web development, AI automation pipelines, and custom SaaS builds are governed by specific Statements of Work (SOW) detailing milestones, deliverables, timelines, and payment terms.
          </p>

          <h2 className="font-display font-bold text-xl text-black">2. Intellectual Property & Code Ownership</h2>
          <p>
            Upon complete payment of all project invoices, CYBERSTYLE LLC transfers 100% ownership of the resulting custom source code, design assets, and database schemas directly to the client.
          </p>

          <h2 className="font-display font-bold text-xl text-black">3. Warranties & SLA</h2>
          <p>
            We warrant that all delivered software functions according to approved technical specifications and provide post-launch bug fixing periods as specified in your engagement contract.
          </p>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
