import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NextActionCardProps {
  actionText?: string;
  dueDate?: string;
  actionLink?: string;
  actionButtonText?: string;
  isIdle?: boolean;
}

export function NextActionCard({
  actionText,
  dueDate,
  actionLink = '/portal/projects',
  actionButtonText = 'View details',
  isIdle = false,
}: NextActionCardProps) {
  if (isIdle || !actionText) {
    return (
      <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Your next action</h2>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
            No action needed right now. We will notify you when the next review item is ready.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-950 to-zinc-950 border border-amber-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
            Action required from your team
          </span>
        </div>
        {dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400/80" />
            <span>Target date: {dueDate}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-bold text-white tracking-tight leading-snug">
          {actionText}
        </h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your feedback keeps the delivery schedule on track. Review the shared deliverable below.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href={actionLink}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] focus:ring-2 focus:ring-amber-400 focus:outline-none"
        >
          <span>{actionButtonText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
