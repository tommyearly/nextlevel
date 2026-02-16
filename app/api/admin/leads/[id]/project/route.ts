import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PROGRESS_STAGES } from '@/lib/progress';

const VALID_STAGE_IDS = new Set(PROGRESS_STAGES.map((s) => s.id));

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const session = await getSessionFromCookie();
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const resolved = await Promise.resolve(context.params);
    const id = resolved?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
    }
    const formData = await request.formData();
    const rawUrl = formData.get('projectUrl');
    const projectUrl = typeof rawUrl === 'string' ? rawUrl.trim() || null : null;
    const rawStage = formData.get('progressStage');
    const progressStage =
      typeof rawStage === 'string' && VALID_STAGE_IDS.has(rawStage) ? rawStage : null;

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    await prisma.lead.update({
      where: { id },
      data: {
        projectUrl,
        ...(progressStage && { progressStage, progressUpdatedAt: new Date() }),
      },
    });

    const base = request.nextUrl?.origin ?? request.url?.split('/api')[0] ?? 'http://localhost:3000';
    return NextResponse.redirect(new URL(`/admin/leads/${id}`, base));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Project update error:', err);
    return NextResponse.json(
      { error: 'Update failed.', detail: message },
      { status: 500 }
    );
  }
}
