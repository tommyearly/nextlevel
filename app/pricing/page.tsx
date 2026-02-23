import type { Metadata } from 'next';
import GradientButton from '@/components/GradientButton';
import GlassCard from '@/components/GlassCard';
import HeroBackground from '@/components/HeroBackground';
import { DISPLAY_PACKAGES } from '@/lib/packages';

const title = 'Pricing';
const description =
  'Honest, clear website pricing — no surprises. €900 to €2,000 one-off. Irish-run. Domain & hosting included. Editable pages. €200 deposit.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: '/pricing',
    title: `${title} | Next Level Web`,
    description,
  },
  twitter: {
    title: `${title} | Next Level Web`,
    description,
  },
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 min-h-screen">
        {/* Hero */}
        <section className="relative pt-16 sm:pt-24 pb-10 sm:pb-14 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 via-transparent to-transparent pointer-events-none" aria-hidden />
          <div className="w-full px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-accent-blue font-semibold text-xs sm:text-sm uppercase tracking-[0.2em]">
                Honest pricing. Run by Irish people. No surprises.
              </p>
              <div className="hero-title-3d-wrapper mt-4 max-w-4xl mx-auto">
                <h1 className="hero-title-3d font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 leading-tight text-center">
                  Get a website that{' '}
                  <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-violet bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    works for you
                  </span>
                </h1>
              </div>
              <p className="mt-4 sm:mt-6 text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
                Clear, honest pricing — no price hikes. Domain & hosting included. <strong className="text-slate-300">€200 deposit</strong> to secure your spot; we&apos;ll send a payment link. Balance before launch.
              </p>
              <div className="mt-8 sm:mt-10">
                <GradientButton href="/contact" size="lg" className="min-h-[48px] sm:min-h-0" ariaLabel="Reserve my spot">
                  Reserve my spot
                </GradientButton>
              </div>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <div className="border-y border-white/5 bg-brand-card/30">
          <div className="w-full px-4 sm:px-6 py-5 sm:py-6">
            <ul className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12 text-center text-sm text-slate-400 max-w-4xl mx-auto" role="list">
              <li><strong className="text-slate-300">100% Irish</strong> — run by Irish people</li>
              <li><strong className="text-slate-300">Honest pricing</strong> — no price hikes or surprises</li>
              <li><strong className="text-slate-300">Editable pages</strong> — update content yourself</li>
              <li><strong className="text-slate-300">Domain & hosting</strong> included</li>
              <li><strong className="text-slate-300">You own it</strong> — no lock-in</li>
            </ul>
          </div>
        </div>

        {/* Pricing cards — mobile-first, same structure as homepage */}
        <section
          id="packages"
          aria-labelledby="packages-heading"
          className="py-12 sm:py-16 md:py-24 scroll-mt-16"
        >
          <div className="w-full px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 id="packages-heading" className="sr-only">
                Choose your package
              </h2>
              <ul
                className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-6 lg:gap-8 list-none p-0 m-0"
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
            </div>
          </div>
        </section>

        {/* Deposit & CTA block */}
        <section className="py-12 sm:py-16 md:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-accent-violet/5 to-transparent pointer-events-none" aria-hidden />
          <div className="relative z-10 w-full px-4 sm:px-6">
            <div className="max-w-3xl mx-auto rounded-2xl sm:rounded-3xl border border-accent-glow/20 bg-brand-card/60 backdrop-blur-sm p-6 sm:p-10 md:p-12 text-center shadow-glow-sm">
              <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold text-slate-50">
                €200 deposit secures your project
              </h2>
              <p className="mt-3 sm:mt-4 text-slate-400 text-sm sm:text-base">
                We&apos;ll send a Stripe link to pay your deposit. The balance is due before we launch your site. No hidden fees, no price hikes — guaranteed Irish, honest pricing. The price you see is the price you pay.
              </p>
              <p className="mt-4 sm:mt-6 text-slate-500 text-xs sm:text-sm">
                Need something custom? Get in touch and we&apos;ll quote for your project.
              </p>
              <div className="mt-8 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
                <GradientButton href="/contact" size="lg" className="min-h-[48px] sm:min-h-0" ariaLabel="Get in touch">
                  Get in touch
                </GradientButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
