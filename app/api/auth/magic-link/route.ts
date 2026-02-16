import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createMagicLink } from '@/lib/magic-link';
import { sendMagicLinkEmail } from '@/lib/email';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const lead = await prisma.lead.findFirst({
      where: { email },
      orderBy: { createdAt: 'desc' },
    });
    if (!lead) {
      return NextResponse.json(
        { error: 'No account found with this email. Submit the contact form first.' },
        { status: 404 }
      );
    }
    const token = await createMagicLink(email, 'customer');
    const magicLinkUrl = `${BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
    const result = await sendMagicLinkEmail(email, magicLinkUrl);
    if (!result.ok) {
      return NextResponse.json({ error: 'Could not send email. Try again later.' }, { status: 503 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Magic link API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
