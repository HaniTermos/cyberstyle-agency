'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MessageSquareText,
  Building2,
  Briefcase,
  Flag,
  Receipt,
  CreditCard,
  Repeat,
  Star,
  FolderKanban,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  Mail,
  Shield,
  History,
  Settings,
  ListTodo,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Globe2,
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarGroup {
  group: string;
  items: SidebarItem[];
}

const navigationGroups: SidebarGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Roadmap', href: '/admin/roadmap', icon: <ListTodo className="w-4 h-4" /> },
    ],
  },
  {
    group: 'CRM',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: <Users className="w-4 h-4" /> },
      { label: 'Proposals', href: '/admin/proposals', icon: <FileText className="w-4 h-4" /> },
      { label: 'Contacts', href: '/admin/contacts', icon: <MessageSquareText className="w-4 h-4" /> },
      { label: 'Clients', href: '/admin/clients', icon: <Building2 className="w-4 h-4" /> },
    ],
  },
  {
    group: 'DELIVERY',
    items: [
      { label: 'Projects', href: '/admin/projects', icon: <Briefcase className="w-4 h-4" /> },
      { label: 'Milestones', href: '/admin/milestones', icon: <Flag className="w-4 h-4" /> },
    ],
  },
  {
    group: 'FINANCE',
    items: [
      { label: 'Invoices', href: '/admin/invoices', icon: <Receipt className="w-4 h-4" /> },
      { label: 'Payments', href: '/admin/payments', icon: <CreditCard className="w-4 h-4" /> },
      { label: 'Retainers', href: '/admin/retainers', icon: <Repeat className="w-4 h-4" /> },
      { label: 'Reports', href: '/admin/reports', icon: <FileText className="w-4 h-4" /> },
    ],
  },
  {
    group: 'CONTENT',
    items: [
      { label: 'Reviews', href: '/admin/reviews', icon: <Star className="w-4 h-4" /> },
      { label: 'Case Studies', href: '/admin/case-studies', icon: <FolderKanban className="w-4 h-4" /> },
      { label: 'Blog', href: '/admin/blog', icon: <FileText className="w-4 h-4" /> },
      { label: 'FAQs', href: '/admin/faqs', icon: <HelpCircle className="w-4 h-4" /> },
      { label: 'Media', href: '/admin/media', icon: <ImageIcon className="w-4 h-4" /> },
    ],
  },
  {
    group: 'GROWTH & OPS',
    items: [
      { label: 'Analytics Cockpit', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'AI Search / GEO', href: '/admin/geo', icon: <Globe2 className="w-4 h-4" /> },
      { label: 'Monitoring', href: '/admin/monitoring', icon: <History className="w-4 h-4" /> },
      { label: 'OpenSEO', href: '/admin/seo', icon: <FolderKanban className="w-4 h-4" /> },
    ],
  },
  {
    group: 'COMMUNICATION',
    items: [
      { label: 'Client Messages', href: '/admin/messages', icon: <MessageSquare className="w-4 h-4" /> },
      { label: 'Email Center', href: '/admin/email', icon: <Mail className="w-4 h-4" /> },
    ],
  },
  {
    group: 'SYSTEM',
    items: [
      { label: 'Users & Roles', href: '/admin/users', icon: <Shield className="w-4 h-4" /> },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
      { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export function AdminSidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('cyberstyle_admin_session');
    router.push('/admin/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#07090E] border-r border-zinc-800/80 z-30 transition-all duration-300 flex flex-col font-sans select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand & Toggle Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-800/80">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
            <span className="font-mono text-xs tracking-widest font-bold text-white">
              CYBERSTYLE<span className="text-[#00F0FF]">_OS</span>
            </span>
          </div>
        )}

        {collapsed && (
          <div className="w-full flex justify-center">
            <div className="w-3 h-3 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors ${
            collapsed ? 'hidden' : 'block'
          }`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
        {navigationGroups.map((grp, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-3 text-[10px] font-mono tracking-wider text-zinc-500 font-semibold mb-1">
                {grp.group}
              </div>
            )}
            {grp.items.map((item, iIdx) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={iIdx}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group relative ${
                    isActive
                      ? 'bg-[#00F0FF]/10 text-[#00F0FF] font-semibold border border-[#00F0FF]/30 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`${isActive ? 'text-[#00F0FF]' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}

                  {collapsed && (
                    <div className="fixed left-24 px-2 py-1 bg-zinc-900 border border-zinc-700 text-white text-[11px] rounded font-mono shadow-xl hidden group-hover:block z-50 whitespace-nowrap">
                      {item.label}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-zinc-800/80 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 transition-colors"
          title="Open Public Site"
        >
          <ExternalLink className="w-4 h-4 text-zinc-500 shrink-0" />
          {!collapsed && <span>Public Website</span>}
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
