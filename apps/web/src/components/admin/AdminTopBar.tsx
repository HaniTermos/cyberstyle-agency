'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Plus,
  ExternalLink,
  Bell,
  ChevronRight,
  Sparkles,
  Users,
  Briefcase,
  Receipt,
  ListTodo,
} from 'lucide-react';

export function AdminTopBar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);

  // Generate breadcrumb path
  const segments = pathname.replace(/^\/admin/, '').split('/').filter(Boolean);

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#080A10]/95 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between transition-all duration-300 ${
        collapsed ? 'left-20' : 'left-64'
      }`}
    >
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-neutral-400">
        <Link href="/admin/dashboard" className="text-neutral-400 hover:text-white transition-colors">
          ADMIN
        </Link>
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;
          const href = `/admin/${segments.slice(0, idx + 1).join('/')}`;
          return (
            <React.Fragment key={href}>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
              {isLast ? (
                <span className="text-[#00F0FF] font-bold uppercase">{seg}</span>
              ) : (
                <Link href={href} className="text-neutral-400 hover:text-white uppercase transition-colors">
                  {seg}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Global Actions & Tools */}
      <div className="flex items-center gap-4">
        {/* Quick Create Dropdown */}
        <div className="relative">
          <button
            onClick={() => setQuickCreateOpen(!quickCreateOpen)}
            className="px-3 py-1.5 rounded-lg bg-[#00F0FF] text-black text-xs font-mono font-bold hover:bg-[#33F3FF] transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,240,255,0.25)] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Quick Create
          </button>

          {quickCreateOpen && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0D1017] border border-white/15 p-1.5 shadow-2xl space-y-1 text-xs font-sans z-50 animate-in fade-in zoom-in-95"
              onClick={() => setQuickCreateOpen(false)}
            >
              <Link
                href="/admin/leads"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-[#00F0FF]" /> Ingest Lead
              </Link>
              <Link
                href="/admin/projects"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-[#00F0FF]" /> New Project
              </Link>
              <Link
                href="/admin/invoices"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Receipt className="w-3.5 h-3.5 text-[#00F0FF]" /> Create Invoice
              </Link>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <ListTodo className="w-3.5 h-3.5 text-[#00F0FF]" /> Add Todo
              </Link>
            </div>
          )}
        </div>

        {/* View Live Site Action */}
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
        </Link>
      </div>
    </header>
  );
}
