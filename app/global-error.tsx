'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: 'linear-gradient(to bottom, #0f172a, #020617)', minHeight: '100vh', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.125rem', marginBottom: '0.75rem' }}>
            We hit a snag. Give it another go or head back home.
          </p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.5rem',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: '#e2e8f0',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                borderRadius: '0.5rem',
                background: '#3b82f6',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Back to home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
