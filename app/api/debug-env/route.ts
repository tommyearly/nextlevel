import { NextResponse } from 'next/server';

/**
 * Temporary: hit /api/debug-env on production to see if SESSION_SECRET is available.
 * Remove or protect this route once debugging is done.
 */
export async function GET() {
  const secret = process.env.SESSION_SECRET;
  return NextResponse.json({
    SESSION_SECRET: secret ? 'set' : 'not set',
    length: secret?.length ?? 0,
    ok: !!(secret && secret.length >= 32),
  });
}
