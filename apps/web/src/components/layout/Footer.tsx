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
              Capabilities
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="#services" className="hover:text-white transition-colors">Premium Web Experiences</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">AI & Business Automation</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">Custom SaaS Platforms</Link></li>
              <li><Link href="#services" className="hover:text-white transition-colors">3D & Interactive WebGL</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="#about" className="hover:text-white transition-colors">About CYBERSTYLE</Link></li>
              <li><Link href="#how-we-work" className="hover:text-white transition-colors">How We Work</Link></li>
              <li><Link href="#work" className="hover:text-white transition-colors">Selected Work</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing & Scope</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-neutral-300">
              <li><Link href="#faq" className="hover:text-white transition-colors">Engineering FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Architecture Insights</Link></li>
              <li><Link href="/portal" className="hover:text-white transition-colors">Client Portal</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-neutral-400 mb-4">
              Operational Status
            </h4>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Systems Operational
              </div>
              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Accepting select builds for high-conversion web platforms and AI automation.
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
