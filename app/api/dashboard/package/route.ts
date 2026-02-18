import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getPackagePricing } from '@/lib/pricing';
import { PACKAGE_FORM_OPTIONS, isPackageDowngradeOrSame } from '@/lib/packages';

const ALLOWED_IDS = ['starter', 'growth', 'premium'] as const;

export async function POST(request: NextRequest) {
  const session = await getSessionFromRequest(request);
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
  if (isChange && isPackageDowngradeOrSame(lead.packageId, packageId)) {
    return NextResponse.json(
      { error: 'You can only upgrade to a higher tier. Downgrades are not allowed.' },
      { status: 400 }
    );
  }

  const isUpgrade = isChange && !isPackageDowngradeOrSame(lead.packageId, packageId);
  const currentPaidCents = lead.totalPaidCents ?? 0;
  const oldPricing = getPackagePricing(lead.packageId);
  const oldTotalCents = oldPricing.total != null ? Math.round(oldPricing.total * 100) : 0;
  const totalPaidCentsOnUpgrade =
    isUpgrade && lead.paymentStatus === 'paid_full' && currentPaidCents < oldTotalCents
      ? oldTotalCents
      : undefined;

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      packageId,
      packageLabel,
      ...(isChange && {
        packageChangeFrom: lead.packageId,
        packageChangeRequestedAt: new Date(),
      }),
      // On upgrade: keep deposit as paid but set status to paid_deposit so balance reflects new package (balance owing)
      ...(isUpgrade && lead.paymentStatus === 'paid_full'
        ? { paymentStatus: 'paid_deposit' as const }
        : {}),
      ...(totalPaidCentsOnUpgrade != null ? { totalPaidCents: totalPaidCentsOnUpgrade } : {}),
    },
  });

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
