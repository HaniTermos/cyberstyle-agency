'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, HelpCircle, User, ChevronDown } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { DEMO_WORKSPACE_DATA } from '@/lib/constants/portal';

export function PortalTopBar() {
  const [user, setUser] = useState<{ email: string; name?: string; role?: string }>({
    email: DEMO_WORKSPACE_DATA.user.email,
    name: DEMO_WORKSPACE_DATA.user.name,
    role: DEMO_WORKSPACE_DATA.user.role,
  });

  const [orgName, setOrgName] = useState(DEMO_WORKSPACE_DATA.organization.name);

  useEffect(() => {
    // Check session storage
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('cyberstyle_portal_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.user) {
            setUser({
              email: parsed.user.email || DEMO_WORKSPACE_DATA.user.email,
              name: parsed.user.name || DEMO_WORKSPACE_DATA.user.name,
              role: parsed.user.role || DEMO_WORKSPACE_DATA.user.role,
            });
            if (parsed.user.organizationName) {
              setOrgName(parsed.user.organizationName);
            }
          }
        } catch {}
      }
    }

    // Fetch fresh profile
    apiRequest('/portal/profile')
      .then((res) => {
        if (res.success && res.data) {
          const member = res.data.member || res.data;
          setUser({
            email: member.email || res.data.email || DEMO_WORKSPACE_DATA.user.email,
            name: member.name || res.data.name || DEMO_WORKSPACE_DATA.user.name,
            role: member.role || DEMO_WORKSPACE_DATA.user.role,
          });
          if (res.data.organization?.name) {
            setOrgName(res.data.organization.name);
          }
        }
      })
      .catch(() => {});
  }, []);

  const initial = (user.name?.[0] || user.email?.[0] || 'D').toUpperCase();

  return (
    <header className="h-14 bg-[#080A10]/90 backdrop-blur border-b border-zinc-800/80 px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Organization / Workspace Name */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono font-semibold text-zinc-300 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          {orgName}
        </span>
      </div>

      {/* Right Controls: Help, Notifications, User Menu */}
      <div className="flex items-center gap-3">
        <Link
          href="/portal/messages"
          className="text-zinc-400 hover:text-cyan-400 p-1.5 rounded-lg hover:bg-zinc-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Support and Project Messages"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Help & Support</span>
        </Link>

        <Link
          href="/portal/notifications"
          className="p-1.5 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors relative"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        </Link>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <Link
          href="/portal/profile"
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-900/80 transition-colors focus:ring-1 focus:ring-cyan-400 focus:outline-none"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-black text-xs font-bold border border-cyan-400/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
            {initial}
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-medium text-zinc-200 leading-none">{user.name || user.email}</span>
            <span className="text-[10px] text-zinc-400 font-mono">{user.role}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}
