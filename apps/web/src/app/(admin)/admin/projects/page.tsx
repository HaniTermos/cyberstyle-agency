'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Flag,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Building2,
  ArrowUpRight,
  GitBranch,
  ShieldCheck,
  Search,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  clientName: string;
  status: 'DISCOVERY' | 'DESIGN' | 'DEVELOPMENT' | 'REVIEW' | 'LAUNCHED';
  progressPercent: number;
  currentMilestone: string;
  stagingUrl?: string;
  productionUrl?: string;
  budget: number;
  deliveryDate: string;
  description?: string;
  healthScore?: number;
  healthBand?: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
}

const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    id: 'proj_acme_01',
    name: 'Acme SaaS Modernization',
    clientName: 'Acme Global Corp',
    status: 'REVIEW',
    progressPercent: 80,
    currentMilestone: 'Milestone 4: Security Audit & Staging Verification',
    stagingUrl: 'https://staging.acme.cyberstyle.net',
    budget: 35000,
    deliveryDate: 'Sep 30, 2026',
    description: 'Multi-tenant cloud architecture upgrade with Argon2id and Zero-Trust RBAC.',
    healthScore: 92,
    healthBand: 'HEALTHY',
  },
  {
    id: 'proj_vortex_02',
    name: 'Vortex AI Trading Platform',
    clientName: 'Vortex AI Trading',
    status: 'DEVELOPMENT',
    progressPercent: 45,
    currentMilestone: 'Milestone 2: High-Frequency WebSocket Engine',
    stagingUrl: 'https://staging.vortex.cyberstyle.net',
    budget: 28000,
    deliveryDate: 'Oct 15, 2026',
    description: 'Low-latency order book routing and real-time Redis pub/sub backpressure.',
    healthScore: 78,
    healthBand: 'AT_RISK',
  },
  {
    id: 'proj_nexus_03',
    name: 'Nexus Health Systems Portal',
    clientName: 'Nexus Health Systems',
    status: 'DESIGN',
    progressPercent: 20,
    currentMilestone: 'Milestone 1: 3D Anatomy Visualizer & HIPAA Schema',
    budget: 22000,
    deliveryDate: 'Nov 01, 2026',
    description: 'Interactive WebGL 3D organ view with client zero-knowledge data encryption.',
    healthScore: 95,
    healthBand: 'HEALTHY',
  },
];

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>(SAMPLE_PROJECTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals & State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    status: 'DISCOVERY' as ProjectItem['status'],
    progressPercent: 10,
    currentMilestone: 'Milestone 1: Architecture Blueprint & Spec',
    stagingUrl: '',
    productionUrl: '',
    budget: 25000,
    deliveryDate: 'Oct 30, 2026',
    description: '',
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: ProjectItem = {
      id: `proj_${Date.now()}`,
      ...formData,
      healthScore: 100,
      healthBand: 'HEALTHY',
    };
    setProjects([newProj, ...projects]);
    setShowCreateModal(false);
    alert(`Project "${newProj.name}" created!\nOnboarding Channel spawned in Client Portal.`);
  };

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setProjects((prev) =>
      prev.map((p) => (p.id === editingProject.id ? { ...p, ...formData } : p))
    );
    setEditingProject(null);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeletingProjectId(null);
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: ProjectItem['status']) => {
    switch (status) {
      case 'LAUNCHED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            LAUNCHED / PRODUCTION
          </span>
        );
      case 'REVIEW':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30">
            STAGING REVIEW
          </span>
        );
      case 'DEVELOPMENT':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
            ACTIVE BUILD SPRINT
          </span>
        );
      case 'DESIGN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            DESIGN & 3D PROTO
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-700/30 text-zinc-400 border border-zinc-700">
            {status}
          </span>
        );
    }
  };

  const getHealthBadge = (score?: number, band?: string) => {
    const s = score ?? 100;
    const b = band ?? (s >= 80 ? 'HEALTHY' : s >= 50 ? 'AT_RISK' : 'CRITICAL');
    if (b === 'HEALTHY') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          HEALTH {s}%
        </span>
      );
    }
    if (b === 'AT_RISK') {
      return (
        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          AT RISK {s}%
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
        CRITICAL {s}%
      </span>
    );
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#00F0FF]" />
              Active Builds & Delivery Squads
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
              PHASE 5 ENGINE ACTIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Realtime project health scoring, automated milestone gating, and sprint Kanban boards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/milestones"
            className="flex items-center gap-2 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-mono rounded-xl transition-all"
          >
            <Flag className="w-3.5 h-3.5 text-[#00F0FF]" />
            <span>Milestones</span>
          </Link>
          <button
            onClick={() => {
              setFormData({
                name: '',
                clientName: '',
                status: 'DISCOVERY',
                progressPercent: 10,
                currentMilestone: 'Milestone 1: Architecture Blueprint & Spec',
                stagingUrl: '',
                productionUrl: '',
                budget: 25000,
                deliveryDate: 'Oct 30, 2026',
                description: '',
              });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search project name or client organization..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00F0FF]/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {['ALL', 'DEVELOPMENT', 'REVIEW', 'DESIGN', 'LAUNCHED'].map((st) => (
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

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(item.status)}
                  {getHealthBadge(item.healthScore, item.healthBand)}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setEditingProject(item);
                      setFormData({
                        name: item.name,
                        clientName: item.clientName,
                        status: item.status,
                        progressPercent: item.progressPercent,
                        currentMilestone: item.currentMilestone,
                        stagingUrl: item.stagingUrl || '',
                        productionUrl: item.productionUrl || '',
                        budget: item.budget,
                        deliveryDate: item.deliveryDate,
                        description: item.description || '',
                      });
                    }}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingProjectId(item.id)}
                    className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <Link
                  href={`/admin/projects/${item.id}`}
                  className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors flex items-center justify-between"
                >
                  <span>{item.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-[#00F0FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1 font-mono">
                  <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                  {item.clientName}
                </p>
              </div>

              {/* Progress & Milestone */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">Progress</span>
                  <span className="text-[#00F0FF] font-bold">{item.progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00F0FF] transition-all duration-500"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 font-mono truncate">{item.currentMilestone}</p>
              </div>

              {/* Stats Box */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase">Budget</span>
                  <div className="text-white font-bold">${item.budget.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-zinc-500 uppercase">Target Release</span>
                  <div className="text-zinc-300">{item.deliveryDate}</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs font-mono">
              <Link
                href={`/admin/projects/${item.id}`}
                className="flex items-center gap-1.5 text-[#00F0FF] hover:underline font-bold"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Open Cockpit</span>
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/messages"
                  className="flex items-center gap-1.5 text-zinc-400 hover:text-white"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Discuss</span>
                </Link>

                {item.stagingUrl && (
                  <a
                    href={item.stagingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-[#00F0FF]"
                  >
                    <span>Staging</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT PROJECT MODAL */}
      {(showCreateModal || editingProject) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-5 border-b border-zinc-800">
              <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#00F0FF]" />
                {editingProject ? 'Edit Project Details' : 'Initialize New Engineering Project'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingProject(null);
                }}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingProject ? handleUpdateProject : handleCreateProject} className="p-6 space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Project Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Acme SaaS Modernization"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Client Organization</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Acme Global Corp"
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
                    <option value="DISCOVERY">DISCOVERY</option>
                    <option value="DESIGN">DESIGN</option>
                    <option value="DEVELOPMENT">DEVELOPMENT</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="LAUNCHED">LAUNCHED</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Progress (%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.progressPercent}
                    onChange={(e) => setFormData({ ...formData, progressPercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Budget ($ USD)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase">Delivery Date</label>
                  <input
                    type="text"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    placeholder="Sep 30, 2026"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Current Milestone Title</label>
                <input
                  type="text"
                  value={formData.currentMilestone}
                  onChange={(e) => setFormData({ ...formData, currentMilestone: e.target.value })}
                  placeholder="Milestone 1: ..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 uppercase">Staging URL (Optional)</label>
                <input
                  type="url"
                  value={formData.stagingUrl}
                  onChange={(e) => setFormData({ ...formData, stagingUrl: e.target.value })}
                  placeholder="https://staging.project.cyberstyle.net"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/80"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {editingProject ? 'Save Changes' : 'Initialize Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingProjectId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#07090E] border border-rose-500/30 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white font-mono">Delete Project?</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Are you sure you want to permanently delete this project? All attached milestones and records will be deleted.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setDeletingProjectId(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProject(deletingProjectId)}
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
