# Next Level Web — Complete Code Audit

**Date:** 2025-02-22  
**Scope:** Performance, Security, Code Quality, Bundle, Database, Caching, SEO, Accessibility, Error Handling, Refactoring

---

## Executive Summary

The Next Level Web Next.js application is well-structured with solid auth (magic-link + JWT) and clear separation of concerns. Several **critical** and **high**-severity issues require attention, notably the debug route exposing env metadata, missing DB indexes, and duplicated pricing/packages logic. The audit below provides specific file paths, line references, severity ratings, and prioritized fix recommendations.

---

## 1. Performance

### 1.1 Slow DB Queries — `findFirst` without index on `email`

**Severity:** High  
**Files:** `lib/magic-link.ts`, `app/api/auth/magic-link/route.ts`, `app/api/auth/verify/route.ts`, `app/api/dashboard/*`, `app/dashboard/page.tsx`

**Issue:** Lead lookups use `findFirst({ where: { email }, orderBy: { createdAt: 'desc' } })` frequently. Without an index on `(email, createdAt)`, PostgreSQL performs full table scans.

**Evidence:**
```23:26:app/dashboard/page.tsx
  const lead = await prisma.lead.findFirst({
    where: { email: session.email },
    orderBy: { createdAt: 'desc' },
    include: { ticketMessages: { orderBy: { createdAt: 'asc' } } },
```

**Fix:** Add compound index in `prisma/schema.prisma`:

```prisma
model Lead {
  // ...
  @@index([email, createdAt(sort: Desc)])
}
```

---

### 1.2 Redundant Lead Lookup Pattern (DRY)

**Severity:** Medium  
**Files:** `app/api/dashboard/package/route.ts:23`, `app/api/dashboard/ticket/route.ts:16`, `app/api/dashboard/feedback/route.ts:16`, `app/api/dashboard/checkout/route.ts:28`

**Issue:** Same lead-resolving logic repeated in multiple API routes:

```typescript
const lead = await prisma.lead.findFirst({
  where: session.leadId ? { id: session.leadId, email: session.email } : { email: session.email },
  orderBy: { createdAt: 'desc' },
});
```

**Fix:** Extract to shared utility in `lib/auth.ts` or `lib/lead.ts`:

```typescript
export async function getLeadForSession(session: SessionPayload) {
  return prisma.lead.findFirst({
    where: session.leadId
      ? { id: session.leadId, email: session.email }
      : { email: session.email },
    orderBy: { createdAt: 'desc' },
  });
}
```

---

### 1.3 ContactForm reCAPTCHA Script Not Cleaned Up

**Severity:** Low  
**File:** `components/ContactForm.tsx:33-53`

**Issue:** `useEffect` injects a reCAPTCHA script but the cleanup only deletes the callback. The script element is never removed from `document.head`, which can cause duplicate scripts on unmount/remount.

**Before:**
```javascript
return () => {
  delete win[callbackName];
};
```

**After:**
```javascript
const scriptEl = document.head.querySelector(`script[src*="recaptcha/api.js"]`);
if (scriptEl) scriptEl.remove();
delete win[callbackName];
```

---

### 1.4 HeroTypewriter Timeout Cleanup

**Status:** Good  
**File:** `components/HeroTypewriter.tsx:66-68`

The component correctly clears timeouts in `useEffect` cleanup and respects `prefers-reduced-motion`. No action needed.

---

## 2. Security

### 2.1 CRITICAL: Debug Route Exposes SESSION_SECRET Metadata

**Severity:** Critical  
**File:** `app/api/debug-env/route.ts`

**Issue:** Route returns `SESSION_SECRET: set | not set`, `length`, `ok`. While it doesn't expose the value, it reveals configuration state and aids attackers in probing.

```1:14:app/api/debug-env/route.ts
import { NextResponse } from 'next/server';

/**
 * Temporary: hit /api/debug-env on production to see if SESSION_SECRET is available.
 * Remove or protect this route once debugging is done.
 */
export async function GET() {
  const secret = process.env.SESSION_SECRET;
  return NextResponse.json({
    SESSION_SECRET: secret ? 'set' : 'not set',
    length: secret?.length ?? 0,
    ok: !!(secret && secret.length >= 32),
  });
}
```

**Fix:** **Remove this route entirely** or restrict to `NODE_ENV === 'development'`:

```typescript
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  // ... existing logic
}
```

---

### 2.2 Admin Magic Link: No Rate Limiting

**Severity:** High  
**File:** `app/api/auth/admin/magic-link/route.ts`

**Issue:** Anyone can POST arbitrary emails; only `ADMIN_EMAIL` gets a magic link. No rate limiting allows email bombing / enumeration.

