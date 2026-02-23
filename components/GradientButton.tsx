'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type GradientButtonProps = {
  href?: string;
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Required when children is not descriptive (e.g. icon-only). Falls back to children when it's a string. */
  ariaLabel?: string;
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-lg rounded-xl',
};

const baseClasses =
  'inline-flex items-center justify-center font-heading font-semibold transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface disabled:opacity-50 disabled:pointer-events-none';

const variantClasses = {
  primary:
    'relative overflow-hidden bg-gradient-to-r from-accent-blue via-accent-violet to-accent-violet bg-[length:200%_100%] text-white shadow-glow-sm hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] hover:animate-gradient-x',
  outline:
    'border-2 border-accent-glow/50 bg-transparent text-slate-100 hover:bg-accent-glow/10 hover:border-accent-glow hover:shadow-glow-sm',
  ghost:
    'text-slate-200 hover:text-white hover:bg-white/5',
};

export default function GradientButton({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel,
}: GradientButtonProps) {
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`.trim();

  if (href && !disabled) {
    return (
      <Link
        href={href}
        className={combinedClasses}
        aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel ?? (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </button>
  );
}
