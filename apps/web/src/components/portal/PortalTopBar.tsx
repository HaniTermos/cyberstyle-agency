'use client';

import React from 'react';
import { Bell, ShieldCheck, HelpCircle } from 'lucide-react';

export function PortalTopBar() {
  return (
    <header className="h-14 bg-zinc-950/80 backdrop-blur border-b border-zinc-800/80 px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          CLIENT ENVIRONMENT // SECURE ENCLAVE
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
        </button>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-xs font-bold border border-emerald-400/30">
            C
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-medium text-zinc-200 leading-none">client@acme.com</span>
            <span className="text-[10px] text-zinc-500 font-mono">Organization Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
