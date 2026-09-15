'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Receipt,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  LifeBuoy,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { DEMO_WORKSPACE_DATA, ProjectStatus, ProjectStage } from '@/lib/constants/portal';
import { NextActionCard } from '@/components/portal/NextActionCard';
import { ProjectStatusBadge } from '@/components/portal/ProjectStatusBadge';
import { MilestoneList } from '@/components/portal/MilestoneList';

export default function PortalDashboardPage() {
  const [data, setData] = useState(DEMO_WORKSPACE_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/portal/dashboard')
      .then((res) => {
        if (res.success && res.data) {
          // If real project data exists from backend, map cleanly
          const org = res.data.organization;
          const activeProj = res.data.projects?.[0];

          if (activeProj) {
            setData((prev) => ({
              ...prev,
              isDemo: false,
              organization: {
                ...prev.organization,
                name: org?.name || prev.organization.name,
                businessName: org?.businessName || prev.organization.businessName,
              },
              activeProject: {
                ...prev.activeProject,
                id: activeProj.id,
                name: activeProj.name,
                type: activeProj.type || 'Custom Engineering',
                stage: (activeProj.stage as ProjectStage) || 'Build in progress',
                status: (activeProj.status as ProjectStatus) || 'We are working',
                milestonesTotal: activeProj.milestones?.length || prev.activeProject.milestonesTotal,
                milestonesCompleted:
                  activeProj.milestones?.filter((m: any) => m.status === 'COMPLETED' || m.status === 'Approved').length ||
                  prev.activeProject.milestonesCompleted,
                milestones: activeProj.milestones?.map((m: any) => ({
                  id: m.id,
                  title: m.name || m.title,
                  description: m.description || '',
                  status: m.status === 'COMPLETED' ? 'Approved' : 'In progress',
                  deliverables: m.deliverables?.map((d: any) => d.name) || [],
                })) || prev.activeProject.milestones,
              },
            }));
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const project = data.activeProject;

  return (
    <div className="space-y-8 font-sans text-zinc-100">
      {/* 1. Header with Plain Client Language */}
      <div className="space-y-2 pb-6 border-b border-zinc-800/80">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Your project workspace
        </h1>
        <p className="text-xs text-zinc-400 max-w-3xl leading-relaxed">
          Follow progress, review shared files, send feedback, view invoices, and keep project communication organized in one place.
        </p>
      </div>

      {/* 2. Your Next Action Card */}
      <NextActionCard
        actionText={project.nextAction}
        dueDate={project.nextActionDueDate}
        actionLink={project.actionLink}
        actionButtonText={project.actionButtonText}
        isIdle={project.status !== 'Needs your feedback'}
      />

      {/* 3. Current Project Status */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-900">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
              Active Project
            </span>
            <h2 className="text-lg font-bold text-white mt-0.5">{project.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-mono text-zinc-400">
                Current stage: <strong className="text-white">{project.stage}</strong>
              </span>
              <span className="text-zinc-700">•</span>
              <ProjectStatusBadge status={project.status} />
            </div>
          </div>

          <div className="text-right sm:self-center">
            <span className="text-[11px] font-mono text-zinc-400 block">
              Current owner: <strong className="text-zinc-200">{project.currentOwner}</strong>
            </span>
            <span className="text-[11px] font-mono text-zinc-500 block mt-0.5">
              Next scheduled update: {project.nextUpdateDate}
            </span>
          </div>
        </div>

        {/* Milestone Progress (Calculated as X of Y, strictly factual) */}
        <MilestoneList milestones={project.milestones as any} />
      </div>

      {/* 4. Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Quick actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            href="/portal/projects"
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 text-left space-y-2 group transition-all"
          >
            <FolderGit2 className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
            <span className="block text-xs font-medium text-zinc-200 group-hover:text-white">View project</span>
          </Link>

          <Link
            href="/portal/feedback"
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500/40 text-left space-y-2 group transition-all"
          >
            <Clock className="w-4 h-4 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            <span className="block text-xs font-medium text-zinc-200 group-hover:text-white">Send feedback</span>
          </Link>

          <Link
            href="/portal/files"
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 text-left space-y-2 group transition-all"
          >
            <FileText className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
            <span className="block text-xs font-medium text-zinc-200 group-hover:text-white">Open files</span>
          </Link>

          <Link
            href="/portal/messages"
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-cyan-500/40 text-left space-y-2 group transition-all"
          >
            <MessageSquare className="w-4 h-4 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
            <span className="block text-xs font-medium text-zinc-200 group-hover:text-white">Send message</span>
          </Link>

          <Link
            href="/portal/invoices"
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 text-left space-y-2 group transition-all"
          >
            <Receipt className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
            <span className="block text-xs font-medium text-zinc-200 group-hover:text-white">View invoice</span>
          </Link>

          <Link
            href="/portal/messages?category=Support%20request"
            className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/40 text-left space-y-2 group transition-all"
          >
            <LifeBuoy className="w-4 h-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
            <span className="block text-xs font-medium text-zinc-200 group-hover:text-white">Request support</span>
          </Link>
        </div>
      </div>

      {/* 5. Recent Activity */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
        <h3 className="text-sm font-semibold text-white">Recent activity</h3>
        <div className="divide-y divide-zinc-900">
          {data.recentActivity.map((activity) => (
            <div key={activity.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <p className="text-zinc-200 font-medium">{activity.description}</p>
                <p className="text-[11px] text-zinc-500">
                  {activity.actor} • <span className="font-mono">{activity.timestamp}</span>
                </p>
              </div>
              <Link
                href={activity.link}
                className="text-zinc-400 hover:text-cyan-400 font-mono text-[11px] flex items-center gap-1 shrink-0"
              >
                <span>View</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
