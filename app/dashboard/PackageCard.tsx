import GlassCard from '@/components/GlassCard';
import CheckoutButton from '@/app/dashboard/CheckoutButton';
import type { PaymentBreakdown, PackagePricing } from '@/lib/pricing';

type Props = {
  packageLabel: string;
  pricing: PackagePricing;
  payment: PaymentBreakdown;
  canPayDeposit: boolean;
  canPayBalance: boolean;
};

export default function PackageCard({ packageLabel, pricing, payment, canPayDeposit, canPayBalance }: Props) {
  return (
    <GlassCard className="p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold text-slate-50 mb-4">Your package</h2>
      <p className="text-slate-300">{packageLabel}</p>
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
        <p className="text-slate-400 text-sm mb-4">Pay your €200 deposit online. Balance before launch.</p>
        {payment.depositStatus === 'Paid' && payment.balanceStatus === 'Paid' ? (
          <p className="text-emerald-400 font-medium text-sm">You&apos;re all paid. Thank you.</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            {payment.depositStatus !== 'Paid' && canPayDeposit && (
              <CheckoutButton
                type="deposit"
                label="Pay deposit (€200)"
                ariaLabel="Pay €200 deposit"
                className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
              />
            )}
            {payment.depositStatus === 'Paid' && payment.balanceStatus !== 'Paid' && canPayBalance && (
              <CheckoutButton
                type="balance"
                label={`Pay balance (${payment.balanceFormatted})`}
                ariaLabel={`Pay balance ${payment.balanceFormatted}`}
                className="rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
              />
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
  );
}
