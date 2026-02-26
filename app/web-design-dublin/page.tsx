import type { Metadata } from 'next';
import Link from 'next/link';
import GradientButton from '@/components/GradientButton';
import GlassCard from '@/components/GlassCard';
import HeroBackground from '@/components/HeroBackground';

const title = 'Web Design Dublin';
const description =
  'Professional web design in Dublin. Irish-run agency with honest pricing, clear packages from €900, and editable sites. Serving Dublin and Ireland. Get a quote in 24 hours.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: '/web-design-dublin',
    title: `${title} | Next Level Web`,
    description,
  },
  twitter: {
    title: `${title} | Next Level Web`,
    description,
  },
  alternates: { canonical: '/web-design-dublin' },
};

export default function WebDesignDublinPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          <GlassCard className="mb-8 sm:mb-10">
            <p className="text-accent-blue font-medium text-sm uppercase tracking-wider">
              Dublin & Ireland
            </p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50 max-w-3xl">
              Web design Dublin — honest pricing, no surprises
            </h1>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl">
              We&apos;re an Irish web design agency serving Dublin and the rest of Ireland. Fixed-price packages (from €900), domain and hosting included. You get an editable website you can update yourself, and we respond within 24 hours. Based in Leixlip, Co. Kildare — easy reach for Dublin businesses.
            </p>
          </GlassCard>

          <GlassCard className="mb-8 sm:mb-10">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-50">
              Why choose us for web design in Dublin
            </h2>
            <ul className="mt-4 space-y-3 text-slate-400 list-disc list-inside">
              <li><strong className="text-slate-300">Clear pricing</strong> — Starter €900, Growth €1,200, Premium €2,000. No hidden fees.</li>
              <li><strong className="text-slate-300">Editable sites</strong> — Change text and images yourself; no need to call us for small updates.</li>
              <li><strong className="text-slate-300">Domain & hosting included</strong> — We set everything up; you own the domain.</li>
              <li><strong className="text-slate-300">24-hour response</strong> — Get in touch and we&apos;ll reply with next steps within a day.</li>
              <li><strong className="text-slate-300">Irish-run</strong> — Real people in Ireland, no outsourced support.</li>
            </ul>
          </GlassCard>

          <GlassCard className="mb-8 sm:mb-10">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-50">
              Web design for Dublin businesses
            </h2>
            <p className="mt-3 text-slate-400">
              Whether you&apos;re in Dublin city centre, the suburbs, or anywhere in Ireland, we build websites that work. Small businesses, trades, consultants, and startups — we keep the process simple: pick a package, send your details, and we get you live in about 3 weeks. Need a site that ranks? We build SEO-friendly pages and can help with Google Business and basic Google Ads setup.
            </p>
          </GlassCard>

          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-6">Ready for a quote? We&apos;ll get back within 24 hours.</p>
            <GradientButton href="/contact" size="lg" ariaLabel="Get a quote for web design Dublin">
              Get a quote
            </GradientButton>
            <p className="mt-6 text-slate-500 text-sm">
              <Link href="/pricing" className="text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue rounded">
                See packages and pricing
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
