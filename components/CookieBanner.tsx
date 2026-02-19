'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';

export default function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setAccepted(stored === 'accepted');
    setMounted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setAccepted(true);
  };

  if (!mounted || accepted !== false) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5"
    >
      <div className="mx-auto max-w-4xl rounded-t-2xl border border-white/10 border-b-0 bg-[#111827] shadow-[0_-4px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm text-slate-300 sm:text-base">
            We use cookies to run the site and remember your preferences. By clicking Accept you agree to our use of cookies.{' '}
            <Link
              href="/privacy"
              className="font-medium text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827] rounded"
            >
              Privacy policy
            </Link>
          </p>
          <div className="flex flex-shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={handleAccept}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-violet px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-[#111827] transition-opacity"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
