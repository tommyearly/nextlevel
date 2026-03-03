import Link from 'next/link';
import { mkPath } from '@/lib/martin-kelly-base';

export const metadata = {
  title: 'Contact',
  description: 'Contact Costa del Sol Golf. Call 086 600 6202 or send an enquiry for your golf holiday.',
};

export default function ContactPage() {
  return (
    <div className="bg-slate-50">
      <section className="py-16 md:py-20 border-b border-slate-200">
        <div className="container">
          <h1 className="font-accent text-3xl md:text-4xl text-golf-dark">
            Contact us
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Call us or send an enquiry. We will get back to you with a tailor-made proposal for your Costa del Sol golf break.
          </p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container max-w-2xl">
          <div className="mb-10 p-6 rounded-xl bg-white border border-slate-200">
            <h2 className="font-accent font-semibold text-golf-dark text-lg">Phone</h2>
            <a href="tel:+353866006202" className="mt-1 text-golf-primary font-semibold text-xl hover:text-golf-dark transition-colors">
              086 600 6202
            </a>
            <p className="mt-1 text-slate-500 text-sm">Ireland · E.164: +353 86 600 6202</p>
          </div>
          <p className="text-slate-500 text-sm">
            Prefer to design your package step by step?{' '}
            <Link href={mkPath('/design-your-package')} className="text-golf-primary font-medium hover:underline">
              Go to Design your package
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
