import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPackagePricing, getPaymentBreakdown } from '@/lib/pricing';
import { getCheckoutPriceId, hasStripeConfig } from '@/lib/stripe';
import { PROGRESS_STAGES, getProgressStageIndex } from '@/lib/progress';
import GlassCard from '@/components/GlassCard';
import GradientButton from '@/components/GradientButton';
import FeedbackForm from '@/app/dashboard/FeedbackForm';

export default async function DashboardPage() {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'customer') redirect('/dashboard/login');

  const lead = await prisma.lead.findFirst({
    where: { email: session.email },
    orderBy: { createdAt: 'desc' },
    include: { ticketMessages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!lead) redirect('/dashboard/login');

  const pricing = getPackagePricing(lead.packageId);
  const payment = getPaymentBreakdown(lead.packageId, lead.paymentStatus);
  const canPayDeposit = hasStripeConfig() && getCheckoutPriceId(lead.packageId, 'deposit');
  const canPayBalance = hasStripeConfig() && getCheckoutPriceId(lead.packageId, 'balance');
  const currentStageIndex = getProgressStageIndex(lead.progressStage);
  const currentStage = lead.progressStage ? PROGRESS_STAGES.find((s) => s.id === lead.progressStage) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-50">Your dashboard</h1>
        <Link href="/api/auth/logout" className="text-sm text-slate-400 hover:text-accent-blue transition-colors">
            Sign out
          </Link>
      </div>
      <GlassCard className="p-6 sm:p-8">
        <h2 className="font-heading text-lg font-semibold text-slate-50 mb-4">Your package</h2>
        <p className="text-slate-300">{lead.packageLabel}</p>
        <dl className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-slate-400">Total</dt>
            <dd className="text-slate-50 font-medium">{pricing.totalFormatted}</dd>
          </div>
          <div className="flex justify-between text-sm items-center">
            <dt className="text-slate-400">Deposit (€{payment.depositAmount})</dt>
            <dd>
              <span className={payment.depositStatus === 'Paid' ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                {payment.depositStatus}
              </span>
            </dd>
          </div>
          <div className="flex justify-between text-sm items-center">
            <dt className="text-slate-400">Balance</dt>
            <dd>
              <span className="text-slate-300">{payment.balanceFormatted}</span>
              <span className={`ml-2 ${payment.balanceStatus === 'Paid' ? 'text-emerald-400 font-medium' : 'text-slate-400'}`}>
                {payment.balanceStatus}
              </span>
            </dd>
          </div>
        </dl>
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-slate-400 text-sm mb-4">
            Pay your €200 deposit online. Balance before launch.
          </p>
          {payment.depositStatus === 'Paid' && payment.balanceStatus === 'Paid' ? (
            <p className="text-emerald-400 font-medium text-sm">You&apos;re all paid. Thank you.</p>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {payment.depositStatus !== 'Paid' && canPayDeposit && (
                <form action="/api/dashboard/checkout" method="POST">
                  <input type="hidden" name="type" value="deposit" />
                  <button
                    type="submit"
                    className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
                    aria-label="Pay €200 deposit"
                  >
                    Pay deposit (€200)
                  </button>
                </form>
              )}
              {payment.depositStatus === 'Paid' && payment.balanceStatus !== 'Paid' && canPayBalance && (
                <form action="/api/dashboard/checkout" method="POST">
                  <input type="hidden" name="type" value="balance" />
                  <button
                    type="submit"
                    className="rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
                    aria-label={`Pay balance ${payment.balanceFormatted}`}
                  >
                    Pay balance ({payment.balanceFormatted})
                  </button>
                </form>
              )}
              {!canPayDeposit && payment.depositStatus !== 'Paid' && (
                <p className="text-slate-500 text-sm">Payment link for your package will be sent by email.</p>
              )}
              {payment.depositStatus === 'Paid' && !canPayBalance && payment.balanceStatus !== 'Paid' && (
                <p className="text-slate-500 text-sm">We&apos;ll send you a link to pay the balance before launch.</p>
              )}
            </div>
          )}
        </div>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8 mt-6">
        <h2 className="font-heading text-lg font-semibold text-slate-50 mb-4">Your project progress</h2>
        {lead.projectUrl ? (
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-2">Preview your site</p>
            <a
              href={lead.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-accent-blue/20 hover:bg-accent-blue/30 border border-accent-blue/40 px-4 py-2.5 text-sm font-medium text-accent-blue transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
            >
              View your site
              <span className="text-xs" aria-hidden>↗</span>
            </a>
          </div>
        ) : (
          <p className="text-slate-500 text-sm mb-4">A preview link will appear here when your site is ready to view.</p>
        )}
        {currentStage ? (
          <>
            <p className="text-slate-400 text-sm mb-3">Current stage</p>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-4">
              <p className="font-heading font-semibold text-slate-50">{currentStage.customerLabel}</p>
              <p className="text-slate-400 text-sm mt-1">{currentStage.customerHint}</p>
              {currentStage.id === 'your_review' && (
                <FeedbackForm
                  existingFeedback={lead.customerFeedback ?? null}
                  existingFeedbackAt={lead.customerFeedbackAt ?? null}
                />
              )}
            </div>
          </>
        ) : (
          <p className="text-slate-500 text-sm mb-4">We&apos;ll update the stage as we work on your site.</p>
        )}
        <div className="space-y-2" role="list" aria-label="Project stages">
          {PROGRESS_STAGES.map((stage, idx) => {
            const isDone = currentStage ? idx < currentStageIndex : false;
            const isCurrent = currentStage ? idx === currentStageIndex : false;
            return (
              <div
                key={stage.id}
                role="listitem"
                className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm ${
                  isCurrent ? 'bg-accent-blue/15 border border-accent-blue/40' : 'bg-white/5 border border-transparent'
                } ${isDone ? 'opacity-80' : ''}`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    isDone ? 'bg-emerald-500/30 text-emerald-300' : isCurrent ? 'bg-accent-blue text-white' : 'bg-white/10 text-slate-400'
                  }`}
                  aria-hidden
                >
                  {isDone ? '✓' : idx + 1}
                </span>
                <div>
                  <p className={isCurrent ? 'text-slate-100 font-medium' : 'text-slate-400'}>{stage.customerLabel}</p>
                  {isCurrent && <p className="text-slate-500 text-xs mt-0.5">{stage.customerHint}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard className="p-6 sm:p-8 mt-6">
        <h2 className="font-heading text-lg font-semibold text-slate-50 mb-2">Change package</h2>
        <p className="text-slate-400 text-sm mb-4">
          {lead.packageId === 'custom'
            ? 'Choose a fixed package below and we\'ll update your details. Payment status will update automatically when you pay (Stripe coming soon).'
            : 'Select a different package below. Your dashboard and any payment status will update automatically.'}
        </p>
        <form action="/api/dashboard/package" method="POST" className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="sr-only">Package</span>
            <select
              name="packageId"
              defaultValue={lead.packageId === 'custom' ? 'starter' : lead.packageId}
              className="rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue min-w-[200px]"
              aria-label="Select package"
            >
              <option value="starter">Starter — €900</option>
              <option value="growth">Growth — €1,200</option>
              <option value="premium">Premium — €2,000</option>
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Update package
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5">
          <p className="text-slate-400 text-sm mb-1">Ticket ID</p>
          <p className="font-mono text-slate-200 text-sm mb-4" aria-label="Your support ticket ID">
            TKT-{lead.id.slice(-6).toUpperCase()}
          </p>
          {lead.ticketMessages.length > 0 && (
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
                    {msg.fromRole === 'admin' ? 'Support' : 'You'} · {new Date(msg.createdAt).toLocaleString('en-IE')}
                  </span>
                  <p className="mt-1 whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
          <form action="/api/dashboard/ticket" method="POST" className="space-y-2">
            <label className="block">
              <span className="sr-only">Message</span>
              <textarea
                name="message"
                rows={3}
                placeholder="Send a message to support..."
                className="w-full rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue resize-y min-h-[80px]"
                aria-label="Message to support"
                required
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
            >
              Send message
            </button>
          </form>
        </div>
      </GlassCard>

      <p className="mt-6 text-center">
        <Link href="/" className="text-accent-blue hover:underline text-sm">Back to home</Link>
      </p>
    </div>
  );
}
