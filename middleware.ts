import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'nextlevel_session';

async function getSessionPayload(request: NextRequest): Promise<{ role: string } | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload as unknown as { role: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard')) {
    if (path === '/dashboard/login' || path.startsWith('/dashboard/auth/')) {
      return NextResponse.next();
    }
    const session = await getSessionPayload(request);
    if (!session || session.role !== 'customer') {
      return NextResponse.redirect(new URL('/dashboard/login', request.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith('/admin')) {
    if (path === '/admin/login') return NextResponse.next();
    const session = await getSessionPayload(request);
    if (!session || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
