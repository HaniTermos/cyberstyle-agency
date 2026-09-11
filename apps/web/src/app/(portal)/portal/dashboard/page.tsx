'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Receipt,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Building2,
  ExternalLink
} from 'lucide-react';

export default function PortalDashboardPage() {
  return (
    <div className="space-y-8 font-sans text-zinc-100">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-emerald-400" />
              Client Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ENTERPRISE SLA
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Realtime milestone updates, staging deploy review, invoices, and direct encrypted comms with your CYBERSTYLE engineering squad.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/messages"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Direct Comms</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">Active Build</span>
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">Acme SaaS Modernization</div>
            <p className="text-[11px] font-mono text-emerald-400 mt-0.5">Milestone 4: Staging Review (80%)</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">Invoices Settled</span>
            <Receipt className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">$17,500 Paid</div>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Invoice #INV-2026-001 (Stripe Verified)</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">Squad Channel</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <div className="text-xl font-bold text-white">Online // Active</div>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">Lead Architect & Systems Engineer</p>
          </div>
        </div>
      </div>

      {/* Active Milestone Deep-Dive */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              Active Milestone Progress
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Sprint delivery timeline and staging environment URLs</p>
          </div>
          <a
            href="https://staging.acme.cyberstyle.net"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-emerald-500 text-emerald-400 text-xs font-mono transition-colors"
          >
            <span>Open Staging Preview</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-zinc-400">Milestone 4 of 5 (80%)</span>
            <span className="text-emerald-400 font-bold">Estimated Delivery: Sep 30, 2026</span>
          </div>
          <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800">
            <div className="bg-emerald-500 h-full rounded-full w-4/5 shadow-[0_0_10px_#10b981]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">M1: Architecture</span>
            <p className="text-xs text-zinc-300 font-medium mt-1">COMPLETED</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">M2: 3D Shader Core</span>
            <p className="text-xs text-zinc-300 font-medium mt-1">COMPLETED</p>
          </div>
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <span className="text-[10px] font-mono text-emerald-400 font-bold">M3: Backend API & Auth</span>
            <p className="text-xs text-zinc-300 font-medium mt-1">COMPLETED</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
            <span className="text-[10px] font-mono text-emerald-300 font-bold">M4: Staging Review</span>
            <p className="text-xs text-white font-bold mt-1">IN PROGRESS</p>
          </div>
        </div>
      </div>
    </div>
  );
}
