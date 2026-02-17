import Link from 'next/link';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPaymentBreakdown } from '@/lib/pricing';
import GlassCard from '@/components/GlassCard';

export default async function AdminPage() {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return null;
  }

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { ticketMessages: true } } },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-50">
          Leads
        </h1>
        <Link href="/api/auth/logout" className="text-sm text-slate-400 hover:text-accent-blue transition-colors">
            Sign out
          </Link>
      </div>
      <GlassCard className="overflow-hidden">
        {leads.length === 0 ? (
          <p className="p-6 text-slate-400">No leads yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 font-heading font-semibold text-slate-300">Name</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Email</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Package</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Date</th>
                  <th className="p-4 font-heading font-semibold text-slate-300">Notes</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => {
                  const payment = getPaymentBreakdown(lead.packageId, lead.paymentStatus);
                  const paymentLabel =
                    payment.depositStatus === 'Paid' && payment.balanceStatus === 'Paid'
                      ? 'Paid in full'
                      : payment.depositStatus === 'Paid'
                        ? 'Deposit paid'
                        : 'Unpaid';
                  const paymentClass =
                    paymentLabel === 'Paid in full'
                      ? 'text-emerald-400'
                      : paymentLabel === 'Deposit paid'
                        ? 'text-amber-400'
                        : 'text-slate-500';
                  return (
                    <tr key={lead.id} className="border-b border-white/5 last:border-0">
                      <td className="p-4">
                        <Link href={`/admin/leads/${lead.id}`} prefetch={false} className="text-slate-200 hover:text-accent-blue hover:underline font-medium">
                          {lead.name}
                        </Link>
                      </td>
                      <td className="p-4">
                        <a
                          href={`mailto:${lead.email}`}
                          className="text-accent-blue hover:underline"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="p-4 text-slate-300">{lead.packageLabel}</td>
                      <td className="p-4 text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString('en-IE')}
                      </td>
                      <td className="p-4">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-medium ${paymentClass}`} title={`Deposit: ${payment.depositStatus}, Balance: ${payment.balanceStatus}`}>
                            {paymentLabel}
                          </span>
                          {lead.packageChangeRequestedAt && (
                            <span className="inline-flex items-center rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-medium text-amber-400">
                              Change requested
                            </span>
                          )}
                          {lead._count.ticketMessages > 0 && (
                            <span className="text-slate-500 text-xs">
                              {lead._count.ticketMessages} ticket message{lead._count.ticketMessages !== 1 ? 's' : ''}
                            </span>
                          )}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
      <p className="mt-6">
        <Link href="/" className="text-accent-blue hover:underline text-sm">
          Back to home
        </Link>
      </p>
    </div>
  );
}
