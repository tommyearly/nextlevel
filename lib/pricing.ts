import { PACKAGES } from './packages';

const DEPOSIT_EURO = 200;

function getPriceFromPackages(id: string): number | null {
  if (id === 'custom') return null;
  const pkg = PACKAGES.find((p) => p.id === id);
  return pkg ? pkg.price : null;
}

export type PackagePricing = {
  label: string;
  total: number | null;
  deposit: number;
  totalFormatted: string;
};

export function getPackagePricing(packageId: string | null | undefined): PackagePricing {
  const id = packageId ?? '';
  const total = getPriceFromPackages(id);
  const pkg = PACKAGES.find((p) => p.id === id);
  const label = pkg ? pkg.name : id === 'custom' ? 'Custom' : 'Custom';
  const totalFormatted =
    total !== null ? `€${total.toLocaleString('en-IE')}` : 'Quote on request';
  return {
    label,
    total,
    deposit: DEPOSIT_EURO,
    totalFormatted,
  };
}

export { DEPOSIT_EURO };

export type PaymentBreakdown = {
  depositAmount: number;
  depositStatus: 'Paid' | 'Unpaid';
  balanceAmount: number | null;
  balanceFormatted: string;
  balanceStatus: 'Paid' | 'Unpaid';
  totalFormatted: string;
  totalPaidFormatted: string;
};

/** Effective total paid in cents (from DB or inferred from paymentStatus for legacy leads). */
function effectiveTotalPaidCents(
  packageId: string | null | undefined,
  paymentStatus: string | null | undefined,
  totalPaidCents: number | null | undefined
): number {
  if (totalPaidCents != null && totalPaidCents > 0) return totalPaidCents;
  if (paymentStatus === 'paid_full') {
    const total = getPriceFromPackages(packageId ?? '');
    return total != null ? total * 100 : 0;
  }
  if (paymentStatus === 'paid_deposit') return DEPOSIT_EURO * 100;
  return 0;
}

export function getPaymentBreakdown(
  packageId: string | null | undefined,
  paymentStatus: string | null | undefined,
  totalPaidCents?: number | null
): PaymentBreakdown {
  const pricing = getPackagePricing(packageId);
  const totalCents = pricing.total != null ? pricing.total * 100 : null;
  const paid = effectiveTotalPaidCents(packageId, paymentStatus, totalPaidCents ?? 0);
  const depositPaid = paid >= DEPOSIT_EURO * 100;
  const balancePaid = totalCents !== null && paid >= totalCents;
  const balanceAmount =
    totalCents !== null ? Math.max(0, (totalCents - paid) / 100) : null;
  const balanceFormatted =
    balanceAmount !== null
      ? `€${balanceAmount.toLocaleString('en-IE')}`
      : '—';
  return {
    depositAmount: DEPOSIT_EURO,
    depositStatus: depositPaid ? 'Paid' : 'Unpaid',
    balanceAmount: balanceAmount !== null && balanceAmount > 0 ? balanceAmount : null,
    balanceFormatted,
    balanceStatus: balancePaid ? 'Paid' : 'Unpaid',
    totalFormatted: pricing.totalFormatted,
    totalPaidFormatted: `€${(paid / 100).toLocaleString('en-IE')}`,
  };
}
