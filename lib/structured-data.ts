import { SITE } from './site';

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? 'https://nextlevelweb.ie';

/**
 * LocalBusiness JSON-LD for rich snippets (Google, etc.).
 * Used on homepage and contact page.
 */
export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl.replace(/\/$/, '')}/#organization`,
    name: 'Next Level Web',
    description:
      'Honest website design run by Irish people. Clear pricing, no surprises — editable pages so you can update your site yourself. Web design and development agency in Leixlip, Co. Kildare.',
    url: baseUrl.replace(/\/$/, ''),
    email: SITE.email,
    telephone: `+${SITE.phoneE164}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '38 Easton Drive',
      addressLocality: 'Leixlip',
      addressRegion: 'Co. Kildare',
      addressCountry: 'IE',
    },
    areaServed: [
      { '@type': 'City', name: 'Dublin' },
      { '@type': 'City', name: 'Leixlip' },
      { '@type': 'Country', name: 'Ireland' },
    ],
    priceRange: '€900 - €2,000',
  };
}
