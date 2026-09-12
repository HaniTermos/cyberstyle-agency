'use client';

import React, { useEffect, useState } from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { apiRequest } from '@/lib/api';

export function PortalTopBar() {
  const [user, setUser] = useState<{ email: string; name?: string; role?: string }>({
    email: 'client@workspace.enclave',
    name: 'Authorized Client',
    role: 'Client Representative',
  });

  useEffect(() => {
    // 1. Check local session storage first
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('cyberstyle_portal_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.user) {
            setUser({
              email: parsed.user.email || 'client@workspace.enclave',
              name: parsed.user.name || parsed.user.email?.split('@')[0] || 'Authorized Client',
              role: parsed.user.role === 'CLIENT' ? 'Client Representative' : 'Workspace Admin',
            });
          }
        } catch {}
      }
    }

    // 2. Fetch fresh profile
    apiRequest('/portal/profile')
      .then((res) => {
        if (res.success && res.data) {
          const member = res.data.member || res.data;
          setUser({
            email: member.email || res.data.email || 'client@workspace.enclave',
            name: member.name || res.data.name || 'Authorized Client',
            role: member.role || 'Client Representative',
          });
        }
      })
      .catch(() => {});
  }, []);

  const initial = (user.name?.[0] || user.email?.[0] || 'C').toUpperCase();

  return (
    <header className="h-14 bg-[#080A10]/90 backdrop-blur border-b border-zinc-800/80 px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(0,240,255,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          CLIENT ENVIRONMENT // SECURE ENCLAVE
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors relative"
          title="Security & System Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </button>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black text-xs font-bold border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            {initial}
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-medium text-zinc-200 leading-none">{user.email}</span>
            <span className="text-[10px] text-cyan-400/80 font-mono">{user.role}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
