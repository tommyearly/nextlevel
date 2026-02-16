# Dashboard & Magic-Link Auth — Implementation Plan

**Project:** Next Level Web — Admin + Customer dashboards with magic-link login  
**Style:** Match existing site (dark theme, blue/violet accents, glassmorphism, Space Grotesk + Inter)

---

## 1. Goals

| Goal | Description |
|------|--------------|
| **Customer dashboard** | After contact form submit, user receives email with magic link → logs in → sees chosen package, total amount, and option to pay online (Stripe portal later). |
| **Admin dashboard** | View leads/customers, same look and feel as site. Protected; separate auth. |
| **Security** | Magic links single-use and short-lived; sessions in httpOnly cookies; rate limiting; no secrets in client. |
| **Stripe** | Placeholder only for now (“Pay online” → “Coming soon” or link you add later). |

---

## 2. Architecture Overview

```
[Contact form submit]
       → POST /api/contact
       → Validate, store lead/customer (DB)
       → Generate magic-link token (single-use, ~15–30 min TTL)
       → Send email with link: /dashboard/auth/verify?token=...
       → Response: success

[User clicks magic link]
       → GET /dashboard/auth/verify?token=...
       → Validate token, mark used, create session (httpOnly cookie)
       → Redirect to /dashboard

[Customer dashboard /dashboard]
       → Middleware: no session → redirect to /dashboard/login
       → Show: package name, total (€900 / €1,200 / €2,000 or Custom), deposit €200, “Pay online” (Stripe placeholder)

[Admin dashboard /admin]
       → Middleware: not admin session → redirect to /admin/login
       → Admin login: magic link to admin email (or simple password for MVP)
       → Show: list of leads/customers, same UI style
```

---

## 3. Data Model (for implementation)

- **Lead/Customer**  
  `id`, `email`, `name`, `company`, `packageId` (starter|growth|premium|custom), `packageLabel` (display text), `message`, `createdAt`. Optional later: `stripeCustomerId`, `paymentStatus`.

- **Magic link token**  
  `id`, `tokenHash` (store hashed, not plain), `email`, `role` (customer | admin), `expiresAt`, `usedAt` (null until used). Single-use: once verified, set `usedAt`.

- **Session**  
  Stored in signed httpOnly cookie (e.g. payload: `{ email, role, customerId? }` + expiry). No DB session table required for MVP if using JWT-like cookie; or short-lived DB session row.

- **Package pricing** (already in code)  
  Starter €900, Growth €1,200, Premium €2,000. Custom: “Quote on request” or TBD. Deposit €200 (from existing copy).

---

## 4. Security

| Measure | Detail |
|---------|--------|
| Magic link | Cryptographically random token (e.g. 32 bytes), stored hashed (e.g. SHA-256). Single use; set `usedAt` on first successful verify. |
| TTL | Token expires in 15–30 minutes. Clear expired tokens periodically. |
| HTTPS | Magic link and auth routes only over HTTPS in production. |
| Session cookie | httpOnly, secure, sameSite=lax (or strict). Short expiry (e.g. 7 days; or “session” with refresh). |
| Admin isolation | Admin auth separate from customer; admin role checked in middleware for `/admin/*`. |
| Rate limiting | Limit requests to `/api/contact`, `/api/auth/request-magic-link`, and `/api/auth/verify` (e.g. per IP / per email). |
| No secrets in client | Token only in URL once; after verify, redirect and drop token. Session only in httpOnly cookie. |

---

## 5. Routes & Pages

| Route | Purpose | Auth |
|-------|---------|------|
| `POST /api/contact` | Submit form; create lead; send magic-link email. | None (rate limited). |
| `GET /dashboard/login` | Customer: enter email, “Send magic link”. | None. |
| `POST /api/auth/magic-link` | Send magic link to given email (customer). | None (rate limited). |
| `GET /dashboard/auth/verify?token=...` | Consume token, create session, redirect to `/dashboard`. | Token in query. |
| `GET /dashboard` | Customer dashboard: package, total, “Pay online” (Stripe placeholder). | Session required. |
| `POST /api/auth/logout` | Clear session cookie. | Session. |
| `GET /admin/login` | Admin: enter email (or password for MVP). | None. |
| `POST /api/auth/admin/magic-link` or admin login | Admin magic link or password. | None (rate limited). |
| `GET /admin` | Admin dashboard: list of leads/customers. | Admin session required. |
| `GET /admin/auth/verify?token=...` | Consume admin magic link, set admin session. | Token. |

