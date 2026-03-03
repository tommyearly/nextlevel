import { EXTRAS } from '@/data/martin-kelly/content';

const icons: Record<number, string> = {
  0: '⛳',
  1: '🚐',
  2: '🚗',
  3: '🏛️',
};

export default function Extras() {
  return (
    <section className="py-16 md:py-24 bg-golf-dark text-white" aria-labelledby="extras-heading">
      <div className="container">
        <h2 id="extras-heading" className="font-accent text-3xl md:text-4xl text-center mb-4">
          The full picture
        </h2>
        <p className="text-slate-300 text-center max-w-2xl mx-auto mb-12">
          We can add club rental, transfers, car hire and excursions so your trip from Ireland is fully taken care of.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXTRAS.map((item, i) => (
            <div
              key={item.title}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <span className="text-3xl" aria-hidden>
                {icons[i] ?? '•'}
              </span>
              <h3 className="mt-3 font-accent font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-slate-300 text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
