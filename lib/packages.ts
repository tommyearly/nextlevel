/** Single source of truth for package definitions — used by Pricing, pricing page, contact form, dashboard, checkout. */
export const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Get online fast',
    price: 900,
    features: [
      '5-page website',
      'Contact form',
      'Domain name included',
      'Hosting included',
      'Mobile responsive',
      'SEO basics',
    ],
    cta: 'Get started',
    gradient: 'from-accent-blue/20 to-accent-violet/10',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Edit your homepage live',
    price: 1200,
    features: [
      'Everything in Starter',
      'Editable homepage on the fly',
      'Update key sections yourself',
      'No developer needed for content',
      'Domain name included',
      'Hosting included',
    ],
    cta: 'Choose Growth',
    gradient: 'from-accent-violet/25 to-accent-blue/15',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Fully yours to edit',
    price: 2000,
    features: [
      'Everything in Growth',
      'Fully editable site (all pages)',
      'Content management built in',
      'Ongoing flexibility',
      'Domain name included',
      'Hosting included',
    ],
    cta: 'Choose Premium',
    gradient: 'from-accent-violet/20 to-accent-cyan/10',
    popular: false,
  },
] as const;

export type PackageId = 'starter' | 'growth' | 'premium' | 'custom';

export const PACKAGE_IDS: readonly PackageId[] = ['starter', 'growth', 'premium', 'custom'];

/** Packages shown on Pricing section and pricing page (excludes Custom). */
export const DISPLAY_PACKAGES = PACKAGES;

const formatPrice = (n: number) => `€${n.toLocaleString('en-IE')}`;

/** Option value for the contact form package <select> — derived from PACKAGES. */
export const PACKAGE_FORM_OPTIONS: { id: PackageId; value: string }[] = [
  ...PACKAGES.map((p) => ({
    id: p.id,
    value: `${p.name} — ${formatPrice(p.price)} (5 pages + contact form${p.id === 'growth' ? ' + editable homepage' : p.id === 'premium' ? ' + fully editable' : ''})`,
  })),
  { id: 'custom', value: 'Custom (describe below)' },
];

export function getPackageOptionValue(id: string | null | undefined): string {
  if (!id) return '';
  const found = PACKAGE_FORM_OPTIONS.find((o) => o.id === id);
  return found?.value ?? '';
}

/** Map form select value (e.g. "Starter — €900...") back to package id for DB */
export function getPackageIdFromFormValue(formValue: string | null | undefined): PackageId | null {
  if (!formValue) return null;
  const found = PACKAGE_FORM_OPTIONS.find((o) => o.value === formValue);
  return found?.id ?? null;
}

/** Tier order for upgrade-only rule: starter < growth < premium. Custom has no tier. */
const PACKAGE_TIER_ORDER: Record<string, number> = {
  starter: 0,
  growth: 1,
  premium: 2,
  custom: -1,
};

export function getPackageTier(packageId: string | null | undefined): number {
  if (!packageId) return -1;
  return PACKAGE_TIER_ORDER[packageId] ?? -1;
}

/** True if newPackage is a higher tier than currentPackage (upgrade only). */
export function isPackageUpgrade(
  currentPackageId: string | null | undefined,
  newPackageId: string | null | undefined
): boolean {
  const current = getPackageTier(currentPackageId);
  const next = getPackageTier(newPackageId);
  if (current < 0 || next < 0) return false;
  return next > current;
}

/** True if newPackage is same or lower tier (downgrade or no change). */
export function isPackageDowngradeOrSame(
  currentPackageId: string | null | undefined,
  newPackageId: string | null | undefined
): boolean {
  const current = getPackageTier(currentPackageId);
  const next = getPackageTier(newPackageId);
  if (current < 0 || next < 0) return true;
  return next <= current;
}
