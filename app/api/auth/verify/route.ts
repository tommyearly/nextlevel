import { NextRequest, NextResponse } from 'next/server';
import { consumeMagicLink } from '@/lib/magic-link';
import { createSession, setSessionCookieOnResponse } from '@/lib/auth';
import { prisma } from '@/lib/db';

const LOGIN_URL = '/dashboard/login';

function checkSessionSecret(): void {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    console.error('[auth/verify] SESSION_SECRET:', secret ? `length=${secret.length} (need 32+)` : 'missing');
    throw new Error('SESSION_SECRET must be set and at least 32 characters');
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL(`${LOGIN_URL}?error=missing`, request.url));
  }
  try {
    checkSessionSecret();
    const result = await consumeMagicLink(token);
    if (!result.ok) {
      return NextResponse.redirect(new URL(`${LOGIN_URL}?error=${result.reason}`, request.url));
    }
    const isAdmin = result.role === 'admin';
    let leadId: string | undefined;
    if (!isAdmin) {
      const lead = await prisma.lead.findFirst({
        where: { email: result.email },
        orderBy: { createdAt: 'desc' },
      });
      leadId = lead?.id;
    }
    const sessionToken = await createSession({
      email: result.email,
      role: result.role,
      leadId,
    });
    const redirectPath = isAdmin ? '/admin' : '/dashboard';
    const response = NextResponse.redirect(new URL(redirectPath, request.url));
    setSessionCookieOnResponse(response, sessionToken);
    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const secretLen = process.env.SESSION_SECRET?.length ?? 0;
    console.error('Auth verify error:', message, '| SESSION_SECRET length:', secretLen);
    const isSessionSecret = /SESSION_SECRET/i.test(message);
    return NextResponse.redirect(
      new URL(`${LOGIN_URL}?error=${isSessionSecret ? 'config' : 'server'}`, request.url)
    );
  }
}
