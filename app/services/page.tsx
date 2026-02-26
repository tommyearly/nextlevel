import type { Metadata } from 'next';
import Link from 'next/link';
import GradientButton from '@/components/GradientButton';
import GlassCard from '@/components/GlassCard';
import HeroBackground from '@/components/HeroBackground';

const title = 'Services';
const description =
  'Pick a package and we handle the rest: website, domain, hosting, Google Business, email, Facebook page, and more. Done in about 3 weeks.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: '/services',
    title: `${title} | Next Level Web`,
    description,
  },
  twitter: {
    title: `${title} | Next Level Web`,
    description,
  },
  alternates: { canonical: '/services' },
};

const included = [
  { title: 'Domain name & hosting', detail: 'We buy and set them up. You own the domain.' },
  { title: 'Your website', detail: '5 pages, contact form, your info and photos. Editable so you can change text yourself on the higher packages.' },
  { title: 'Google Business listing', detail: 'So you show up when people search locally.' },
  { title: 'Email accounts', detail: 'Professional email addresses using your domain (e.g. hello@yourbusiness.ie).' },
  { title: 'Basic Google Ads set-up', detail: 'We get your first campaign in place so you can start getting clicks.' },
  { title: 'Facebook page', detail: 'We create it and add cover images, your logo, and basic info.' },
  { title: 'Contact details & social links', detail: 'Phone, email, address, and links to your socials in one place on the site.' },
  { title: 'Privacy policy & cookie page', detail: 'The legal pages your site needs. We add them for you.' },
  { title: 'WhatsApp link', detail: 'A button on the site so visitors can message you on WhatsApp.' },
];

export default function ServicesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 pt-16 sm:pt-24 pb-20 sm:pb-28">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Intro block — honest, Irish, we want you to succeed */}
          <GlassCard className="mb-8 sm:mb-10">
            <p className="text-accent-blue font-medium text-sm uppercase tracking-wider">
              Good, honest website design
            </p>
            <h1 className="mt-2 font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50 max-w-3xl">
              We want you to succeed
            </h1>
            <p className="mt-4 text-slate-400 text-lg max-w-2xl">
              We&apos;re an Irish team doing hard-working, straightforward website design. No jargon, no price hikes, no surprises. You choose a package — we do the rest. Our job is to get you online and set up so you can get on with yours. We serve Dublin and all of Ireland — see our <Link href="/web-design-dublin" className="text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded">web design Dublin</Link> page for more.
            </p>
          </GlassCard>

          {/* How it works block */}
          <GlassCard className="mb-8 sm:mb-10">
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-slate-50">
              Simple as this
            </h2>
            <p className="mt-3 text-slate-400">
              Pick the package that fits. Send us your details and what you do. We build the site, sort the domain and hosting, and get you set up on Google and Facebook. Everything below is included. Usually done in about <strong className="text-slate-300">3 weeks</strong>.
            </p>
          </GlassCard>

          {/* What you get — as blocks */}
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-50 mb-6">
            What you get
          </h2>
          <p className="text-slate-400 mb-8">
            All of this is part of the service. No hidden extras.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {included.map(({ title, detail }) => (
              <li key={title}>
                <GlassCard className="h-full">
                  <h3 className="font-heading text-lg font-semibold text-slate-50">{title}</h3>
                  <p className="mt-2 text-slate-400 text-sm leading-relaxed">{detail}</p>
                </GlassCard>
              </li>
            ))}
          </ul>

          {/* Timeframe block */}
          <GlassCard className="mt-10">
            <h3 className="font-heading text-xl font-semibold text-slate-50">
              How long does it take?
            </h3>
            <p className="mt-3 text-slate-400">
              From the day we have your content and details, we aim to have your site live and everything above set up in about <strong className="text-slate-300">3 weeks</strong>. If we need a bit longer we&apos;ll tell you upfront.
            </p>
          </GlassCard>

          {/* CTA block */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 mb-6">Ready to pick a package?</p>
            <GradientButton href="/pricing" size="lg">
              See pricing
            </GradientButton>
          </div>
        </div>
      </div>
    </div>
  );
}