**Fix:** Add rate limiting (e.g. Upstash Redis, or Vercel KV) or at minimum IP-based throttling. Consider using `@upstash/ratelimit` or middleware-level rate limit.

---

### 2.3 Contact Form: Hardcoded Admin Email

**Severity:** Medium  
**File:** `app/api/contact/route.ts:8`

```8:8:app/api/contact/route.ts
const ADMIN_EMAIL = 'hello@nextlevelweb.ie';
```

**Issue:** Admin email is hardcoded instead of using `process.env.ADMIN_EMAIL`. Reduces flexibility and may diverge from admin magic-link config.

**Fix:** Use `process.env.ADMIN_EMAIL ?? 'hello@nextlevelweb.ie'`.

---

### 2.4 Stripe Webhook: No Idempotency / Replay Protection

**Severity:** Medium  
**File:** `app/api/webhooks/stripe/route.ts`

**Issue:** Webhook processes `checkout.session.completed` without checking if the lead was already updated for that `session.id`. A duplicate webhook could double-count payments.

**Fix:** Store `processedStripeSessionIds` or add a `lastProcessedStripeSessionId` on Lead. Skip processing if already handled.

---

### 2.5 Session Cookie Security

**Status:** Good  
**File:** `lib/auth.ts`

- `httpOnly`, `secure` in prod, `sameSite: 'lax'` — appropriate.
- `SESSION_SECRET` length check (32+) — good.
- Consider adding `__Host-` prefix for extra security on same-origin cookies (optional).

---

## 3. Code Quality

### 3.1 Duplicated Package/Pricing Data

**Severity:** High  
**Files:** `components/Pricing.tsx`, `app/pricing/page.tsx`, `lib/packages.ts`, `lib/pricing.ts`

**Issue:** Package definitions (id, name, price, features, tagline) exist in three places:
- `components/Pricing.tsx` — `packages` array
- `app/pricing/page.tsx` — `packages` array
- `lib/packages.ts` + `lib/pricing.ts` — `PACKAGE_FORM_OPTIONS`, `PACKAGE_PRICES`

Adding a new package or changing a price requires edits in multiple files.

**Fix:** Centralize in `lib/packages.ts`:

```typescript
export const PACKAGES = [
  { id: 'starter', name: 'Starter', tagline: 'Get online fast', price: 900, features: [...], ... },
  // ...
] as const;
```

Then import in Pricing, pricing page, and pricing lib.

---

### 3.2 Admin Lead Detail: Duplicate "Project progress" Heading

**Severity:** Low  
**File:** `app/admin/leads/[id]/page.tsx:182-183`

```182:183:app/admin/leads/[id]/page.tsx
        <h2 className="font-heading text-lg font-semibold text-slate-50 mt-8 mb-4">Project progress</h2>
        <p className="text-slate-400 text-sm mb-4">Customer sees the staging URL and progress stage in their dashboard.</p>
        <h2 className="font-heading text-lg font-semibold text-slate-50 mt-8 mb-4">Ticket (TKT-{lead.id.slice(-6).toUpperCase()})</h2>
```

And again at line 229. One heading is duplicated; structure suggests the first "Project progress" block was meant to contain the form that appears later. Consolidate headings and layout.

---

### 3.3 Large Components

**File sizes (approx):**

| Component        | Lines | Notes                                |
|------------------|-------|--------------------------------------|
| `app/dashboard/page.tsx` | ~272 | Could extract `PackageCard`, `ProgressSection`, `TicketSection` |
| `app/admin/leads/[id]/page.tsx` | ~271 | Could extract `LeadInfoCard`, `PaymentSection`, `TicketSection` |
| `components/ContactForm.tsx` | ~218 | Reasonable; reCAPTCHA logic could move to hook |
| `lib/email.ts`   | ~270 | Long but cohesive; templates could move to separate file |

**Recommendation:** Extract dashboard and admin lead detail into smaller subcomponents for maintainability.

---

## 4. Bundle

### 4.1 Dependencies Overview

**File:** `package.json`

| Package        | Size Impact | Notes                          |
|----------------|-------------|--------------------------------|
| `next`         | Large       | Core framework                 |
| `@prisma/client` | Large    | Consider `output: 'edge'` only if using edge; otherwise default is fine |
| `stripe`       | Medium      | Server-only; tree-shaken       |
| `jose`         | Small       | JWT — lightweight              |
| `resend`       | Medium      | Server-only                    |
| `react`, `react-dom` | Core | Required                    |

**Status:** No heavy unnecessary deps. Stripe and Resend are server-only and excluded from client bundle.

