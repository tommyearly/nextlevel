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

  const handleClick = async () => {
    setLoading(true);
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
        alert(data?.error || 'Something went wrong. Please try again.');
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      aria-label={ariaLabel ?? label}
      className={className}
    >
      {loading ? 'Redirecting…' : label}
    </button>
  );
}
