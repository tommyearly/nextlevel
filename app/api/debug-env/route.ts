import { NextResponse } from 'next/server';

/**
 * Dev-only: hit /api/debug-env to check if SESSION_SECRET is available.
 * Returns 404 in production to avoid exposing config metadata.
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  const secret = process.env.SESSION_SECRET;
  return NextResponse.json({
    SESSION_SECRET: secret ? 'set' : 'not set',
    length: secret?.length ?? 0,
    ok: !!(secret && secret.length >= 32),
  });
}
