'use client';

import { useState } from 'react';
import GradientButton from '@/components/GradientButton';

type Props = {
  existingFeedback: string | null;
  existingFeedbackAt: Date | null;
};

export default function FeedbackForm({ existingFeedback, existingFeedbackAt }: Props) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      const res = await fetch('/api/dashboard/feedback', {
        method: 'POST',
        body: data,
      });
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
      if (!res.ok) {
        setStatus('idle');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('idle');
    }
  };

  const formBlock = (
    <form onSubmit={handleSubmit} className="mt-4">
      <label className="block">
        <span className="text-slate-400 text-sm font-medium mb-1.5 block">Your feedback</span>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Tell us what you’d like to change or any comments on the preview..."
          className="w-full rounded-lg border border-white/10 bg-brand-surface px-3 py-2.5 text-slate-200 text-sm placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue resize-y min-h-[100px]"
          disabled={status === 'sending'}
          aria-label="Feedback message"
        />
      </label>
      <GradientButton
        type="submit"
        size="md"
        className="mt-3"
        disabled={status === 'sending'}
        ariaLabel="Send feedback"
      >
        {status === 'sending' ? 'Sending…' : 'Send feedback'}
      </GradientButton>
    </form>
  );

  if (existingFeedback && existingFeedbackAt) {
    return (
      <>
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 mt-4">
          <p className="text-emerald-300 text-sm font-medium">Thanks — we got your feedback</p>
          <p className="text-slate-400 text-sm mt-1">{existingFeedback}</p>
          <p className="text-slate-500 text-xs mt-2">
            Sent {new Date(existingFeedbackAt).toLocaleDateString('en-IE', { dateStyle: 'medium' })}
          </p>
          <p className="text-slate-500 text-xs mt-1">Send another message below if you have more to add.</p>
        </div>
        {formBlock}
      </>
    );
  }

  return formBlock;
}
