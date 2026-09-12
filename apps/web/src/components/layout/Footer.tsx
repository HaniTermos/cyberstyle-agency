import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import Silk from '../backgrounds/Silk';

export function Footer() {
  return (
    <footer className="relative bg-black text-white pt-24 pb-12 overflow-hidden">
      {/* Background Silk Ambient Waves */}
      <Silk className="opacity-40" speed={0.4} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Giant Direct Contact Statement */}
        <div className="mb-20 pb-16 border-b border-white/10 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#00F0FF] mb-3 block">
              Inquiries & Direct Engagements
            </span>
            <a
              href="mailto:hello@cyberstyle.net"
              className="font-display font-bold text-3xl md:text-5xl lg:text-6xl text-white hover:text-[#00F0FF] transition-colors tracking-tight inline-flex items-center gap-4 group"
            >
              hello@cyberstyle.net
              <ArrowUpRight className="w-8 h-8 md:w-12 md:h-12 text-[#00F0FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
          </div>
          <div className="text-sm text-neutral-400 font-mono">
            <div>Markets: USA • Canada • Middle East</div>
            <div className="text-neutral-500">UTC-5 (EST) / UTC+3 (AST)</div>
          </div>
        </div>

        {/* Multi-Column Link Directory */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-20 text-sm">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/services/premium-web" className="hover:text-[#00F0FF] transition-colors">Websites That Sell</Link></li>
              <li><Link href="/services/ai-automation" className="hover:text-[#00F0FF] transition-colors">24/7 AI Lead Assistants</Link></li>
              <li><Link href="/services/custom-saas" className="hover:text-[#00F0FF] transition-colors">Custom Portals & Tools</Link></li>
              <li><Link href="/services" className="hover:text-[#00F0FF] transition-colors">All Solutions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/about" className="hover:text-[#00F0FF] transition-colors">About Us</Link></li>
              <li><Link href="/work" className="hover:text-[#00F0FF] transition-colors">Client Results</Link></li>
              <li><Link href="/pricing" className="hover:text-[#00F0FF] transition-colors">Transparent Pricing</Link></li>
              <li><Link href="/reviews" className="hover:text-[#00F0FF] transition-colors">Client Reviews</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="/faq" className="hover:text-[#00F0FF] transition-colors">Common Questions</Link></li>
              <li><Link href="/blog" className="hover:text-[#00F0FF] transition-colors">Growth Guides</Link></li>
              <li><Link href="/contact" className="hover:text-[#00F0FF] transition-colors">Contact Directly</Link></li>
              <li><Link href="/portal" className="hover:text-[#00F0FF] transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Current Availability
            </h4>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Taking On New Clients
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Currently accepting projects for fast website builds and 24/7 AI lead assistants.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Wordmark */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-500 font-mono gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-neutral-300 tracking-wider">CYBERSTYLE LLC</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-neutral-300 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
