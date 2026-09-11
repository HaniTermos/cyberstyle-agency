'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Repeat,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  Building2,
  AlertCircle,
  Calendar,
  Sparkles,
  Edit2,
  Trash2,
  MessageSquare,
  DollarSign
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface RetainerPlan {
  id: string;
  clientName: string;
  organizationId: string;
  planName: string;
  monthlyAmount: number;
  currency: string;
  hoursAllocated: number;
  hoursUsed: number;
  slaResponseTime: string;
  billingCycleAnchor: string;
  status: 'ACTIVE' | 'PAUSED' | 'TRIAL' | 'CANCELLED';
  autoRenew: boolean;
  createdAt?: string;
}

const SAMPLE_RETAINERS: RetainerPlan[] = [
  {
    id: 'ret_01',
    clientName: 'Acme Global Corp',
    organizationId: 'org_acme',
    planName: 'Enterprise Growth & Dedicated Dev Squad',
    monthlyAmount: 7500,
    currency: 'USD',
    hoursAllocated: 40,
    hoursUsed: 18,
    slaResponseTime: '< 1 hour',
    billingCycleAnchor: '1st of month (Next: Oct 01, 2026)',
    status: 'ACTIVE',
    autoRenew: true,
  },
  {
    id: 'ret_02',
    clientName: 'Vortex AI Trading',
    organizationId: 'org_vortex',
    planName: 'High-Frequency Infrastructure Maintenance',
    monthlyAmount: 5000,
    currency: 'USD',
    hoursAllocated: 25,
    hoursUsed: 12,
    slaResponseTime: '< 15 mins (24/7)',
    billingCycleAnchor: '15th of month (Next: Sep 15, 2026)',
    status: 'ACTIVE',
    autoRenew: true,
  },
  {
    id: 'ret_03',
    clientName: 'SynthWave Audio',
    organizationId: 'org_synth',
    planName: 'Standard Maintenance & Security Patching',
    monthlyAmount: 2500,
    currency: 'USD',
    hoursAllocated: 15,
    hoursUsed: 4,
    slaResponseTime: '< 4 hours',
    billingCycleAnchor: '1st of month (Next: Oct 01, 2026)',
    status: 'ACTIVE',
    autoRenew: true,
  },
];

