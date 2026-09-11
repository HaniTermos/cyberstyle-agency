import React from 'react';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'Cookie policy and consent transparency for CYBERSTYLE LLC.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Cookie Transparency"
        title="Cookie Policy"
        description="How we utilize essential and analytical cookies to provide a secure and high-performance experience."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto space-y-8 text-neutral-700 text-sm leading-relaxed font-sans">
          <h2 className="font-display font-bold text-xl text-black">1. Essential Security Cookies</h2>
          <p>
            We use strictly necessary cookies to manage authenticated sessions, prevent CSRF attacks, and ensure rate limiting protection. These cannot be disabled without compromising platform security.
          </p>

          <h2 className="font-display font-bold text-xl text-black">2. Performance & Analytics Cookies</h2>
          <p>
            We use Google Analytics 4 (via Google Tag Manager) to understand aggregate site traffic and page load performance. No personal identifying information is stored in analytics cookies without your consent.
          </p>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
