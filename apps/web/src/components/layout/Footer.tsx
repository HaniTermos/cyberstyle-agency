'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Settings, ShieldCheck, Sparkles } from 'lucide-react';
import Silk from '../backgrounds/Silk';
import { CONTACT_EMAIL, LEGAL_ENTITY_NAME } from '@/lib/constants/brand';

export function Footer() {
  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  };

  return (
    <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden border-t border-white/10">
      {/* Background Silk Ambient Waves */}
      <Silk className="opacity-40" speed={0.4} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Giant Direct Contact Statement */}
        <div className="mb-20 pb-16 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] mb-3 block">
              Inquiries &amp; Project Requests
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white hover:text-[#00F0FF] transition-colors tracking-tight inline-flex items-center gap-4 group"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 text-[#00F0FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/start-project"
              className="px-6 py-3 rounded-xl bg-[#00F0FF] text-black font-display font-bold text-sm hover:bg-[#00D8E6] transition-all shadow-[0_0_25px_rgba(0,240,255,0.25)] flex items-center gap-2"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Multi-Column Link Directory — All Website Pages */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 text-sm">
          {/* Col 1: Services */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              Services &amp; Solutions
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/services/premium-web" className="hover:text-[#00F0FF] transition-colors">Business Websites</Link></li>
              <li><Link href="/services/ai-automation" className="hover:text-[#00F0FF] transition-colors">AI Enquiry Workflows</Link></li>
              <li><Link href="/services/custom-saas" className="hover:text-[#00F0FF] transition-colors">Client Portals &amp; Tools</Link></li>
              <li><Link href="/services" className="hover:text-[#00F0FF] transition-colors">All Services Overview</Link></li>
              <li><Link href="/delivery-standards" className="hover:text-[#00F0FF] transition-colors">Delivery Standards</Link></li>
            </ul>
          </div>

          {/* Col 2: Proof & Pricing */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              Work &amp; Results
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/work" className="hover:text-[#00F0FF] transition-colors">Selected Work</Link></li>
              <li><Link href="/reviews" className="hover:text-[#00F0FF] transition-colors">Client Reviews &amp; Feedback</Link></li>
              <li><Link href="/pricing" className="hover:text-[#00F0FF] transition-colors">Pricing &amp; Project Scopes</Link></li>
              <li><Link href="/start-project" className="hover:text-[#00F0FF] transition-colors">Project Estimator</Link></li>
            </ul>
          </div>

          {/* Col 3: Studio & Insights */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              Studio &amp; Insights
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/about" className="hover:text-[#00F0FF] transition-colors">About CYBERSTYLE</Link></li>
              <li><Link href="/blog" className="hover:text-[#00F0FF] transition-colors">CYBERSTYLE Insights</Link></li>
              <li><Link href="/faq" className="hover:text-[#00F0FF] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#00F0FF] transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              Client Hub &amp; Legal
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li>
                <Link href="/portal" className="hover:text-[#00F0FF] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Client Operations Portal</span>
                </Link>
              </li>
              <li><Link href="/privacy" className="hover:text-[#00F0FF] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-[#00F0FF] transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-[#00F0FF] transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright, Legal & Cookie Settings */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 font-mono gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-neutral-300 tracking-wider">{LEGAL_ENTITY_NAME}</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-neutral-300 transition-colors">Cookies</Link>
            <button
              onClick={openCookieSettings}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#00F0FF] transition-colors cursor-pointer focus:outline-none"
            >
              <Settings className="w-3.5 h-3.5" /> Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
