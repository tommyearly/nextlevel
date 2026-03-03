import { PACKAGE_STEPS } from '@/data/martin-kelly/content';
import Link from 'next/link';
import { mkPath } from '@/lib/martin-kelly-base';

export const metadata = {
  title: 'Design Your Package',
  description: 'Tell us your dates and preferences. We design your Costa del Sol golf package for Irish travellers.',
};

export default function DesignYourPackagePage() {
  return (
    <div className="bg-slate-50">
      <section className="py-16 md:py-20 border-b border-slate-200">
        <div className="container">
          <h1 className="font-accent text-3xl md:text-4xl text-golf-dark">
            Design your golf package
          </h1>
          <p className="mt-4 text-slate-600 max-w-2xl">
            Tell us your dates, group size and preferences. We will put together a tailor-made Costa del Sol package and get back to you.
          </p>
        </div>
      </section>
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200">
              <p className="text-slate-600 mb-4">Enquiry form coming soon. Call us to discuss your package.</p>
              <a href="tel:+353866006202" className="inline-flex items-center justify-center px-6 py-3 bg-golf-primary text-white font-semibold rounded-lg hover:bg-golf-dark">086 600 6202</a>
            </div>
            <aside className="space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200">
                <h2 className="font-accent font-semibold text-golf-dark mb-3">How it works</h2>
                <ol className="space-y-3 text-sm text-slate-600">
                  {PACKAGE_STEPS.map(({ step, title }) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-golf-primary text-white text-xs font-bold flex items-center justify-center">{step}</span>
                      {title}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="p-6 rounded-xl bg-golf-pale/50 border border-golf-light/30">
                <p className="font-semibold text-golf-dark">Prefer to talk?</p>
                <a href="tel:+353866006202" className="mt-1 text-golf-primary font-semibold hover:underline">086 600 6202</a>
              </div>
              <Link href={mkPath('/courses')} className="block text-sm text-golf-primary font-medium hover:underline">View golf courses</Link>
              <Link href={mkPath('/accommodation')} className="block text-sm text-golf-primary font-medium hover:underline">View accommodation</Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
