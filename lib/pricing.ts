import type { PackageId } from './packages';

const DEPOSIT_EURO = 200;

const PACKAGE_PRICES: Record<PackageId, number | null> = {
  starter: 900,
  growth: 1200,
  premium: 2000,
  custom: null,
};

export type PackagePricing = {
  label: string;
  total: number | null;
  deposit: number;
  totalFormatted: string;
};

export function getPackagePricing(packageId: string | null | undefined): PackagePricing {
  const id = (packageId ?? '') as PackageId;
  const total = PACKAGE_PRICES[id] ?? null;
  const label =
    id === 'starter'
      ? 'Starter'
      : id === 'growth'
        ? 'Growth'
        : id === 'premium'
          ? 'Premium'
          : 'Custom';
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
};

export function getPaymentBreakdown(
  packageId: string | null | undefined,
  paymentStatus: string | null | undefined
): PaymentBreakdown {
  const pricing = getPackagePricing(packageId);
  const depositPaid =
    paymentStatus === 'paid_deposit' || paymentStatus === 'paid_full';
  const balancePaid = paymentStatus === 'paid_full';
  const balanceAmount =
    pricing.total !== null ? pricing.total - DEPOSIT_EURO : null;
  const balanceFormatted =
    balanceAmount !== null
      ? `€${balanceAmount.toLocaleString('en-IE')}`
      : '—';
  return {
    depositAmount: DEPOSIT_EURO,
    depositStatus: depositPaid ? 'Paid' : 'Unpaid',
    balanceAmount,
    balanceFormatted,
    balanceStatus: balancePaid ? 'Paid' : 'Unpaid',
    totalFormatted: pricing.totalFormatted,
  };
}
