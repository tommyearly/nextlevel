import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME_BASE = 'nextlevel_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/** __Host- prefix: cookie tied to exact host, no Domain; requires Secure, Path=/. Use when same-origin only. */
function getCookieName(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const hasDomain = !!process.env.COOKIE_DOMAIN;
  if (isProd && !hasDomain) return `__Host-${COOKIE_NAME_BASE}`;
  return COOKIE_NAME_BASE;
}

function getCookieOptions(overrides?: { maxAge?: number }) {
  const domain = process.env.COOKIE_DOMAIN || undefined; // e.g. .nextlevelweb.ie so www and non-www share the cookie
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: overrides?.maxAge ?? MAX_AGE,
    path: '/',
    ...(domain && { domain }),
  };
}
</think>path
c:\Users\Thomas\Desktop\nextlevelie\lib\auth.ts

type SessionPayload = {
  email: string;
  role: 'customer' | 'admin';
  leadId?: string;
  exp: number;
};

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    const hint = secret && secret.length > 0 && secret.length < 32
      ? ' (SESSION_SECRET may be truncated: avoid # in the value, or set it in Vercel without #)'
      : '';
    throw new Error('SESSION_SECRET must be set and at least 32 characters' + hint);
  }
  return new TextEncoder().encode(secret);
}

export async function createSession(payload: Omit<SessionPayload, 'exp'>): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const token = await new SignJWT({ ...payload, exp })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(exp)
    .sign(getSecret());
  return token;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Set session cookie on a response (use this before returning redirect so the cookie is sent). */
export function setSessionCookieOnResponse(response: NextResponse, token: string): void {
  response.cookies.set(getCookieName(), token, getCookieOptions());
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(getCookieName(), token, getCookieOptions());
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!token) return null;
  return verifySession(token);
}

/** Use in Route Handlers: read session from the incoming request so cookies are reliable in serverless. */
export async function getSessionFromRequest(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get(getCookieName())?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(getCookieName());
}

export { getCookieName, getCookieOptions };
