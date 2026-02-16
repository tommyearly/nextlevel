import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import HeroBackground from '@/components/HeroBackground';
import { SITE } from '@/lib/site';

const title = 'Contact';
const description =
  'Get in touch with Next Level Web — Irish-run, honest pricing, no surprises. We respond within 24 hours.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: '/contact',
    title: `${title} | Next Level Web`,
    description,
  },
  twitter: {
    title: `${title} | Next Level Web`,
    description,
  },
  alternates: { canonical: '/contact' },
};

type ContactPageProps = {
  searchParams?: { package?: string | string[] };
};

export default function ContactPage({ searchParams }: ContactPageProps) {
  const packageParam = searchParams?.package;
  const defaultPackage = Array.isArray(packageParam) ? packageParam[0] : packageParam ?? undefined;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <header className="text-center mb-12 sm:mb-16">
            <p className="text-accent-blue font-medium text-sm uppercase tracking-wider">Get in touch</p>
            <div className="hero-title-3d-wrapper mt-2">
              <h1 className="hero-title-3d font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-slate-50 text-center">
                Jump start{' '}
                <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-violet bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  your company
                </span>
              </h1>
            </div>
            <p className="mt-6 text-slate-400 text-lg">
              Irish-run, honest pricing, no surprises. Tell us your goals and we&apos;ll get back within 24 hours with clear next steps.
            </p>
          </header>
          <ContactForm defaultPackage={defaultPackage} />
          <div className="mt-10 p-6 rounded-2xl border border-white/5 bg-brand-card/40 backdrop-blur-sm">
            <h2 className="font-heading text-lg font-semibold text-slate-200 mb-3">Contact details</h2>
            <p className="text-slate-400 text-sm">
              <span className="text-slate-500">Address:</span>{' '}
              {SITE.address}
            </p>
            <p className="mt-2 text-slate-400 text-sm">
              <span className="text-slate-500">Mobile:</span>{' '}
              <a href={`tel:+${SITE.phoneE164}`} className="text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded">
                {SITE.phone}
              </a>
            </p>
            <p className="mt-2 text-slate-400 text-sm">
              <span className="text-slate-500">Email:</span>{' '}
              <a href={`mailto:${SITE.email}`} className="text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded">
                {SITE.email}
              </a>
            </p>
          </div>
          <p className="mt-8 text-center text-slate-500 text-sm">
            Prefer email?{' '}
            <a
              href={`mailto:${SITE.email}`}
              className="text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-brand-surface rounded"
            >
              {SITE.email}
            </a>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
