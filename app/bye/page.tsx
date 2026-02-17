import Link from 'next/link';

export default function ByePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-md text-center space-y-6">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-50">
          Slán go fóill!
        </h1>
        <p className="text-slate-300 text-lg">
          So long, and thanks for dropping by. We&apos;ll leave the light on for ya—sure you know yourself.
        </p>
        <p className="text-slate-400 text-sm">
          Mind how you go. Come back anytime.
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
