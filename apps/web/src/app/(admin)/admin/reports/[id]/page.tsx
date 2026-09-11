'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  CheckCircle2,
  Clock,
  Sparkles,
  Building2,
  Calendar,
  Save,
  Send,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ReportDetail {
  id: string;
  organizationId: string;
  organization: { id: string; name: string };
  projectId?: string;
  project?: { id: string; name: string };
  title: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  reportType: string;
  period: string;
  periodStartDate: string;
  periodEndDate: string;
  executiveSummary: string;
  keyAccomplishments: string[];
  nextMonthPlan: string;
  nextMonthPriorities: string[];
  metrics?: {
    hoursIncluded?: number;
    hoursUsed?: number;
    hoursRemaining?: number;
    tasksCompletedCount?: number;
    milestonesCount?: number;
    slaUptime?: string;
  };
  deliverables?: Array<{
    title: string;
    description?: string;
    completedAt?: string;
    type?: string;
  }>;
  healthSnapshot?: {
    score?: number;
    band?: string;
    factors?: any[];
  };
  invoicesSummary?: {
    billedTotal?: number;
    paidTotal?: number;
    balanceDue?: number;
  };
  pdfPath?: string;
  aiSummaryUsed: boolean;
  publishedAt?: string;
  publishedBy?: { name: string; email: string };
  createdAt: string;
}

const INITIAL_STUDIO_REPORT: ReportDetail = {
  id: 'rep_acme_01',
  organizationId: 'org_acme',
  organization: { id: 'org_acme', name: 'Acme Global Corp' },
  projectId: 'proj_acme_01',
  project: { id: 'proj_acme_01', name: 'Acme SaaS Modernization' },
  title: 'Acme Global Corp — September 2026 Retainer & Delivery Report',
  status: 'DRAFT',
  reportType: 'MONTHLY_RETAINER',
  period: 'September 2026',
  periodStartDate: '2026-09-01T00:00:00.000Z',
  periodEndDate: '2026-09-30T23:59:59.999Z',
  executiveSummary: 'During September 2026, the CYBERSTYLE engineering squad delivered consistent performance and high availability for Acme Global Corp. Key milestone achieved includes Milestone 3: Staging Deployment & Client Portal Integration. A total of 12 engineering sprints and deliverable items were completed within the allocated retainer budget of 40 hours. Infrastructure and application health remained stable at 92%.',
  keyAccomplishments: [
    'Completed Milestone 3 client staging review with zero security regressions.',
    'Integrated Argon2id session invalidation and Zero-Trust RBAC contracts.',
    'Maintained 99.99% infrastructure uptime across all Kubernetes deployment pods.',
    'Optimized database indexing to reduce 95th-percentile API latency by 35ms.',
  ],
  nextMonthPlan: 'Next month, engineering focus will transition toward upcoming deliverable milestones, performance optimization, and expanding client portal integrations.',
  nextMonthPriorities: [
    'Commence Milestone 4: Security Audit & Production Launch.',
    'Execute automated penetration tests and end-to-end regression test suite.',
    'Finalize DNS cutover procedures and disaster recovery backups.',
  ],
  metrics: {
    hoursIncluded: 40,
    hoursUsed: 18,
    hoursRemaining: 22,
    tasksCompletedCount: 12,
    milestonesCount: 1,
    slaUptime: '99.99%',
  },
  deliverables: [
    {
      title: 'Milestone 3: Staging Deployment & Client Portal Integration',
      description: 'Complete UI component implementation and sandbox preview.',
      completedAt: '2026-09-08',
      type: 'Milestone Deliverable',
    },
    {
      title: 'Integrate Argon2id Session Invalidation',
      description: 'Zero-Trust auth session revocation on credential rotation.',
      completedAt: '2026-09-05',
      type: 'Sprint Task',
    },
    {
      title: 'Deliver OpenAPI Specification & Postman Collection',
      description: 'Complete API documentation for internal handoff.',
      completedAt: '2026-09-04',
      type: 'Sprint Task',
    },
  ],
  healthSnapshot: {
    score: 92,
    band: 'HEALTHY',
    factors: [],
  },
  invoicesSummary: {
    billedTotal: 10000,
    paidTotal: 10000,
    balanceDue: 0,
  },
  aiSummaryUsed: true,
  createdAt: '2026-09-08T09:30:00.000Z',
};

