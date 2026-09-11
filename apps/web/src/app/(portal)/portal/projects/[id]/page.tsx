'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  ArrowLeft,
  Calendar,
  Sparkles,
  FileCheck2,
  Send
} from 'lucide-react';

interface PortalMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'PENDING_APPROVAL' | 'COMPLETED';
  paymentStatus: 'UNBILLED' | 'INVOICED' | 'PAID';
  amount: number;
  requestedApprovalAt?: string;
  approvedAt?: string;
}

interface PortalTask {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'WAITING_ON_CLIENT' | 'DONE';
  milestoneTitle?: string;
}

interface PortalProjectData {
  id: string;
  name: string;
  status: string;
  healthSimplified: 'ON_TRACK' | 'NEEDS_ATTENTION' | 'BLOCKED';
  healthMessage: string;
  progressPercent: number;
  stagingUrl?: string;
  productionUrl?: string;
  targetRelease: string;
  techStack: string;
  milestones: PortalMilestone[];
  tasks: PortalTask[];
}

const INITIAL_PROJECT_DATA: Record<string, PortalProjectData> = {
  proj_acme_01: {
    id: 'proj_acme_01',
    name: 'Acme SaaS Modernization',
    status: 'ACTIVE SPRINT',
    healthSimplified: 'NEEDS_ATTENTION',
    healthMessage: 'Milestone 3 is ready for your review and sign-off.',
    progressPercent: 75,
    stagingUrl: 'https://staging.acme.cyberstyle.net',
    productionUrl: 'https://app.acmeglobal.io',
    targetRelease: 'September 30, 2026',
    techStack: 'Next.js 15 • Express • Prisma • Argon2id • Redis',
    milestones: [
      {
        id: 'ms_01',
        title: 'Milestone 1: Architectural Blueprint & Zero-Trust RBAC Spec',
        description: 'Multi-tenant database isolation model, Argon2id auth token rotation schema, and API contracts.',
        targetDate: 'Aug 15, 2026',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        amount: 8000,
        approvedAt: 'Aug 16, 2026',
      },
      {
        id: 'ms_02',
        title: 'Milestone 2: High-Throughput Ingestion & API Gateway',
        description: 'Express microservice layer with rate-limiting, JWT validation, and BullMQ event queues.',
        targetDate: 'Sep 01, 2026',
        status: 'COMPLETED',
        paymentStatus: 'PAID',
        amount: 12000,
        approvedAt: 'Sep 02, 2026',
      },
      {
        id: 'ms_03',
        title: 'Milestone 3: Staging Deployment & Client Portal Integration',
        description: 'Complete UI component implementation, live sandbox preview, and end-to-end telemetry verification.',
        targetDate: 'Sep 15, 2026',
        status: 'PENDING_APPROVAL',
        paymentStatus: 'INVOICED',
        amount: 10000,
        requestedApprovalAt: 'Sep 08, 2026',
      },
      {
        id: 'ms_04',
        title: 'Milestone 4: Security Audit & Production Launch',
        description: 'Penetration testing sign-off, DNS cutover, and automated database backups.',
        targetDate: 'Sep 30, 2026',
        status: 'PENDING',
        paymentStatus: 'UNBILLED',
        amount: 5000,
      },
    ],
    tasks: [
      {
        id: 'task_01',
        title: 'Complete Staging User Acceptance Testing Sandbox',
        description: 'Interactive demo environment ready for Acme executive team sign-off.',
        status: 'WAITING_ON_CLIENT',
        milestoneTitle: 'Milestone 3',
      },
      {
        id: 'task_02',
        title: 'Integrate Argon2id Session Invalidation',
        description: 'Zero-Trust auth session revocation on credential rotation.',
        status: 'DONE',
        milestoneTitle: 'Milestone 2',
      },
      {
        id: 'task_03',
        title: 'Configure Automated Daily Database Snapshots',
        description: 'Encrypted GCS bucket replication with automated recovery drills.',
        status: 'IN_PROGRESS',
        milestoneTitle: 'Milestone 4',
      },
      {
        id: 'task_04',
        title: 'Deliver OpenAPI Specification & Postman Collection',
        description: 'Complete API documentation for internal Acme engineering handoff.',
        status: 'DONE',
        milestoneTitle: 'Milestone 3',
      },
    ],
  },
};

