import GlassCard from './GlassCard';
import GradientButton from './GradientButton';
import { DISPLAY_PACKAGES } from '@/lib/packages';

export default function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="py-12 sm:py-16 md:py-24 scroll-mt-16"
    >
      <div className="w-full px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-8 sm:mb-12">
            <h2
              id="pricing-heading"
              className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-slate-50"
            >
              Simple pricing when you&apos;re ready
            </h2>
            <p className="mt-3 sm:mt-4 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
              Irish-run, no surprises. One-off price with domain & hosting included — and editable pages so you can update your site yourself.
            </p>
          </header>

          <ul
            className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-6 lg:gap-8 list-none p-0 m-0"
            role="list"
          >
            {DISPLAY_PACKAGES.map((pkg) => (
              <li key={pkg.id} className="min-w-0">
                <GlassCard
                  className={`h-full flex flex-col text-center md:text-left ${pkg.popular ? 'ring-2 ring-accent-glow/50 shadow-glow-sm' : ''}`}
                >
                  {pkg.popular && (
                    <span className="absolute top-0 right-4 -translate-y-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-blue to-accent-violet text-xs font-bold text-white shadow-glow-sm badge-text-3d animate-badge-pulse">
                      Most popular
                    </span>
                  )}
                  <div className={`rounded-xl p-4 sm:p-5 mb-5 bg-gradient-to-br ${pkg.gradient} -mx-1 sm:-mx-2 mt-1 sm:mt-2`}>
                    <p className="text-xs sm:text-sm font-medium text-accent-blue uppercase tracking-wider">
                      {pkg.tagline}
                    </p>
                    <p className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-slate-50">
                      €{pkg.price}
                      <span className="text-sm sm:text-base font-normal text-slate-400"> one-off</span>
                    </p>
                  </div>
                  <h3 className="font-heading text-lg sm:text-xl font-semibold text-slate-50">{pkg.name}</h3>
                  <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-2.5 flex-1 text-left" role="list">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-slate-400 text-sm sm:text-base">
                        <span className="text-accent-blue mt-0.5 shrink-0" aria-hidden>✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/5">
                    <GradientButton
                      href={`/contact?package=${pkg.id}`}
                      size="lg"
                      className="w-full min-h-[48px] sm:min-h-0"
                      ariaLabel={`${pkg.cta} — ${pkg.name} €${pkg.price}`}
                    >
                      {pkg.cta}
                    </GradientButton>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>

          <div className="mt-8 sm:mt-12 max-w-3xl mx-auto p-4 sm:p-6 rounded-2xl bg-brand-card/40 border border-white/5 text-center">
            <p className="text-slate-300 text-sm sm:text-base">
              <strong className="text-slate-50">€200 deposit</strong> secures your spot; we&apos;ll send a link to pay. Balance before launch. No hidden fees — just honest, Irish service.
            </p>
            <p className="mt-2 text-slate-500 text-xs sm:text-sm">
              Need something different? Choose <strong className="text-slate-400">Custom</strong> when you get in touch and we&apos;ll figure it out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
