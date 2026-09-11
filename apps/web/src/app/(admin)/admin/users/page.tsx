'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, Plus, ShieldCheck, Key, Lock, RotateCcw, AlertCircle } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'ADMIN',
  });

  const fetchUsers = async () => {
    setLoading(true);
    const res = await apiRequest('/admin/users');
    if (res.success && res.data) {
      setUsers(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleReset2FA = async (userId: string) => {
    if (!confirm('Are you sure you want to reset 2FA for this administrator? They will be forced to re-enroll on next login.')) return;
    const res = await apiRequest(`/admin/users/${userId}/reset-2fa`, {
      method: 'POST',
    });
    if (res.success) {
      alert('2FA secret successfully reset and logged in audit trail.');
      fetchUsers();
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiRequest('/admin/users/invite', {
      method: 'POST',
      body: JSON.stringify(inviteForm),
    });
    if (res.success) {
      setShowInviteModal(false);
      setInviteForm({ email: '', role: 'ADMIN' });
      alert('Administrator invite dispatched via SMTP!');
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ACCESS CONTROL
            </span>
            <span className="text-[11px] font-mono text-zinc-500">ROLE-BASED PERMISSIONS & 2FA</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin & Team Management</h1>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Admin</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-mono uppercase text-[11px]">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">2FA Status</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 font-sans">
            {(users.length > 0 ? users : [
              { id: '1', email: 'admin@cyberstyle.net', role: 'SUPER_ADMIN', twoFactorEnabled: true, status: 'ACTIVE' },
              { id: '2', email: 'lead-dev@cyberstyle.net', role: 'ADMIN', twoFactorEnabled: true, status: 'ACTIVE' },
            ]).map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800/20">
                <td className="p-4">
                  <div className="font-semibold text-zinc-100 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-cyan-400" />
                    <span>{u.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    u.role === 'SUPER_ADMIN'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border flex items-center gap-1 w-fit ${
                    u.twoFactorEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{u.twoFactorEnabled ? 'ENFORCED' : 'PENDING ENROLLMENT'}</span>
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {u.status || 'ACTIVE'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleReset2FA(u.id)}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors inline-flex items-center gap-1"
                    title="Reset 2FA Secret"
                  >
                    <RotateCcw className="w-3 h-3 text-amber-400" />
                    <span>Reset 2FA</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-bold text-white">Invite Team Member</h2>
            <form onSubmit={handleInvite} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Role</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="ADMIN">ADMIN (Full Management)</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN (Enclave Owner)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
