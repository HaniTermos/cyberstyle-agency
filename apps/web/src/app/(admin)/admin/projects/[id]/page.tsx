'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Flag,
  CheckCircle2,
  Clock,
  ExternalLink,
  Plus,
  Building2,
  ArrowLeft,
  ShieldCheck,
  Search,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  MessageSquare,
  DollarSign,
  Calendar,
  Layers,
  Activity,
  UserCheck,
  Radio,
  Eye,
  EyeOff,
  ChevronRight,
  RefreshCw,
  Send,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface TaskItem {
  id: string;
  projectId: string;
  milestoneId?: string | null;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'WAITING_ON_CLIENT' | 'DONE';
  assigneeId?: string | null;
  assignee?: { id: string; name?: string; email: string } | null;
  milestone?: { id: string; title: string } | null;
  dueDate?: string | null;
  isClientVisible: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface MilestoneItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  amount?: number | null;
  orderIndex: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'PENDING_APPROVAL' | 'COMPLETED';
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  invoiceId?: string | null;
  requestedApprovalAt?: string | null;
  approvedAt?: string | null;
  dueDate?: string | null;
}

interface HealthFactor {
  factor: string;
  deduction: number;
  reason: string;
  entityId?: string;
}

interface HealthLog {
  id: string;
  score: number;
  band: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
  factors: HealthFactor[];
  recordedAt: string;
}

interface ProjectDetail {
  id: string;
  name: string;
  slug: string;
  organizationId: string;
  organization?: { id: string; name: string; slaTier?: string };
  status: 'DISCOVERY' | 'DESIGN' | 'DEVELOPMENT' | 'REVIEW' | 'LAUNCHED' | 'MAINTENANCE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';
  description?: string;
  budget?: number;
  healthScore: number;
  healthBand: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
  healthFactors?: HealthFactor[];
  stagingUrl?: string;
  productionUrl?: string;
  startDate?: string;
  targetLaunchDate?: string;
  milestones: MilestoneItem[];
  tasks: TaskItem[];
  healthLogs?: HealthLog[];
  invoices?: any[];
}

