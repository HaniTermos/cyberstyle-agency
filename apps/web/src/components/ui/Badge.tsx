import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'electric' | 'outline' | 'success';
  dot?: boolean;
}

export function Badge({
  className,
  variant = 'default',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  const base =
    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest select-none';

  const variants = {
    default: 'bg-white/5 text-neutral-300 border border-white/10',
    electric:
      'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]',
    outline: 'bg-transparent text-neutral-400 border border-white/15',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))} {...props}>
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full', {
            'bg-[#00F0FF]': variant === 'electric',
            'bg-emerald-400': variant === 'success',
            'bg-white/60': variant === 'default' || variant === 'outline',
          })}
        />
      )}
      {children}
    </span>
  );
}