---

### 4.2 Dynamic Imports

**Status:** Not used for heavy components.

**Recommendation:** Consider `next/dynamic` for `ContactForm` (reCAPTCHA script) or `CookieBanner` to reduce initial JS if they are below the fold. Low priority.

---

### 4.3 Tree-Shaking

**Status:** Good. ESM imports used throughout. `jose` and `stripe` are tree-shakeable.

---

## 5. Database

### 5.1 Missing Indexes

**Severity:** High  
**File:** `prisma/schema.prisma`

**Recommended indexes:**

```prisma
model Lead {
  // ... existing fields
  @@index([email, createdAt(sort: Desc)])
}

model TicketMessage {
  // ...
  @@index([leadId])
}

model MagicLinkToken {
  // tokenHash is @unique — already indexed
  @@index([expiresAt])  // For cleanup of expired tokens
}
```

---

### 5.2 N+1 Queries

**Status:** Good

- Admin leads list uses `include: { _count: { select: { ticketMessages: true } } }` — single query.
- Admin lead detail uses `include: { ticketMessages }` — single query.
- Dashboard uses `include: { ticketMessages }` — single query.

No N+1 patterns found.

---

### 5.3 Magic Link Token Cleanup

**Severity:** Low  
**File:** `lib/magic-link.ts`

**Issue:** Expired and used tokens accumulate. No scheduled job or cron to delete old rows.

**Fix:** Add a cleanup function and call it from a cron (e.g. Vercel Cron) or periodically:

```typescript
export async function cleanupExpiredMagicLinks() {
  await prisma.magicLinkToken.deleteMany({
    where: { OR: [{ expiresAt: { lt: new Date() } }, { usedAt: { not: null } }] },
  });
}
```

---

## 6. Caching

### 6.1 API Routes

**Status:** All relevant API routes are dynamic (auth, contact, webhooks, dashboard). No caching needed for these.

---

### 6.2 Page-Level Caching

**Status:** Admin and dashboard use `getSessionFromCookie()` and DB — correctly uncached. Home, contact, services, pricing are static-friendly but not explicitly cached. Next.js will cache static pages by default where possible.

---

### 6.3 Caching Opportunities

| Resource            | Cache Strategy                      |
|---------------------|-------------------------------------|
| `/`, `/services`, `/pricing`, `/contact` | ISR or static; already effectively cacheable |
| `SITE`, `PACKAGES`  | In-memory constants — no change needed |
| Lead/ticket data    | Must remain dynamic — no caching    |

---

## 7. SEO

### 7.1 Root Layout Metadata

**Status:** Good  
**File:** `app/layout.tsx:22-71`

- `metadataBase`, `title`, `description`, `keywords`, `openGraph`, `twitter`, `robots`, `canonical` — all present.
- OG image: `/og-image.png` referenced.

---

### 7.2 Page-Level Metadata

**Status:** Good  

| Page       | Title | Description | OG | Canonical |
|------------|-------|-------------|----|-----------|
| Contact    | ✓     | ✓           | ✓  | ✓         |
| Services   | ✓     | ✓           | ✓  | ✓         |
| Pricing    | ✓     | ✓           | ✓  | ✓         |

---

### 7.3 Missing Sitemap

**Severity:** Medium  
**File:** None (no `sitemap.ts` or `sitemap.xml`)

**Fix:** Add `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nextlevelweb.ie';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pricing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ];
}
```

---

### 7.4 Missing robots.txt

**Severity:** Low  
**File:** None

**Fix:** Add `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/admin', '/api'] },
    sitemap: 'https://nextlevelweb.ie/sitemap.xml',
  };
}
```

---

### 7.5 Structured Data

**Status:** Not implemented.

**Recommendation:** Add `LocalBusiness` or `Organization` JSON-LD on homepage and contact page for rich snippets. Low priority.

---

## 8. Accessibility

### 8.1 Good Practices

- `aria-label`, `aria-labelledby`, `aria-describedby` used on forms and sections.
- `role="main"`, `role="list"`, `role="log"` where appropriate.
- `focus:outline-none focus-visible:ring-2` on buttons and links.
- Form labels associated with inputs (`<label>`, `aria-label`).
- `prefers-reduced-motion` respected in HeroTypewriter.
- Cookie banner: `role="dialog"`, `aria-label="Cookie consent"`.
- Navbar: `aria-expanded`, `aria-controls`, `aria-label` on mobile toggle.

---

### 8.2 Issues

