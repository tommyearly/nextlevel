import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';

const VALID_STATUSES = ['unpaid', 'paid_deposit', 'paid_full'] as const;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const formData = await request.formData();
  const raw = formData.get('paymentStatus');
  const paymentStatus = typeof raw === 'string' && VALID_STATUSES.includes(raw as typeof VALID_STATUSES[number])
    ? raw
    : null;
  if (!paymentStatus) {
    return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
  }
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }
  await prisma.lead.update({
    where: { id },
    data: { paymentStatus },
  });
  return NextResponse.redirect(new URL(`/admin/leads/${id}`, request.url));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  let body: { paymentStatus?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const raw = body.paymentStatus;
  const paymentStatus = typeof raw === 'string' && VALID_STATUSES.includes(raw as typeof VALID_STATUSES[number])
    ? raw
    : null;
  if (!paymentStatus) {
    return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 });
  }
  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }
  await prisma.lead.update({
    where: { id },
    data: { paymentStatus },
  });
  return NextResponse.json({ success: true });
}
