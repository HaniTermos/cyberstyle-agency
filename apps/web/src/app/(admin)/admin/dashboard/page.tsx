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
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface DashboardData {
  kpis: {
    newLeads7Days: number;
    newLeads30Days: number;
    leadsNeedingFollowUpCount: number;
    proposalsPendingDecision: number;
    activeProjectsCount: number;
    invoicesNeedingAttentionCount: number;
    unreadClientMessagesCount: number;
  };
  leadsNeedingFollowUp: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    serviceNeeded: string;
    stage: string;
    nextFollowUpAt: string | null;
    createdAt: string;
  }>;
  recentLeads: Array<{
    id: string;
    name: string;
    email: string;
    company: string | null;
    serviceNeeded: string;
    stage: string;
    createdAt: string;
  }>;
  activeProjects: Array<{
    id: string;
    name: string;
    slug: string;
    status: string;
    organizationName: string;
    totalMilestones: number;
    completedMilestones: number;
    milestoneProgress: string;
    percent: number;
  }>;
  invoicesNeedingAttention: Array<{
    id: string;
    invoiceNumber: string;
    totalAmount: number | string;
    amountDue: number | string;
    status: string;
    dueDate: string;
    organization: {
      id: string;
      name: string;
    };
  }>;
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
    user?: { name?: string | null; email: string } | null;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiRequest<DashboardData>('/api/v1/admin/dashboard');
      if (res.data) {
        setData(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load dashboard metrics:', err);
      setError(err.message || 'Unable to connect to live administrative database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const kpis = data?.kpis;

  return (
    <div className="space-y-8 font-sans text-zinc-100">
      {/* Header & Status Indicator */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#00F0FF]" />
              Executive Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              LIVE DATA
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Realtime database telemetry: verified leads, milestone progression, attention invoices, and client threads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#00F0FF]/40 text-xs font-mono text-zinc-300 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#00F0FF]' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DATABASE CONNECTED</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
          <div className="flex-1">
            <p className="font-semibold">Failed to query operational data</p>
            <p className="font-mono text-[11px] text-red-400/80">{error}</p>
          </div>
          <button
            onClick={fetchDashboard}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-[11px] font-mono transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Real KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* New Leads (7d / 30d) */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-[#00F0FF]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">New Leads</span>
            <div className="w-8 h-8 rounded-xl bg-[#00F0FF]/10 text-[#00F0FF] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display">
              {loading ? '—' : kpis?.newLeads7Days ?? 0}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Last 7 days • {loading ? '—' : kpis?.newLeads30Days ?? 0} in past 30 days
            </p>
          </div>
        </div>

        {/* Leads Needing Follow-up */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">Needs Follow-Up</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display">
              {loading ? '—' : kpis?.leadsNeedingFollowUpCount ?? 0}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Overdue or pending prospect outreach
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
              {loading ? '—' : kpis?.activeProjectsCount ?? 0}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Live projects in production delivery
            </p>
          </div>
        </div>

        {/* Attention Invoices */}
        <div className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-3 relative overflow-hidden group hover:border-red-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-medium">Invoices Needing Action</span>
            <div className="w-8 h-8 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight font-display">
              {loading ? '—' : kpis?.invoicesNeedingAttentionCount ?? 0}
            </div>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              Due, overdue, or disputed invoices
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Leads & Active Client Builds */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Leads & Active Builds */}
        <div className="lg:col-span-8 space-y-6">
          {/* Leads Needing Follow-up / Pipeline */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Leads Requiring Immediate Follow-Up
                </h2>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Overdue follow-up dates or pending inquiries
                </p>
              </div>
              <Link
                href="/admin/leads"
                className="text-xs font-mono text-[#00F0FF] hover:underline flex items-center gap-1"
              >
                <span>View All Leads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
                Querying lead pipeline...
              </div>
            ) : !data?.leadsNeedingFollowUp || data.leadsNeedingFollowUp.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/50 space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-white">All Leads Up to Date</p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  No prospects currently exceed their scheduled follow-up window.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 font-mono text-[10px] uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Prospect</th>
                      <th className="pb-3 font-semibold">Service Needed</th>
                      <th className="pb-3 font-semibold">Stage</th>
                      <th className="pb-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    {data.leadsNeedingFollowUp.map((lead) => (
                      <tr key={lead.id} className="hover:bg-zinc-900/30">
                        <td className="py-3.5">
                          <div className="font-semibold text-white">{lead.name}</div>
                          <div className="text-[10px] font-mono text-zinc-500">
                            {lead.company || lead.email}
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-zinc-300">{lead.serviceNeeded}</td>
                        <td className="py-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            {lead.stage}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/admin/leads?id=${lead.id}`}
                            className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-[#00F0FF] text-[#00F0FF] text-[11px] font-mono transition-colors"
                          >
                            Follow Up
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Active Client Builds with Honest Milestone Counts */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#00F0FF]" />
                  Active Client Builds & Real Milestone Counts
                </h2>
                <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                  Milestone execution verified from database tasks and deliveries
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

            {loading ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500 animate-pulse">
                Loading project milestones...
              </div>
            ) : !data?.activeProjects || data.activeProjects.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/50 space-y-2">
                <Briefcase className="w-6 h-6 text-zinc-500 mx-auto" />
                <p className="text-xs font-semibold text-white">No Active Client Builds</p>
                <p className="text-[11px] text-zinc-500 font-mono">
                  There are currently no projects in discovery, design, or development stages.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.activeProjects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{proj.name}</span>
                      <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {proj.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400">
                      Client: <span className="text-white">{proj.organizationName}</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00F0FF] h-full transition-all duration-500"
                        style={{ width: `${proj.percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                      <span>{proj.milestoneProgress}</span>
                      <span>{proj.percent}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols): Invoices Needing Attention & Audit Logs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Invoices Needing Attention */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                <Receipt className="w-4 h-4 text-amber-400" />
                Attention Invoices
              </h2>
              <Link href="/admin/invoices" className="text-[11px] font-mono text-[#00F0FF] hover:underline">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs font-mono text-zinc-500 animate-pulse">
                Checking invoices...
              </div>
            ) : !data?.invoicesNeedingAttention || data.invoicesNeedingAttention.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-zinc-900/30 border border-zinc-800/50 space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                <p className="text-xs font-semibold text-white">Billing Current</p>
                <p className="text-[10px] text-zinc-500 font-mono">
                  No invoices are currently overdue or disputed.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.invoicesNeedingAttention.map((inv) => (
                  <Link
                    key={inv.id}
                    href={`/admin/invoices?id=${inv.id}`}
                    className="block p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-white font-mono">{inv.invoiceNumber}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>{inv.organization.name}</span>
                      <span className="text-white font-semibold">
                        ${Number(inv.amountDue).toLocaleString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Operational Shortcuts */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800/80 space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
              Operational Navigation
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
                    <p className="text-xs font-semibold">Client Communications</p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {kpis?.unreadClientMessagesCount ?? 0} active client messages
                    </p>
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
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Versioned Proposals</p>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {kpis?.proposalsPendingDecision ?? 0} pending client decision
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </Link>

              <Link
                href="/admin/audit-logs"
                className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-[#00F0FF]/50 text-xs font-medium text-white transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Audit Logs & Chain</p>
                    <p className="text-[10px] font-mono text-zinc-500">Cryptographic hash verification</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
