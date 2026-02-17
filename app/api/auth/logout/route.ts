import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME, getCookieOptions } from '@/lib/auth';

function handleLogout(request: NextRequest) {
  const base = request.nextUrl.origin;
  const res = NextResponse.redirect(new URL('/bye', base));
  const opts = getCookieOptions({ maxAge: 0 });
  res.cookies.set(COOKIE_NAME, '', opts);
  return res;
}

export function GET(request: NextRequest) {
  return handleLogout(request);
}

export function POST(request: NextRequest) {
  return handleLogout(request);
}
