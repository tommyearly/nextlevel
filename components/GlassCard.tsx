import type { ReactNode } from 'react';

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  gradientBorder?: boolean;
};

export default function GlassCard({
  children,
  className = '',
  as: Component = 'div',
  gradientBorder = true,
}: GlassCardProps) {
  const base =
    'relative rounded-2xl bg-brand-card/60 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-accent-glow/30 hover:shadow-glow-sm';

  return (
    <Component className={`group relative ${base} ${className}`.trim()}>
      {gradientBorder && (
        <div
          className="absolute inset-0 rounded-2xl p-px bg-gradient-to-br from-accent-blue/30 via-accent-violet/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none -z-10"
          aria-hidden
        />
      )}
      <div className="relative z-0 rounded-2xl bg-brand-card/80 backdrop-blur-xl border border-white/5 p-6 sm:p-8">
        {children}
      </div>
    </Component>
  );
}
