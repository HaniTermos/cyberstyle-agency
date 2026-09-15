import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PORTAL_DEMO_BANNER_TEXT } from '@/lib/constants/portal';

interface DemoBannerProps {
  isDemo?: boolean;
}

export function DemoBanner({ isDemo = true }: DemoBannerProps) {
  if (!isDemo) return null;

  return (
    <div
      role="region"
      aria-label="Demo environment notice"
      className="w-full bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-center text-xs font-sans text-amber-200/90 flex items-center justify-center gap-2 select-none shadow-[0_2px_10px_rgba(245,158,11,0.05)]"
    >
      <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
      <span className="font-medium tracking-wide">
        {PORTAL_DEMO_BANNER_TEXT}
      </span>
    </div>
  );
}
