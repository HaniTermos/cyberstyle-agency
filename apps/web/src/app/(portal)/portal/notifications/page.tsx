'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Receipt,
  FolderGit2,
  MessageSquare
} from 'lucide-react';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 'notif_01',
    title: 'Milestone 4 Deployed to Staging',
    description: 'Security Audit & Staging Verification is ready for acceptance testing.',
    time: '2 hours ago',
    type: 'BUILD',
    href: '/portal/projects',
  },
  {
    id: 'notif_02',
    title: 'New Message from Lead Architect',
    description: 'Hani Termos sent an update in thread: "Milestone 4 Staging Review".',
    time: '4 hours ago',
    type: 'MESSAGE',
    href: '/portal/messages',
  },
  {
    id: 'notif_03',
    title: 'Invoice #INV-2026-004 Generated',
    description: 'Invoice for Milestone 4 ($8,750 USD) has been issued.',
    time: 'Yesterday',
    type: 'INVOICE',
    href: '/portal/invoices',
  },
];

export default function PortalNotificationsPage() {
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-emerald-400" />
              Notifications & Activity Feed
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              REALTIME
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Live updates on staging deployments, milestone approvals, invoice receipts, and engineering messages.
          </p>
        </div>
      </div>

      <div className="space-y-3 max-w-3xl">
        {SAMPLE_NOTIFICATIONS.map((n) => (
          <Link
            key={n.id}
            href={n.href}
            className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-all flex items-start justify-between gap-4 block group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {n.type}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">{n.time}</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors pt-1">
                {n.title}
              </h3>
              <p className="text-xs text-zinc-400">{n.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
