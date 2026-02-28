'use client';

import { useState } from 'react';
import { sendCampaignToSubscribed } from '@/app/admin/email/actions';

type Props = { subscribedCount: number };

export default function SendCampaignButton({ subscribedCount }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    const res = await sendCampaignToSubscribed();
    setSending(false);
    setConfirming(false);
    if (res.ok) {
      setResult({ ok: true, message: `Sent to ${res.sent} subscriber${res.sent !== 1 ? 's' : ''}.` });
    } else {
      setResult({ ok: false, message: res.error });
    }
  };

  if (result) {
    return (
      <p className={result.ok ? 'text-emerald-400 text-sm' : 'text-red-400 text-sm'} role="alert">
        {result.message}
      </p>
    );
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-slate-300 text-sm">
          Send to <strong>{subscribedCount}</strong> subscriber{subscribedCount !== 1 ? 's' : ''}?
        </p>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {sending ? 'Sending…' : 'Yes, send'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={sending}
          className="px-4 py-2 rounded-lg border border-white/20 text-slate-300 text-sm hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-violet text-white font-medium text-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
    >
      Send campaign
    </button>
  );
}
