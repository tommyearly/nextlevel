import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const resolved = await Promise.resolve(context.params);
  const id = resolved?.id;
  if (!id) return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  await prisma.lead.delete({ where: { id } });
  const base = request.nextUrl?.origin ?? request.url?.split('/api')[0] ?? 'http://localhost:3000';
  return NextResponse.redirect(new URL('/admin', base));
}
