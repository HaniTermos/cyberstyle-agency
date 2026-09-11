'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, Building2, ArrowRight } from 'lucide-react';
import Silk from '@/components/backgrounds/Silk';

export default function CentralLoginPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#040609] overflow-hidden font-sans">
      <Silk />

      <div className="relative z-10 w-full max-w-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[#00F0FF] text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            CYBERSTYLE SECURE GATEWAY
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white font-mono">
            CYBERSTYLE<span className="text-[#00F0FF]">_OS</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Select your authentication realm to proceed with Zero-Trust access
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Admin Realm */}
          <Link
            href="/admin/login"
            className="p-6 rounded-2xl bg-[#07090E]/90 border border-zinc-800 hover:border-[#00F0FF]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF]">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                Admin Console
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Super Admin operations, pipeline controls, AI lead scoring, and financial ledgers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] pt-2">
              <span>Enter Console</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Client Realm */}
          <Link
            href="/portal/login"
            className="p-6 rounded-2xl bg-[#07090E]/90 border border-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                Client Portal
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Live milestone tracking, staging sign-offs, Stripe invoices, and direct encrypted comms.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-2">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Return to CYBERSTYLE Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}
