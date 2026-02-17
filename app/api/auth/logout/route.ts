import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/auth';

function handleLogout(request: NextRequest) {
  const base = request.nextUrl.origin;
  const res = NextResponse.redirect(new URL('/bye', base));
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}

export function GET(request: NextRequest) {
  return handleLogout(request);
}

export function POST(request: NextRequest) {
  return handleLogout(request);
}
