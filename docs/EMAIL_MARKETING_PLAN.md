# Email Marketing Strategy — Next Level Web

Plan for built-in email marketing: admin-managed list, beautiful campaign emails (3 packages), unsubscribe with block list, all in your site’s style.

---

## 1. Approach: Built-in vs external

| Option | Pros | Cons |
|--------|------|------|
| **Built-in (recommended)** | One login (admin), same styling, full control, no per-seat SaaS cost, Resend already in use | You build and maintain it |
| **External (Mailchimp, etc.)** | No build, analytics, deliverability tools | Cost, separate login, template may not match site |

**Recommendation:** Build it into the admin. Use your existing Resend account; add a `EmailSubscriber` table, admin UI to manage list + send campaigns, and an unsubscribe flow. Matches the “login, add emails, send lovely template” ask and keeps everything in one place.

---

## 2. Database

**New model: `EmailSubscriber`**

```prisma
model EmailSubscriber {
  id             String    @id @default(cuid())
  email          String    @unique
  status         String    // "subscribed" | "unsubscribed"
  name           String?   // optional
  source         String?   // "admin" | "import" | "website"
  subscribedAt   DateTime  @default(now())
  unsubscribedAt DateTime?

  @@index([status])
  @@index([email])
}
```

- **Add email:** Normalise (trim, lowercase). If email already exists and `status = "unsubscribed"`, do **not** change status (they stay blocked).
- **Unsubscribe:** Set `status = "unsubscribed"`, `unsubscribedAt = now()`.
- **Sending:** Only send to `status = "subscribed"`.

---

## 3. Unsubscribe flow (required)

- **In every campaign email:** Footer link e.g.  
  `https://www.nextlevelweb.ie/unsubscribe?email=xxx&token=yyy`  
  where `token` = HMAC or signed value so they can’t unsubscribe someone else.
- **Route:** `GET /unsubscribe?email=...&token=...`
  - Verify token.
  - Find `EmailSubscriber` by email (or create with status `unsubscribed` so we remember them).
  - Set `status = "unsubscribed"`, `unsubscribedAt = now()`.
  - Show a simple page: “You’re unsubscribed. You won’t receive further marketing emails.”
- **Block rule:** When you “add” an email in admin (or via CSV), if that email is already in the table with `unsubscribed`, either:
  - Refuse to add as subscribed, or
  - Add/update only as `unsubscribed` so they never get campaigns.

Result: anyone who unsubscribes is blocked until they explicitly re-subscribe (you can add a “Resubscribe” path later if you want).

---

## 4. Admin UI (behind existing admin auth)

**4.1 Subscribers page** (`/admin/email` or `/admin/subscribers`)

- List: email, name (if any), status, subscribed date.
- Filters: All / Subscribed / Unsubscribed.
- **Add subscriber:** Form with email (required), optional name. On submit: normalise email; if exists and unsubscribed, show message “This address is unsubscribed and cannot be re-added as subscribed” and do not set to subscribed.
- **Bulk import (CSV):** Upload CSV (email required, name optional). For each row: if email already unsubscribed, skip or add as unsubscribed; else add/update as subscribed.
- Stats: Total subscribed, total unsubscribed.

**4.2 Send campaign page** (`/admin/email/send` or under same section)

- **Choose template:** e.g. “3 packages promo” (single template for now).
- **Preview:** Show HTML preview (same as what will be sent).
- **Recipients:** “All subscribed” (default) — count = number of subscribed.
- **Send:** Button “Send to N subscribers”. Backend: fetch all `status = 'subscribed'`, send one Resend email per recipient (or batch if Resend supports). Optional: store a “Campaign” record (id, sentAt, recipientCount) for history.
- **Safety:** Confirm step (“Send to 150 subscribers?”) and maybe a rate limit (e.g. max 500 per run) to avoid mistakes.

**4.3 Optional: Campaign history**

