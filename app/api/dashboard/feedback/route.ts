import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getLeadForSession } from '@/lib/lead';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const raw = formData.get('message');
  const message = typeof raw === 'string' ? raw.trim() : '';
  if (!message) {
    return NextResponse.json({ error: 'Please enter your feedback.' }, { status: 400 });
  }
  const lead = await getLeadForSession(session);
  if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  await prisma.lead.update({
    where: { id: lead.id },
    data: { customerFeedback: message, customerFeedbackAt: new Date() },
  });
  const base = request.nextUrl?.origin ?? request.url?.split('/api')[0] ?? 'http://localhost:3000';
  return NextResponse.redirect(new URL('/dashboard', base));
  } catch (err) {
    console.error('Dashboard feedback error:', err);
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 });
  }
}
