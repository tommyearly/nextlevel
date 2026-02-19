'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-50">
          Something went wrong
        </h1>
        <p className="text-slate-300 text-lg">
          We hit a snag loading this page. It&apos;s not you—give it another go or head back home.
        </p>
        <p className="text-slate-400 text-sm">
          If it keeps happening, drop us a line and we&apos;ll sort it.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-accent-blue px-6 py-3 text-sm font-medium text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
