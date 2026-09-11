'use client';

import React from 'react';
import Link from 'next/link';
import {
  Repeat,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Calendar,
  Sparkles,
  MessageSquare
} from 'lucide-react';

export default function PortalRetainersPage() {
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Repeat className="w-6 h-6 text-emerald-400" />
              Active Retainer & SLA Coverage
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ACTIVE SUBSCRIBER
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Guaranteed monthly engineering bandwidth, emergency SLA on-call response, and infrastructure oversight.
          </p>
        </div>

        <Link
          href="/portal/messages"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Request Retainer Task</span>
        </Link>
      </div>

      {/* Retainer Card */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">Tier 1 Dedicated Squad</span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise Growth & Dedicated Dev Retainer</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white font-mono">$7,500.00 / mo</div>
            <div className="text-[10px] font-mono text-zinc-500">Auto-renews Oct 01, 2026</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <span className="text-xs text-zinc-400">SLA Response Time</span>
            <div className="text-lg font-bold text-emerald-400 mt-1">&lt; 1 Hour Guaranteed</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">24/7 Severity-1 incident coverage</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <span className="text-xs text-zinc-400">Monthly Hours</span>
            <div className="text-lg font-bold text-white mt-1">18 / 40 Hours Used</div>
            <p className="text-[11px] text-zinc-500 mt-1 font-sans">22 hours remaining this billing cycle</p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
            <span className="text-xs text-zinc-400">Included Scope</span>
            <div className="text-xs font-bold text-zinc-300 mt-2 font-sans space-y-1">
              <div>• Performance Optimization</div>
              <div>• Continuous Security Patches</div>
              <div>• Architecture Refactoring</div>
            </div>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Cycle Capacity (September 2026)</span>
            <span>45% Used (18 / 40 hrs)</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 transition-all" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
