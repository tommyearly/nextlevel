import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.nextlevelweb.ie';
  const baseUrl = base.replace(/\/$/, '');

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/admin', '/api'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
