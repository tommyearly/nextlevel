const steps = [
  { num: '01', title: 'Discovery & strategy', text: 'We align on goals, audience, and scope so the build stays on track.' },
  { num: '02', title: 'Design', text: 'Figma-first design with your brand. Iterate until it feels right.' },
  { num: '03', title: 'Build', text: 'Development in Next.js with performance and SEO baked in.' },
  { num: '04', title: 'Launch & grow', text: 'Go live, then optimise with analytics and ongoing support.' },
];

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="py-20 sm:py-28 bg-brand-primary/40">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 id="process-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50">
          How we work
        </h2>
        <p className="mt-4 text-slate-400 text-lg max-w-xl">
          A clear process from brief to launch — no surprises, no scope creep.
        </p>
        <ol className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6" role="list">
          {steps.map(({ num, title, text }, i) => (
            <li key={num} className="relative">
              {i < steps.length - 1 && (
                <span className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-accent-glow/30 to-transparent -translate-x-4" aria-hidden />
              )}
              <span className="text-accent-blue/80 font-heading text-sm font-bold">{num}</span>
              <h3 className="mt-2 font-heading text-xl font-semibold text-slate-50">{title}</h3>
              <p className="mt-2 text-slate-400 text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