- Table “Campaign” (id, name/template, sentAt, recipientCount) and list last 10 campaigns on the send page.

---

## 5. Email template (“3 packages promo”)

- **Style:** Match your site: dark background (#0c1222, #111827), accent blue/violet, same font stack. Inline CSS (email clients).
- **Structure:**
  - Header: Next Level Web logo/name.
  - Short intro: one or two lines (e.g. “Honest web design for Irish businesses. Pick a package and we’ll get you online.”).
  - **Three packages:** Starter €900, Growth €1,200, Premium €2,000 — same copy/features as site (from `PACKAGES` or hardcoded in template). Each with a clear CTA: “Get Starter” / “Choose Growth” / “Choose Premium” linking to e.g. `https://www.nextlevelweb.ie/contact?package=starter` (and growth/premium).
  - CTA line: “Get a quote” or “Talk to us” → contact page.
  - Footer: Address/phone if you want; **Unsubscribe:** “If you don’t want to receive these emails, [unsubscribe link].”
- **Unsubscribe link:** Must be in every campaign; use the signed URL from §3.

Implement as an HTML string in code (or a small template function) that takes `unsubscribeUrl` and optionally `firstName` for “Hi {{name}}” if you add personalisation later.

---

## 6. Bells and whistles (priority order)

1. **Unsubscribe + block** — Must have (above).
2. **Beautiful template** — 3 packages, site styling, CTA buttons.
3. **Admin: add one + list + filters** — Must have.
4. **CSV import** — High value for “add a lot of emails”.
5. **Preview before send** — High value.
6. **Send confirmation** — “Are you sure? Sending to N subscribers.”
7. **Campaign log** — Optional: store sent campaigns and recipient count.
8. **Double opt-in (optional later):** New signups get “Confirm your subscription” email; only mark subscribed when they click. Not required for v1.
9. **Open/click tracking (optional):** Tracking pixel and link redirects; consider privacy and GDPR. Can add later.

---

## 7. Technical summary

| Piece | Where |
|-------|--------|
| DB | New Prisma model `EmailSubscriber`; migration. |
| Unsubscribe | Page + API or server action: verify token, set unsubscribed, show confirmation. |
| Sign unsubscribe link | Server-side: e.g. `sign({ email, exp })` with a secret; verify on unsubscribe page. |
| Admin list + add + import | Admin route(s) under existing auth; server actions or API for add/import. |
| Send campaign | Admin “Send” → API or server action: get subscribed list, render HTML per recipient (or one template with replace), call Resend for each. |
| Template | HTML string in `lib/email.ts` or `lib/email-templates.ts`; reuse PACKAGES for copy/prices. |

---

## 8. Implementation phases

**Phase 1 — Core**
- Add `EmailSubscriber` model and migration.
- Unsubscribe: signed link generator + `/unsubscribe` page that sets status and shows confirmation.
- One “3 packages” HTML template with unsubscribe link in footer.

**Phase 2 — Admin**
- Subscribers page: list (with status filter), add-one form (respect unsubscribed block).
- Send campaign page: select “3 packages” template, preview, “Send to all subscribed” with confirmation.

**Phase 3 — Polish**
- CSV import for subscribers (respect unsubscribed).
- Campaign history (optional).
- Optional: double opt-in, open/click tracking.

---

## 9. Copy for “3 packages” email (draft)

- **Subject line (example):** “Three clear packages to get your business online — Next Level Web”
- **Intro:** “We’re an Irish web design agency. No jargon, no surprises — just clear pricing and a site you can update yourself. Here’s how it works.”
- **Packages:** Use same names/prices/features as site; CTAs to contact page with `?package=starter` etc.
- **Footer:** “You’re getting this because you signed up for updates from Next Level Web. [Unsubscribe from this list].”

---

If you want to proceed, the next step is **Phase 1**: schema + migration, unsubscribe flow, and the single campaign template, then Phase 2 admin UI.
