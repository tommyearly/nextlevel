import Stripe from 'stripe';

const secret = process.env.STRIPE_SECRET_KEY;
export const stripe =
  typeof secret === 'string' && secret.length > 0 ? new Stripe(secret) : null;

const PACKAGES = ['starter', 'growth', 'premium'] as const;
type PackageId = (typeof PACKAGES)[number];
type PaymentType = 'deposit' | 'balance';

export function getCheckoutPriceId(
  packageId: string | null | undefined,
  paymentType: PaymentType
): string | null {
  if (!packageId || !PACKAGES.includes(packageId as PackageId)) return null;
  const key = `STRIPE_PRICE_${(packageId as string).toUpperCase()}_${paymentType.toUpperCase()}`;
  const value = process.env[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export function hasStripeConfig(): boolean {
  return stripe !== null;
}
