import { NextRequest, NextResponse } from 'next/server';
import { cleanupExpiredMagicLinks } from '@/lib/magic-link';

/** Vercel Cron: delete expired/used magic link tokens. Runs daily. */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { deleted } = await cleanupExpiredMagicLinks();
    return NextResponse.json({ ok: true, deleted });
  } catch (err) {
    console.error('[cron/cleanup-magic-links]', err);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
