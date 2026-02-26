import Link from 'next/link';
import LogoIcon from '@/components/LogoIcon';
import { SITE } from '@/lib/site';

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/web-design-dublin', label: 'Web design Dublin' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-white/5 bg-brand-primary/80 backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 font-heading text-2xl font-bold text-slate-50 hover:text-accent-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded"
            >
              <LogoIcon size="lg" />
              Next Level Web
            </Link>
            <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-md">
              Good, honest website design run by Irish people. Clear pricing, no surprises — with editable pages so you can update your site yourself.
            </p>
            <p className="mt-4 text-slate-500 text-sm">
              {SITE.address}
            </p>
            <p className="mt-1 text-slate-500 text-sm">
              <a href={`tel:+${SITE.phoneE164}`} className="hover:text-accent-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded">
                {SITE.phone}
              </a>
              {' · '}
              <a href={`mailto:${SITE.email}`} className="hover:text-accent-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded">
                {SITE.email}
              </a>
            </p>
            <p className="mt-1 text-slate-600 text-xs">
              nextlevelweb.ie — 100% Irish
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-slate-200 text-sm uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="mt-4 space-y-3" role="list">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-accent-blue transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-slate-200 text-sm uppercase tracking-wider">
              Legal
            </h3>
            <ul className="mt-4 space-y-3" role="list">
              {legalLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-accent-blue transition-colors text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Next Level Web. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Built for performance. Designed for growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
