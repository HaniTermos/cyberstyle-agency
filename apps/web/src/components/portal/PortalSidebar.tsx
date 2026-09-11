'use client';

import React from 'react';
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
  ExternalLink
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/portal/dashboard', icon: LayoutDashboard },
  { name: 'Active Builds & Milestones', href: '/portal/projects', icon: FolderGit2 },
  { name: 'Invoices & Retainers', href: '/portal/invoices', icon: Receipt },
  { name: 'Asset Vault & Files', href: '/portal/files', icon: FileText },
  { name: 'Direct Comms / Support', href: '/portal/messages', icon: MessageSquare },
  { name: 'Feedback & Reviews', href: '/portal/feedback', icon: Star },
  { name: 'Security & 2FA', href: '/portal/security', icon: ShieldCheck },
  { name: 'Organization Profile', href: '/portal/profile', icon: User },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-screen sticky top-0 text-zinc-300 select-none z-30 font-sans">
      {/* Brand Header */}
      <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
        <Link href="/portal/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition-colors">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-mono text-sm tracking-wider font-bold text-white group-hover:text-emerald-400 transition-colors">
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
          const isActive = pathname === item.href || (item.href !== '/portal/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Organization Info / Footer */}
      <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-zinc-900/60 border border-zinc-800/80">
          <div className="w-7 h-7 rounded bg-emerald-500/20 text-emerald-300 font-mono text-xs flex items-center justify-center font-bold">
            CO
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-200 truncate">Acme Global</p>
            <p className="text-[10px] text-zinc-500 font-mono truncate">Enterprise SLA</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <Link
            href="/"
            className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px] transition-colors"
            target="_blank"
          >
            <ExternalLink className="w-3 h-3" />
            <span>cyberstyle.net</span>
          </Link>
          <button
            onClick={() => {
              document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
              window.location.href = '/admin/login';
            }}
            className="text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1 text-[11px]"
            title="Sign out"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
