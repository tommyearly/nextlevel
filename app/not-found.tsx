import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-50">
          Page not found
        </h1>
        <p className="text-slate-300 text-lg">
          This page doesn&apos;t exist or has been moved. No bother—head back and we&apos;ll get you sorted.
        </p>
        <p className="text-slate-400 text-sm">
          If you were looking for something specific, try the menu or get in touch.
        </p>
        <div className="pt-4">
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
