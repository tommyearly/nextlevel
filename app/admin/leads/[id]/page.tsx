import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPaymentBreakdown } from '@/lib/pricing';
import { PROGRESS_STAGES } from '@/lib/progress';
import GlassCard from '@/components/GlassCard';
import DeleteLeadButton from './DeleteLeadButton';

type Props = { params: Promise<{ id: string }> };

export default async function AdminLeadDetailPage({ params }: Props) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') return null;

  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { ticketMessages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!lead) notFound();

  const payment = getPaymentBreakdown(lead.packageId, lead.paymentStatus, lead.totalPaidCents);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Link
          href="/admin"
          prefetch={false}
          className="text-sm text-slate-400 hover:text-accent-blue transition-colors"
        >
          ← Back to leads
        </Link>
        <Link href="/api/auth/logout" prefetch={false} className="text-sm text-slate-400 hover:text-accent-blue transition-colors">
            Sign out
          </Link>
      </div>
      <GlassCard className="p-6 sm:p-8">
        <h1 className="font-heading text-xl font-bold text-slate-50 mb-6">Lead details</h1>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-slate-500 font-medium mb-0.5">Name</dt>
            <dd className="text-slate-200">{lead.name}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium mb-0.5">Email</dt>
            <dd>
              <a href={`mailto:${lead.email}`} className="text-accent-blue hover:underline">
                {lead.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium mb-0.5">Company (optional)</dt>
            <dd className="text-slate-200">{lead.company ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 font-medium mb-0.5">Package</dt>
            <dd className="text-slate-200">{lead.packageLabel}</dd>
            {lead.packageChangeRequestedAt && (
              <dd className="mt-2 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-2 text-sm text-amber-200">
                Package change requested on {new Date(lead.packageChangeRequestedAt).toLocaleString('en-IE')}
                {lead.packageChangeFrom && (
                  <span> (from previous package)</span>
                )}
              </dd>
            )}
          </div>
          <div>
            <dt className="text-slate-500 font-medium mb-0.5">Message</dt>
            <dd className="text-slate-200 whitespace-pre-wrap">{lead.message}</dd>
          </div>
          {(lead as { customerFeedback?: string | null }).customerFeedback && (
            <div>
              <dt className="text-slate-500 font-medium mb-0.5">Customer feedback (review stage)</dt>
              <dd className="text-slate-200 whitespace-pre-wrap">{(lead as { customerFeedback: string }).customerFeedback}</dd>
              {(lead as { customerFeedbackAt?: Date | null }).customerFeedbackAt && (
                <dd className="text-slate-500 text-xs mt-1">
                  {new Date((lead as { customerFeedbackAt: Date }).customerFeedbackAt).toLocaleString('en-IE')}
                </dd>
              )}
            </div>
          )}
        </dl>

        <h2 className="font-heading text-lg font-semibold text-slate-50 mt-8 mb-4">Payment</h2>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-slate-400">Total</dt>
            <dd className="text-slate-200 font-medium">{payment.totalFormatted}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-400">Deposit (€{payment.depositAmount})</dt>
            <dd>
              <span
                className={
                  payment.depositStatus === 'Paid'
                    ? 'text-emerald-400 font-medium'
                    : 'text-amber-400 font-medium'
                }
              >
                {payment.depositStatus}
              </span>
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-400">Balance owed</dt>
            <dd className="flex items-center gap-2">
              <span className="text-slate-200">{payment.balanceFormatted}</span>
              <span
                className={
                  payment.balanceStatus === 'Paid'
                    ? 'text-emerald-400 font-medium'
                    : 'text-amber-400 font-medium'
                }
              >
                {payment.balanceStatus}
              </span>
            </dd>
          </div>
        </dl>
        <form
          action={`/api/admin/leads/${lead.id}/payment`}
          method="POST"
          className="mt-6 pt-6 border-t border-white/5 flex flex-wrap items-end gap-3"
        >
          <label className="block">
            <span className="text-slate-400 text-sm font-medium mb-1.5 block">Payment status</span>
            <select
              name="paymentStatus"
              defaultValue={lead.paymentStatus ?? 'unpaid'}
              className="rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              aria-label="Payment status"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid_deposit">Deposit paid</option>
              <option value="paid_full">Paid in full</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Update
          </button>
        </form>

        <h2 className="font-heading text-lg font-semibold text-slate-50 mt-8 mb-4">Project progress</h2>
        <p className="text-slate-400 text-sm mb-4">Customer sees the staging URL and progress stage in their dashboard.</p>
        <h2 className="font-heading text-lg font-semibold text-slate-50 mt-8 mb-4">Ticket (TKT-{lead.id.slice(-6).toUpperCase()})</h2>
        <p className="text-slate-400 text-sm mb-4">Messages are stacked; reply below to add to the thread. Customer sees this in their dashboard.</p>
        {lead.ticketMessages.length > 0 ? (
          <div className="space-y-3 mb-4" role="log" aria-label="Ticket messages">
            {lead.ticketMessages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg px-3 py-2.5 text-sm ${
                  msg.fromRole === 'admin'
                    ? 'bg-accent-blue/15 border border-accent-blue/30 text-slate-200'
                    : 'bg-white/5 border border-white/10 text-slate-300'
                }`}
              >
                <span className="text-xs text-slate-500 font-medium">
                  {msg.fromRole === 'admin' ? 'You (admin)' : 'Customer'} · {new Date(msg.createdAt).toLocaleString('en-IE')}
                </span>
                <p className="mt-1 whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm mb-4">No messages yet.</p>
        )}
        <form action={`/api/admin/leads/${lead.id}/ticket`} method="POST" className="space-y-2">
          <label className="block">
            <span className="sr-only">Reply</span>
            <textarea
              name="message"
              rows={3}
              placeholder="Reply to customer..."
              className="w-full rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue resize-y min-h-[80px]"
              aria-label="Reply to ticket"
              required
            />
          </label>
          <button
            type="submit"
            className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Send reply
          </button>
        </form>

        <h2 className="font-heading text-lg font-semibold text-slate-50 mt-8 mb-4">Project progress</h2>
        <form action={`/api/admin/leads/${lead.id}/project`} method="POST" className="space-y-4">
          <label className="block">
            <span className="text-slate-400 text-sm font-medium mb-1.5 block">Customer / preview URL</span>
            <input
              type="url"
              name="projectUrl"
              defaultValue={lead.projectUrl ?? ''}
              placeholder="https://staging.example.com or https://your-site.vercel.app"
              className="w-full rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
              aria-label="Preview URL for customer"
            />
          </label>
          <label className="block">
            <span className="text-slate-400 text-sm font-medium mb-1.5 block">Progress stage</span>
            <select
              name="progressStage"
              defaultValue={lead.progressStage ?? ''}
              className="rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue min-w-[220px]"
              aria-label="Progress stage"
            >
              <option value="">— Select stage —</option>
              {PROGRESS_STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface">
            Save URL &amp; stage
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-white/10">
          <p className="text-slate-500 text-sm mb-3">Delete this lead permanently. The customer will no longer be able to sign in to their dashboard.</p>
          <DeleteLeadButton leadId={lead.id} leadName={lead.name} />
        </div>
      </GlassCard>
    </div>
  );
}
