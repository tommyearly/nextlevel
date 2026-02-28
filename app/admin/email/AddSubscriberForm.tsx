'use client';

import { useState } from 'react';
import { addSubscriber } from '@/app/admin/email/actions';

export default function AddSubscriberForm() {
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await addSubscriber(formData);
    if (result.ok) {
      setMessage({ type: 'ok', text: 'Subscriber added (or already subscribed).' });
      form.reset();
      window.location.reload(); // refresh list
    } else {
      setMessage({ type: 'error', text: result.error });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl">
      <label className="flex-1 block">
        <span className="sr-only">Email</span>
        <input
          type="email"
          name="email"
          required
          placeholder="email@example.com"
          className="block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </label>
      <label className="sm:w-48 block">
        <span className="sr-only">Name (optional)</span>
        <input
          type="text"
          name="name"
          placeholder="Name (optional)"
          className="block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
        />
      </label>
      <button
        type="submit"
        className="self-start sm:self-auto px-4 py-2.5 rounded-lg bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue"
      >
        Add
      </button>
      {message && (
        <p
          className={`text-sm mt-1 sm:mt-0 sm:self-center ${
            message.type === 'ok' ? 'text-emerald-400' : 'text-red-400'
          }`}
          role="alert"
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
