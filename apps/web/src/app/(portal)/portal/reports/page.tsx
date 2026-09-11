'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface PortalReportSummary {
  id: string;
  title: string;
  reportType: string;
  period: string;
  periodStartDate: string;
  executiveSummary: string;
  keyAccomplishments?: string[];
  metrics?: {
    hoursIncluded?: number;
    hoursUsed?: number;
    hoursRemaining?: number;
    tasksCompletedCount?: number;
    milestonesCount?: number;
    slaUptime?: string;
  };
  publishedAt?: string;
}

const SAMPLE_PORTAL_REPORTS: PortalReportSummary[] = [
  {
    id: 'rep_acme_01',
    title: 'Acme Global Corp — September 2026 Retainer & Delivery Report',
    reportType: 'MONTHLY_RETAINER',
    period: 'September 2026',
    periodStartDate: '2026-09-01T00:00:00.000Z',
    executiveSummary: 'During September 2026, the CYBERSTYLE engineering squad delivered consistent performance and high availability. Milestone 3: Staging Deployment & Client Portal Integration was successfully completed and signed off. A total of 12 engineering sprints were delivered with 18 of 40 allocated retainer hours utilized.',
    keyAccomplishments: [
      'Completed Milestone 3 client staging review with zero regressions.',
      'Integrated Argon2id session invalidation and Zero-Trust RBAC contracts.',
      'Maintained 99.99% infrastructure uptime across all deployment pods.',
    ],
    metrics: {
      hoursIncluded: 40,
      hoursUsed: 18,
      hoursRemaining: 22,
      tasksCompletedCount: 12,
      milestonesCount: 1,
      slaUptime: '99.99%',
    },
    publishedAt: 'Sep 08, 2026',
  },
  {
    id: 'rep_acme_00',
    title: 'Acme Global Corp — August 2026 Retainer & Delivery Report',
    reportType: 'MONTHLY_RETAINER',
    period: 'August 2026',
    periodStartDate: '2026-08-01T00:00:00.000Z',
    executiveSummary: 'August development focused on Milestone 2: High-Throughput Ingestion & API Gateway delivery. All 8 sprint deliverables were verified and approved within SLA.',
    keyAccomplishments: [
      'Delivered Express microservice layer with rate-limiting and JWT token rotation.',
      'Completed Milestone 2 sign-off.',
    ],
    metrics: {
      hoursIncluded: 40,
      hoursUsed: 26,
      hoursRemaining: 14,
      tasksCompletedCount: 8,
      milestonesCount: 1,
      slaUptime: '99.98%',
    },
    publishedAt: 'Aug 31, 2026',
  },
];

export default function PortalReportsPage() {
  const [reports, setReports] = useState<PortalReportSummary[]>(SAMPLE_PORTAL_REPORTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPortalReports = async () => {
      try {
        setLoading(true);
        const res = await apiRequest<{ reports: PortalReportSummary[] }>('/api/portal/reports');
        if (res.data?.reports && res.data.reports.length > 0) {
          setReports(res.data.reports);
        }
      } catch {
        // Keep fallback sample data
      } finally {
        setLoading(false);
      }
    };
    fetchPortalReports();
  }, []);

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#00F0FF]" />
              Monthly Retainer & Delivery Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              EXECUTIVE COMPLIANCE
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Official monthly deliverables summaries, retainer hours utilization, and signed-off SLA performance statements.
          </p>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 hover:border-zinc-700 transition-all space-y-4 group"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    OFFICIAL REPORT
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-mono text-zinc-400">{rep.period}</span>
                </div>
                <Link
                  href={`/portal/reports/${rep.id}`}
                  className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors flex items-center gap-2"
                >
                  <span>{rep.title}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00F0FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <Link
                  href={`/portal/reports/${rep.id}`}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 flex items-center gap-1.5 transition-all"
                >
                  <span>View Details</span>
                </Link>

                <a
                  href={`/api/portal/reports/${rep.id}/pdf`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Official PDF</span>
                </a>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{rep.executiveSummary}</p>

            {/* Metrics Snapshot Bar */}
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
                <span className="text-[10px] text-zinc-500 uppercase">Deliverables Shipped</span>
                <div className="text-sm font-bold text-[#00F0FF] mt-0.5">{rep.metrics?.tasksCompletedCount || 0} Sprints</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80 font-mono">
                <span className="text-[10px] text-zinc-500 uppercase">Published</span>
                <div className="text-sm font-bold text-zinc-300 mt-0.5">{rep.publishedAt || 'Published'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