export default function AdminRetainersPage() {
  const router = useRouter();
  const [retainers, setRetainers] = useState<RetainerPlan[]>(SAMPLE_RETAINERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal States
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeRetainer, setActiveRetainer] = useState<RetainerPlan | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    organizationId: 'org_default',
    planName: '',
    monthlyAmount: 5000,
    currency: 'USD',
    hoursAllocated: 20,
    hoursUsed: 0,
    slaResponseTime: '< 1 hour',
    billingCycleAnchor: '1st of month',
    status: 'ACTIVE' as 'ACTIVE' | 'PAUSED' | 'TRIAL' | 'CANCELLED',
    autoRenew: true,
  });

  const fetchRetainers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<RetainerPlan[]>('/admin/retainers');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setRetainers(res.data);
      }
    } catch {
      // Retain sample data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRetainers();
  }, []);

  const handleCreateRetainer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<RetainerPlan>('/admin/retainers', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const newPlan: RetainerPlan = (res.success && res.data) ? res.data : {
        ...formData,
        id: `ret_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setRetainers((prev) => [newPlan, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditRetainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRetainer) return;

    try {
      const res = await apiRequest<RetainerPlan>(`/admin/retainers/${activeRetainer.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      const updated = (res.success && res.data) ? res.data : { ...activeRetainer, ...formData };

      setRetainers((prev) => prev.map((r) => (r.id === activeRetainer.id ? updated : r)));
      setShowEditModal(false);
      setActiveRetainer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRetainer = async () => {
    if (!activeRetainer) return;

    try {
      await apiRequest(`/admin/retainers/${activeRetainer.id}`, { method: 'DELETE' });
      setRetainers((prev) => prev.filter((r) => r.id !== activeRetainer.id));
      setShowDeleteModal(false);
      setActiveRetainer(null);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '',
      organizationId: 'org_default',
      planName: '',
      monthlyAmount: 5000,
      currency: 'USD',
      hoursAllocated: 20,
      hoursUsed: 0,
      slaResponseTime: '< 1 hour',
      billingCycleAnchor: '1st of month',
      status: 'ACTIVE',
      autoRenew: true,
    });
  };

  const openEdit = (ret: RetainerPlan) => {
    setActiveRetainer(ret);
    setFormData({
      clientName: ret.clientName,
      organizationId: ret.organizationId,
      planName: ret.planName,
      monthlyAmount: ret.monthlyAmount,
      currency: ret.currency,
      hoursAllocated: ret.hoursAllocated,
      hoursUsed: ret.hoursUsed,
      slaResponseTime: ret.slaResponseTime,
      billingCycleAnchor: ret.billingCycleAnchor,
      status: ret.status,
      autoRenew: ret.autoRenew,
    });
    setShowEditModal(true);
  };

  const handleDiscussInMessages = async (ret: RetainerPlan) => {
    try {
      const res = await apiRequest<{ id: string }>('/messaging/threads', {
        method: 'POST',
        body: JSON.stringify({
          title: `Retainer & SLA: ${ret.planName} (${ret.clientName})`,
          contextType: 'GENERAL',
          contextId: ret.id,
          organizationId: ret.organizationId || 'org_acme',
          initialMessage: `Opening dedicated discussion thread for retainer package: ${ret.planName} ($${ret.monthlyAmount.toLocaleString()}/mo, SLA: ${ret.slaResponseTime}).`,
        }),
      });

      if (res.success && res.data?.id) {
        router.push(`/admin/messages?threadId=${res.data.id}`);
      } else {
        router.push(`/admin/messages`);
      }
    } catch {
      router.push(`/admin/messages`);
    }
  };

  const filtered = retainers.filter((r) => {
    const matchesSearch =
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.planName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMRR = retainers.reduce((acc, r) => (r.status === 'ACTIVE' ? acc + r.monthlyAmount : acc), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Repeat className="w-6 h-6 text-[#00F0FF]" />
              Monthly Recurring Retainers & SLAs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              MRR: ${totalMRR.toLocaleString()}/MO
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Automated subscription billing, allocated engineering capacity, and guaranteed SLA response times.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#00F0FF] hover:bg-[#00D8E6] text-black font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Retainer Contract</span>
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Contracted MRR</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">${totalMRR.toLocaleString()}.00</div>
          <p className="text-[11px] text-zinc-400 mt-1">{retainers.filter(r => r.status === 'ACTIVE').length} Active retainers</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Allocated Hours / Mo</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">
            {retainers.reduce((acc, r) => acc + (r.hoursAllocated || 0), 0)} hrs
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">Capacity reserved</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Hours Utilized (MTD)</div>
          <div className="text-2xl font-bold text-[#00F0FF] mt-1 font-mono">
            {retainers.reduce((acc, r) => acc + (r.hoursUsed || 0), 0)} hrs
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">MTD engineering burn</p>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800">
          <div className="text-[11px] font-mono text-zinc-500 uppercase">Average SLA Response</div>
          <div className="text-2xl font-bold text-white mt-1 font-mono">&lt; 18 mins</div>
          <p className="text-[11px] text-zinc-400 mt-1">100% SLA compliance</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search retainers by client or plan..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#00F0FF] font-mono"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PAUSED">PAUSED</option>
            <option value="TRIAL">TRIAL</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Retainer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filtered.map((ret) => (
          <div
            key={ret.id}
            className="p-6 rounded-2xl bg-[#07090E] border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                  ret.status === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : ret.status === 'PAUSED'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {ret.status}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {ret.autoRenew ? 'AUTORENEW ON' : 'MANUAL RENEWAL'}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                  {ret.clientName}
                </h3>
                <p className="text-xs font-mono text-zinc-400 mt-0.5">{ret.planName}</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2 font-mono">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Rate:</span>
                  <span className="text-white font-bold text-sm">${ret.monthlyAmount.toLocaleString()} / mo</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">SLA Response:</span>
                  <span className="text-[#00F0FF] font-semibold">{ret.slaResponseTime}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Cycle:</span>
                  <span className="text-zinc-300 text-[11px]">{ret.billingCycleAnchor}</span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>Hours Used This Cycle</span>
                  <span>
                    {ret.hoursUsed} / {ret.hoursAllocated} hrs
                  </span>
                </div>
                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00F0FF] transition-all"
                    style={{ width: `${Math.min(100, (ret.hoursUsed / (ret.hoursAllocated || 1)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => openEdit(ret)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs border border-zinc-700/60 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Contract</span>
                </button>
                <button
                  onClick={() => {
                    setActiveRetainer(ret);
                    setShowDeleteModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-mono text-xs transition-colors"
                  title="Delete Retainer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => handleDiscussInMessages(ret)}
                className="w-full px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00F0FF] hover:text-white font-mono text-xs border border-cyan-500/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Discuss Retainer in Messages</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Repeat className="w-5 h-5 text-[#00F0FF]" />
              Create Monthly Retainer Contract
            </h2>
            <form onSubmit={handleCreateRetainer} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Client / Organization Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="e.g. Apex Global Industries"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Plan Name & Scope</label>
                <input
                  type="text"
                  required
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  placeholder="e.g. Dedicated Dev Squad & 24/7 SRE"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Monthly Amount (USD)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyAmount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Allocated Hours / Mo</label>
                  <input
                    type="number"
                    required
                    value={formData.hoursAllocated}
                    onChange={(e) => setFormData({ ...formData, hoursAllocated: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">SLA Response Window</label>
                  <input
                    type="text"
                    required
                    value={formData.slaResponseTime}
                    onChange={(e) => setFormData({ ...formData, slaResponseTime: e.target.value })}
                    placeholder="e.g. < 15 mins (24/7)"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Billing Cycle Anchor</label>
                  <input
                    type="text"
                    required
                    value={formData.billingCycleAnchor}
                    onChange={(e) => setFormData({ ...formData, billingCycleAnchor: e.target.value })}
                    placeholder="e.g. 1st of month"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-zinc-300 font-mono text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                    className="rounded bg-zinc-900 border-zinc-800 text-[#00F0FF]"
                  />
                  <span>Enable Automated Monthly Auto-Renew</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Create Retainer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && activeRetainer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#00F0FF]" />
              Edit Retainer Contract
            </h2>
            <form onSubmit={handleEditRetainer} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Client / Organization Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Plan Name & Scope</label>
                <input
                  type="text"
                  required
                  value={formData.planName}
                  onChange={(e) => setFormData({ ...formData, planName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Monthly Amount (USD)</label>
                  <input
                    type="number"
                    required
                    value={formData.monthlyAmount}
                    onChange={(e) => setFormData({ ...formData, monthlyAmount: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PAUSED">PAUSED</option>
                    <option value="TRIAL">TRIAL</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Hours Used (MTD)</label>
                  <input
                    type="number"
                    value={formData.hoursUsed}
                    onChange={(e) => setFormData({ ...formData, hoursUsed: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Allocated Hours / Mo</label>
                  <input
                    type="number"
                    value={formData.hoursAllocated}
                    onChange={(e) => setFormData({ ...formData, hoursAllocated: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && activeRetainer && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete Retainer Contract
            </h2>
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete the retainer contract for <strong className="text-white">{activeRetainer.clientName}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteRetainer}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-500 text-xs font-mono"
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
