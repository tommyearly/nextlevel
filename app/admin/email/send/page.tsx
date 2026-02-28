import Link from 'next/link';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getCampaignPackagesHtml } from '@/lib/email';
import GlassCard from '@/components/GlassCard';
import SendCampaignButton from '@/app/admin/email/send/SendCampaignButton';

export const dynamic = 'force-dynamic';

export default async function AdminEmailSendPage() {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return null;
  }

  const subscribedCount = await prisma.emailSubscriber.count({
    where: { status: 'subscribed' },
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.nextlevelweb.ie';
  const sampleUnsubscribeUrl = `${baseUrl}/unsubscribe?email=example@example.com&token=xxx`;
  const previewHtml = getCampaignPackagesHtml(sampleUnsubscribeUrl);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-50">
          Send campaign
        </h1>
        <Link href="/admin/email" prefetch={false} className="text-slate-400 hover:text-accent-blue text-sm">
          Back to subscribers
        </Link>
      </div>

      <GlassCard className="mb-8 p-6">
        <h2 className="font-heading text-lg font-semibold text-slate-50 mb-2">3 packages promo</h2>
        <p className="text-slate-400 text-sm mb-4">
          One email to all subscribed subscribers. Subject: &quot;Three clear packages to get your business online — Next Level Web&quot;. Each recipient gets a unique unsubscribe link.
        </p>
        <p className="text-slate-300 text-sm mb-6">
          <strong>{subscribedCount}</strong> subscriber{subscribedCount !== 1 ? 's' : ''} will receive this email.
        </p>
        {subscribedCount === 0 ? (
          <p className="text-amber-400 text-sm">Add subscribers first, then come back to send.</p>
        ) : (
          <SendCampaignButton subscribedCount={subscribedCount} />
        )}
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="font-heading text-lg font-semibold text-slate-50 mb-4">Preview</h2>
        <div className="rounded-lg border border-white/10 overflow-hidden bg-slate-900">
          <iframe
            title="Email preview"
            srcDoc={previewHtml}
            className="w-full h-[600px] border-0 bg-white"
            sandbox="allow-same-origin"
          />
        </div>
      </GlassCard>
    </div>
  );
}
