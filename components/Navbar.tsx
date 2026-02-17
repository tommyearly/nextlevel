'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useCallback } from 'react';
import LogoIcon from '@/components/LogoIcon';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleToggle = useCallback(() => setMobileOpen((prev) => !prev), []);
  const handleClose = useCallback(() => setMobileOpen(false), []);
  const isProtectedPage = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 w-full border-b border-white/5 bg-brand-surface/80 backdrop-blur-xl"
    >
      <nav
        className="container mx-auto flex h-16 sm:h-18 items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          prefetch={!isProtectedPage}
          className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-slate-50 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded group"
          onClick={handleClose}
        >
          <LogoIcon size="md" className="animate-icon-float group-hover:shadow-glow group-hover:border-accent-glow/30 transition-all duration-300" />
          <span>Next Level Web</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                prefetch={!isProtectedPage}
                className={`text-sm font-medium transition-colors rounded px-2 py-1 ${
                  pathname === href ? 'text-accent-blue' : 'text-slate-300 hover:text-slate-50'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface`}
                onClick={handleClose}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            prefetch={!isProtectedPage}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-accent-blue to-accent-violet text-white shadow-glow-sm hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Get in touch
          </Link>
          <button
            type="button"
            onClick={handleToggle}
            className="md:hidden inline-flex flex-col justify-center items-center w-10 h-10 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current my-1 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </nav>
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
        role="region"
        aria-label="Mobile menu"
      >
        <ul className="container mx-auto flex flex-col gap-1 px-4 pb-4 pt-2" role="list">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                prefetch={!isProtectedPage}
                className={`block py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href ? 'text-accent-blue bg-accent-blue/10' : 'text-slate-300 hover:text-slate-50 hover:bg-white/5'
                }`}
                onClick={handleClose}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Link href="/contact" prefetch={!isProtectedPage} className="block py-3 px-4 rounded-lg text-sm font-semibold bg-gradient-to-r from-accent-blue to-accent-violet text-white text-center" onClick={handleClose}>
              Get in touch
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
