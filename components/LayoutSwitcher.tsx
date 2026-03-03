'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppLink from '@/components/WhatsAppLink';
import CookieBanner from '@/components/CookieBanner';

const CLIENT_BASE = '/martin-kelly-costa-del-sol';

export default function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isClientSite = pathname?.startsWith(CLIENT_BASE);

  if (isClientSite) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="flex-1" role="main">
        {children}
      </main>
      <Footer />
      <WhatsAppLink />
      <CookieBanner />
    </>
  );
}
