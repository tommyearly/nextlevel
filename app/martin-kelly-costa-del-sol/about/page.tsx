import Link from 'next/link';
import { mkPath } from '@/lib/martin-kelly-base';

export const metadata = {
  title: 'About',
  description: 'Costa del Sol golf holidays for Irish travellers. Tailor-made packages.',
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50">
      <section className="py-16 md:py-20 border-b border-slate-200">
        <div className="container max-w-3xl">
          <h1 className="font-accent text-3xl md:text-4xl text-golf-dark">
            About Costa del Sol Golf
          </h1>
          <p className="mt-4 text-slate-600">
            Golf holidays on the Costa del Sol for Irish customers only.
          </p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container max-w-3xl">
          <p className="text-slate-600 leading-relaxed">
            We specialise in tailor-made golf holidays on the Costa del Sol. Our focus is Irish golfers travelling to the Costa del Sol. We know the courses, hotels, and logistics and offer the best value and availability for you.
          </p>
          <p className="text-slate-600 leading-relaxed mt-6">
            Whether you fly from Dublin or Cork to Malaga, we handle courses, accommodation, and optional extras such as transfers, car hire, and club rental. You tell us your dates and preferences; we design your package.
          </p>
          <p className="text-slate-600 leading-relaxed mt-6">
            We aim to be the best for Irish travellers heading to the Costa del Sol. Customer care is at the heart of what we do.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={mkPath('/design-your-package')} className="inline-flex items-center justify-center px-6 py-3 bg-golf-primary text-white font-semibold rounded-lg hover:bg-golf-dark transition-colors">
              Enquire now
            </Link>
            <a href="tel:+353866006202" className="inline-flex items-center justify-center px-6 py-3 border-2 border-golf-primary text-golf-primary font-semibold rounded-lg hover:bg-golf-pale transition-colors">
              086 600 6202
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
