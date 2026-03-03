'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { mkPath } from '@/lib/martin-kelly-base';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Golf Courses' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/design-your-package', label: 'Design Your Package' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export default function MartinKellyHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = () => setMobileOpen((p) => !p);
  const close = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-[#e7e5e4] shadow-card" role="banner">
      <div className="container flex items-center justify-between h-16">
        <Link href={mkPath('/')} className="font-accent text-xl md:text-2xl font-bold text-golf-dark tracking-tight hover:text-golf-primary transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary focus-visible:ring-offset-2" aria-label="Costa del Sol Golf - Home">
          Costa del Sol Golf
        </Link>
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const fullHref = mkPath(href);
            const isActive = pathname === fullHref || (href !== '/' && pathname?.startsWith(fullHref));
            return (
              <Link key={href} href={fullHref} className={`text-sm font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary focus-visible:ring-offset-2 ${isActive ? 'text-golf-primary' : 'text-slate-600 hover:text-golf-primary'}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <a href="tel:+353866006202" className="hidden md:inline-flex items-center px-4 py-2 bg-golf-primary text-white text-sm font-semibold rounded-lg hover:bg-golf-dark transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary focus-visible:ring-offset-2" aria-label="Call us: 086 600 6202">
          086 600 6202
        </a>
        <button type="button" className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-primary" onClick={toggle} aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label="Toggle menu">
          <span className="sr-only">{mobileOpen ? 'Close' : 'Open'} menu</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      <div id="mobile-nav" className={`md:hidden border-t border-[#e7e5e4] bg-white ${mobileOpen ? 'block' : 'hidden'}`} aria-hidden={!mobileOpen}>
        <nav className="container py-4 flex flex-col gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={mkPath(href)} onClick={close} className={`px-4 py-3 rounded-lg text-sm font-medium ${pathname === mkPath(href) ? 'bg-golf-pale text-golf-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
              {label}
            </Link>
          ))}
          <a href="tel:+353866006202" onClick={close} className="px-4 py-3 rounded-lg text-sm font-semibold text-golf-primary hover:bg-golf-pale">
            086 600 6202
          </a>
        </nav>
      </div>
    </header>
  );
}
