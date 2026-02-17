import { NextRequest, NextResponse } from 'next/server';
import { consumeMagicLink } from '@/lib/magic-link';
import { createSession, setSessionCookieOnResponse } from '@/lib/auth';
import { prisma } from '@/lib/db';

const LOGIN_URL = '/dashboard/login';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL(`${LOGIN_URL}?error=missing`, request.url));
  }
  try {
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
    console.error('Auth verify error:', message);
    const isSessionSecret = /SESSION_SECRET/i.test(message);
    return NextResponse.redirect(
      new URL(`${LOGIN_URL}?error=${isSessionSecret ? 'config' : 'server'}`, request.url)
    );
  }
}
