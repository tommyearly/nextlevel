'use client';

import { useState } from 'react';

type Props = {
  type: 'deposit' | 'balance';
  label: string;
  className?: string;
  ariaLabel?: string;
};

export default function CheckoutButton({ type, label, className, ariaLabel }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.set('type', type);
      const res = await fetch('/api/dashboard/checkout', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (res.status === 401) {
        window.location.href = '/dashboard/login?error=session';
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Something went wrong. Please try again.');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-label={ariaLabel ?? label}
        aria-describedby={error ? `checkout-error-${type}` : undefined}
        className={className}
      >
        {loading ? 'Redirecting…' : label}
      </button>
      {error && (
        <p id={`checkout-error-${type}`} role="alert" className="text-amber-400 text-sm font-medium">
          {error}
        </p>
      )}
    </span>
  );
}
