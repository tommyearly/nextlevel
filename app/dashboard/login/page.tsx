'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import GradientButton from '@/components/GradientButton';

export default function DashboardLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  useEffect(() => {
    setUrlError(new URLSearchParams(window.location.search).get('error'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.error ?? 'Something went wrong');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setStatus('error');
      setErrorMessage('Network error');
    }
  };

  const errorText =
    urlError === 'missing'
      ? 'No login link was provided.'
      : urlError === 'used'
        ? 'That link was already used.'
        : urlError === 'expired'
          ? 'That link has expired. Request a new one below.'
          : urlError === 'invalid'
            ? 'Invalid link. Request a new one below.'
            : urlError === 'server'
              ? 'Something went wrong on our side. Check that SESSION_SECRET is set in Vercel (32+ characters, no # in the value), then try again.'
              : urlError === 'config'
                ? 'Session not configured. Set SESSION_SECRET in Vercel (32+ characters, avoid #).'
                : null;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-heading text-2xl font-bold text-slate-50 text-center mb-2">
        Sign in to your dashboard
      </h1>
      <p className="text-slate-400 text-sm text-center mb-8">
        Enter the email you used on the contact form. We&apos;ll send you a one-time login link.
      </p>
      {errorText && (
        <p className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
          {errorText}
        </p>
      )}
      <GlassCard className="p-6">
        {status === 'sent' ? (
          <p className="text-slate-300 text-center">
            Check your inbox. Click the link in the email to sign in. The link expires in 30 minutes.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                placeholder="you@company.ie"
                disabled={status === 'sending'}
                autoComplete="email"
              />
            </label>
            {errorMessage && (
              <p className="mt-2 text-red-400 text-sm">{errorMessage}</p>
            )}
            <GradientButton
              type="submit"
              size="lg"
              className="w-full mt-6"
              disabled={status === 'sending'}
              ariaLabel="Send login link"
            >
              {status === 'sending' ? 'Sending…' : 'Send login link'}
            </GradientButton>
          </form>
        )}
      </GlassCard>
      <p className="mt-6 text-center">
        <Link href="/" className="text-accent-blue hover:underline text-sm">
          Back to home
        </Link>
      </p>
    </div>
  );
}
