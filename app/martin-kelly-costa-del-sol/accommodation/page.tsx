import Image from 'next/image';
import Link from 'next/link';
import { ACCOMMODATION } from '@/data/martin-kelly/content';
import { mkPath } from '@/lib/martin-kelly-base';

export const metadata = {
  title: 'Accommodation',
  description: 'Hotels and resorts on the Costa del Sol for Irish golfers.',
};

export default function AccommodationPage() {
  return (
    <div className="bg-slate-50">
      <section className="py-16 md:py-20 border-b border-slate-200">
        <div className="container">
          <h1 className="font-accent text-3xl md:text-4xl text-golf-dark">Where to stay</h1>
          <p className="mt-4 text-slate-600 max-w-2xl">We work with the best hotels and resorts. Better rates when you book through us.</p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ACCOMMODATION.map((acc) => (
              <article key={acc.id} id={acc.slug} className="rounded-xl overflow-hidden bg-white border border-slate-200 shadow-card scroll-mt-24">
                <div className="relative aspect-[16/10]">
                  <Image src={mkPath(acc.image)} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-card-gradient" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h2 className="font-heading font-semibold text-white text-xl">{acc.name}</h2>
                    <p className="text-white/80 text-sm">{acc.location}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-slate-600 text-sm leading-relaxed">{acc.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href={mkPath('/design-your-package')} className="inline-flex items-center justify-center px-6 py-3 bg-golf-primary text-white font-semibold rounded-lg hover:bg-golf-dark">Design your package</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
