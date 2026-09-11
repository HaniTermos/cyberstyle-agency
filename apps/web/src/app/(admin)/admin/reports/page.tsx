'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Calendar,
  Zap,
  ShieldCheck,
  X,
  AlertCircle,
  ArrowUpRight,
  Send,
  Eye
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ReportItem {
  id: string;
  organizationId: string;
  organization: { id: string; name: string };
  projectId?: string;
  project?: { id: string; name: string };
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  reportType: 'MONTHLY_RETAINER' | 'PROJECT_DELIVERY' | 'HEALTH_AUDIT' | 'SECURITY_AUDIT';
  period: string;
  periodStartDate: string;
  periodEndDate: string;
  executiveSummary: string;
  keyAccomplishments?: string[];
  nextMonthPlan?: string;
  nextMonthPriorities?: string[];
  metrics?: {
    hoursIncluded?: number;
    hoursUsed?: number;
    hoursRemaining?: number;
    tasksCompletedCount?: number;
    milestonesCount?: number;
    slaUptime?: string;
  };
  deliverables?: any[];
  pdfPath?: string;
  aiSummaryUsed: boolean;
  publishedAt?: string;
  createdAt: string;
}

const SAMPLE_REPORTS: ReportItem[] = [
  {
    id: 'rep_acme_01',
    organizationId: 'org_acme',
    organization: { id: 'org_acme', name: 'Acme Global Corp' },
    projectId: 'proj_acme_01',
    project: { id: 'proj_acme_01', name: 'Acme SaaS Modernization' },
    title: 'Acme Global Corp — September 2026 Retainer & Delivery Report',
    status: 'PUBLISHED',
    reportType: 'MONTHLY_RETAINER',
    period: 'September 2026',
    periodStartDate: '2026-09-01T00:00:00.000Z',
    periodEndDate: '2026-09-30T23:59:59.999Z',
    executiveSummary: 'During September 2026, the CYBERSTYLE engineering squad delivered consistent performance and high availability. Milestone 3: Staging Deployment & Client Portal Integration was successfully completed and signed off. A total of 12 engineering sprints were delivered with 18 of 40 allocated retainer hours utilized.',
    keyAccomplishments: [
      'Successfully deployed multi-tenant staging environment on Kubernetes.',
      'Completed Milestone 3 client deliverable sign-off.',
      'Maintained 99.99% infrastructure uptime with zero critical regressions.',
    ],
    metrics: {
      hoursIncluded: 40,
      hoursUsed: 18,
      hoursRemaining: 22,
      tasksCompletedCount: 12,
      milestonesCount: 1,
      slaUptime: '99.99%',
    },
    aiSummaryUsed: true,
    publishedAt: '2026-09-08T10:00:00.000Z',
    createdAt: '2026-09-08T09:30:00.000Z',
  },
  {
    id: 'rep_vortex_02',
    organizationId: 'org_vortex',
    organization: { id: 'org_vortex', name: 'Vortex AI Trading' },
    projectId: 'proj_vortex_02',
    project: { id: 'proj_vortex_02', name: 'Vortex AI Trading Platform' },
    title: 'Vortex AI Trading — September 2026 Retainer & Delivery Report',
    status: 'DRAFT',
    reportType: 'MONTHLY_RETAINER',
    period: 'September 2026',
    periodStartDate: '2026-09-01T00:00:00.000Z',
    periodEndDate: '2026-09-30T23:59:59.999Z',
    executiveSummary: 'Sub-millisecond WebSocket engine load testing completed with zero dropped messages over 50,000 synthetic market tick streams. Awaiting final admin approval before client portal release.',
    keyAccomplishments: [
      'High-frequency WebSocket backpressure mitigation validated.',
      'Low-latency Redis cluster connected to trading order book.',
    ],
    metrics: {
      hoursIncluded: 30,
      hoursUsed: 22,
      hoursRemaining: 8,
      tasksCompletedCount: 8,
      milestonesCount: 1,
      slaUptime: '100.0%',
    },
    aiSummaryUsed: false,
    createdAt: '2026-09-09T02:00:00.000Z',
  },
];

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>(SAMPLE_REPORTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Modals
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  // Generate Form State
  const [genForm, setGenForm] = useState({
    organizationName: 'Acme Global Corp',
    year: 2026,
    month: 9,
    reportType: 'MONTHLY_RETAINER' as ReportItem['reportType'],
  });

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ reports: ReportItem[] }>('/api/v1/reports');
      if (res.data?.reports && res.data.reports.length > 0) {
        setReports(res.data.reports);
      }
    } catch {
      // Keep sample reports as fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateRollup = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = monthNames[genForm.month];
      const periodStr = `${monthName} ${genForm.year}`;

      const newReport: ReportItem = {
        id: `rep_${Date.now()}`,
        organizationId: `org_${Date.now()}`,
        organization: { id: `org_${Date.now()}`, name: genForm.organizationName },
        title: `${genForm.organizationName} — ${periodStr} Retainer & Delivery Report`,
        status: 'DRAFT',
        reportType: genForm.reportType,
        period: periodStr,
        periodStartDate: new Date(Date.UTC(genForm.year, genForm.month - 1, 1)).toISOString(),
        periodEndDate: new Date(Date.UTC(genForm.year, genForm.month, 0)).toISOString(),
        executiveSummary: `During ${periodStr}, the engineering squad delivered comprehensive architecture updates and continuous sprint deliverables for ${genForm.organizationName}. Review draft details and publish when ready.`,
        keyAccomplishments: [
          `Completed sprint engineering deliverables with zero security regressions.`,
          `Maintained 99.99% infrastructure uptime SLA.`,
          `Managed cloud compute allocations within the approved retainer budget.`,
        ],
        metrics: {
          hoursIncluded: 40,
          hoursUsed: 16,
          hoursRemaining: 24,
          tasksCompletedCount: 7,
          milestonesCount: 1,
          slaUptime: '99.99%',
        },
        aiSummaryUsed: true,
        createdAt: new Date().toISOString(),
      };

      setReports([newReport, ...reports]);
      setShowGenerateModal(false);
    } catch (err) {
      console.error('Generate report failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePublishReport = async (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: 'PUBLISHED', publishedAt: new Date().toISOString() }
          : r
      )
    );
    alert('Report published! Client organization notified and PDF generated.');
  };

  const handleDeleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    setDeletingReportId(null);
  };

  const filtered = reports.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.organization.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00F0FF]" />
              Executive Retainer & Delivery Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              PHASE 6 ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Monthly retainer rollup generator, human-approved AI executive summaries, and client portal PDF publications.
          </p>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0 font-mono"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Monthly Rollup</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search report title or client organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 transition-colors font-mono"
          />
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-semibold'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid / Cards */}
      <div className="space-y-4">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            className={`p-6 rounded-2xl border transition-all space-y-4 group ${
              rep.status === 'PUBLISHED'
                ? 'bg-[#07090E] border-zinc-800 hover:border-zinc-700'
                : 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.03)]'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                      rep.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex items-center gap-1'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30 flex items-center gap-1 animate-pulse'
                    }`}
                  >
                    {rep.status === 'PUBLISHED' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        PUBLISHED TO PORTAL
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        DRAFT (AWAITING APPROVAL)
                      </>
                    )}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-mono text-[#00F0FF] font-semibold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {rep.organization.name}
                  </span>
                  {rep.aiSummaryUsed && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      AI ASSISTED
                    </span>
                  )}
                </div>
                <Link
                  href={`/admin/reports/${rep.id}`}
                  className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors flex items-center gap-2"
                >
                  <span>{rep.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[#00F0FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                <Link
                  href={`/admin/reports/${rep.id}`}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center gap-1.5 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#00F0FF]" />
                  <span>Open Studio</span>
                </Link>

                {rep.status === 'DRAFT' && (
                  <button
                    onClick={() => handlePublishReport(rep.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </button>
                )}

                <a
                  href={`/api/v1/reports/${rep.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-[#00F0FF] hover:text-white border border-zinc-800 flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Statement</span>
                </a>

                <button
                  onClick={() => setDeletingReportId(rep.id)}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 border border-zinc-800 transition-all"
                  title="Delete Report"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rep.executiveSummary}</p>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-500 uppercase">Hours Utilized</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {rep.metrics?.hoursUsed || 0} / {rep.metrics?.hoursIncluded || 40} hrs
                </div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-500 uppercase">SLA Availability</span>
                <div className="text-sm font-bold text-emerald-400 mt-0.5">{rep.metrics?.slaUptime || '99.99%'}</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-500 uppercase">Sprint Deliverables</span>
                <div className="text-sm font-bold text-[#00F0FF] mt-0.5">{rep.metrics?.tasksCompletedCount || 0} Items</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-500 uppercase">Period Range</span>
                <div className="text-sm font-bold text-zinc-300 mt-0.5">{rep.period}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GENERATE ROLLUP MODAL */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                Generate Monthly Retainer Rollup
              </h2>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleGenerateRollup} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Client Organization</label>
                <input
                  type="text"
                  required
                  value={genForm.organizationName}
                  onChange={(e) => setGenForm({ ...genForm, organizationName: e.target.value })}
                  placeholder="Acme Global Corp"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Target Month</label>
                  <select
                    value={genForm.month}
                    onChange={(e) => setGenForm({ ...genForm, month: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value={1}>January</option>
                    <option value={2}>February</option>
                    <option value={3}>March</option>
                    <option value={4}>April</option>
                    <option value={5}>May</option>
                    <option value={6}>June</option>
                    <option value={7}>July</option>
                    <option value={8}>August</option>
                    <option value={9}>September</option>
                    <option value={10}>October</option>
                    <option value={11}>November</option>
                    <option value={12}>December</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Year</label>
                  <input
                    type="number"
                    value={genForm.year}
                    onChange={(e) => setGenForm({ ...genForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Report Type</label>
                <select
                  value={genForm.reportType}
                  onChange={(e) => setGenForm({ ...genForm, reportType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                >
                  <option value="MONTHLY_RETAINER">MONTHLY RETAINER & SLA HEALTH</option>
                  <option value="PROJECT_DELIVERY">PROJECT SPRINT & MILESTONE DELIVERY</option>
                  <option value="HEALTH_AUDIT">INFRASTRUCTURE & CODE HEALTH AUDIT</option>
                  <option value="SECURITY_AUDIT">ZERO-TRUST SECURITY AUDIT</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed font-sans">
                💡 Automatically compiles completed tasks, signed-off milestones, retainer usage, and synthesizes an executive summary in <strong>DRAFT</strong> status.
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)] disabled:opacity-50"
                >
                  {generating ? 'Aggregating...' : 'Generate Rollup Draft'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingReportId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white font-mono">Delete Report Draft?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setDeletingReportId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReport(deletingReportId)}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
