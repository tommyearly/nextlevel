'use client';

import { useState, useRef, useEffect } from 'react';
import { PACKAGE_FORM_OPTIONS, getPackageOptionValue } from '@/lib/packages';
import GradientButton from './GradientButton';

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        opts: { sitekey: string; theme?: 'light' | 'dark'; size?: 'normal' | 'compact' }
      ) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
  }
}

type ContactFormProps = {
  /** Package id from URL (?package=starter etc.) — pre-selects the package dropdown */
  defaultPackage?: string | null;
};

export default function ContactForm({ defaultPackage }: ContactFormProps) {
  const initialPackageValue = getPackageOptionValue(defaultPackage);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);

  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '';

  useEffect(() => {
    if (!siteKey || !recaptchaContainerRef.current) return;
    const callbackName = 'onRecaptchaLoad';
    const win = window as unknown as Record<string, () => void>;
    win[callbackName] = () => {
      if (recaptchaContainerRef.current && window.grecaptcha) {
        widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
        });
      }
    };
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?onload=${callbackName}&render=explicit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return () => {
      delete win[callbackName];
    };
  }, [siteKey]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCaptchaError(false);
    const token = siteKey && window.grecaptcha ? window.grecaptcha.getResponse(widgetIdRef.current ?? undefined) : '';
    if (siteKey && !token) {
      setCaptchaError(true);
      return;
    }
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    const obj = Object.fromEntries(data.entries()) as Record<string, string>;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...obj, recaptchaToken: token || undefined }),
      });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        return;
      }
      setStatus('sent');
      form.reset();
      if (window.grecaptcha && widgetIdRef.current !== null) {
        window.grecaptcha.reset(widgetIdRef.current);
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div
        className="rounded-2xl border border-white/5 bg-brand-card/60 backdrop-blur-xl p-12 sm:p-16 flex flex-col items-center justify-center text-center min-h-[420px] sm:min-h-[460px]"
        role="status"
        aria-live="polite"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center flex-shrink-0 animate-success-circle">
          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path className="animate-success-check" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-heading text-xl sm:text-2xl font-bold text-slate-50">Message sent</h2>
        <p className="mt-2 text-slate-400 text-base sm:text-lg max-w-sm">
          Thanks for getting in touch. We&apos;ll be in contact within 24 hours with next steps.
        </p>
      </div>
    );
  }

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
      {siteKey && (
        <div className="mt-6">
          <div ref={recaptchaContainerRef} className="inline-block" aria-label="reCAPTCHA" />
        </div>
      )}
      <p className="mt-6 text-slate-500 text-xs">
          By submitting you agree to a €200 deposit to secure your project; we&apos;ll send a payment link to complete.
        </p>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
        {captchaError && (
          <p className="text-amber-400 text-sm font-medium" role="alert">
            Please complete the &quot;I&apos;m not a robot&quot; check before sending.
          </p>
        )}
        <GradientButton type="submit" size="lg" disabled={status === 'sending'} ariaLabel="Send message">
          {status === 'sending' ? 'Sending...' : 'Send message'}
        </GradientButton>
        {status === 'error' && (
          <p className="text-red-400 text-sm font-medium" role="alert">
            Something went wrong. Please try again or email us directly.
          </p>
        )}
      </div>
    </form>
  );
}
