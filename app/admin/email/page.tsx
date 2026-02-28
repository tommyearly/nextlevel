import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import GlassCard from '@/components/GlassCard';
import AddSubscriberForm from '@/app/admin/email/AddSubscriberForm';

export const dynamic = 'force-dynamic';

type Props = { searchParams: Promise<{ filter?: string }> };

export default async function AdminEmailPage({ searchParams }: Props) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return null;
  }

  const params = await searchParams;
  const filter = params.filter === 'unsubscribed' ? 'unsubscribed' : params.filter === 'subscribed' ? 'subscribed' : 'all';

  const [subscribers, counts] = await Promise.all([
    prisma.emailSubscriber.findMany({
      where: filter === 'all' ? undefined : { status: filter },
      orderBy: { subscribedAt: 'desc' },
    }),
    prisma.emailSubscriber.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  const subscribedCount = counts.find((c) => c.status === 'subscribed')?._count ?? 0;
  const unsubscribedCount = counts.find((c) => c.status === 'unsubscribed')?._count ?? 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-50">
          Email subscribers
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/email/send" prefetch={false} className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-accent-blue to-accent-violet text-white text-sm font-semibold hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue">
            Send campaign
          </Link>
          <Link href="/admin" prefetch={false} className="text-slate-400 hover:text-accent-blue text-sm">
            Back to leads
          </Link>
        </div>
      </div>

      <GlassCard className="mb-8 p-6">
        <h2 className="font-heading text-lg font-semibold text-slate-50 mb-4">Add subscriber</h2>
        <AddSubscriberForm />
      </GlassCard>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-slate-400 text-sm">
          <strong className="text-slate-200">{subscribedCount}</strong> subscribed
          {' · '}
          <strong className="text-slate-200">{unsubscribedCount}</strong> unsubscribed
        </span>
        <span className="flex gap-2">
          <Link
            href={filter === 'all' ? '/admin/email' : '/admin/email'}
            prefetch={false}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-accent-blue/20 text-accent-blue' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All
          </Link>
          <Link
            href="/admin/email?filter=subscribed"
            prefetch={false}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'subscribed' ? 'bg-accent-blue/20 text-accent-blue' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Subscribed
          </Link>
          <Link
            href="/admin/email?filter=unsubscribed"
            prefetch={false}
            className={`px-3 py-1 rounded-lg text-sm ${filter === 'unsubscribed' ? 'bg-accent-blue/20 text-accent-blue' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Unsubscribed
          </Link>
        </span>
      </div>

      <GlassCard className="overflow-hidden">
        {subscribers.length === 0 ? (
          <p className="p-6 text-slate-400">
            {filter === 'all' ? 'No subscribers yet.' : `No ${filter} subscribers.`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 font-heading font-semibold text-slate-300">Email</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Name</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Status</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/5 last:border-0">
                    <td className="p-4">
                      <a href={`mailto:${sub.email}`} className="text-accent-blue hover:underline">
                        {sub.email}
                      </a>
                    </td>
                    <td className="p-4 text-slate-300">{sub.name ?? '—'}</td>
                    <td className="p-4">
                      <span
                        className={
                          sub.status === 'subscribed'
                            ? 'text-emerald-400'
                            : 'text-slate-500'
                        }
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {sub.status === 'unsubscribed' && sub.unsubscribedAt
                        ? new Date(sub.unsubscribedAt).toLocaleDateString('en-IE')
                        : new Date(sub.subscribedAt).toLocaleDateString('en-IE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
