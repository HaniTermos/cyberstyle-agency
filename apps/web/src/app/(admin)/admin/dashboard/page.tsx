'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Briefcase,
  Receipt,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Activity,
  Cpu,
  Clock,
  ArrowRight,
  Plus
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    pipelineValue: 85000,
    recordedRevenue: 48500,
    activeLeads: 12,
    activeProjects: 4,
    openInvoices: 3,
    unreadMessages: 1,
  });

  return (
    <div className="space-y-8 font-sans text-zinc-100">
      {/* Top Banner & Dev Mode Transparency Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#00F0FF]" />
              Executive Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              CYBERSTYLE_OS v4.0
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Realtime operations, AI lead scoring telemetry, Stripe invoice monitoring, and direct client communications.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>DEVELOPMENT DATA ACTIVE</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-[#00F0FF] text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAYMENTS: TEST MODE</span>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pipeline Value */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-[#00F0FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">Pipeline Value</span>
            <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display">
              ${stats.pipelineValue.toLocaleString()}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Development Seed Data • 12 Active Inbound Leads
            </p>
          </div>
        </div>

        {/* Revenue Recorded */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">Recorded Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display">
              ${stats.recordedRevenue.toLocaleString()}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Stripe Test Invoices Settled
            </p>
          </div>
        </div>

        {/* Active Builds */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">Active Builds</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display">
              {stats.activeProjects} Builds
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Acme, Vortex AI, Nexus Health
            </p>
          </div>
        </div>

        {/* Client Communications */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-[#00F0FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">Live Messaging</span>
            <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display flex items-center gap-2">
              Phase 4 Active
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Encrypted Client Thread Mesh
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Grid: Quick Actions & Live Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Recent Pipeline Leads & AI Status */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#00F0FF]" />
                  Inbound Leads & AI Intelligence Workspace
                </h2>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Automated Gemini 3.7 Flash lead qualification & proposal generation
                </p>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-mono text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                <span>View Full Pipeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Prospect</th>
                    <th className="pb-3 font-semibold">Service</th>
                    <th className="pb-3 font-semibold">AI Fit Score</th>
                    <th className="pb-3 font-semibold">Stage</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3.5">
                      <div className="font-semibold text-white">David Harrison</div>
                      <div className="text-[10px] font-mono text-zinc-500">Apex Capital Advisory</div>
                    </td>
                    <td className="py-3.5 font-mono text-zinc-300">Custom SaaS</td>
                    <td className="py-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        94 / 100
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        QUALIFIED
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/leads"
                        className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#00F0FF] text-[#00F0FF] text-[11px] font-mono transition-colors"
                      >
                        Draft SOW
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3.5">
                      <div className="font-semibold text-white">Sarah Jenkins</div>
                      <div className="text-[10px] font-mono text-zinc-500">Aura Biotech</div>
                    </td>
                    <td className="py-3.5 font-mono text-zinc-300">Premium 3D Web</td>
                    <td className="py-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        88 / 100
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        PROPOSAL_DRAFT
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/proposals"
                        className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#00F0FF] text-[#00F0FF] text-[11px] font-mono transition-colors"
                      >
                        Review SOW
                      </Link>
                    </td>
                  </tr>

                  <tr className="hover:bg-zinc-900/30">
                    <td className="py-3.5">
                      <div className="font-semibold text-white">Marcus Vance</div>
                      <div className="text-[10px] font-mono text-zinc-500">Vance Logistics</div>
                    </td>
                    <td className="py-3.5 font-mono text-zinc-300">AI Automation</td>
                    <td className="py-3.5 font-mono">
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold">
                        81 / 100
                      </span>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300">
                        NEW_INBOUND
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/leads"
                        className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#00F0FF] text-[#00F0FF] text-[11px] font-mono transition-colors"
                      >
                        Score Lead
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Client Builds Card */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#00F0FF]" />
                  Active Client Builds & Milestones
                </h2>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Milestone execution and staging deploy environments
                </p>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs font-mono text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                <span>View All Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Acme Modernization</span>
                  <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded">
                    M4 REVIEW
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#00F0FF] h-full w-4/5" />
                </div>
                <p className="text-[10px] font-mono text-zinc-400">80% Complete • Staging Live</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Vortex AI Platform</span>
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded">
                    M2 SPRINT
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-2/5" />
                </div>
                <p className="text-[10px] font-mono text-zinc-400">40% Complete • API Integration</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Nexus Health Portal</span>
                  <span className="text-[9px] font-mono bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded">
                    DISCOVERY
                  </span>
                </div>
                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-400 h-full w-1/5" />
                </div>
                <p className="text-[10px] font-mono text-zinc-400">20% Complete • Schema Finalized</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Quick Operations & Messaging */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Launchpad */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Operational Shortcuts
            </h2>

            <div className="space-y-2">
              <Link
                href="/admin/messages"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#00F0FF]/50 text-xs font-medium text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Client Live Messaging</p>
                    <p className="text-[10px] font-mono text-zinc-500">Live chat & internal notes</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00F0FF] transition-colors" />
              </Link>

              <Link
                href="/admin/proposals"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#00F0FF]/50 text-xs font-medium text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">AI SOW Generator</p>
                    <p className="text-[10px] font-mono text-zinc-500">Draft proposals & Loom scripts</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </Link>

              <Link
                href="/admin/invoices"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#00F0FF]/50 text-xs font-medium text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Stripe Invoices & Retainers</p>
                    <p className="text-[10px] font-mono text-zinc-500">Payment tracking & PDF exports</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </Link>
            </div>
          </div>

          {/* System Telemetry */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Infrastructure Status
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">PostgreSQL Database</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  ONLINE (Port 5432)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Core Express API</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  READY (Port 4000)
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-zinc-400">Stripe Billing Engine</span>
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  TEST MODE
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-400">AI Engine</span>
                <span className="text-[#00F0FF] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  GEMINI 3.7 FLASH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
