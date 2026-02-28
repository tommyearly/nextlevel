import Link from 'next/link';

const quote =
  'Next Level Web built our site from scratch and we couldn\'t be happier. Clear pricing, no run-around, and the site looks brilliant. We\'re getting more enquiries since we went live. If you need a proper website done right, talk to these lads.';

const clientName = 'DC Drain Cleaning';
const siteUrl = 'https://dcdraincleaning.com';

export default function CustomerReview() {
  return (
    <section
      aria-labelledby="customer-review-heading"
      className="py-20 sm:py-28 relative overflow-hidden scroll-mt-20"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100%,800px)] h-[400px] bg-accent-violet/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <h2 id="customer-review-heading" className="sr-only">
          Customer review
        </h2>

        <div className="max-w-4xl mx-auto">
          {/* Fancy card with gradient border and quote marks */}
          <div className="relative rounded-3xl p-px bg-gradient-to-br from-accent-blue via-accent-violet to-accent-cyan/50 shadow-glow-lg">
            <div className="relative rounded-3xl bg-brand-card/90 backdrop-blur-xl border border-white/10 p-8 sm:p-12 lg:p-16">
              {/* Decorative large quote mark - opening */}
              <span
                className="absolute top-6 left-6 sm:top-8 sm:left-8 text-7xl sm:text-8xl font-serif text-accent-blue/20 select-none leading-none"
                aria-hidden
              >
                &ldquo;
              </span>
              {/* Decorative large quote mark - closing */}
              <span
                className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-7xl sm:text-8xl font-serif text-accent-violet/20 select-none leading-none"
                aria-hidden
              >
                &rdquo;
              </span>

              {/* 5 stars */}
              <div className="flex justify-center gap-1 mb-6 sm:mb-8" aria-hidden>
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="relative z-10 text-center">
                <p className="font-heading text-xl sm:text-2xl lg:text-3xl font-medium text-slate-100 leading-relaxed">
                  {quote}
                </p>
              </blockquote>

              {/* Client attribution */}
              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-accent-blue to-accent-violet flex items-center justify-center text-white font-heading text-lg sm:text-xl font-bold shadow-glow-sm">
                  DC
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-heading font-semibold text-slate-50">
                    {clientName}
                  </p>
                  <Link
                    href={siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-blue hover:text-accent-violet hover:underline text-sm sm:text-base transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded"
                  >
                    dcdraincleaning.com
                  </Link>
                </div>
              </div>

              {/* Subtle "Featured client" badge */}
              <p className="mt-6 text-center text-slate-500 text-xs uppercase tracking-wider">
                Featured client
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
