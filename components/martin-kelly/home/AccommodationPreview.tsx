'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ACCOMMODATION } from '@/data/martin-kelly/content';
import { mkPath } from '@/lib/martin-kelly-base';

const featured = ACCOMMODATION.filter((a) => a.featured);

export default function AccommodationPreview() {
  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="accommodation-heading">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 id="accommodation-heading" className="font-accent text-3xl md:text-4xl text-golf-dark">
              Where to stay
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl">
              We work with the best hotels and resorts on the Costa del Sol. Better rates and cancellation terms when you book through us.
            </p>
          </div>
          <Link href={mkPath('/accommodation')} className="text-golf-primary font-semibold hover:text-golf-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary focus-visible:ring-offset-2 rounded shrink-0">
            View all accommodation
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((acc) => (
            <Link
              key={acc.id}
              href={mkPath('/accommodation#' + acc.slug)}
              className="group block rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shadow-card hover:shadow-card-hover transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={mkPath(acc.image)} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-card-gradient" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-accent font-semibold text-white text-lg">{acc.name}</h3>
                  <p className="text-white/80 text-sm">{acc.location}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-600 text-sm line-clamp-2">{acc.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
