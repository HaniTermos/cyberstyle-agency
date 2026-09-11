'use client';

import React from 'react';
import { User, Building, Mail, Phone, Globe, Shield } from 'lucide-react';

export default function PortalProfilePage() {
  return (
    <div className="space-y-6 font-sans max-w-3xl">
      <div className="pb-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold text-white tracking-tight">Organization Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">Manage corporate billing details, legal contacts, and technical liaisons.</p>
      </div>

      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Company Name</label>
            <input
              type="text"
              readOnly
              value="Acme Global Technologies Inc."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Domain</label>
            <input
              type="text"
              readOnly
              value="acmeglobal.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">Primary Billing Email</label>
            <input
              type="text"
              readOnly
              value="billing@acmeglobal.com"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">SLA Tier</label>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-between">
              <span>Enterprise Tier-1</span>
              <Shield className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
