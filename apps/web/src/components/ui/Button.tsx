import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'electric';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  href?: string;
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-tight rounded-full transition-all duration-200 select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-white text-black hover:bg-neutral-200 shadow-sm hover:shadow-md font-semibold',
      secondary:
        'bg-neutral-900 text-white hover:bg-neutral-800 border border-white/10',
      outline:
        'bg-transparent text-white border border-white/20 hover:border-white/40 hover:bg-white/5',
      electric:
        'bg-[#00F0FF] text-black hover:bg-[#00D2E0] font-semibold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_28px_rgba(0,240,255,0.45)]',
      ghost:
        'bg-transparent text-neutral-300 hover:text-white hover:bg-white/5',
    };

    const sizes = {
      sm: 'text-xs px-3.5 py-1.5 gap-1.5',
      md: 'text-sm px-5 py-2.5 gap-2',
      lg: 'text-base px-7 py-3.5 gap-2.5 font-semibold',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {children}
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
