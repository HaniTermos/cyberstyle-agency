'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Flag,
  CheckCircle2,
  Clock,
  Briefcase,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  AlertCircle,
  Calendar,
  Lock,
  Edit2,
  Trash2,
  X
} from 'lucide-react';

interface MilestoneItem {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  title: string;
  description: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'UPCOMING';
  dueDate: string;
  amount: number;
  signOffRequired: boolean;
  signedOffBy?: string;
  stagingUrl?: string;
}

const SAMPLE_MILESTONES: MilestoneItem[] = [
  {
    id: 'ms_01',
    projectId: 'proj_acme_01',
    projectName: 'Acme SaaS Modernization',
    clientName: 'Acme Global Corp',
    title: 'Milestone 1: Core Architecture & Multi-Tenant Database',
    description: 'PostgreSQL schema with Prisma ORM, multi-tenant isolation, and JWT session handling.',
    status: 'COMPLETED',
    dueDate: 'Aug 15, 2026',
    amount: 8750,
    signOffRequired: true,
    signedOffBy: 'Marcus Vance (CTO, Acme)',
  },
  {
    id: 'ms_02',
    projectId: 'proj_acme_01',
    projectName: 'Acme SaaS Modernization',
    clientName: 'Acme Global Corp',
    title: 'Milestone 2: Billing Engine & Webhook Verification',
    description: 'Stripe integration with idempotent webhook handlers and automated PDF invoice generation.',
    status: 'COMPLETED',
    dueDate: 'Aug 30, 2026',
    amount: 8750,
    signOffRequired: true,
    signedOffBy: 'Marcus Vance (CTO, Acme)',
  },
  {
    id: 'ms_03',
    projectId: 'proj_acme_01',
    projectName: 'Acme SaaS Modernization',
    clientName: 'Acme Global Corp',
    title: 'Milestone 3: AI Lead Intelligence & Proposal Generator',
    description: 'Server-side Gemini 3.7 scoring pipelines with human approval gates and full audit logs.',
    status: 'COMPLETED',
    dueDate: 'Sep 05, 2026',
    amount: 8750,
    signOffRequired: true,
    signedOffBy: 'Marcus Vance (CTO, Acme)',
  },
  {
    id: 'ms_04',
    projectId: 'proj_acme_01',
    projectName: 'Acme SaaS Modernization',
    clientName: 'Acme Global Corp',
    title: 'Milestone 4: Security Audit & Staging Verification',
    description: 'Penetration testing, rate limiting, and client portal real-time threaded communications.',
    status: 'IN_PROGRESS',
    dueDate: 'Sep 30, 2026',
    amount: 8750,
    signOffRequired: true,
    stagingUrl: 'https://staging.acme.cyberstyle.net',
  },
  {
    id: 'ms_05',
    projectId: 'proj_vortex_02',
    projectName: 'Vortex AI Trading Platform',
    clientName: 'Vortex AI Trading',
    title: 'Milestone 1: WebSocket Feed & Order Book Normalizer',
    description: 'Sub-millisecond market feed normalizer with Redis pub/sub backpressure control.',
    status: 'COMPLETED',
    dueDate: 'Aug 28, 2026',
    amount: 14000,
    signOffRequired: true,
    signedOffBy: 'Elena Rostova (Head of Quant)',
  },
  {
    id: 'ms_06',
    projectId: 'proj_vortex_02',
    projectName: 'Vortex AI Trading Platform',
    clientName: 'Vortex AI Trading',
    title: 'Milestone 2: Execution Engine & Risk Guardrails',
    description: 'Pre-trade risk limits, circuit breakers, and algorithmic execution router.',
    status: 'IN_PROGRESS',
    dueDate: 'Oct 15, 2026',
    amount: 14000,
    signOffRequired: true,
    stagingUrl: 'https://staging.vortex.cyberstyle.net',
  },
  {
    id: 'ms_07',
    projectId: 'proj_nexus_03',
    projectName: 'Nexus Health Systems Portal',
    clientName: 'Nexus Health Systems',
    title: 'Milestone 1: 3D Anatomy Visualizer & HIPAA Compliance',
    description: 'Three.js interactive organ renderers and zero-knowledge patient record encryption.',
    status: 'IN_PROGRESS',
    dueDate: 'Nov 01, 2026',
    amount: 22000,
    signOffRequired: true,
  },
];

