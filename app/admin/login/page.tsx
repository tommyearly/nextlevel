'use client';

import { useState } from 'react';
import Link from 'next/link';
import GlassCard from '@/components/GlassCard';
import GradientButton from '@/components/GradientButton';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/api/auth/admin/magic-link', {
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

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-heading text-2xl font-bold text-slate-50 text-center mb-2">Admin sign in</h1>
      <p className="text-slate-400 text-sm text-center mb-8">Enter the admin email. A one-time login link will be sent.</p>
      <GlassCard className="p-6">
        {status === 'sent' ? (
          <p className="text-slate-300 text-center">Check your inbox. Click the link to sign in. Link expires in 30 minutes.</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Admin email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border border-white/10 bg-brand-surface px-4 py-3 text-slate-100"
                placeholder="admin@nextlevelweb.ie"
                disabled={status === 'sending'}
              />
            </label>
            {errorMessage && <p className="mt-2 text-red-400 text-sm">{errorMessage}</p>}
            <GradientButton type="submit" size="lg" className="w-full mt-6" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send login link'}
            </GradientButton>
          </form>
        )}
      </GlassCard>
      <p className="mt-6 text-center">
        <Link href="/" className="text-accent-blue hover:underline text-sm">Back to home</Link>
      </p>
    </div>
  );
}
