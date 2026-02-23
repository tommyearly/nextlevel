import { NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/magic-link';
import { sendMagicLinkEmail } from '@/lib/email';
import { checkAdminMagicLinkRateLimit } from '@/lib/rate-limit';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

export async function POST(request: Request) {
  const rateLimit = checkAdminMagicLinkRateLimit(request);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: rateLimit.retryAfter
          ? { 'Retry-After': String(rateLimit.retryAfter) }
          : undefined,
      }
    );
  }

  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin login not configured. Set ADMIN_EMAIL in Vercel.' }, { status: 503 });
  }
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 403 });
    }

    let token: string;
    try {
      token = await createMagicLink(email, 'admin');
    } catch (dbError) {
      console.error('Admin magic link DB error:', dbError);
      const hasDbUrl = !!(process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL);
      return NextResponse.json(
        {
          error: hasDbUrl
            ? 'Database error. In Vercel, ensure POSTGRES_PRISMA_URL is set and run "npx prisma db push" locally (with that URL in .env) so tables exist.'
            : 'Database error. In Vercel set DATABASE_URL or connect Supabase so POSTGRES_PRISMA_URL is set (Settings → Environment Variables).',
        },
        { status: 503 }
      );
    }

    const magicLinkUrl = `${BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const result = await sendMagicLinkEmail(email, magicLinkUrl);
    if (!result.ok) {
      console.error('Resend send failed:', result.message);
      return NextResponse.json(
        { error: `Could not send email: ${result.message}` },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Admin magic link error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