export default function AdminMilestonesPage() {
  const [milestones, setMilestones] = useState<MilestoneItem[]>(SAMPLE_MILESTONES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<MilestoneItem | null>(null);
  const [deletingMilestoneId, setDeletingMilestoneId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    projectName: 'Acme SaaS Modernization',
    clientName: 'Acme Global Corp',
    title: '',
    description: '',
    status: 'IN_PROGRESS' as MilestoneItem['status'],
    dueDate: 'Oct 30, 2026',
    amount: 8750,
    signOffRequired: true,
    signedOffBy: '',
    stagingUrl: '',
  });

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    const newMs: MilestoneItem = {
      id: `ms_${Date.now()}`,
      projectId: 'proj_custom',
      ...formData,
    };
    setMilestones([...milestones, newMs]);
    setShowCreateModal(false);
  };

  const handleUpdateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMilestone) return;
    setMilestones((prev) =>
      prev.map((m) => (m.id === editingMilestone.id ? { ...m, ...formData } : m))
    );
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
    setDeletingMilestoneId(null);
  };

  const filtered = milestones.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.projectName.toLowerCase().includes(search.toLowerCase()) ||
      m.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: MilestoneItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} />
            IN ACTIVE BUILD
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            CLIENT REVIEW
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/30">
            <Lock className="w-3 h-3" />
            LOCKED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Truth Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Flag className="w-6 h-6 text-[#00F0FF]" />
              Engineering Milestones
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              DEMO / DEVELOPMENT DATA
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Contractual delivery gates, staging sign-offs, and payment trigger points across active client builds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-zinc-700/80 transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projects Overview</span>
          </Link>
          <button
            onClick={() => {
              setFormData({
                projectName: 'Acme SaaS Modernization',
                clientName: 'Acme Global Corp',
                title: '',
                description: '',
                status: 'IN_PROGRESS',
                dueDate: 'Oct 30, 2026',
                amount: 8750,
                signOffRequired: true,
                signedOffBy: '',
                stagingUrl: '',
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestone</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search milestone title, project, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'IN_PROGRESS', 'COMPLETED', 'PENDING_REVIEW'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-all ${
                statusFilter === st
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/40 font-semibold'
                  : 'bg-zinc-900/40 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Milestones List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-[#07090E] border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#00F0FF] font-semibold">{item.projectName}</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs text-zinc-400">{item.clientName}</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {getStatusBadge(item.status)}
                <div className="text-right">
                  <div className="text-sm font-bold font-mono text-white">${item.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-mono text-zinc-500">PAYMENT GATE</div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingMilestone(item);
                      setFormData({
                        projectName: item.projectName,
                        clientName: item.clientName,
                        title: item.title,
                        description: item.description,
                        status: item.status,
                        dueDate: item.dueDate,
                        amount: item.amount,
                        signOffRequired: item.signOffRequired,
                        signedOffBy: item.signedOffBy || '',
                        stagingUrl: item.stagingUrl || '',
                      });
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                    title="Edit Milestone"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingMilestoneId(item.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                    title="Delete Milestone"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>

            <div className="pt-3 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-4 text-zinc-400">
                <span className="flex items-center gap-1.5 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  Target: {item.dueDate}
                </span>
                {item.signedOffBy && (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Signed off by: {item.signedOffBy}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {item.stagingUrl && (
                  <a
                    href={item.stagingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#00F0FF] hover:underline text-[11px]"
                  >
                    <span>Staging Preview</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <Link
                  href={`/admin/projects`}
                  className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-[11px] border border-zinc-700/60 transition-colors"
                >
                  View Project
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(showCreateModal || editingMilestone) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Flag className="w-4 h-4 text-[#00F0FF]" />
                {editingMilestone ? 'Edit Engineering Milestone' : 'Add Delivery Milestone'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingMilestone(null);
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingMilestone ? handleUpdateMilestone : handleCreateMilestone} className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Milestone 4: Security Audit & Staging Sign-Off"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Project Name</label>
                  <input
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Client Name</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Payment Gate ($ USD)</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Due Date</label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    placeholder="Sep 30, 2026"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  >
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="UPCOMING">UPCOMING</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Signed Off By (Optional)</label>
                  <input
                    type="text"
                    value={formData.signedOffBy}
                    onChange={(e) => setFormData({ ...formData, signedOffBy: e.target.value })}
                    placeholder="Marcus Vance (CTO)"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Description & Deliverables</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Specific deliverables, test criteria, and architecture verification steps..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF] font-sans"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingMilestone(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {editingMilestone ? 'Save Changes' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingMilestoneId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white font-mono">Delete Milestone?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Are you sure you want to permanently delete this milestone gate?
            </p>
            <div className="pt-2 flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setDeletingMilestoneId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMilestone(deletingMilestoneId)}
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
