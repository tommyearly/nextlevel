import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  await clearSessionCookie();
  const base = request.nextUrl.origin;
  const to = request.nextUrl.searchParams.get('to');
  const path = to === 'admin' ? '/admin/login' : '/dashboard/login';
  return NextResponse.redirect(new URL(path, base));
}
