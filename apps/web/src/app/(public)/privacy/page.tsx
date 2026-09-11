import React from 'react';
import type { Metadata } from 'next';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionGradient } from '@/components/ui/SectionGradient';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data processing terms for CYBERSTYLE LLC.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Legal & Compliance"
        title="Privacy Policy"
        description="Last updated: August 2026. How CYBERSTYLE LLC collects, secures, and processes your business data."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-3xl mx-auto space-y-8 text-neutral-700 text-sm leading-relaxed font-sans">
          <h2 className="font-display font-bold text-xl text-black">1. Information We Collect</h2>
          <p>
            When you interact with our website or submit project inquiries via our &quot;Start a Project&quot; or &quot;Contact&quot; forms, we collect the information you explicitly provide: full name, business email, organization name, phone number (optional), website URL, project scope, budget ranges, and message details.
          </p>

          <h2 className="font-display font-bold text-xl text-black">2. How We Use Your Data</h2>
          <p>
            We process project inquiry data strictly to evaluate service fit, prepare transparent scope estimates, communicate regarding your engagement, and fulfill client contracts. We do not sell, rent, or monetize prospect or client information under any circumstances.
          </p>

          <h2 className="font-display font-bold text-xl text-black">3. Self-Hosted Data Storage & Security</h2>
          <p>
            All lead submissions and client communications are stored securely in encrypted PostgreSQL databases hosted on our private Linux VPS infrastructure. We enforce TLS 1.3 encryption in transit and strict access controls.
          </p>

          <h2 className="font-display font-bold text-xl text-black">4. Your Privacy Rights</h2>
          <p>
            Regardless of your jurisdiction (including GDPR in Europe and CCPA in California), you have the right to request access to, correction of, or deletion of your personal data at any time by contacting our privacy officer at <a href="mailto:privacy@cyberstyle.net" className="text-[#0080FF] underline">privacy@cyberstyle.net</a>.
          </p>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
