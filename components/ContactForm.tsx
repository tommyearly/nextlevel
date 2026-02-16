'use client';

import { useState } from 'react';
import { PACKAGE_FORM_OPTIONS, getPackageOptionValue } from '@/lib/packages';
import GradientButton from './GradientButton';

type ContactFormProps = {
  /** Package id from URL (?package=starter etc.) — pre-selects the package dropdown */
  defaultPackage?: string | null;
};

export default function ContactForm({ defaultPackage }: ContactFormProps) {
  const initialPackageValue = getPackageOptionValue(defaultPackage);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        return;
      }
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/5 bg-brand-card/60 backdrop-blur-xl p-6 sm:p-8"
      noValidate
      aria-label="Contact form"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Name</span>
          <input
            type="text"
            name="name"
            required
            className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
            placeholder="Your name"
            autoComplete="name"
            disabled={status === 'sending'}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-300">Email</span>
          <input
            type="email"
            name="email"
            required
            className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
            placeholder="you@company.ie"
            autoComplete="email"
            disabled={status === 'sending'}
          />
        </label>
      </div>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-slate-300">Company (optional)</span>
        <input
          type="text"
          name="company"
          className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
          placeholder="Company name"
          autoComplete="organization"
          disabled={status === 'sending'}
        />
      </label>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-slate-300">Package I&apos;m interested in</span>
        <select
          name="package"
          required
          defaultValue={initialPackageValue}
          className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue disabled:opacity-50"
          disabled={status === 'sending'}
          aria-describedby="package-hint"
        >
          <option value="">Select a package</option>
          {PACKAGE_FORM_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.id === 'custom' ? 'Custom — tell me more' : opt.value}
            </option>
          ))}
        </select>
        <span id="package-hint" className="mt-1.5 text-xs text-slate-500">
          All packages include domain & hosting. €200 deposit required.
        </span>
      </label>
      <label className="mt-6 block">
        <span className="text-sm font-medium text-slate-300">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue resize-y min-h-[120px]"
          placeholder="Tell us about your project... (If Custom, describe what you need.)"
          disabled={status === 'sending'}
        />
      </label>
      <p className="mt-6 text-slate-500 text-xs">
          By submitting you agree to a €200 deposit to secure your project; we&apos;ll send a payment link to complete.
        </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        <GradientButton type="submit" size="lg" disabled={status === 'sending'} ariaLabel="Send message">
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </GradientButton>
        {status === 'sent' && (
          <p className="text-accent-blue text-sm font-medium" role="status">
            Thanks. We will be in touch soon.
          </p>
        )}
        {status === 'error' && (
          <p className="text-red-400 text-sm font-medium" role="alert">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </div>
    </form>
  );
}
