import React from 'react';
import { ProjectStatus, PROJECT_STATUS_CONFIG } from '@/lib/constants/portal';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  showExplanation?: boolean;
}

export function ProjectStatusBadge({ status, showExplanation = false }: ProjectStatusBadgeProps) {
  const config = PROJECT_STATUS_CONFIG[status] || {
    label: status,
    color: 'text-zinc-400',
    bg: 'bg-zinc-500/10',
    border: 'border-zinc-500/30',
    description: '',
  };

  return (
    <div className="inline-flex flex-col">
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${config.bg} ${config.color} ${config.border} shadow-[0_0_8px_rgba(0,0,0,0.2)]`}
      >
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.color.replace('text-', 'bg-')}`} />
        {config.label}
      </span>
      {showExplanation && config.description && (
        <span className="text-[11px] text-zinc-400 mt-1 max-w-xs leading-relaxed">
          {config.description}
        </span>
      )}
    </div>
  );
}
