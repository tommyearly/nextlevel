import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

const COOKIE_NAME = 'nextlevel_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: MAX_AGE,
  path: '/',
};

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
  response.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export async function getSessionFromCookie(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
