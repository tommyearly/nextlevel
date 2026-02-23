import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> | { id: string } };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const resolved = await Promise.resolve(context.params);
  const id = resolved?.id;
  if (!id) return NextResponse.json({ error: 'Missing lead id' }, { status: 400 });
  const formData = await request.formData();
  const raw = formData.get('message');
  const message = typeof raw === 'string' ? raw.trim() : '';
  if (!message) return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  await prisma.ticketMessage.create({
    data: { leadId: id, message, fromRole: 'admin' },
  });
  return NextResponse.redirect(new URL(`/admin/leads/${id}`, request.url));
  } catch (err) {
    console.error('Admin ticket error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
