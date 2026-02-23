import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionFromCookie } from '@/lib/auth';
import { getLeadForSession } from '@/lib/lead';
import { getPackagePricing, getPaymentBreakdown } from '@/lib/pricing';
import { getCheckoutPriceId, hasStripeConfig } from '@/lib/stripe';
import { PROGRESS_STAGES, getProgressStageIndex } from '@/lib/progress';
import PackageCard from '@/app/dashboard/PackageCard';
import ProgressSection from '@/app/dashboard/ProgressSection';
import TicketSection from '@/app/dashboard/TicketSection';

export default async function DashboardPage() {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'customer') redirect('/dashboard/login');

  const lead = await getLeadForSession(session, { includeTicketMessages: true });
  if (!lead) redirect('/dashboard/login');

  const pricing = getPackagePricing(lead.packageId);
  const payment = getPaymentBreakdown(lead.packageId, lead.paymentStatus, lead.totalPaidCents);
  const canPayDeposit = hasStripeConfig() && getCheckoutPriceId(lead.packageId, 'deposit');
  const canPayBalance = hasStripeConfig() && payment.balanceAmount != null && payment.balanceAmount > 0;
  const currentStageIndex = getProgressStageIndex(lead.progressStage);
  const currentStage = lead.progressStage ? PROGRESS_STAGES.find((s) => s.id === lead.progressStage) : null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-50">Your dashboard</h1>
        <Link href="/api/auth/logout" prefetch={false} className="text-sm text-slate-400 hover:text-accent-blue transition-colors">
            Sign out
          </Link>
      </div>
      <PackageCard
        packageLabel={lead.packageLabel}
        pricing={pricing}
        payment={payment}
        canPayDeposit={!!canPayDeposit}
        canPayBalance={!!canPayBalance}
      />

      <ProgressSection
        projectUrl={lead.projectUrl}
        currentStage={currentStage ?? null}
        currentStageIndex={currentStageIndex}
        customerFeedback={lead.customerFeedback ?? null}
        customerFeedbackAt={lead.customerFeedbackAt ?? null}
      />

      <TicketSection
        leadId={lead.id}
        packageId={lead.packageId}
        ticketMessages={lead.ticketMessages}
      />

      <p className="mt-6 text-center">
        <Link href="/" prefetch={false} className="text-accent-blue hover:underline text-sm">Back to home</Link>
      </p>
    </div>
  );
}
