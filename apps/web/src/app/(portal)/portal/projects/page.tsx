'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  MessageSquare
} from 'lucide-react';

interface ClientProjectSummary {
  id: string;
  name: string;
  repo: string;
  status: string;
  healthSimplified: 'ON_TRACK' | 'NEEDS_ATTENTION' | 'BLOCKED';
  healthMessage: string;
  progressPercent: number;
  currentMilestone: string;
  targetRelease: string;
  stagingUrl?: string;
  techStack: string;
}

const CLIENT_PROJECTS: ClientProjectSummary[] = [
  {
    id: 'proj_acme_01',
    name: 'Acme SaaS Modernization',
    repo: 'github.com/cyberstyle-org/acme-saas',
    status: 'ACTIVE SPRINT',
    healthSimplified: 'NEEDS_ATTENTION',
    healthMessage: 'Milestone 3 is ready for your review and sign-off.',
    progressPercent: 75,
    currentMilestone: 'Milestone 3: Staging Deployment & Client Portal Integration',
    targetRelease: 'September 30, 2026',
    stagingUrl: 'https://staging.acme.cyberstyle.net',
    techStack: 'Next.js 15 • Express • Prisma • Argon2id',
  },
  {
    id: 'proj_vortex_02',
    name: 'Vortex AI Trading Platform',
    repo: 'github.com/cyberstyle-org/vortex-trading',
    status: 'DEVELOPMENT SPRINT',
    healthSimplified: 'ON_TRACK',
    healthMessage: 'All engineering deliverables progressing on schedule.',
    progressPercent: 45,
    currentMilestone: 'Milestone 2: High-Frequency WebSocket Engine',
    targetRelease: 'October 15, 2026',
    stagingUrl: 'https://staging.vortex.cyberstyle.net',
    techStack: 'Next.js 15 • Redis • WebSockets • Python FastAPI',
  },
];

export default function PortalProjectsPage() {
  const getHealthBadge = (health: ClientProjectSummary['healthSimplified']) => {
    if (health === 'ON_TRACK') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ON TRACK
        </span>
      );
    }
    if (health === 'NEEDS_ATTENTION') {
      return (
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          NEEDS YOUR ATTENTION
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        BLOCKED
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FolderGit2 className="w-6 h-6 text-[#00F0FF]" />
              Active Builds & Engineering Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              CLIENT WORKSPACE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Live tracking of engineering sprints, staging deployments, and deliverable sign-offs.
          </p>
        </div>

        <Link
          href="/portal/messages"
          className="flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-mono rounded-xl transition-all self-start md:self-auto"
        >
          <MessageSquare className="w-4 h-4 text-[#00F0FF]" />
          <span>Engineering Team Chat</span>
        </Link>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CLIENT_PROJECTS.map((proj) => (
          <div
            key={proj.id}
            className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                  {proj.status}
                </span>
                {getHealthBadge(proj.healthSimplified)}
              </div>

              <div>
                <Link
                  href={`/portal/projects/${proj.id}`}
                  className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors flex items-center justify-between"
                >
                  <span>{proj.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00F0FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <p className="text-xs text-zinc-400 font-mono mt-1">{proj.repo}</p>
              </div>

              {/* Health Notice */}
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 font-mono">
                {proj.healthMessage}
              </div>

              {/* Progress & Milestone */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Progress</span>
                  <span className="text-[#00F0FF] font-bold">{proj.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00F0FF] transition-all duration-500"
                    style={{ width: `${proj.progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 font-mono truncate">{proj.currentMilestone}</p>
              </div>

              {/* Grid details */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase">Target Release</span>
                  <div className="text-white font-bold mt-0.5">{proj.targetRelease}</div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/80">
                  <span className="text-[10px] text-zinc-500 uppercase">Environment</span>
                  <div className="text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Staging Live
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono">
              <Link
                href={`/portal/projects/${proj.id}`}
                className="flex items-center gap-1.5 text-[#00F0FF] hover:underline font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>View Milestones & Sign-Off</span>
              </Link>

              {proj.stagingUrl && (
                <a
                  href={proj.stagingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
                >
                  <span>Staging</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
