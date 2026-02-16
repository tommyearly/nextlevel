import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'nextlevel_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  email: string;
  role: 'customer' | 'admin';
  leadId?: string;
  exp: number;
};

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be set and at least 32 characters');
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

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
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
