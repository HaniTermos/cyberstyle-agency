import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { BRAND_NAME, OWNERSHIP_DISCLOSURE, ONGOING_COSTS_DISCLOSURE } from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Privacy Policy // CYBERSTYLE',
  description:
    'Comprehensive privacy policy and data protection terms detailing how CYBERSTYLE collects, processes, and safeguards personal and project data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Legal &amp; Privacy"
        title="Privacy Policy"
        description="Last updated: August 2026. How CYBERSTYLE processes, protects, and respects your personal and business data."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-10 text-neutral-800 text-sm leading-relaxed font-sans">
          
          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">1. Data Controller</h2>
            <p>
              This Privacy Policy applies to personal data collected and processed by <strong>{BRAND_NAME}</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) through our website at <code>cyberstyle.net</code> and our related client intake and communication channels.
            </p>
            <p>
              If you have any questions regarding this policy or our data practices, contact our Data Privacy Officer at <a href="mailto:privacy@cyberstyle.net" className="text-[#0080FF] underline">privacy@cyberstyle.net</a>.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, as well as technical data generated automatically during your visit:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-700">
              <li>
                <strong>Inquiry &amp; Scoping Data:</strong> When submitting forms through our &quot;Contact&quot; or &quot;Start a Project&quot; pages, we collect your full name, business email address, phone number (optional), organization name, website URL, target market, budget preferences, desired project timeline, and project description.
              </li>
              <li>
                <strong>Technical &amp; Log Data:</strong> Our web servers record IP addresses, browser user-agent strings, referring URLs, and access timestamps to detect malicious traffic, prevent spam submissions, and maintain system availability.
              </li>
              <li>
                <strong>Cookie &amp; Consent Preferences:</strong> We store your selected cookie consent preferences (essential vs. optional analytics) in local storage and cookies.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">3. Lawful Bases for Processing (GDPR &amp; Global Standards)</h2>
            <p>We process personal data only when an applicable legal basis exists under data protection laws:</p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-700">
              <li>
                <strong>Pre-Contractual &amp; Contractual Steps:</strong> Processing inquiry information is necessary to review your project scope, prepare written estimates, schedule consultation calls, and deliver contracted services.
              </li>
              <li>
                <strong>Legitimate Interests:</strong> We process server logs and enforce anti-spam honeypot checks to protect our network infrastructure from fraud, abuse, and unauthorized access.
              </li>
              <li>
                <strong>Consent:</strong> Where required by law (e.g. for optional Google Analytics telemetry), we process data only after you provide explicit affirmative consent via our cookie preferences banner.
              </li>
              <li>
                <strong>Legal Compliance:</strong> Retaining transactional and invoicing records to comply with statutory accounting and tax obligations.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">4. Third-Party Service Processors</h2>
            <p>
              We do not sell, rent, or trade your personal data. We disclose information only to vetted third-party service providers bound by data processing agreements:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-700">
              <li>
                <strong>Hosting &amp; Cloud Infrastructure:</strong> Our web frontend and API databases are hosted on dedicated, encrypted Linux VPS infrastructure (Hostinger) and edge deployment platforms.
              </li>
              <li>
                <strong>Analytics Providers:</strong> Google Analytics 4 (utilizing Google Consent Mode v2) for aggregated, non-personally identifiable traffic metrics, active only when optional cookies are accepted.
              </li>
              <li>
                <strong>Payment Gateways:</strong> When you execute a project agreement, card processing is handled securely through Stripe. CYBERSTYLE does not store raw credit card numbers.
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">5. Data Retention</h2>
            <p>
              We retain inquiry submissions for up to 24 months following the last interaction to facilitate ongoing discussions or re-engagements. Client project records, contracts, and invoicing data are retained for 7 years to fulfill legal and accounting requirements. You may request early deletion of prospective inquiry records at any time.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">6. Your Rights</h2>
            <p>
              Depending on your location (including the European Economic Area, the United Kingdom, California, and other jurisdictions), you have specific statutory rights regarding your data:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-neutral-700">
              <li>The right to access and receive a copy of your personal data.</li>
              <li>The right to rectify inaccurate or incomplete records.</li>
              <li>The right to request erasure of your data (&quot;right to be forgotten&quot;).</li>
              <li>The right to restrict or object to certain processing activities.</li>
              <li>The right to withdraw consent at any time without affecting the lawfulness of prior processing.</li>
            </ul>
            <p className="pt-2">
              To exercise these rights, submit a request in writing to <a href="mailto:privacy@cyberstyle.net" className="text-[#0080FF] underline">privacy@cyberstyle.net</a>. We verify identity and respond within statutory deadlines (typically 30 days).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">7. Policy Modifications</h2>
            <p>
              We may update this Privacy Policy periodically to reflect evolving legal standards or operational modifications. The latest revision date is always posted at the top of this document.
            </p>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
