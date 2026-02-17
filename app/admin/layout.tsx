import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-surface text-slate-100 font-body antialiased">
      <header className="border-b border-white/5 bg-brand-card/40 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/" prefetch={false} className="font-heading text-lg font-bold text-slate-50">Next Level Web</Link>
          <span className="text-sm text-slate-400">Admin</span>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
    </div>
  );
}
