import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionGradient } from '@/components/ui/SectionGradient';
import {
  BRAND_NAME,
  OWNERSHIP_DISCLOSURE,
  ONGOING_COSTS_DISCLOSURE,
  AI_LIMITATIONS_DISCLOSURE,
} from '@/lib/constants/brand';

export const metadata: Metadata = {
  title: 'Terms of Service // CYBERSTYLE',
  description:
    'Terms of service and standard engagement conditions governing web engineering and automation services provided by CYBERSTYLE.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Legal Agreements"
        title="Terms of Service"
        description="Last updated: August 2026. General terms governing engagements, deliverables, and service boundaries with CYBERSTYLE."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-10 text-neutral-800 text-sm leading-relaxed font-sans">
          
          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">1. Engagement Framework &amp; Scope</h2>
            <p>
              These Terms of Service (&quot;Terms&quot;) govern the use of the <strong>{BRAND_NAME}</strong> website and establish general terms for professional engineering services.
            </p>
            <p>
              Each client engagement is formalized through a written proposal, Statement of Work (&quot;SOW&quot;), or service agreement that defines specific project deliverables, milestone schedules, acceptance criteria, and fee structures. In the event of a conflict between these Terms and a signed SOW, the terms of the signed SOW govern.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">2. Build Fees vs. Operating Costs</h2>
            <p>
              All agreed project fees represent one-time or milestone-based build fees for design, engineering, configuration, and testing work conducted by CYBERSTYLE.
            </p>
            <p>
              <strong>Third-Party Infrastructure &amp; Tool Costs:</strong> {ONGOING_COSTS_DISCLOSURE} The client remains responsible for maintaining active, funded accounts with their selected third-party providers (including domain registrars, cloud VPS hosts, API providers, SMS gateways, and payment processors).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">3. Code Ownership &amp; Intellectual Property</h2>
            <p>
              <strong>Custom Project Deliverables:</strong> {OWNERSHIP_DISCLOSURE} Upon full payment of all contracted invoices, CYBERSTYLE assigns to the client all right, title, and interest in and to the custom source code, layout designs, and bespoke assets produced specifically for the project.
            </p>
            <p>
              <strong>Pre-Existing Tools &amp; Open-Source Dependencies:</strong> Deliverables may incorporate third-party open-source libraries (e.g. Next.js, React, Tailwind CSS, PostgreSQL drivers) that remain subject to their respective open-source licenses (e.g. MIT, Apache 2.0). CYBERSTYLE retains ownership of its proprietary internal toolkits, reusable workflow boilerplates, and developer scripts.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">4. AI &amp; Automation Workflows Disclaimer</h2>
            <p>
              Where project scope includes automated enquiry processing, large language model (LLM) prompts, or conversational agents:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-neutral-700">
              <li>{AI_LIMITATIONS_DISCLOSURE}</li>
              <li>The client is responsible for reviewing, testing, and approving all system prompts, reference documentation, and operational rules before live deployment.</li>
              <li>Automated tools are not a substitute for qualified professional advice (legal, medical, or financial).</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">5. Acceptance Testing &amp; Warranty</h2>
            <p>
              Upon delivery of a project milestone or final deployment, the client receives an agreed review window (typically 7 to 14 days) to conduct acceptance testing against the written SOW specifications. CYBERSTYLE will remedy any reproducible functional defects reported during this window at no additional charge.
            </p>
            <p>
              Except as expressly warranted in a signed SOW, all deliverables are provided on an &quot;as is&quot; and &quot;as available&quot; basis, without warranty of specific commercial outcomes, search engine ranking guarantees, or sales conversion volumes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, neither party will be liable for indirect, incidental, special, consequential, or punitive damages (including loss of profits, business interruption, or data corruption) arising out of or related to this engagement.
            </p>
            <p>
              CYBERSTYLE&apos;s total aggregate liability arising out of any engagement will not exceed the total fees paid by the client under the applicable Statement of Work in the six (6) months preceding the incident.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">7. Termination</h2>
            <p>
              Either party may terminate an ongoing service agreement upon written notice if the other party materially breaches its obligations and fails to cure such breach within thirty (30) days of receiving written notice. In the event of termination, the client is liable for payment of all completed milestones and work performed up to the termination date.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">8. Governing Law &amp; Contact</h2>
            <p>
              These Terms will be governed by and construed in accordance with the laws of the jurisdiction specified in your signed Statement of Work, without regard to conflicts of law principles.
            </p>
            <p>
              For legal inquiries or contractual clarifications, contact us at <a href="mailto:legal@cyberstyle.net" className="text-[#0080FF] underline">legal@cyberstyle.net</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
