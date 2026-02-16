import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const raw = formData.get('message');
  const message = typeof raw === 'string' ? raw.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'Please enter your feedback.' }, { status: 400 });
  }
  const lead = await prisma.lead.findFirst({
    where: session.leadId ? { id: session.leadId, email: session.email } : { email: session.email },
    orderBy: { createdAt: 'desc' },
  });
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  await prisma.lead.update({
    where: { id: lead.id },
    data: { customerFeedback: message, customerFeedbackAt: new Date() },
  });
  const base = request.nextUrl?.origin ?? request.url?.split('/api')[0] ?? 'http://localhost:3000';
  return NextResponse.redirect(new URL('/dashboard', base));
}
