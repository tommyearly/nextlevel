import GlassCard from '@/components/GlassCard';
import { getPackageTier } from '@/lib/packages';

type TicketMessage = { id: string; message: string; fromRole: string; createdAt: Date };

type Props = {
  leadId: string;
  packageId: string;
  ticketMessages: TicketMessage[];
};

export default function TicketSection({ leadId, packageId, ticketMessages }: Props) {
  const currentTier = getPackageTier(packageId);
  const upgradeOptions = [
    { id: 'starter' as const, label: 'Starter — €900' },
    { id: 'growth' as const, label: 'Growth — €1,200' },
    { id: 'premium' as const, label: 'Premium — €2,000' },
  ].filter((p) => getPackageTier(p.id) >= currentTier);
  const canUpgrade = upgradeOptions.length > 1 || (packageId === 'custom' && upgradeOptions.length >= 1);
  const defaultVal = packageId === 'custom' ? 'starter' : (upgradeOptions[0]?.id ?? packageId);

  return (
    <GlassCard className="p-6 sm:p-8 mt-6">
      <h2 className="font-heading text-lg font-semibold text-slate-50 mb-2">Change package</h2>
      <p className="text-slate-400 text-sm mb-4">
        {packageId === 'custom'
          ? "Choose a fixed package below and we'll update your details. Payment status will update automatically when you pay."
          : "You can only upgrade to a higher tier. Your deposit stays marked as paid; any extra balance for the new package will be shown."}
      </p>
      {canUpgrade ? (
        <form action="/api/dashboard/package" method="POST" className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="sr-only">Package</span>
            <select
              name="packageId"
              defaultValue={defaultVal}
              className="rounded-lg border border-white/10 bg-brand-surface px-3 py-2 text-slate-200 text-sm focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue min-w-[200px]"
              aria-label="Select package (upgrade only)"
            >
              {upgradeOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="rounded-lg bg-accent-blue/90 hover:bg-accent-blue px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface"
          >
            Update package
          </button>
        </form>
      ) : (
        <p className="text-slate-500 text-sm">You&apos;re on the highest tier (Premium).</p>
      )}

      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-slate-400 text-sm mb-1">Ticket ID</p>
        <p className="font-mono text-slate-200 text-sm mb-4" aria-label="Your support ticket ID">
          TKT-{leadId.slice(-6).toUpperCase()}
        </p>
        {ticketMessages.length > 0 && (
          <div className="space-y-3 mb-4" role="log" aria-label="Ticket messages">
            {ticketMessages.map((msg) => (
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
  );
}
