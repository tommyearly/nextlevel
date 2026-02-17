import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const raw = formData.get('message');
  const message = typeof raw === 'string' ? raw.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'Please enter a message.' }, { status: 400 });
  }
  const lead = await prisma.lead.findFirst({
    where: session.leadId ? { id: session.leadId, email: session.email } : { email: session.email },
    orderBy: { createdAt: 'desc' },
  });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  await prisma.ticketMessage.create({
    data: { leadId: lead.id, message, fromRole: 'customer' },
  });
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
