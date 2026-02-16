export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-surface text-slate-100 font-body antialiased">
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
