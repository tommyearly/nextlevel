import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

async function handleLogout(request: NextRequest) {
  await clearSessionCookie();
  const base = request.nextUrl.origin;
  return NextResponse.redirect(new URL('/bye', base));
}

export async function POST(request: NextRequest) {
  return handleLogout(request);
}

export async function GET(request: NextRequest) {
  return handleLogout(request);
}