---

## 6. UI / UX (match site)

- **Colours & components**  
  Reuse: `bg-brand-surface`, `accent-blue`, `accent-violet`, `GlassCard`, `GradientButton`, existing Tailwind theme (see `tailwind.config.js` / `globals.css`).

- **Typography**  
  Same fonts: Space Grotesk (headings), Inter (body). Use existing `font-heading` / `font-body` and `hero-title-3d` only where it fits (e.g. dashboard title).

- **Layout**  
  - **Customer dashboard:** Simple layout: header with “Your dashboard” + logout; main area: card with “Your package”, “Total”, “Deposit €200”, “Pay online” (Stripe placeholder).  
  - **Admin dashboard:** Header + sidebar or top nav; table or card list of leads (name, email, package, date); same dark/glass style.

- **Responsive**  
  Mobile-first; dashboards work on small screens (stacked layout, no horizontal scroll).

---

## 7. Implementation Steps (order of work)

### Phase A — Foundation

1. **Step 1: Data store and schema**  
   - Choose DB: SQLite (Prisma) for simplicity, or Postgres if you prefer.  
   - Define schema: `Lead` (or `Customer`), `MagicLinkToken`, optionally `AdminUser` if not using a single admin email.  
   - Add Prisma (or Drizzle) and run migrations.

2. **Step 2: Package and pricing helper**  
   - Add to `lib/packages.ts` (or new `lib/pricing.ts`): function that returns `{ label, total, deposit }` for a given `packageId`. Custom returns “Quote on request” and optionally no fixed total.

3. **Step 3: Extend contact API**  
   - Keep existing validation (name, email, message).  
   - Parse `package` from body (already sent by form).  
   - Create `Lead` record in DB (email, name, company, packageId, packageLabel, message).  
   - Do **not** send magic link yet (next step).

### Phase B — Magic link (customer)

4. **Step 4: Magic-link generation and storage**  
   - Add `MagicLinkToken` table and a service: `createMagicLink(email, role: 'customer')` → generate secure token, hash and store, set `expiresAt`, return plain token for URL.  
   - Token in URL: `/dashboard/auth/verify?token=<plain>`.

5. **Step 5: Email sending**  
   - Integrate an email provider (Resend, SendGrid, etc.).  
   - After creating lead (Step 3), call `createMagicLink(lead.email, 'customer')`, then send email with link `https://<site>/dashboard/auth/verify?token=...`.  
   - Use env var for base URL and from address.

6. **Step 6: Verify route and session**  
   - `GET /dashboard/auth/verify?token=...`: lookup token by hash, check not expired and not used, get lead by email, set `usedAt`, create session (cookie: email, role=customer, leadId), redirect to `/dashboard`.  
   - Session: use a signed cookie (e.g. `jose` or NextAuth session strategy); httpOnly, secure, sameSite.

7. **Step 7: Middleware**  
   - For `/dashboard` (and `/dashboard/*` except login and auth/verify): if no valid session, redirect to `/dashboard/login`.  
   - For `/admin` (and `/admin/*` except login and auth/verify): if no valid admin session, redirect to `/admin/login`.

### Phase C — Customer dashboard UI

8. **Step 8: Customer dashboard layout and page**  
   - Layout: same Navbar/Footer or minimal dashboard shell (logo + “Dashboard” + Logout) using site styles.  
   - Page `/dashboard`: load lead for session email (or from session leadId); display package name, total amount, deposit €200, and a “Pay online” button that for now goes to placeholder (“Stripe payment coming soon”) or a disabled state.

9. **Step 9: Customer login page**  
   - `/dashboard/login`: form “Enter your email” → `POST /api/auth/magic-link` (body: `{ email }`). Rate limit. Show “Check your email” after submit.

### Phase D — Admin

10. **Step 10: Admin auth**  
    - Option A: Admin magic link to a fixed admin email (env var).  
    - Option B: Simple password login for MVP (env var `ADMIN_PASSWORD`); compare hashed value.  
    - Create admin session (role=admin) in cookie; middleware allows access to `/admin` only when admin.

