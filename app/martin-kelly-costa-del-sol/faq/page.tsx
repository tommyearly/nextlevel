import { FAQ_ITEMS } from '@/data/martin-kelly/content';

export const metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about Costa del Sol golf holidays from Ireland.',
};

export default function FAQPage() {
  return (
    <div className="bg-slate-50">
      <section className="py-16 md:py-20 border-b border-slate-200">
        <div className="container">
          <h1 className="font-accent text-3xl md:text-4xl text-golf-dark">FAQ</h1>
          <p className="mt-4 text-slate-600 max-w-2xl">Common questions about golf holidays on the Costa del Sol.</p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl space-y-8">
          {FAQ_ITEMS.map(({ q, a }) => (
            <div key={q} className="rounded-xl bg-white border border-slate-200 p-5 shadow-card">
              <h2 className="font-accent font-semibold text-golf-dark text-lg">{q}</h2>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
