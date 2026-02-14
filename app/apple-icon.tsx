import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Apple touch icon — same as header LogoIcon (N + dot on gradient).
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          borderRadius: 36,
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 28 28"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <path d="M7 6v16" stroke="white" strokeWidth="2.25" strokeLinecap="round" />
          <path d="M7 6L21 22" stroke="white" strokeWidth="2.25" strokeLinecap="round" />
          <path d="M21 6v16" stroke="white" strokeWidth="2.25" strokeLinecap="round" />
          <circle cx="22" cy="5" r="2" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
