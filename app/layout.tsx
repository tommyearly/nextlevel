import type { Metadata } from 'next';
import Script from 'next/script';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppLink from '@/components/WhatsAppLink';
import CookieBanner from '@/components/CookieBanner';
import StructuredData from '@/components/StructuredData';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const siteUrl = 'https://www.nextlevelweb.ie';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Next Level Web | Web Design & Development Agency | Ireland',
    template: '%s | Next Level Web',
  },
  description:
    'Honest website design run by Irish people. Clear pricing, no surprises — editable pages so you can update your site yourself. Next Level Web — Leixlip, Kildare.',
  keywords: [
    'web design Dublin',
    'web design Ireland',
    'Irish web design',
    'honest web design pricing',
    'editable website',
    'web development agency',
    'nextlevelweb',
  ],
  authors: [{ name: 'Next Level Web', url: siteUrl }],
  creator: 'Next Level Web',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: siteUrl,
    siteName: 'Next Level Web',
    title: 'Next Level Web | Web Design & Development Agency | Ireland',
    description:
      'Honest website design run by Irish people. Clear pricing, no surprises — editable pages. Next Level Web, Leixlip.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Next Level Web — Web Design & Development Agency',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next Level Web | Web Design & Development Agency | Ireland',
    description: 'Honest website design run by Irish people. Clear pricing, no surprises — editable pages.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: siteUrl },
  icons: {
    icon: '/icon',
    apple: '/apple-icon',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17971880740" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17971880740');
          `}
        </Script>
        <StructuredData />
        <Navbar />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
        <WhatsAppLink />
        <CookieBanner />
      </body>
    </html>
  );
}
