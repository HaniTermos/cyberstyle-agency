'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  Receipt,
  FileText,
  MessageSquare,
  Star,
  ShieldCheck,
  User,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { DEMO_WORKSPACE_DATA, PORTAL_LABELS } from '@/lib/constants/portal';

const navigation = [
  { name: PORTAL_LABELS.DASHBOARD, href: '/portal/dashboard', icon: LayoutDashboard },
  { name: PORTAL_LABELS.PROJECTS, href: '/portal/projects', icon: FolderGit2 },
  { name: PORTAL_LABELS.INVOICES, href: '/portal/invoices', icon: Receipt },
  { name: PORTAL_LABELS.FILES, href: '/portal/files', icon: FileText },
  { name: PORTAL_LABELS.MESSAGES, href: '/portal/messages', icon: MessageSquare },
  { name: PORTAL_LABELS.FEEDBACK, href: '/portal/feedback', icon: Star },
  { name: PORTAL_LABELS.SECURITY, href: '/portal/security', icon: ShieldCheck },
  { name: PORTAL_LABELS.SETTINGS, href: '/portal/profile', icon: User },
];

export function PortalSidebar() {
  const pathname = usePathname();
  const [orgData, setOrgData] = useState<{ name: string; plan: string; initials: string }>({
    name: DEMO_WORKSPACE_DATA.organization.name,
    plan: DEMO_WORKSPACE_DATA.organization.businessName,
    initials: 'DW',
  });

  useEffect(() => {
    // 1. Check local session storage first
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('cyberstyle_portal_session');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const userName = parsed.user?.name || parsed.user?.email?.split('@')[0] || '';
          const orgName =
            parsed.user?.organizationName ||
            (userName ? `${userName}'s Workspace` : DEMO_WORKSPACE_DATA.organization.name);
          const initials = orgName.substring(0, 2).toUpperCase();
          setOrgData({
            name: orgName,
            plan: parsed.user?.businessName || DEMO_WORKSPACE_DATA.organization.businessName,
            initials: initials || 'CW',
          });
        } catch {}
      }
    }

    // 2. Fetch live profile from backend
    apiRequest('/portal/profile')
      .then((res) => {
        if (res.success && res.data) {
          const org = res.data.organization || res.data;
          const name = org.name || res.data.name || DEMO_WORKSPACE_DATA.organization.name;
          const initials =
            name
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'CW';

          setOrgData({
            name,
            plan: org.businessName || org.legalName || 'Authorized Workspace',
            initials,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cyberstyle_portal_token');
      localStorage.removeItem('portal_token');
      sessionStorage.removeItem('cyberstyle_portal_session');
      document.cookie = 'cyberstyle_portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'portal_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = '/portal/login';
    }
  };

  return (
    <aside
      aria-label="Client Portal Navigation"
      className="w-64 bg-[#080A10] border-r border-zinc-800/80 flex flex-col h-screen sticky top-0 text-zinc-300 select-none z-30 font-sans"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <Link href="/portal/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-sm tracking-wider font-bold text-white group-hover:text-cyan-400 transition-colors">
              CYBERSTYLE
            </span>
            <span className="block text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
              CLIENT PORTAL
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
          Client Workspace
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/portal/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-zinc-400'}`}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Organization Info Footer */}
      <div className="p-4 border-t border-zinc-800/80 bg-[#080A10]/95 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-zinc-900/60 border border-zinc-800/80">
          <div className="w-7 h-7 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
            {orgData.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-100 truncate">{orgData.name}</p>
            <p className="text-[10px] text-zinc-400 font-mono truncate">{orgData.plan}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <Link
            href="/"
            className="text-zinc-500 hover:text-cyan-400 flex items-center gap-1 text-[11px] transition-colors"
            target="_blank"
          >
            <ExternalLink className="w-3 h-3" />
            <span>cyberstyle.net</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-1 text-[11px]"
            title="Sign out of Client Portal"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
