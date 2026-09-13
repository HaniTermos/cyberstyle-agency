'use client';

import React from 'react';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionGradient } from '@/components/ui/SectionGradient';
import { Button } from '@/components/ui/Button';
import { Settings, ShieldCheck, Info } from 'lucide-react';
import { BRAND_NAME } from '@/lib/constants/brand';

export default function CookiePolicyPage() {
  const handleOpenCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  };

  const cookieInventory = [
    {
      name: 'cyberstyle_cookie_consent',
      provider: 'CYBERSTYLE (First-party)',
      purpose: 'Records your explicit cookie consent preferences (essential vs. analytics).',
      duration: '12 Months',
      category: 'Strictly Necessary',
    },
    {
      name: 'csrf_token / session_id',
      provider: 'CYBERSTYLE (First-party)',
      purpose: 'Prevents Cross-Site Request Forgery (CSRF) and protects secure form submissions.',
      duration: 'Session',
      category: 'Strictly Necessary',
    },
    {
      name: '_ga',
      provider: 'Google Analytics',
      purpose: 'Distinguishes unique users to calculate aggregate visitor telemetry without storing direct identifiers.',
      duration: '2 Years',
      category: 'Analytics / Optional',
    },
    {
      name: '_ga_*',
      provider: 'Google Analytics',
      purpose: 'Maintains session state across page views for aggregated performance reporting.',
      duration: '2 Years',
      category: 'Analytics / Optional',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <PageBanner
        badgeText="Cookie Transparency"
        title="Cookie Policy &amp; Consent Management"
        description="How CYBERSTYLE uses essential security mechanisms and optional analytics telemetry to maintain website performance and user privacy."
      />

      {/* Atmospheric Black-to-White Scrim Gradient */}
      <SectionGradient direction="black-to-white" heightClass="h-44 sm:h-60" />

      <section className="pt-4 pb-24 px-6 bg-white text-black">
        <div className="max-w-4xl mx-auto space-y-10 text-neutral-800 text-sm leading-relaxed font-sans">
          
          {/* Quick Action Box */}
          <div className="p-6 rounded-2xl bg-[#08090C] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs text-[#00F0FF] uppercase tracking-wider font-semibold">
                Manage Preferences Anytime
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                Update Your Cookie Settings
              </h3>
              <p className="text-xs text-neutral-300">
                You can change your consent preferences or withdraw consent for optional analytics at any time.
              </p>
            </div>
            <Button
              variant="electric"
              size="sm"
              onClick={handleOpenCookieSettings}
              icon={<Settings className="w-4 h-4" />}
            >
              Open Cookie Settings
            </Button>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your computer or mobile device when you visit a website. They are widely used by web developers to make websites work efficiently, protect user sessions, and deliver reporting data on system performance.
            </p>
            <p>
              Cookies can be &quot;persistent&quot; (remaining on your device until they expire or are deleted) or &quot;session&quot; cookies (deleted automatically when you close your browser).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="font-display font-bold text-2xl text-black">2. Categories of Cookies We Use</h2>
            <p>We classify cookies on our site into two clear categories:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-base text-black">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Strictly Necessary Cookies</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  These cookies are essential for core site functionality, including anti-spam verification, security token validation, and storing your consent preferences. Because the website cannot function properly without them, they cannot be switched off.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-black/10 bg-[#F8F9FB] space-y-2">
                <div className="flex items-center gap-2 font-display font-bold text-base text-black">
                  <Info className="w-4 h-4 text-[#0080FF]" />
                  <span>Performance &amp; Analytics Cookies</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  These optional cookies collect aggregated information regarding page load speed and user interaction. They are active only if you click &quot;Accept All&quot; or toggle them on in our Cookie Settings banner.
                </p>
              </div>
            </div>
          </div>

          {/* Cookie Inventory Table */}
          <div className="space-y-4 pt-4">
            <h2 className="font-display font-bold text-2xl text-black">3. Complete Cookie Inventory</h2>
            <p className="text-xs text-neutral-600">
              The table below lists all cookies currently deployed across the public CYBERSTYLE website:
            </p>
            <div className="overflow-x-auto rounded-xl border border-black/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F2F4F7] font-mono uppercase text-neutral-600 border-b border-black/10">
                  <tr>
                    <th className="p-3">Cookie Name</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Purpose</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Category</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-sans">
                  {cookieInventory.map((item, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02]">
                      <td className="p-3 font-mono font-semibold text-black">{item.name}</td>
                      <td className="p-3 text-neutral-600">{item.provider}</td>
                      <td className="p-3 text-neutral-700">{item.purpose}</td>
                      <td className="p-3 text-neutral-600 whitespace-nowrap">{item.duration}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap ${
                            item.category.includes('Necessary')
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <h2 className="font-display font-bold text-2xl text-black">4. Managing Cookies in Your Browser</h2>
            <p>
              In addition to our interactive preference manager above, most modern web browsers allow you to manage cookie settings through their preferences menu. You can configure your browser to block third-party cookies or notify you whenever a cookie is set.
            </p>
            <p>
              Note that blocking strictly necessary cookies through browser-level settings may cause some features of our website (such as contact forms or session validation) to function improperly.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-black/10">
            <h2 className="font-display font-bold text-xl text-black">Questions &amp; Contact</h2>
            <p>
              For further questions regarding our cookie practices, reach out to our team at <a href="mailto:privacy@cyberstyle.net" className="text-[#0080FF] underline">privacy@cyberstyle.net</a>.
            </p>
          </div>
        </div>
      </section>

      {/* Atmospheric White-to-Black Scrim Gradient */}
      <SectionGradient direction="white-to-black" heightClass="h-44 sm:h-60" />
    </div>
  );
}
