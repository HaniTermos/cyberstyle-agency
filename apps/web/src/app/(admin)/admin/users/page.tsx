'use client';

import React, { useEffect, useState } from 'react';
import {
  UserCheck,
  Plus,
  ShieldCheck,
  Key,
  Lock,
  RotateCcw,
  AlertCircle,
  Building2,
  Users,
  Copy,
  Check,
  X,
  Mail,
  RefreshCw
} from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ADMINS' | 'CLIENTS'>('ADMINS');

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'ADMIN',
    organizationName: '',
    department: 'Operations',
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; tempPassword?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await apiRequest('/admin/users');
    if (res.success && res.data) {
      setUsers(res.data);
    }
    const clientRes = await apiRequest('/admin/clients');
    if (clientRes.success && clientRes.data) {
      setClients(clientRes.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleReset2FA = async (userId: string, email: string) => {
    if (!confirm(`Reset 2FA for ${email}? They will be prompted to re-enroll on next authentication.`)) return;
    const res = await apiRequest(`/admin/users/${userId}/reset-2fa`, {
      method: 'POST',
    });
    if (res.success) {
      alert(`2FA reset successfully for ${email}.`);
      fetchUsers();
    } else {
      alert(res.error || 'Failed to reset 2FA');
    }
  };

  const handleForcePasswordReset = async (userId: string, email: string) => {
    if (!confirm(`Issue a new temporary password and email credentials to ${email}?`)) return;
    const res = await apiRequest(`/admin/users/${userId}/reset-password`, {
      method: 'POST',
    });
    if (res.success && res.data) {
      setCreatedCredentials({
        email,
        tempPassword: res.data.tempPassword,
      });
      fetchUsers();
    } else {
      alert(res.error || 'Failed to reset password');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError(null);

    const res = await apiRequest('/admin/users/invite', {
      method: 'POST',
      body: JSON.stringify(inviteForm),
    });

    setInviteLoading(false);
    if (res.success && res.data) {
      setCreatedCredentials({
        email: res.data.email,
        tempPassword: res.data.tempPassword,
      });
      setInviteForm({
        email: '',
        name: '',
        role: activeTab === 'CLIENTS' ? 'CLIENT' : 'ADMIN',
        organizationName: '',
        department: 'Operations',
      });
      fetchUsers();
    } else {
      setInviteError(res.error || 'Failed to send invitation.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (activeTab === 'ADMINS') {
      return u.role === 'ADMIN' || u.role === 'SUPER_ADMIN';
    }
    return u.role === 'CLIENT';
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ACCESS CONTROL
            </span>
            <span className="text-[11px] font-mono text-zinc-500">ROLE-BASED PERMISSIONS & ENCLAVES</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Identity & User Management</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => {
              setInviteForm({
                email: '',
                name: '',
                role: activeTab === 'CLIENTS' ? 'CLIENT' : 'ADMIN',
                organizationName: '',
                department: 'Operations',
              });
              setInviteError(null);
              setShowInviteModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'CLIENTS' ? 'Invite Client' : 'Invite Admin'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80">
        <button
          onClick={() => setActiveTab('ADMINS')}
          className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'ADMINS'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Team Administrators ({users.filter((u) => u.role !== 'CLIENT').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CLIENTS')}
          className={`px-4 py-2.5 text-xs font-mono font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'CLIENTS'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Client Portal Users ({users.filter((u) => u.role === 'CLIENT').length})</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-zinc-800 bg-[#0C0E17]/80 overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080A10] border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">Identity / Name</th>
              <th className="p-4">{activeTab === 'CLIENTS' ? 'Organization' : 'Department'}</th>
              <th className="p-4">Role</th>
              <th className="p-4">2FA Enclave</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500 font-mono text-xs">
                  {loading ? 'Retrieving user directory from database...' : `No ${activeTab.toLowerCase()} registered yet.`}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-zinc-100 flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span>{u.name || u.email.split('@')[0]}</span>
                        <p className="text-[11px] text-zinc-400 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    {activeTab === 'CLIENTS' ? (
                      <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                        {u.clientProfile?.organization?.name || 'Assigned Workspace'}
                      </span>
                    ) : (
                      <span className="text-zinc-400 font-mono text-[11px]">
                        {u.adminProfile?.department || 'Operations Command'}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : u.role === 'ADMIN'
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 w-fit ${
                        u.twoFactorEnabled
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>{u.twoFactorEnabled ? 'ENFORCED' : 'PENDING'}</span>
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleReset2FA(u.id, u.email)}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-mono transition-colors inline-flex items-center gap-1 border border-zinc-800"
                        title="Reset 2FA Secret"
                      >
                        <RotateCcw className="w-3 h-3 text-amber-400" />
                        <span>Reset 2FA</span>
                      </button>

                      <button
                        onClick={() => handleForcePasswordReset(u.id, u.email)}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 text-xs font-mono transition-colors inline-flex items-center gap-1 border border-cyan-500/30"
                        title="Generate Temporary Password"
                      >
                        <Key className="w-3 h-3 text-cyan-400" />
                        <span>Issue Temp Pass</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0E17] border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-[0_0_40px_rgba(0,240,255,0.15)] relative">
            <button
              onClick={() => setShowInviteModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PROVISION ACCESS
              </span>
              <h2 className="text-base font-bold text-white mt-1">
                {inviteForm.role === 'CLIENT' ? 'Invite Client to Portal' : 'Invite Team Administrator'}
              </h2>
            </div>

            {inviteError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{inviteError}</span>
              </div>
            )}

            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Work Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="user@organization.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Marcus Vance"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="CLIENT">CLIENT (Portal Access Only)</option>
                  <option value="ADMIN">ADMIN (Full Management)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Enclave Owner)</option>
                </select>
              </div>

              {inviteForm.role === 'CLIENT' ? (
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Client Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Fintech Corp"
                    value={inviteForm.organizationName}
                    onChange={(e) => setInviteForm({ ...inviteForm, organizationName: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Web Architecture, DevOps"
                    value={inviteForm.department}
                    onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white font-mono text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviteLoading}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 text-xs shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  {inviteLoading ? 'Dispatching...' : 'Dispatch Invitation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Popup / Success Alert */}
      {createdCredentials && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0C0E17] border border-cyan-500/40 rounded-2xl p-6 space-y-4 shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PROVISIONED
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Credentials Dispatched via SMTP</h3>
            <p className="text-xs text-zinc-400">
              An invitation email has been sent to <strong>{createdCredentials.email}</strong>. You may also provide these temporary credentials directly:
            </p>

            <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">TEMPORARY PASSWORD</span>
                <span className="text-cyan-400 font-bold tracking-wider">{createdCredentials.tempPassword}</span>
              </div>
              <button
                onClick={() => {
                  if (createdCredentials.tempPassword) {
                    navigator.clipboard.writeText(createdCredentials.tempPassword);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }
                }}
                className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 transition-colors"
                title="Copy Password"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={() => setCreatedCredentials(null)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 text-black font-semibold text-xs hover:bg-cyan-400"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