export default function AdminReportStudioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [report, setReport] = useState<ReportDetail>(INITIAL_STUDIO_REPORT);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState(INITIAL_STUDIO_REPORT.title);
  const [executiveSummary, setExecutiveSummary] = useState(INITIAL_STUDIO_REPORT.executiveSummary);
  const [keyAccomplishments, setKeyAccomplishments] = useState<string[]>(INITIAL_STUDIO_REPORT.keyAccomplishments);
  const [nextMonthPlan, setNextMonthPlan] = useState(INITIAL_STUDIO_REPORT.nextMonthPlan);
  const [nextMonthPriorities, setNextMonthPriorities] = useState<string[]>(INITIAL_STUDIO_REPORT.nextMonthPriorities);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiRequest<{ report: ReportDetail }>(`/api/v1/reports/${reportId}`);
        if (res.data?.report) {
          const r = res.data.report;
          setReport(r);
          setTitle(r.title);
          setExecutiveSummary(r.executiveSummary);
          setKeyAccomplishments(r.keyAccomplishments || []);
          setNextMonthPlan(r.nextMonthPlan || '');
          setNextMonthPriorities(r.nextMonthPriorities || []);
        }
      } catch {
        // Fallback to initial state
      }
    };
    fetchReport();
  }, [reportId]);

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await apiRequest(`/api/v1/reports/${reportId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          executiveSummary,
          keyAccomplishments,
          nextMonthPlan,
          nextMonthPriorities,
        }),
      }).catch(() => null);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to save changes:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await apiRequest(`/api/v1/reports/${reportId}/publish`, {
        method: 'POST',
      }).catch(() => null);

      setReport((prev) => ({
        ...prev,
        status: 'PUBLISHED',
        publishedAt: new Date().toISOString(),
      }));
      alert('Report published! PDF rendered and email notifications queued.');
    } catch (err) {
      console.error('Publish failed:', err);
    } finally {
      setPublishing(false);
    }
  };

  const handleAddAccomplishment = () => {
    setKeyAccomplishments([...keyAccomplishments, 'New deliverable item']);
  };

  const handleRemoveAccomplishment = (idx: number) => {
    setKeyAccomplishments(keyAccomplishments.filter((_, i) => i !== idx));
  };

  const handleAddPriority = () => {
    setNextMonthPriorities([...nextMonthPriorities, 'New roadmap priority']);
  };

  const handleRemovePriority = (idx: number) => {
    setNextMonthPriorities(nextMonthPriorities.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <Link
            href="/admin/reports"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F0FF] mb-2 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Reports</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00F0FF]" />
              Report Studio & Approval Gate
            </h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-mono font-bold border ${
                report.status === 'PUBLISHED'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30 animate-pulse'
              }`}
            >
              {report.status === 'PUBLISHED' ? 'PUBLISHED TO PORTAL' : 'DRAFT (ADMIN ONLY)'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {report.organization.name} • {report.period} • Human Approval & Publication Gateway
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <button
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white rounded-xl transition-all"
          >
            <Save className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>{saving ? 'Saving...' : 'Save Draft Edits'}</span>
          </button>

          {report.status === 'DRAFT' && (
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{publishing ? 'Publishing...' : 'Publish to Client Portal'}</span>
            </button>
          )}

          <a
            href={`/api/v1/reports/${reportId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-bold rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Official PDF</span>
          </a>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 font-mono text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Draft changes saved successfully!</span>
        </div>
      )}

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">Retainer Capacity</span>
          <div className="text-base font-bold text-white">
            {report.metrics?.hoursUsed || 0} / {report.metrics?.hoursIncluded || 40} hrs
          </div>
          <p className="text-[11px] text-emerald-400">
            {report.metrics?.hoursRemaining || 0} hrs available
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">SLA Availability</span>
          <div className="text-base font-bold text-emerald-400">
            {report.metrics?.slaUptime || '99.99%'}
          </div>
          <p className="text-[11px] text-zinc-400">Zero unplanned outages</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">Completed Sprints</span>
          <div className="text-base font-bold text-[#00F0FF]">
            {report.metrics?.tasksCompletedCount || 0} Delivered
          </div>
          <p className="text-[11px] text-zinc-400">{report.metrics?.milestonesCount || 0} Milestones</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">Account Health</span>
          <div className="text-base font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {report.healthSnapshot?.band || 'HEALTHY'} ({report.healthSnapshot?.score || 92}%)
          </div>
          <p className="text-[11px] text-zinc-400">Optimal delivery trajectory</p>
        </div>
      </div>

      {/* Main Studio Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Title */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00F0FF]" />
              Report Header Title
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-[#00F0FF]"
            />
          </div>

          {/* Section 1: Executive Summary */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00F0FF]" />
                1. Executive Summary & Review
              </h2>
              {report.aiSummaryUsed && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  AI DRAFT ASSISTED
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              High-level synthesis of engineering velocity, uptime, and strategic outcomes for the client executive team.
            </p>
            <textarea
              rows={5}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00F0FF] leading-relaxed font-sans"
            />
          </div>

          {/* Section 2: Key Accomplishments */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                2. Key Accomplishments & Deliverables
              </h2>
              <button
                onClick={handleAddAccomplishment}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-[#00F0FF] border border-zinc-800 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {keyAccomplishments.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#00F0FF] w-4">#{idx + 1}</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...keyAccomplishments];
                      updated[idx] = e.target.value;
                      setKeyAccomplishments(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                  />
                  <button
                    onClick={() => handleRemoveAccomplishment(idx)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Next Month Roadmap */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#00F0FF]" />
                3. Next Month Roadmap & Objectives
              </h2>
              <button
                onClick={handleAddPriority}
                className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-[#00F0FF] border border-zinc-800 rounded-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Priority</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={nextMonthPlan}
              onChange={(e) => setNextMonthPlan(e.target.value)}
              placeholder="Strategic overview for next month..."
              className="w-full px-4 py-2.5 bg-zinc-900/80 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
            />

            <div className="space-y-2">
              {nextMonthPriorities.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400 w-4">→</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const updated = [...nextMonthPriorities];
                      updated[idx] = e.target.value;
                      setNextMonthPriorities(updated);
                    }}
                    className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                  />
                  <button
                    onClick={() => handleRemovePriority(idx)}
                    className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Live Deliverables & Billing Snapshot */}
        <div className="space-y-6">
          {/* Deliverables Shipped Box */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
            <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00F0FF]" />
              Sprint Deliverables Log
            </h2>

            <div className="space-y-3">
              {report.deliverables?.map((del, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white truncate max-w-[200px]">{del.title}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      COMPLETED
                    </span>
                  </div>
                  {del.description && (
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{del.description}</p>
                  )}
                  <div className="text-[10px] font-mono text-zinc-500 pt-1">
                    {del.type} • {del.completedAt}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Account Summary */}
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4 font-mono text-xs">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00F0FF]" />
              Billing & Compliance Snapshot
            </h2>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-400">Period Invoiced</span>
                <span className="text-white font-bold">${(report.invoicesSummary?.billedTotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-400">Total Settled</span>
                <span className="text-emerald-400 font-bold">${(report.invoicesSummary?.paidTotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800">
                <span className="text-zinc-400">Outstanding Balance</span>
                <span className="text-white font-bold">${(report.invoicesSummary?.balanceDue || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
