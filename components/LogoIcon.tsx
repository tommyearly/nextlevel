/**
 * Next Level Web — brand mark
 * Concept: Stylized "N" (Next) with ascending diagonal (level up) + node (web).
 * Works as icon-only in header/footer.
 */
type LogoIconProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9',
  lg: 'w-11 h-11',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export default function LogoIcon({ className = '', size = 'md' }: LogoIconProps) {
  return (
    <span
      className={`flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-blue to-accent-violet border border-white/10 shadow-glow-sm ${sizes[size]} ${className}`}
      aria-hidden
    >
      <svg
        viewBox="0 0 28 28"
        fill="none"
        className={`${iconSizes[size]} text-white`}
        aria-hidden
      >
        {/* N — left stem */}
        <path d="M7 6v16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        {/* N — diagonal (level up) */}
        <path d="M7 6L21 22" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        {/* N — right stem */}
        <path d="M21 6v16" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" />
        {/* Node dot — web / next destination */}
        <circle cx="22" cy="5" r="2" fill="currentColor" />
      </svg>
    </span>
  );
}
