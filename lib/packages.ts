/** Package ids used in URLs (?package=...) and form pre-selection */
export const PACKAGE_IDS = ['starter', 'growth', 'premium', 'custom'] as const;
export type PackageId = (typeof PACKAGE_IDS)[number];

/** Option value for the contact form package <select> — must match exactly */
export const PACKAGE_FORM_OPTIONS: { id: PackageId; value: string }[] = [
  { id: 'starter', value: 'Starter — €900 (5 pages + contact form)' },
  { id: 'growth', value: 'Growth — €1,200 (5 pages + contact form + editable homepage)' },
  { id: 'premium', value: 'Premium — €2,000 (5 pages + contact form + fully editable)' },
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
