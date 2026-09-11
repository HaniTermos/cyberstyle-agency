'use client';

import React, { useState } from 'react';
import { ShieldCheck, Smartphone, Key, CheckCircle2 } from 'lucide-react';

export default function PortalSecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="space-y-6 font-sans max-w-3xl">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Security & 2FA Enclave</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage client enclave authentication, TOTP credentials, and access keys.</p>
      </div>

      <div className="space-y-4">
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Two-Factor Authentication (TOTP)</h3>
              <p className="text-xs text-zinc-400 mt-1">Required for all organization admins with access to repository code and invoices.</p>
              <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-xs font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active // Authenticator App Configured</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => alert('TOTP 2FA is strictly enforced across your organization profile.')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            Reconfigure
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Password & Active Sessions</h3>
              <p className="text-xs text-zinc-400 mt-1">Hashed via Argon2id. Sessions automatically rotate on password change.</p>
            </div>
          </div>
          <button
            onClick={() => alert('Password reset link sent to your registered organization email.')}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