export default function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;

  const [project, setProject] = useState<PortalProjectData>(
    INITIAL_PROJECT_DATA[projectId] || {
      id: projectId,
      name: 'Client Engineering Project',
      status: 'ACTIVE DEVELOPMENT',
      healthSimplified: 'ON_TRACK',
      healthMessage: 'All engineering deliverables are on track.',
      progressPercent: 50,
      stagingUrl: 'https://staging.client.cyberstyle.net',
      targetRelease: 'October 15, 2026',
      techStack: 'Next.js 15 • Express • PostgreSQL',
      milestones: [
        {
          id: 'ms_default_1',
          title: 'Milestone 1: Discovery & Core Framework',
          description: 'Foundational architecture and prototype review.',
          targetDate: 'Oct 01, 2026',
          status: 'PENDING_APPROVAL',
          paymentStatus: 'INVOICED',
          amount: 10000,
          requestedApprovalAt: 'Sep 08, 2026',
        },
      ],
      tasks: [
        {
          id: 'task_default_1',
          title: 'Initial Build Setup',
          status: 'DONE',
        },
      ],
    }
  );

  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvalSuccessId, setApprovalSuccessId] = useState<string | null>(null);

  const handleApproveMilestone = async (milestoneId: string) => {
    setApprovingId(milestoneId);
    try {
      // Simulate /api/portal/milestones/:id/approve API call
      const res = await fetch(`/api/portal/milestones/${milestoneId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => null);

      setProject((prev) => ({
        ...prev,
        healthSimplified: 'ON_TRACK',
        healthMessage: 'All deliverables progressing on schedule.',
        milestones: prev.milestones.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                status: 'COMPLETED',
                approvedAt: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }),
              }
            : m
        ),
      }));

      setApprovalSuccessId(milestoneId);
      setTimeout(() => setApprovalSuccessId(null), 5000);
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setApprovingId(null);
    }
  };

  const getStatusBadge = (status: PortalMilestone['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            APPROVED & DELIVERED
          </span>
        );
      case 'PENDING_APPROVAL':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" />
            AWAITING YOUR SIGN-OFF
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            IN ACTIVE BUILD
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">
            UPCOMING
          </span>
        );
    }
  };

  const getHealthPill = () => {
    if (project.healthSimplified === 'ON_TRACK') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          PROJECT ON TRACK
        </span>
      );
    }
    if (project.healthSimplified === 'NEEDS_ATTENTION') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          NEEDS YOUR ATTENTION
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
        BLOCKED
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <Link
            href="/portal/projects"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F0FF] mb-2 font-mono transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Projects</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-[#00F0FF]" />
              {project.name}
            </h1>
            {getHealthPill()}
          </div>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            {project.healthMessage}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/portal/messages"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono rounded-xl transition-all"
          >
            <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
            <span>Project Discussion</span>
          </Link>
          {project.stagingUrl && (
            <a
              href={project.stagingUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0 font-mono"
            >
              <span>Live Staging Sandbox</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Progress & Environment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase">Overall Progress</span>
            <span className="text-[#00F0FF] font-bold">{project.progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-zinc-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#00F0FF] rounded-full transition-all duration-500"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Target Release</span>
          <div className="text-sm font-bold text-white mt-1 flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-zinc-400" />
            {project.targetRelease}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Staging Status</span>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            HEALTHY & VERIFIED
          </div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Architecture</span>
          <div className="text-xs text-zinc-300 mt-1 font-mono truncate">{project.techStack}</div>
        </div>
      </div>

      {/* Approval Success Banner */}
      {approvalSuccessId && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-xs font-mono">
            <strong>Milestone Sign-Off Recorded!</strong> Your formal approval has been logged to the immutable audit ledger. The engineering squad has been notified.
          </div>
        </div>
      )}

      {/* Section 1: Milestones & Sign-Off Gate */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#00F0FF]" />
            Milestones & Deliverable Sign-Offs
          </h2>
          <span className="text-xs text-zinc-400 font-mono">
            {project.milestones.filter((m) => m.status === 'COMPLETED').length} of {project.milestones.length} Completed
          </span>
        </div>

        <div className="space-y-4">
          {project.milestones.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all ${
                m.status === 'PENDING_APPROVAL'
                  ? 'bg-amber-500/5 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
                  : m.status === 'COMPLETED'
                  ? 'bg-zinc-900/30 border-zinc-800/80'
                  : 'bg-[#07090E] border-zinc-800/80'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">{m.title}</h3>
                    {getStatusBadge(m.status)}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{m.description}</p>
                  <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 pt-1">
                    <span>Target: {m.targetDate}</span>
                    <span>•</span>
                    <span>Allocation: ${m.amount.toLocaleString()}</span>
                    {m.approvedAt && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400">Signed Off on {m.approvedAt}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Approve Action Gate */}
                {m.status === 'PENDING_APPROVAL' && (
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleApproveMilestone(m.id)}
                      disabled={approvingId === m.id}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{approvingId === m.id ? 'Recording Sign-Off...' : 'Approve Milestone & Deliverables'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Client-Visible Deliverables & Sprint Tasks */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#00F0FF]" />
            Sprint Deliverables & Tasks
          </h2>
          <span className="text-xs text-zinc-500 font-mono">Live Engineering Task Tracking</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {project.tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{task.title}</h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                      task.status === 'DONE'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : task.status === 'WAITING_ON_CLIENT'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : task.status === 'IN_PROGRESS'
                        ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {task.status.replace(/_/g, ' ')}
                  </span>
                </div>
                {task.description && (
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{task.description}</p>
                )}
              </div>

              {task.milestoneTitle && (
                <div className="pt-2 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-500">
                  Tied to {task.milestoneTitle}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
