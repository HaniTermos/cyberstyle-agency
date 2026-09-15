'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Smartphone,
  Key,
  CheckCircle2,
  Lock,
  Laptop,
  AlertTriangle,
  History,
  LogOut,
} from 'lucide-react';

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

const SAMPLE_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    device: 'MacBook Pro',
    browser: 'Chrome 128',
    ipAddress: '192.0.2.45',
    location: 'Current Session',
    lastActive: 'Just now',
    isCurrent: true,
  },
  {
    id: 'sess-2',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    ipAddress: '198.51.100.22',
    location: 'Authorized Device',
    lastActive: 'Yesterday',
    isCurrent: false,
  },
];

export default function PortalSecurityPage() {
  const [sessions, setSessions] = useState<ActiveSession[]>(SAMPLE_SESSIONS);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
  };

  const handleRevokeAllOtherSessions = () => {
    setSessions(sessions.filter((s) => s.isCurrent));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters.');
      return;
    }

    setPasswordMessage('Password successfully updated. Other sessions have been revoked.');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPasswordMessage(null);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans text-zinc-100 max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          Account Security
        </h1>
        <p className="text-xs text-zinc-400 mt-1 max-w-3xl leading-relaxed">
          Manage your password, two-factor authentication, signed-in devices, and recovery options.
        </p>
      </div>

      {/* 1. Password Control */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Password</h2>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Use a strong, unique password to secure access to your client account.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowPasswordModal(true)}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-colors self-start sm:self-auto"
        >
          Change password
        </button>
      </div>

      {/* 2. Two-Factor Authentication (TOTP) */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Two-factor authentication (TOTP)</h2>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              Protect your account by requiring an authenticator app code whenever you sign in.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  mfaEnabled
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                }`}
              >
                {mfaEnabled ? 'Enabled' : 'Not configured'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMfaEnabled(!mfaEnabled);
            alert(
              mfaEnabled
                ? 'Two-factor authentication has been disabled.'
                : 'TOTP setup key generated: Verification code required before activation.'
            );
          }}
          className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 hover:text-white text-xs font-medium transition-colors self-start sm:self-auto"
        >
          {mfaEnabled ? 'Disable 2FA' : 'Set up 2FA'}
        </button>
      </div>

      {/* 3. Signed-in Devices and Active Sessions */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-white">Signed-in devices</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              These devices currently have active sessions to your workspace.
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={handleRevokeAllOtherSessions}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors font-medium self-start sm:self-auto"
            >
              Sign out all other devices
            </button>
          )}
        </div>

        <div className="divide-y divide-zinc-900 border-t border-zinc-900">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="py-3 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <Laptop className="w-4 h-4 text-zinc-500 shrink-0" />
                <div>
                  <p className="text-zinc-200 font-medium">
                    {session.device} • {session.browser}
                    {session.isCurrent && (
                      <span className="ml-2 px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono text-[9px]">
                        Current session
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    IP: {session.ipAddress} • {session.location} • Last active: {session.lastActive}
                  </p>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(session.id)}
                  className="text-[11px] text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Recent Security Activity */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-400" />
          <h2 className="text-sm font-semibold text-white">Recent security activity</h2>
        </div>

        <div className="divide-y divide-zinc-900 text-xs text-zinc-300">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-200">Successful sign-in</p>
              <p className="text-[11px] text-zinc-500 font-mono">Web session started • 192.0.2.45</p>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Today, 09:15 UTC</span>
          </div>
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-200">Session verified via token</p>
              <p className="text-[11px] text-zinc-500 font-mono">Workspace dashboard accessed</p>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">Yesterday, 14:20 UTC</span>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Change Account Password</h3>

            {passwordMessage && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  passwordMessage.includes('successfully')
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {passwordMessage}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-300 mb-1 font-medium">
                  Current password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1 font-medium">
                  New password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-zinc-300 mb-1 font-medium">
                  Confirm new password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl"
                >
                  Update password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
