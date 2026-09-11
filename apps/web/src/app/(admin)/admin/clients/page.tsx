'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Search,
  Plus,
  ShieldCheck,
  FolderGit2,
  ArrowUpRight,
  Edit2,
  Trash2,
  MessageSquare,
  Globe,
  Briefcase
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

interface ClientOrganization {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  slaTier?: string;
  projects?: any[];
  users?: any[];
  createdAt: string;
}

export default function AdminClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeClient, setActiveClient] = useState<ClientOrganization | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    website: '',
    slaTier: 'ENTERPRISE',
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<ClientOrganization[]>('/admin/clients');
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setClients(res.data);
      } else {
        // Sample organizations for demo mode
        setClients([
          {
            id: 'org_acme',
            name: 'Acme Global Corp',
            industry: 'Enterprise Software & Cloud',
            website: 'acmeglobal.com',
            slaTier: 'ENTERPRISE',
            projects: [{ id: 'p1' }, { id: 'p2' }],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'org_vortex',
            name: 'Vortex AI Trading',
            industry: 'Algorithmic Financial Markets',
            website: 'vortex-quant.io',
            slaTier: 'ENTERPRISE',
            projects: [{ id: 'p3' }],
            createdAt: new Date().toISOString(),
          },
          {
            id: 'org_nexus',
            name: 'Nexus Health',
            industry: 'Digital Health & Telemetry',
            website: 'nexus-health.org',
            slaTier: 'PREMIUM',
            projects: [{ id: 'p4' }],
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      // Fallback sample data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiRequest<ClientOrganization>('/admin/clients', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      const newOrg: ClientOrganization = (res.success && res.data) ? res.data : {
        ...formData,
        id: `org_${Date.now()}`,
        projects: [],
        createdAt: new Date().toISOString(),
      };

      setClients((prev) => [newOrg, ...prev]);
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient) return;

    try {
      const res = await apiRequest<ClientOrganization>(`/admin/clients/${activeClient.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      const updated = (res.success && res.data) ? res.data : { ...activeClient, ...formData };
      setClients((prev) => prev.map((c) => (c.id === activeClient.id ? updated : c)));
      setShowEditModal(false);
      setActiveClient(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async () => {
    if (!activeClient) return;

    try {
      await apiRequest(`/admin/clients/${activeClient.id}`, { method: 'DELETE' });
      setClients((prev) => prev.filter((c) => c.id !== activeClient.id));
      setShowDeleteModal(false);
      setActiveClient(null);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      website: '',
      slaTier: 'ENTERPRISE',
    });
  };

  const openEdit = (client: ClientOrganization) => {
    setActiveClient(client);
    setFormData({
      name: client.name,
      industry: client.industry || '',
      website: client.website || '',
      slaTier: client.slaTier || 'ENTERPRISE',
    });
    setShowEditModal(true);
  };

  const handleOpenMessages = async (client: ClientOrganization) => {
    try {
      const res = await apiRequest<{ id: string }>('/messaging/threads', {
        method: 'POST',
        body: JSON.stringify({
          title: `Account & Retainer Channel – ${client.name}`,
          contextType: 'GENERAL',
          organizationId: client.id,
          initialMessage: `Channel opened for ${client.name} (SLA Tier: ${client.slaTier || 'ENTERPRISE'}).`,
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

  const filtered = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ORGANIZATIONS
            </span>
            <span className="text-[11px] font-mono text-zinc-500">CLIENT ENCLAVES & SLAS</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Client Organizations</h1>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-3.5 py-2 rounded-lg bg-[#00F0FF] hover:bg-[#00D8E6] text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Client Org</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search client organizations..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#00F0FF]"
        />
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Organization</th>
              <th className="p-4">Industry / Domain</th>
              <th className="p-4">SLA Tier</th>
              <th className="p-4">Active Builds</th>
              <th className="p-4">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {filtered.length > 0 ? (
              filtered.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-800/20">
                  <td className="p-4">
                    <div className="font-semibold text-zinc-100 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      <span>{client.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-300">{client.industry || 'Technology & AI'}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{client.website || 'client-portal.io'}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {client.slaTier || 'ENTERPRISE'}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-zinc-300">
                    {client.projects?.length ?? 1} Builds
                  </td>
                  <td className="p-4 text-zinc-500 font-mono text-[11px]">
                    {new Date(client.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenMessages(client)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/30 transition-colors"
                        title="Open Messages Channel"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEdit(client)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
                        title="Edit Organization"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setActiveClient(client);
                          setShowDeleteModal(true);
                        }}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                        title="Delete Organization"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500 text-xs">
                  {loading ? 'Querying organizations...' : 'No client organizations found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#00F0FF]" />
              Create Client Organization
            </h2>
            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Apex Fintech Labs"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    placeholder="e.g. FinTech / AI"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="e.g. apexfintech.com"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">SLA Tier</label>
                <select
                  value={formData.slaTier}
                  onChange={(e) => setFormData({ ...formData, slaTier: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                >
                  <option value="STANDARD">STANDARD (SLA: &lt; 24 hrs)</option>
                  <option value="PREMIUM">PREMIUM (SLA: &lt; 4 hrs)</option>
                  <option value="ENTERPRISE">ENTERPRISE (SLA: &lt; 15 mins / 24/7)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#00F0FF] text-black font-semibold hover:bg-[#00D8E6]"
                >
                  Create Organization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && activeClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-[#00F0FF]" />
              Edit Client Organization
            </h2>
            <form onSubmit={handleEditClient} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Industry</label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Website</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">SLA Tier</label>
                <select
                  value={formData.slaTier}
                  onChange={(e) => setFormData({ ...formData, slaTier: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#00F0FF] font-mono"
                >
                  <option value="STANDARD">STANDARD (SLA: &lt; 24 hrs)</option>
                  <option value="PREMIUM">PREMIUM (SLA: &lt; 4 hrs)</option>
                  <option value="ENTERPRISE">ENTERPRISE (SLA: &lt; 15 mins / 24/7)</option>
                </select>
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
      {showDeleteModal && activeClient && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              Delete Organization
            </h2>
            <p className="text-xs text-zinc-400">
              Are you sure you want to permanently delete <strong className="text-white">{activeClient.name}</strong>? All associated telemetry and project records will be detached.
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
                onClick={handleDeleteClient}
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
