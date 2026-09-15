'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Building2,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { DEMO_WORKSPACE_DATA, ProjectStatus, ProjectStage } from '@/lib/constants/portal';
import { ProjectStatusBadge } from '@/components/portal/ProjectStatusBadge';
import { MilestoneList } from '@/components/portal/MilestoneList';
import { ApprovalModal } from '@/components/portal/ApprovalModal';

export default function PortalProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeApproval, setActiveApproval] = useState<{
    name: string;
    version: string;
    criteria: string[];
  }>({
    name: 'Sample staging preview',
    version: 'v1.0',
    criteria: [
      'Homepage desktop and mobile views match signed design specifications.',
      'Navigation links, contact forms, and lead captures route accurately.',
      'Responsive typography and performance targets are verified.',
    ],
  });

  const project = DEMO_WORKSPACE_DATA.activeProject;

  const handleApprovalConfirm = async (notes?: string) => {
    // Audit-logged approval simulation
    console.log('Approval recorded:', notes);
  };

  const handleRequestChanges = async (notes: string) => {
    console.log('Change request recorded:', notes);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-cyan-400" />
            Your projects
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            See the current stage, upcoming review items, shared previews, project files, and any actions needed from you.
          </p>
        </div>
      </div>

      {/* Main Project Card */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{project.name}</h2>
              <ProjectStatusBadge status={project.status} />
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Project type: <span className="text-zinc-200">{project.type}</span> • Primary contact: <span className="text-zinc-200">{project.projectManager}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Review deliverable</span>
            </button>
            <Link
              href="/portal/messages"
              className="px-4 py-2 rounded-xl border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-zinc-400" />
              <span>Project thread</span>
            </Link>
          </div>
        </div>

        {/* Project Meta Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-900/40 border border-zinc-900 text-xs">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Current Stage</span>
            <span className="text-zinc-200 font-semibold mt-0.5 block">{project.stage}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Current Owner</span>
            <span className="text-zinc-200 font-semibold mt-0.5 block">{project.currentOwner}</span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Next Action</span>
            <span className="text-amber-400 font-medium mt-0.5 block truncate" title={project.nextAction}>
              {project.nextAction}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Next Scheduled Update</span>
            <span className="text-zinc-400 mt-0.5 block">{project.nextUpdateDate}</span>
          </div>
        </div>

        {/* Milestones & Deliverables Workflow */}
        <div className="space-y-4">
          <MilestoneList milestones={project.milestones as any} />
        </div>
      </div>

      {/* Deliverable Approval Dialog */}
      <ApprovalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        deliverableName={activeApproval.name}
        version={activeApproval.version}
        acceptanceCriteria={activeApproval.criteria}
        onConfirmApproval={handleApprovalConfirm}
        onRequestChanges={handleRequestChanges}
      />
    </div>
  );
}
