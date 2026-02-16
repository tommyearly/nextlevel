import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { PACKAGE_FORM_OPTIONS } from '@/lib/packages';

const ALLOWED_IDS = ['starter', 'growth', 'premium'] as const;

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  const raw = formData.get('packageId');
  const packageId = typeof raw === 'string' && (ALLOWED_IDS as readonly string[]).includes(raw) ? raw : null;
  if (!packageId) {
    return NextResponse.json({ error: 'Invalid package' }, { status: 400 });
  }
  const option = PACKAGE_FORM_OPTIONS.find((o) => o.id === packageId);
  const packageLabel = option?.value ?? packageId;

  const lead = await prisma.lead.findFirst({
    where: session.leadId ? { id: session.leadId, email: session.email } : { email: session.email },
    orderBy: { createdAt: 'desc' },
  });
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const isChange = lead.packageId !== packageId;
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      packageId,
      packageLabel,
      ...(isChange && {
        packageChangeFrom: lead.packageId,
        packageChangeRequestedAt: new Date(),
      }),
    },
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
