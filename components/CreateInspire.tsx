/**
 * Inspirational section below hero — website creation, what we build, aspirational copy.
 */
export default function CreateInspire() {
  const steps = [
    { label: 'Idea', sub: 'Your vision' },
    { label: 'Design', sub: 'We shape it' },
    { label: 'Build', sub: 'Code that lasts' },
    { label: 'Live', sub: 'You own it' },
  ];

  const pillars = [
    { word: 'Editable', desc: 'Update your pages yourself — no developer needed' },
    { word: 'Honest', desc: 'Clear pricing, no price hikes or surprises' },
    { word: 'Irish', desc: 'Run by Irish people, for Irish businesses' },
  ];

  return (
    <section
      aria-labelledby="create-inspire-heading"
      className="py-16 sm:py-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/[0.03] to-transparent pointer-events-none" aria-hidden />
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center mb-14 sm:mb-18">
          <div className="hero-title-3d-wrapper">
            <h2
              id="create-inspire-heading"
              className="hero-title-3d font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 leading-tight"
            >
              Your idea,{' '}
              <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-violet bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-x drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                live on the web
              </span>
            </h2>
          </div>
          <p className="mt-6 text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto">
            Irish-run and honest. We build sites you can edit yourself — no jargon, no surprises. Straightforward and built to last.
          </p>
        </div>

        {/* Flow: Idea → Design → Build → Live */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-16">
          {steps.map(({ label, sub }, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-heading text-xl sm:text-2xl font-bold text-slate-50">{label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="hidden sm:inline text-slate-600 text-lg font-light" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {pillars.map(({ word, desc }) => (
            <div
              key={word}
              className="group rounded-2xl border border-white/5 bg-brand-card/40 backdrop-blur-sm px-6 py-8 text-center transition-all duration-300 hover:border-accent-glow/25 hover:bg-brand-card/60"
            >
              <p className="font-heading text-2xl sm:text-3xl font-bold text-accent-blue group-hover:text-accent-violet transition-colors">
                {word}
              </p>
              <p className="mt-2 text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-slate-500 text-sm max-w-xl mx-auto">
          From a simple 5-page site to a fully editable website — Irish, honest, and here to help.
        </p>
      </div>
    </section>
  );
}
