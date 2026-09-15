'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  User,
  Mail,
  Users,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
} from 'lucide-react';
import {
  DEMO_WORKSPACE_DATA,
  ClientRole,
} from '@/lib/constants/portal';

interface AuthorizedMember {
  id: string;
  name: string;
  email: string;
  role: ClientRole;
  lastActive: string;
}

const SAMPLE_MEMBERS: AuthorizedMember[] = [
  {
    id: 'mem-1',
    name: 'Demo Client',
    email: 'demo@cyberstyle.example',
    role: 'Client Owner',
    lastActive: 'Today, 09:15 UTC',
  },
  {
    id: 'mem-2',
    name: 'Billing Contact',
    email: 'billing@samplebusiness.example',
    role: 'Client Billing Contact',
    lastActive: 'Yesterday',
  },
];

export default function PortalSettingsPage() {
  const [activeTab, setActiveTab] = useState<'account' | 'organization' | 'team'>('organization');
  const [members, setMembers] = useState<AuthorizedMember[]>(SAMPLE_MEMBERS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<ClientRole>('Client Project Contact');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const org = DEMO_WORKSPACE_DATA.organization;

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const newMember: AuthorizedMember = {
      id: `mem-${Date.now()}`,
      name: inviteEmail.split('@')[0] || 'Member',
      email: inviteEmail.trim(),
      role: inviteRole,
      lastActive: 'Invitation pending',
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-5xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-cyan-400" />
          Organization Settings
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Manage your organization details, project contacts, billing contact, and authorized portal users.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
        <button
          onClick={() => setActiveTab('organization')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'organization'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Organization Details
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'team'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Authorized Users ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            activeTab === 'account'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          My Account
        </button>
      </div>

      {/* 1. Organization Details */}
      {activeTab === 'organization' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-5">
            <h2 className="text-sm font-semibold text-white">Business Entity Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Legal Business Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={org.businessName}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Domain Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={org.domain}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Billing Email
                </label>
                <input
                  type="text"
                  readOnly
                  value={org.billingEmail}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">
                  Timezone
                </label>
                <input
                  type="text"
                  readOnly
                  value={org.timezone}
                  className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-900">
              <label className="block text-xs font-medium text-zinc-400 mb-1">
                Support & Communication Arrangement
              </label>
              <p className="text-xs text-zinc-300 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
                {org.supportArrangement}
              </p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="p-6 rounded-2xl bg-zinc-950 border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
              <h2 className="text-sm font-semibold text-rose-300">Workspace Management & Danger Zone</h2>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Ownership transfers, workspace archival, or data export requests require verified owner authorization and manual confirmation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => alert('Ownership transfer workflow initiated: Reauthentication required.')}
                className="px-3.5 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Transfer ownership
              </button>
              <button
                onClick={() => alert('Workspace closure request initiated: Subject to contractual data retention policies.')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-medium text-rose-400 transition-colors"
              >
                Request workspace deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Authorized Team Members */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Authorized portal users</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Team members with access to review items, invoices, or project files.
              </p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)] flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite user</span>
            </button>
          </div>

          <div className="divide-y divide-zinc-900 border-t border-zinc-900">
            {members.map((member) => (
              <div key={member.id} className="py-3.5 flex items-center justify-between text-xs">
                <div>
                  <p className="text-zinc-200 font-medium">{member.name}</p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    {member.email} • <span className="text-cyan-400">{member.role}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-zinc-500">{member.lastActive}</span>
                  {member.role !== 'Client Owner' && (
                    <button
                      onClick={() => setMembers(members.filter((m) => m.id !== member.id))}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Remove member access"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. My Account */}
      {activeTab === 'account' && (
        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4 max-w-xl">
          <h2 className="text-sm font-semibold text-white">My Personal Account</h2>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-zinc-400 block mb-1 font-medium">Name:</span>
              <p className="text-zinc-200 font-medium p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                {DEMO_WORKSPACE_DATA.user.name}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1 font-medium">Email Address:</span>
              <p className="text-zinc-200 font-medium p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                {DEMO_WORKSPACE_DATA.user.email}
              </p>
            </div>
            <div>
              <span className="text-zinc-400 block mb-1 font-medium">Role:</span>
              <p className="text-cyan-400 font-mono p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                {DEMO_WORKSPACE_DATA.user.role}
              </p>
            </div>
            <div className="pt-3">
              <Link
                href="/portal/security"
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <span>Manage password & account security</span>
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Invite authorized portal user</h3>

            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Business Email *
                </label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@samplebusiness.example"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 font-medium mb-1">
                  Portal Role *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as ClientRole)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="Client Project Contact">Client Project Contact (Projects, Files, Feedback)</option>
                  <option value="Client Billing Contact">Client Billing Contact (Invoices & Receipts)</option>
                  <option value="Client Member">Client Member (Assigned Projects only)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl"
                >
                  Send invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
