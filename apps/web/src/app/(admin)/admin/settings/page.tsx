'use client';

import React, { useState } from 'react';
import { Settings, ShieldCheck, Key, CreditCard, Mail, Cpu, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              CONFIGURATION
            </span>
            <span className="text-[11px] font-mono text-zinc-500">OPERATIONAL ENVIRONMENT</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System & Agency Settings</h1>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Agency Profile */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Settings className="w-4 h-4 text-cyan-400" />
            <span>Agency Profile & Brand Identity</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Brand Legal Name</label>
              <input
                type="text"
                defaultValue="CYBERSTYLE LLC"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1 font-mono uppercase text-[10px]">Primary Production Domain</label>
              <input
                type="text"
                defaultValue="cyberstyle.net"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & 2FA Enforcement */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Authentication & Security Policies</span>
          </div>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-zinc-950 border-zinc-800 text-cyan-500 w-4 h-4" />
              <div>
                <span className="text-zinc-200 font-medium">Strict First-Login TOTP 2FA Enforcement</span>
                <p className="text-[11px] text-zinc-500">Require all administrator accounts to configure TOTP before accessing dashboard modules.</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-zinc-950 border-zinc-800 text-cyan-500 w-4 h-4" />
              <div>
                <span className="text-zinc-200 font-medium">Automatic Server-Side Session Rotation</span>
                <p className="text-[11px] text-zinc-500">Invalidate active session tokens upon password change or 2FA reset.</p>
              </div>
            </label>
          </div>
        </div>

        {/* Third-Party Integrations */}
        <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <CreditCard className="w-4 h-4 text-purple-400" />
            <span>Integrations & Service Health</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span>Stripe Connect</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">CONNECTED</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span>Nodemailer SMTP</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px]">ACTIVE</span>
            </div>
            <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-between">
              <span>Gemini AI Engine</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px]">READY</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl transition-colors shadow-[0_0_15px_rgba(0,240,255,0.25)]"
        >
          Save System Configuration
        </button>
      </form>
    </div>
  );
}
