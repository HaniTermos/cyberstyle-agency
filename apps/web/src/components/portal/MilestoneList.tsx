import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

export interface MilestoneItem {
  id: string;
  title: string;
  description: string;
  status: 'Approved' | 'Awaiting feedback' | 'Changes requested' | 'In progress' | 'Scheduled';
  deliverables?: string[];
  startDate?: string;
  endDate?: string;
}

interface MilestoneListProps {
  milestones: MilestoneItem[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  const completedCount = milestones.filter((m) => m.status === 'Approved').length;
  const totalCount = milestones.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Project progress</h3>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          {completedCount} of {totalCount} milestones completed
        </span>
      </div>

      <div className="space-y-3">
        {milestones.map((milestone, idx) => {
          const isComplete = milestone.status === 'Approved';
          const isAwaiting = milestone.status === 'Awaiting feedback';

          return (
            <div
              key={milestone.id || idx}
              className={`p-4 rounded-xl border transition-all ${
                isAwaiting
                  ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.05)]'
                  : isComplete
                  ? 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300'
                  : 'bg-zinc-950/40 border-zinc-900 text-zinc-500'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {isComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isAwaiting ? (
                      <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">
                      {idx + 1}. {milestone.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                      {milestone.description}
                    </p>
                    {milestone.deliverables && milestone.deliverables.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {milestone.deliverables.map((d, dIdx) => (
                          <span
                            key={dIdx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <span
                  className={`text-[10px] font-medium font-mono px-2 py-0.5 rounded-full border whitespace-nowrap ${
                    isComplete
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isAwaiting
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                  }`}
                >
                  {milestone.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