export default function AdminProjectCockpitPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const router = useRouter();

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'KANBAN' | 'MILESTONES' | 'HEALTH_TELEMETRY' | 'INVOICES'>('KANBAN');
  const [recalculatingHealth, setRecalculatingHealth] = useState(false);

  // Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    milestoneId: '',
    status: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'WAITING_ON_CLIENT' | 'DONE',
    assigneeName: '',
    dueDate: '',
    isClientVisible: false,
  });

  // Milestone Modal State
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    amount: 5000,
    dueDate: '',
  });

  const fetchProjectData = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ project: ProjectDetail }>(`/admin/projects/${projectId}`);
      if (res.success && res.data?.project) {
        setProject(res.data.project);
      } else {
        // Fallback local mock for seamless preview
        setProject({
          id: projectId,
          name: 'Acme SaaS Cloud Modernization',
          slug: 'acme-saas-modernization',
          organizationId: 'org_acme',
          organization: { id: 'org_acme', name: 'Acme Global Corp', slaTier: 'ENTERPRISE' },
          status: 'DEVELOPMENT',
          budget: 35000,
          healthScore: 90,
          healthBand: 'HEALTHY',
          healthFactors: [
            { factor: 'MILESTONE_IN_FLIGHT', deduction: 10, reason: 'Sprint 3 verification in progress' }
          ],
          stagingUrl: 'https://staging.acme.cyberstyle.net',
          description: 'Enterprise multi-tenant cloud modernizing with Argon2id + TOTP and real-time live messaging mesh.',
          startDate: '2026-08-01',
          targetLaunchDate: '2026-10-30',
          milestones: [
            {
              id: 'm1',
              projectId,
              title: 'Phase 1: Architecture Blueprint & Threat Model',
              amount: 8000,
              orderIndex: 0,
              status: 'COMPLETED',
              paymentStatus: 'PAID',
              approvedAt: '2026-08-15',
            },
            {
              id: 'm2',
              projectId,
              title: 'Phase 2: Billing Engine & Escrow Verification',
              amount: 10000,
              orderIndex: 1,
              status: 'COMPLETED',
              paymentStatus: 'PAID',
              approvedAt: '2026-09-01',
            },
            {
              id: 'm3',
              projectId,
              title: 'Phase 3: Realtime Messaging Enclave & Thread Locks',
              amount: 10000,
              orderIndex: 2,
              status: 'PENDING_APPROVAL',
              paymentStatus: 'PARTIALLY_PAID',
              requestedApprovalAt: '2026-09-08',
              dueDate: '2026-09-15',
            },
            {
              id: 'm4',
              projectId,
              title: 'Phase 4: SRE Telemetry & Final Production Cutover',
              amount: 7000,
              orderIndex: 3,
              status: 'NOT_STARTED',
              paymentStatus: 'UNPAID',
              dueDate: '2026-10-30',
            },
          ],
          tasks: [
            {
              id: 't1',
              projectId,
              title: 'Verify WebSocket sliding-window rate limits (60/min)',
              status: 'DONE',
              isClientVisible: true,
              orderIndex: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 't2',
              projectId,
              title: 'Setup PostgreSQL dual-write shadow replay pipeline',
              status: 'IN_PROGRESS',
              isClientVisible: false,
              orderIndex: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 't3',
              projectId,
              title: 'Client review: Staging auth credentials verification',
              status: 'WAITING_ON_CLIENT',
              isClientVisible: true,
              orderIndex: 2,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 't4',
              projectId,
              title: 'Load test Argon2id hashing under 500 concurrent logins',
              status: 'TODO',
              isClientVisible: false,
              orderIndex: 3,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          healthLogs: [
            {
              id: 'hl1',
              score: 90,
              band: 'HEALTHY',
              factors: [{ factor: 'MILESTONE_IN_FLIGHT', deduction: 10, reason: 'Sprint 3 verification in progress' }],
              recordedAt: new Date().toISOString(),
            },
          ],
          invoices: [
            { id: 'inv_01', invoiceNumber: 'INV-2026-001', totalAmount: 18000, status: 'PAID', dueDate: '2026-09-01' },
            { id: 'inv_02', invoiceNumber: 'INV-2026-002', totalAmount: 10000, status: 'SENT', dueDate: '2026-09-30' },
          ],
        });
      }
    } catch {
      // Retain fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  // Recalculate Health
  const handleRecalculateHealth = async () => {
    setRecalculatingHealth(true);
    try {
      const res = await apiRequest<{ health: { score: number; band: any; factors: HealthFactor[] } }>(
        `/admin/projects/${projectId}/recalculate-health`,
        { method: 'POST' }
      );
      if (res.success && res.data?.health && project) {
        setProject({
          ...project,
          healthScore: res.data.health.score,
          healthBand: res.data.health.band,
          healthFactors: res.data.health.factors,
        });
      }
    } catch (err) {
      console.error('Failed to recalculate health:', err);
    } finally {
      setRecalculatingHealth(false);
    }
  };

  // Change Project Status
  const handleStatusChange = async (newStatus: any) => {
    if (!project) return;
    try {
      await apiRequest(`/admin/projects/${projectId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setProject({ ...project, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  // Task Actions
  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      if (editingTask) {
        const res = await apiRequest<{ task: TaskItem }>(`/admin/projects/${projectId}/tasks/${editingTask.id}`, {
          method: 'PATCH',
          body: JSON.stringify(taskForm),
        });
        const updated = res.data?.task || { ...editingTask, ...taskForm };
        setProject({
          ...project,
          tasks: project.tasks.map((t) => (t.id === editingTask.id ? (updated as any) : t)),
        });
      } else {
        const res = await apiRequest<{ task: TaskItem }>(`/admin/projects/${projectId}/tasks`, {
          method: 'POST',
          body: JSON.stringify(taskForm),
        });
        const created = res.data?.task || {
          id: `task_${Date.now()}`,
          projectId,
          ...taskForm,
          orderIndex: project.tasks.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setProject({
          ...project,
          tasks: [...project.tasks, created as any],
        });
      }
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: TaskItem['status']) => {
    if (!project) return;
    try {
      await apiRequest(`/admin/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setProject({
        ...project,
        tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!project) return;
    try {
      await apiRequest(`/admin/projects/${projectId}/tasks/${taskId}`, { method: 'DELETE' });
      setProject({
        ...project,
        tasks: project.tasks.filter((t) => t.id !== taskId),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Request Milestone Sign-off
  const handleRequestApproval = async (milestoneId: string) => {
    if (!project) return;
    try {
      const res = await apiRequest<{ milestone: MilestoneItem }>(`/admin/milestones/${milestoneId}/request-approval`, {
        method: 'POST',
      });
      if (res.success && res.data?.milestone) {
        setProject({
          ...project,
          milestones: project.milestones.map((m) =>
            m.id === milestoneId ? { ...m, status: 'PENDING_APPROVAL', requestedApprovalAt: new Date().toISOString() } : m
          ),
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Milestone
  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      const res = await apiRequest<{ milestone: MilestoneItem }>('/admin/milestones', {
        method: 'POST',
        body: JSON.stringify({
          projectId,
          title: milestoneForm.title,
          description: milestoneForm.description,
          amount: milestoneForm.amount,
          dueDate: milestoneForm.dueDate,
          orderIndex: project.milestones.length,
        }),
      });

      const newM = res.data?.milestone || {
        id: `m_${Date.now()}`,
        projectId,
        title: milestoneForm.title,
        description: milestoneForm.description,
        amount: milestoneForm.amount,
        orderIndex: project.milestones.length,
        status: 'NOT_STARTED',
        paymentStatus: 'UNPAID',
        dueDate: milestoneForm.dueDate,
      };

      setProject({
        ...project,
        milestones: [...project.milestones, newM as any],
      });
      setShowMilestoneModal(false);
      setMilestoneForm({ title: '', description: '', amount: 5000, dueDate: '' });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !project) {
    return (
      <div className="p-12 text-center text-zinc-500 font-mono text-xs">
        <div className="w-6 h-6 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Synchronizing Project Telemetry Cockpit...
      </div>
    );
  }

  const getHealthBadge = (band: string) => {
    switch (band) {
      case 'HEALTHY':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]';
      case 'AT_RISK':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_12px_rgba(239,68,68,0.2)]';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const tasksByStatus = {
    TODO: project.tasks.filter((t) => t.status === 'TODO'),
    IN_PROGRESS: project.tasks.filter((t) => t.status === 'IN_PROGRESS'),
    WAITING_ON_CLIENT: project.tasks.filter((t) => t.status === 'WAITING_ON_CLIENT'),
    DONE: project.tasks.filter((t) => t.status === 'DONE'),
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 pb-12">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Link href="/admin/projects" className="hover:text-white flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Projects</span>
          </Link>
          <span>/</span>
          <span className="text-[#00F0FF] font-semibold">{project.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/messages?contextType=PROJECT&contextId=${project.id}`}
            className="px-3 py-1.5 rounded-xl bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Open Channel</span>
          </Link>
          {project.stagingUrl && (
            <a
              href={project.stagingUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Staging Enclave</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Cockpit Hero Header */}
      <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#00F0FF]" />
              {project.name}
            </h1>
            <select
              value={project.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-xs font-mono font-semibold text-white rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#00F0FF]"
            >
              <option value="DISCOVERY">DISCOVERY</option>
              <option value="DESIGN">DESIGN</option>
              <option value="DEVELOPMENT">DEVELOPMENT</option>
              <option value="REVIEW">REVIEW</option>
              <option value="LAUNCHED">LAUNCHED</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          <p className="text-xs text-zinc-400 font-mono flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>{project.organization?.name || 'Client Enclave'}</span>
            <span className="text-zinc-600">•</span>
            <span>SLA Tier: {project.organization?.slaTier || 'ENTERPRISE'}</span>
            <span className="text-zinc-600">•</span>
            <span>Budget: ${Number(project.budget || 35000).toLocaleString()}</span>
          </p>
        </div>

        {/* Health Score Telemetry Display */}
        <div className="flex items-center gap-4 bg-zinc-950/80 p-4 rounded-xl border border-zinc-800">
          <div className="relative flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border-4 border-zinc-800 flex items-center justify-center font-mono font-bold text-lg text-white">
              {project.healthScore}
            </div>
            <div
              className={`absolute inset-0 rounded-full border-4 border-transparent ${
                project.healthBand === 'HEALTHY'
                  ? 'border-t-emerald-400 border-r-emerald-400'
                  : project.healthBand === 'AT_RISK'
                  ? 'border-t-amber-400 border-r-amber-400'
                  : 'border-t-red-400 border-r-red-400'
              }`}
            />
          </div>

          <div className="space-y-1 font-mono">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getHealthBadge(project.healthBand)}`}>
                {project.healthBand}
              </span>
              <button
                onClick={handleRecalculateHealth}
                disabled={recalculatingHealth}
                className="text-[10px] text-zinc-500 hover:text-white flex items-center gap-1 transition-colors"
                title="Recalculate Health Engine"
              >
                <RefreshCw className={`w-3 h-3 ${recalculatingHealth ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              {project.healthFactors?.length || 0} active telemetry deductions
            </p>
          </div>
        </div>
      </div>

      {/* Active Health Deduction Breakdown Tooltip Banner */}
      {project.healthFactors && project.healthFactors.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs font-mono flex items-start gap-3 text-amber-300">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <span className="font-bold uppercase text-[10px] text-amber-400">Deterministic Health Deductions:</span>
            <div className="flex flex-wrap gap-2 pt-1">
              {project.healthFactors.map((factor, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-zinc-900 border border-amber-500/30 text-[11px] text-zinc-300 flex items-center gap-1.5"
                >
                  <span className="text-amber-400 font-bold">-{factor.deduction} pts</span>
                  <span>{factor.reason}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cockpit Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-2">
          {[
            { id: 'KANBAN', label: 'Sprint Task Board', icon: Layers, count: project.tasks.length },
            { id: 'MILESTONES', label: 'Milestone Delivery Gates', icon: Flag, count: project.milestones.length },
            { id: 'HEALTH_TELEMETRY', label: 'Health Telemetry History', icon: Activity },
            { id: 'INVOICES', label: 'Linked Invoices & SOW', icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-mono font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? 'border-[#00F0FF] text-[#00F0FF] bg-[#00F0FF]/5'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300 font-bold">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === 'KANBAN' && (
          <button
            onClick={() => {
              setEditingTask(null);
              setTaskForm({
                title: '',
                description: '',
                milestoneId: project.milestones[0]?.id || '',
                status: 'TODO',
                assigneeName: '',
                dueDate: '',
                isClientVisible: false,
              });
              setShowTaskModal(true);
            }}
            className="px-3 py-1.5 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all mb-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sprint Task</span>
          </button>
        )}

        {activeTab === 'MILESTONES' && (
          <button
            onClick={() => setShowMilestoneModal(true)}
            className="px-3 py-1.5 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs font-mono rounded-xl flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] transition-all mb-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Milestone</span>
          </button>
        )}
      </div>

      {/* TAB 1: KANBAN SPRINT TASK BOARD */}
      {activeTab === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['TODO', 'IN_PROGRESS', 'WAITING_ON_CLIENT', 'DONE'] as const).map((colKey) => {
            const colTasks = tasksByStatus[colKey];
            const colTitles = {
              TODO: { label: 'To Do', color: 'text-zinc-400', border: 'border-zinc-800' },
              IN_PROGRESS: { label: 'In Progress', color: 'text-cyan-400', border: 'border-cyan-500/30' },
              WAITING_ON_CLIENT: { label: 'Waiting on Client', color: 'text-amber-400', border: 'border-amber-500/30' },
              DONE: { label: 'Completed', color: 'text-emerald-400', border: 'border-emerald-500/30' },
            };

            return (
              <div
                key={colKey}
                className="flex flex-col bg-[#07090E] border border-zinc-800/80 rounded-2xl overflow-hidden min-h-[500px]"
              >
                <div className={`p-3.5 border-b ${colTitles[colKey].border} bg-zinc-950/60 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${colTitles[colKey].color}`}>
                      {colTitles[colKey].label}
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="p-3 flex-1 overflow-y-auto space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="p-6 text-center text-zinc-600 font-mono text-xs">
                      No tasks in this lane
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-2.5 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-white group-hover:text-[#00F0FF] transition-colors leading-relaxed">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => {
                                setEditingTask(task);
                                setTaskForm({
                                  title: task.title,
                                  description: task.description || '',
                                  milestoneId: task.milestoneId || '',
                                  status: task.status,
                                  assigneeName: task.assignee?.name || '',
                                  dueDate: task.dueDate ? (task.dueDate.split('T')[0] || '') : '',
                                  isClientVisible: task.isClientVisible,
                                });
                                setShowTaskModal(true);
                              }}
                              className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-1 rounded bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-2 leading-normal">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60 text-[10px] font-mono">
                          <span className="flex items-center gap-1 text-zinc-500">
                            {task.isClientVisible ? (
                              <span className="text-emerald-400 flex items-center gap-0.5" title="Visible to Client">
                                <Eye className="w-3 h-3" /> Client
                              </span>
                            ) : (
                              <span className="text-zinc-600 flex items-center gap-0.5" title="Internal Only">
                                <EyeOff className="w-3 h-3" /> Internal
                              </span>
                            )}
                          </span>

                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as any)}
                            className="bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-300 rounded px-1.5 py-0.5 focus:outline-none"
                          >
                            <option value="TODO">TODO</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="WAITING_ON_CLIENT">WAITING_ON_CLIENT</option>
                            <option value="DONE">DONE</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: MILESTONES & DELIVERY GATES */}
      {activeTab === 'MILESTONES' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-[#07090E] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[10px]">
                <tr>
                  <th className="p-4">Milestone</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment Gate</th>
                  <th className="p-4 text-right">Sign-Off Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {project.milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-900/30">
                    <td className="p-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <Flag className="w-3.5 h-3.5 text-[#00F0FF]" />
                        <span>{m.title}</span>
                      </div>
                      {m.description && <p className="text-[11px] text-zinc-400 mt-0.5">{m.description}</p>}
                    </td>
                    <td className="p-4 font-mono text-zinc-200">
                      ${m.amount ? Number(m.amount).toLocaleString() : '—'}
                    </td>
                    <td className="p-4 font-mono text-zinc-400 text-[11px]">
                      {m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'Target Sprint'}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                          m.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'PENDING_APPROVAL'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] ${
                          m.paymentStatus === 'PAID'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {m.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {m.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleRequestApproval(m.id)}
                          className="px-3 py-1 rounded-lg bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/30 text-[11px] font-mono transition-colors"
                        >
                          Request Sign-Off
                        </button>
                      )}
                      {m.status === 'COMPLETED' && (
                        <span className="text-[11px] font-mono text-emerald-400 flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accepted
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: HEALTH TELEMETRY HISTORY */}
      {activeTab === 'HEALTH_TELEMETRY' && (
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00F0FF]" />
              Telemetry Snapshots & Historical Audit Logs
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {(project.healthLogs || []).map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getHealthBadge(log.band)}`}>
                        {log.band} ({log.score}/100)
                      </span>
                      <span className="text-zinc-500 text-[11px]">
                        {new Date(log.recordedAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-[11px]">
                      {log.factors?.map((f) => f.reason).join(' • ') || 'Deterministic score verified.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INVOICES & FINANCIALS */}
      {activeTab === 'INVOICES' && (
        <div className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#00F0FF]" />
            Associated Project Invoices
          </h3>
          <div className="divide-y divide-zinc-800/60 font-mono text-xs">
            {(project.invoices || []).map((inv) => (
              <div key={inv.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{inv.invoiceNumber || inv.id}</div>
                  <div className="text-zinc-500 text-[11px]">Due: {inv.dueDate || 'Upon Receipt'}</div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-bold">${Number(inv.totalAmount).toLocaleString()}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#00F0FF]" />
              {editingTask ? 'Edit Sprint Task' : 'Add Sprint Task'}
            </h2>
            <form onSubmit={handleSaveTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Implement dual-write replication"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Description & Requirements</label>
                <textarea
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Details and technical criteria..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Initial Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="WAITING_ON_CLIENT">WAITING_ON_CLIENT</option>
                    <option value="DONE">DONE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Milestone Association</label>
                  <select
                    value={taskForm.milestoneId}
                    onChange={(e) => setTaskForm({ ...taskForm, milestoneId: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  >
                    <option value="">None / General Backlog</option>
                    {project.milestones.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-zinc-300 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={taskForm.isClientVisible}
                    onChange={(e) => setTaskForm({ ...taskForm, isClientVisible: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-[#00F0FF]"
                  />
                  <span>Make Task Visible to Client in Portal</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Flag className="w-5 h-5 text-[#00F0FF]" />
              Create Delivery Milestone
            </h2>
            <form onSubmit={handleCreateMilestone} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  placeholder="e.g. Phase 3: Staging Deployment & Acceptance"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Description</label>
                <textarea
                  rows={3}
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  placeholder="Deliverable acceptance criteria..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Amount (USD)</label>
                  <input
                    type="number"
                    value={milestoneForm.amount}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, amount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Due Date</label>
                  <input
                    type="date"
                    value={milestoneForm.dueDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, dueDate: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Create Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
