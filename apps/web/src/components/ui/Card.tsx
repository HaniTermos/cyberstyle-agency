import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'dark' | 'light' | 'highlight' | 'glass';
  hoverEffect?: boolean;
}

export function Card({
  className,
  variant = 'dark',
  hoverEffect = false,
  children,
  ...props
}: CardProps) {
  const base = 'rounded-2xl p-6 md:p-8 transition-all duration-300 relative overflow-hidden';

  const variants = {
    dark: 'bg-[#0A0D14] border border-white/10 text-white',
    light: 'bg-white border border-black/10 text-black shadow-sm',
    highlight:
      'bg-[#06080D] border border-[#00F0FF]/40 text-white shadow-[0_0_30px_rgba(0,240,255,0.12)]',
    glass: 'glass-dark text-white',
  };

  const hover = hoverEffect
    ? 'hover:-translate-y-1 hover:border-white/25 hover:shadow-xl'
    : '';

  return (
    <div className={twMerge(clsx(base, variants[variant], hover, className))} {...props}>
      {children}
    </div>
  );
}
