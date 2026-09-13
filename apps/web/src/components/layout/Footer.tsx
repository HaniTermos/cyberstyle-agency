'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Settings } from 'lucide-react';
import Silk from '../backgrounds/Silk';
import { AVAILABILITY_NOTICE, CONTACT_EMAIL, LEGAL_ENTITY_NAME } from '@/lib/constants/brand';

export function Footer() {
  const openCookieSettings = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cookie-settings'));
    }
  };

  return (
    <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden">
      {/* Background Silk Ambient Waves */}
      <Silk className="opacity-40" speed={0.4} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Giant Direct Contact Statement */}
        <div className="mb-20 pb-16 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] mb-3 block">
              Inquiries & Project Requests
            </span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white hover:text-[#00F0FF] transition-colors tracking-tight inline-flex items-center gap-4 group"
            >
              {CONTACT_EMAIL}
              <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 text-[#00F0FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
          <div className="text-sm text-neutral-400 font-mono">
            <div>Independent Digital Studio</div>
            <div className="text-neutral-500">Available for Select Engagements</div>
          </div>
        </div>

        {/* Multi-Column Link Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 text-sm">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/services/premium-web" className="hover:text-[#00F0FF] transition-colors">Business Websites</Link></li>
              <li><Link href="/services/ai-automation" className="hover:text-[#00F0FF] transition-colors">AI Enquiry Workflows</Link></li>
              <li><Link href="/services/custom-saas" className="hover:text-[#00F0FF] transition-colors">Client Portals & Tools</Link></li>
              <li><Link href="/services" className="hover:text-[#00F0FF] transition-colors">All Services Overview</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Studio
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/about" className="hover:text-[#00F0FF] transition-colors">About CYBERSTYLE</Link></li>
              <li><Link href="/work" className="hover:text-[#00F0FF] transition-colors">Selected Work</Link></li>
              <li><Link href="/pricing" className="hover:text-[#00F0FF] transition-colors">Pricing & Scopes</Link></li>
              <li><Link href="/contact" className="hover:text-[#00F0FF] transition-colors">Get in Touch</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/faq" className="hover:text-[#00F0FF] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/blog" className="hover:text-[#00F0FF] transition-colors">CYBERSTYLE Insights</Link></li>
              <li><Link href="/portal" className="hover:text-[#00F0FF] transition-colors">Client Portal</Link></li>
              <li><Link href="/privacy" className="hover:text-[#00F0FF] transition-colors">Privacy & Compliance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Studio Status
            </h4>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Availability
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                {AVAILABILITY_NOTICE}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright, Legal & Cookie Settings */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 font-mono gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-neutral-300 tracking-wider">{LEGAL_ENTITY_NAME}</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-neutral-300 transition-colors">Cookie Policy</Link>
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
