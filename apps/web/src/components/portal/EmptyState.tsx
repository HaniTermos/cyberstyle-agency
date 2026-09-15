import React from 'react';
import Link from 'next/link';
import { LucideIcon, Plus } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div className="p-10 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 text-center flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-400">
        <Icon className="w-6 h-6 text-zinc-400" />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
      </div>
      {actionText && (actionHref || onActionClick) && (
        <div className="pt-2">
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-500/50 text-cyan-400 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{actionText}</span>
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-cyan-500/50 text-cyan-400 text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{actionText}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
