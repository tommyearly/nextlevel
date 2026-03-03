import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import MartinKellyHeader from '@/components/martin-kelly/Header';
import MartinKellyFooter from '@/components/martin-kelly/Footer';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Costa del Sol Golf | Golf Holidays for Irish Travellers', template: '%s | Costa del Sol Golf' },
  description: 'Tailor-made golf holidays on the Costa del Sol. Courses, accommodation & packages for Irish golfers. Direct from Ireland.',
  keywords: ['Costa del Sol golf', 'golf holidays Spain', 'Irish golfers', 'golf breaks from Ireland', 'Marbella golf', 'Malaga golf'],
  openGraph: { type: 'website', locale: 'en_IE', title: 'Costa del Sol Golf | Golf Holidays for Irish Travellers', description: 'Tailor-made golf holidays on the Costa del Sol for Irish golfers.' },
  robots: { index: true, follow: true },
};

export default function MartinKellyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`min-h-screen flex flex-col bg-[#fafaf9] text-[#0f172a] ${dmSans.variable} ${playfair.variable}`} style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif' }}>
      <MartinKellyHeader />
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      <MartinKellyFooter />
    </div>
  );
}
