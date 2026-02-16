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