11. **Step 11: Admin dashboard page**  
    - `/admin`: list all leads (table or cards): name, email, package, date, optional “View” link. Same colours and components as site. Pagination or “Load more” if needed later.

### Phase E — Polish and security

12. **Step 12: Stripe placeholder**  
    - “Pay online” in customer dashboard: button/link that either shows a “Payment portal coming soon” message or a URL you can set via env (e.g. Stripe Customer Portal) when ready. No Stripe API key required for this step.

13. **Step 13: Rate limiting and cleanup**  
    - Add rate limiting to `/api/contact`, `/api/auth/magic-link`, `/api/auth/verify`, and admin login.  
    - Optional: cron or on-request job to delete expired magic-link tokens.

14. **Step 14: Logout**  
    - `POST /api/auth/logout` (or GET) clears session cookie; redirect to home or `/dashboard/login`.

---

## 8. File / Folder Structure (suggested)

```
app/
  dashboard/
    layout.tsx          # Dashboard shell (nav + same style)
    page.tsx             # Customer: package + total + Pay online
    login/page.tsx       # Enter email for magic link
    auth/verify/page.tsx # GET ?token=... → verify, set session, redirect
  admin/
    layout.tsx           # Admin shell
    page.tsx             # List leads
    login/page.tsx       # Admin login
    auth/verify/page.tsx # Admin magic-link verify
  api/
    contact/route.ts     # Extended: save lead + send magic-link email
    auth/
      magic-link/route.ts    # POST { email } → send customer magic link
      verify/route.ts        # Optional API verify; or only page handler
      logout/route.ts
      admin/
        login/route.ts       # or magic-link for admin
        verify/
lib/
  db.ts or prisma.ts     # DB client
  auth.ts                # Session create/verify, cookie helpers
  magic-link.ts          # Create/verify token
  email.ts               # Send email (magic link)
packages.ts              # Existing; add getPackagePricing(id) if needed
components/
  dashboard/              # Shared dashboard UI: DashboardNav, PackageCard, etc.
  admin/                  # Admin table/cards
middleware.ts            # Protect /dashboard and /admin
```

---

## 9. Environment Variables (to document)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Prisma/DB connection. |
| `MAGIC_LINK_SECRET` or `SESSION_SECRET` | Sign cookies / tokens. |
| `EMAIL_*` or `RESEND_API_KEY` | Email provider. |
| `NEXT_PUBLIC_APP_URL` or `VERCEL_URL` | Base URL for magic link. |
| `ADMIN_EMAIL` | Admin magic-link target (if used). |
| `ADMIN_PASSWORD_HASH` | Optional; for password-based admin login. |

---

## 10. What You’ll Do Later (out of scope for this plan)

- Configure Stripe (product/price IDs, Customer Portal or Checkout).  
- Replace “Pay online” placeholder with real Stripe link or embedded flow.  
- Optional: webhook to update `paymentStatus` when payment succeeds.

---

**Next step:** Review this plan; then implementation can start from **Step 1** (data store and schema) and proceed in order.

---

## Goal 1 status (Customer dashboard) — DONE

- **Step 1–2:** Prisma (SQLite), `Lead` + `MagicLinkToken` schema; `lib/pricing.ts` + `getPackageIdFromFormValue` in packages.
- **Step 3:** `POST /api/contact` saves lead, creates magic link, sends email via Resend.
- **Step 4–6:** `lib/magic-link.ts`, `lib/auth.ts` (jose session cookie), `lib/email.ts` (Resend). `GET /dashboard/auth/verify` consumes token, sets session, redirects to `/dashboard`.
- **Step 7:** `middleware.ts` protects `/dashboard` (allows `/dashboard/login` and `/dashboard/auth/*`).
- **Step 8–9:** Customer dashboard page (package, total, deposit, “Pay online — coming soon”), `/dashboard/login` (request magic link). `POST /api/auth/magic-link`, `POST /api/auth/logout`.

**To run:** Copy `.env.example` to `.env`, set `RESEND_API_KEY` and `SESSION_SECRET` (min 32 chars). Run `npm run db:migrate` (creates DB). Then `npm run dev`. Submit contact form → check email for magic link → open link → see dashboard.
