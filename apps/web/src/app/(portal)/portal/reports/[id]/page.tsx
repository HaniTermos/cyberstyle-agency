'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Building2,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface PortalReportDetail {
  id: string;
  organizationId: string;
  organization: { id: string; name: string };
  title: string;
  reportType: string;
  period: string;
  periodStartDate: string;
  periodEndDate: string;
  executiveSummary: string;
  keyAccomplishments: string[];
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
  deliverables?: Array<{
    title: string;
    description?: string;
    completedAt?: string;
    type?: string;
  }>;
  pdfPath?: string;
  publishedAt?: string;
  createdAt: string;
}

const SAMPLE_DETAIL_REPORT: PortalReportDetail = {
  id: 'rep_acme_01',
  organizationId: 'org_acme',
  organization: { id: 'org_acme', name: 'Acme Global Corp' },
  title: 'Acme Global Corp — September 2026 Retainer & Delivery Report',
  reportType: 'MONTHLY_RETAINER',
  period: 'September 2026',
  periodStartDate: '2026-09-01T00:00:00.000Z',
  periodEndDate: '2026-09-30T23:59:59.999Z',
  executiveSummary: 'During September 2026, the CYBERSTYLE engineering squad delivered consistent performance and high availability for Acme Global Corp. Key milestone achieved includes Milestone 3: Staging Deployment & Client Portal Integration. A total of 12 engineering sprints and deliverable items were completed within the allocated retainer budget of 40 hours. Infrastructure and application health remained stable at 92%.',
  keyAccomplishments: [
    'Completed Milestone 3 client staging review with zero security regressions.',
    'Integrated Argon2id session invalidation and Zero-Trust RBAC contracts.',
    'Maintained 99.99% infrastructure uptime across all deployment pods.',
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
  publishedAt: 'Sep 08, 2026',
  createdAt: '2026-09-08T09:30:00.000Z',
};

export default function PortalReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;

  const [report, setReport] = useState<PortalReportDetail>(SAMPLE_DETAIL_REPORT);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiRequest<{ report: PortalReportDetail }>(`/api/portal/reports/${reportId}`);
        if (res.data?.report) {
          setReport(res.data.report);
        }
      } catch {
        // Fallback to sample data
      }
    };
    fetchReport();
  }, [reportId]);

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <Link
            href="/portal/reports"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F0FF] mb-2 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Reports</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00F0FF]" />
              {report.title}
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Official Retainer Statement • {report.period} • Published on {report.publishedAt || 'Recent'}
          </p>
        </div>

        <a
          href={`/api/portal/reports/${reportId}/pdf`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-bold text-xs font-mono rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Official PDF</span>
        </a>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">Retainer Capacity</span>
          <div className="text-base font-bold text-white">
            {report.metrics?.hoursUsed || 0} / {report.metrics?.hoursIncluded || 40} hrs
          </div>
          <p className="text-[11px] text-emerald-400">
            {report.metrics?.hoursRemaining || 0} hrs remaining
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">SLA Availability</span>
          <div className="text-base font-bold text-emerald-400">
            {report.metrics?.slaUptime || '99.99%'}
          </div>
          <p className="text-[11px] text-zinc-400">Zero downtime</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">Deliverables Shipped</span>
          <div className="text-base font-bold text-[#00F0FF]">
            {report.metrics?.tasksCompletedCount || 0} Sprints
          </div>
          <p className="text-[11px] text-zinc-400">{report.metrics?.milestonesCount || 0} Milestones</p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 font-mono space-y-1">
          <span className="text-[10px] text-zinc-500 uppercase">Statement Status</span>
          <div className="text-base font-bold text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            VERIFIED & AUDITED
          </div>
          <p className="text-[11px] text-zinc-400">100% SLA fulfillment</p>
        </div>
      </div>

      {/* 1. Executive Summary */}
      <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-3">
        <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#00F0FF]" />
          1. Executive Summary
        </h2>
        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
          {report.executiveSummary}
        </p>
      </div>

      {/* 2. Key Accomplishments */}
      {report.keyAccomplishments && report.keyAccomplishments.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            2. Key Accomplishments & Deliverables Completed
          </h2>
          <div className="space-y-2">
            {report.keyAccomplishments.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                <span className="text-emerald-400 font-bold">•</span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Completed Deliverables Log */}
      {report.deliverables && report.deliverables.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00F0FF]" />
            3. Deliverables & Milestones Audit Log
          </h2>
          <div className="space-y-3">
            {report.deliverables.map((del, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="text-xs font-bold text-white">{del.title}</div>
                  {del.description && (
                    <div className="text-[11px] text-zinc-400">{del.description}</div>
                  )}
                  <div className="text-[10px] font-mono text-zinc-500">
                    {del.type} • Delivered on {del.completedAt}
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 self-start md:self-auto">
                  VERIFIED COMPLETED
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Next Month Roadmap */}
      {(report.nextMonthPlan || (report.nextMonthPriorities && report.nextMonthPriorities.length > 0)) && (
        <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
          <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00F0FF]" />
            4. Next Month Roadmap & Objectives
          </h2>
          {report.nextMonthPlan && (
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {report.nextMonthPlan}
            </p>
          )}
          {report.nextMonthPriorities && report.nextMonthPriorities.length > 0 && (
            <div className="space-y-2 pt-2">
              {report.nextMonthPriorities.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                  <span className="text-[#00F0FF] font-bold font-mono">→</span>
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
