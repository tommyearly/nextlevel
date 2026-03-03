import { TESTIMONIALS } from '@/data/martin-kelly/content';

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-brand-surface bg-section-pattern" aria-labelledby="testimonials-heading">
      <div className="container">
        <h2 id="testimonials-heading" className="font-accent text-3xl md:text-4xl text-golf-dark text-center mb-4">
          What Irish golfers say
        </h2>
        <p className="text-slate-600 text-center max-w-xl mx-auto mb-12">
          Societies, couples and groups from Dublin, Cork, Galway and beyond.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.id}
              className="p-6 rounded-xl bg-white border border-slate-200 shadow-card"
            >
              <div className="flex gap-1 mb-3" aria-hidden>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-costa-gold">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <footer className="mt-4 text-slate-500 text-sm">
                — <cite className="font-semibold not-italic text-golf-dark">{t.name}</cite>, {t.location}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
