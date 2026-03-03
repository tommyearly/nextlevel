import Link from 'next/link';
import { PACKAGE_STEPS } from '@/data/martin-kelly/content';
import { mkPath } from '@/lib/martin-kelly-base';

export default function PackageSteps() {
  return (
    <section className="py-16 md:py-24 bg-white" aria-labelledby="package-steps-heading">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 id="package-steps-heading" className="font-accent text-3xl md:text-4xl text-golf-dark">
            Design your golf package
          </h2>
          <p className="mt-4 text-slate-600">
            Four simple steps. We handle the rest — from your first enquiry to your last round.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PACKAGE_STEPS.map(({ step, title, description }, i) => (
            <div
              key={step}
              className="relative flex flex-col p-6 rounded-xl border border-slate-200 bg-slate-50 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <span
                className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-golf-primary text-white font-bold text-sm"
                aria-hidden
              >
                {step}
              </span>
              <h3 className="mt-4 font-accent font-semibold text-golf-dark text-lg">
                {title}
              </h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href={mkPath('/design-your-package')}
            className="inline-flex items-center justify-center px-6 py-3 bg-golf-primary text-white font-semibold rounded-lg hover:bg-golf-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary focus-visible:ring-offset-2"
          >
            Start your enquiry
          </Link>
        </div>
      </div>
    </section>
  );
}