| Issue                          | Severity | Location | Fix |
|--------------------------------|----------|----------|-----|
| `GradientButton` with `href` + `children` only — no `aria-label` for icon-only | Low | `components/GradientButton.tsx` | Pass `ariaLabel` when text is not descriptive |
| `CheckoutButton` uses `alert()` for errors | Medium | `app/dashboard/CheckoutButton.tsx:30-37` | Replace with inline error message and `role="alert"` for screen readers |
| Delete confirmation uses `confirm()` | Low | `DeleteLeadButton.tsx` | Consider a modal for better a11y (focus trap, escape key) |
| Contact form error messages | Good | `ContactForm.tsx` | `role="alert"` present |

---

### 8.3 Color Contrast

**Status:** Assumed okay — `text-slate-400`, `text-slate-300`, `text-accent-blue` on dark backgrounds. Recommend running axe or Lighthouse for validation.

---

## 9. Error Handling

### 9.1 Unhandled Exceptions

**Status:** Most API routes use `try/catch` and return appropriate status codes. Some gaps:

| Route                 | Try/Catch | Notes                                      |
|-----------------------|-----------|--------------------------------------------|
| `api/contact`         | ✓         | Catches, returns 500                        |
| `api/auth/verify`     | ✓         | Catches, redirects with error param        |
| `api/auth/magic-link` | ✓         | Catches, returns 500                        |
| `api/auth/admin/magic-link` | ✓  | Catches, returns 500                        |
| `api/dashboard/*`     | ✗         | No try/catch; Prisma errors would bubble   |
| `api/admin/leads/*`   | Partial   | `project` has try/catch; others don't      |
| `api/webhooks/stripe` | Partial   | Inner try/catch for DB; no outer wrap      |

---

### 9.2 Edge Cases

**Contact API (`app/api/contact/route.ts`):**
- Sends magic link and dashboard login email before checking if `sendContactCopyEmail` succeeds. If Resend fails for contact copy, lead is still created and customer gets magic link — acceptable.
- If `sendMagicLinkEmail` fails, the API returns 503 but the lead is already created. Consider transactional rollback or at least documenting this.

**Dashboard package route:**
- Uses `NextResponse.redirect` after `prisma.lead.update`. If update throws, no catch — unhandled 500.

**Fix:** Add try/catch to dashboard routes:

```typescript
try {
  // ... existing logic
} catch (e) {
  console.error('Dashboard package error:', e);
  return NextResponse.json({ error: 'Update failed' }, { status: 500 });
}
```

---

### 9.3 Error Pages

**Status:** Good  
- `app/error.tsx` — client error boundary with reset and home link.
- `app/global-error.tsx` — root error boundary, self-contained markup.
- `app/not-found.tsx` — 404 handling (assumed present; not read but in file list).

---

## 10. Refactoring — Prioritized Fix List

### P0 — Critical (Do First)

1. **Remove or protect `/api/debug-env`** — Security risk.
2. **Add DB index on `Lead(email, createdAt)`** — Performance for lead lookups.

### P1 — High

3. **Extract shared `getLeadForSession`** — Reduce duplication and bugs.
4. **Centralize package/pricing data** — Single source of truth.
5. **Add rate limiting to admin magic link** — Prevent abuse.
6. **Add Stripe webhook idempotency** — Prevent double-processing.

### P2 — Medium

7. **Add sitemap.ts** — SEO.
8. **Add robots.ts** — SEO.
9. **Use `ADMIN_EMAIL` env in contact route** — Consistency.
10. **Add try/catch to dashboard API routes** — Error handling.
11. **Replace `alert()` in CheckoutButton** — Accessibility.

### P3 — Low

12. **Clean up ContactForm reCAPTCHA script on unmount** — Minor memory/duplication.
13. **Add MagicLinkToken cleanup cron** — DB hygiene.
14. **Fix duplicate "Project progress" heading** — Admin lead detail.
15. **Add indexes on `TicketMessage.leadId`, `MagicLinkToken.expiresAt`** — Query optimization.

### P4 — Nice to Have

16. Extract dashboard subcomponents (PackageCard, ProgressSection, TicketSection).
17. Add LocalBusiness structured data for SEO.
18. Dynamic import for ContactForm or CookieBanner if bundle size becomes an issue.

---

## Summary Table

| Category     | Critical | High | Medium | Low |
|-------------|----------|------|--------|-----|
| Security    | 1        | 1    | 2      | 0   |
| Performance | 0        | 1    | 1      | 1   |
| Code Quality| 0        | 1    | 0      | 2   |
| Database    | 0        | 1    | 0      | 2   |
| SEO         | 0        | 0    | 2      | 1   |
| Accessibility | 0      | 0    | 1      | 2   |
| Error Handling | 0     | 0    | 1      | 0   |

---

*End of audit.*
