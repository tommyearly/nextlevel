import { NextResponse } from 'next/server';
import { createMagicLink } from '@/lib/magic-link';
import { sendMagicLinkEmail } from '@/lib/email';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();

export async function POST(request: Request) {
  if (!ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Admin login not configured' }, { status: 503 });
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
    const token = await createMagicLink(email, 'admin');
    const magicLinkUrl = `${BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const result = await sendMagicLinkEmail(email, magicLinkUrl);
    if (!result.ok) {
      return NextResponse.json({ error: 'Could not send email. Try again later.' }, { status: 503 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Admin magic link error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
