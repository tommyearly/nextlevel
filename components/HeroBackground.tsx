/**
 * Animated background used on Hero and other full-width sections (e.g. Services).
 * Grid, diagonal lines, scan lines, floating dots, gradient mesh and blurs.
 */
export default function HeroBackground() {
  return (
    <>
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none animate-grid-drift"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 102, 241, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 102, 241, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -left-40 top-1/4 w-[500px] h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent rotate-[-25deg]" />
        <div className="absolute -right-40 top-1/2 w-[400px] h-px bg-gradient-to-l from-transparent via-accent-violet/25 to-transparent rotate-[15deg]" />
        <div className="absolute left-1/4 bottom-1/3 w-[300px] h-px bg-gradient-to-r from-transparent via-accent-glow/20 to-transparent rotate-[-15deg]" />
      </div>
      <div
        className="absolute left-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-accent-blue/40 to-transparent pointer-events-none animate-scan-line"
        style={{ animationDelay: '0s' }}
        aria-hidden
      />
      <div
        className="absolute left-0 right-0 h-px w-full bg-gradient-to-r from-transparent via-accent-violet/30 to-transparent pointer-events-none animate-scan-line"
        style={{ animationDelay: '4s' }}
        aria-hidden
      />
      {[
        { left: '15%', top: '20%', delay: '0s', size: 'w-1.5 h-1.5', violet: false },
        { left: '85%', top: '25%', delay: '2s', size: 'w-1 h-1', violet: false },
        { left: '70%', top: '60%', delay: '4s', size: 'w-2 h-2', violet: false },
        { left: '25%', top: '70%', delay: '1s', size: 'w-1 h-1', violet: false },
        { left: '50%', top: '35%', delay: '3s', size: 'w-1.5 h-1.5', violet: false },
        { left: '90%', top: '75%', delay: '5s', size: 'w-1 h-1', violet: false },
        { left: '10%', top: '50%', delay: '2.5s', size: 'w-1 h-1', violet: false },
        { left: '60%', top: '15%', delay: '1.5s', size: 'w-1 h-1', violet: true },
        { left: '35%', top: '80%', delay: '3.5s', size: 'w-1.5 h-1.5', violet: true },
      ].map((dot, i) => (
        <div
          key={i}
          className={`absolute rounded-full animate-float-dot ${dot.size} ${dot.violet ? 'bg-accent-violet/50' : 'bg-accent-blue/50'}`}
          style={{ left: dot.left, top: dot.top, animationDelay: dot.delay }}
          aria-hidden
        />
      ))}
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" aria-hidden />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" aria-hidden />
    </>
  );
}
