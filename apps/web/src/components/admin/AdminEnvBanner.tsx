import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface AdminEnvBannerProps {
  environment?: 'development' | 'staging' | 'production';
}

export function AdminEnvBanner({ environment }: AdminEnvBannerProps) {
  const currentEnv =
    environment ||
    (process.env.NEXT_PUBLIC_ENVIRONMENT as 'development' | 'staging' | 'production') ||
    'development';

  if (currentEnv === 'production') {
    return null;
  }

  const isStaging = currentEnv === 'staging';

  return (
    <div
      role="region"
      aria-label="Admin environment indicator"
      className={`w-full py-1.5 px-4 text-center text-xs font-mono select-none flex items-center justify-center gap-2 border-b z-50 fixed top-0 left-0 right-0 ${
        isStaging
          ? 'bg-amber-950/90 text-amber-300 border-amber-500/40 backdrop-blur'
          : 'bg-rose-950/90 text-rose-300 border-rose-500/40 backdrop-blur'
      }`}
    >
      <ShieldAlert className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span className="font-bold tracking-wider uppercase">
        [{currentEnv.toUpperCase()} ENVIRONMENT]
      </span>
      <span className="text-[11px] opacity-90 hidden sm:inline">
        — Local development environment active. Connected to local PostgreSQL database and API services.
      </span>
    </div>
  );
}
