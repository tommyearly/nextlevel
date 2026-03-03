import Link from 'next/link';
import { mkPath } from '@/lib/martin-kelly-base';

export default function CTA() {
  return (
    <section className="py-16 md:py-24 bg-golf-primary" aria-labelledby="cta-heading">
      <div className="container text-center">
        <h2 id="cta-heading" className="font-accent text-3xl md:text-4xl text-white">
          Let us design your perfect golf tour
        </h2>
        <p className="mt-4 text-golf-pale/90 max-w-xl mx-auto">
          Tell us your dates, group size and preferences. We&apos;ll put together a tailor-made Costa del Sol package for you.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={mkPath('/design-your-package')}
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-golf-primary font-semibold rounded-lg hover:bg-golf-pale transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-golf-primary"
          >
            Enquire now
          </Link>
          <a
            href="tel:+353866006202"
            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-golf-primary"
          >
            086 600 6202
          </a>
        </div>
      </div>
    </section>
  );
}
