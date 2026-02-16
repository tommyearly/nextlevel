# Stripe payments setup — step-by-step (plain English)

This guide walks you through adding Stripe so customers can pay for your three website packages. When they pay (deposit or full amount), your **admin leads page** will automatically show “Deposit paid” or “Paid in full” using webhooks.

---

## What you already have

- **Pricing page** with 3 packages and prices:
  - **Starter** — €900 total (€200 deposit, €700 balance)
  - **Growth** — €1,200 total (€200 deposit, €1,000 balance)
  - **Premium** — €2,000 total (€200 deposit, €1,800 balance)
- **Admin** that shows each lead’s payment status (Unpaid / Deposit paid / Paid in full).
- **Database** with a `paymentStatus` field and optional `stripeCustomerId` on each lead.

Stripe will handle the actual payment; your app will create payment links and then **update** `paymentStatus` when Stripe tells you a payment succeeded (via a “webhook”).

---

## Step 1: Create a Stripe account and get your keys

1. Go to [https://stripe.com](https://stripe.com) and sign up (or log in).
2. Complete any verification Stripe asks for (e.g. business details). You can do this later if you want to test first.
3. Open the **Developers** section:
   - Click your profile/account (top right) → **Developers** → **API keys**  
   - Or go to: [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
4. You’ll see two keys:
   - **Publishable key** — starts with `pk_test_` (test) or `pk_live_` (live). Safe to use in the browser.
   - **Secret key** — starts with `sk_test_` or `sk_live_`. **Never** put this in the browser or in public code; only use it on the server.
5. For development, use **Test mode** (toggle in the dashboard so the keys show “Test”). Copy both keys; you’ll add them to your app in a later step.

**In short:** You get a “secret” key for your server and a “publishable” key for the front end. Test keys are for fake cards; live keys are for real money.

---

## Step 2: Create your 3 products and prices in Stripe

Stripe needs to know what you’re selling and how much each item costs. You’ll create **one product per package**, each with **two prices**: deposit (€200) and balance (€700, €1,000, or €1,800).

1. In Stripe Dashboard go to **Product catalog** → **Products**  
   [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Click **+ Add product** and create these **three products** (you can add the two prices when creating each product, or add the second price after):

| Product name (in Stripe) | Price 1 name | Price 1 amount | Price 2 name | Price 2 amount |
|--------------------------|--------------|-----------------|--------------|----------------|
| **Starter**              | Deposit      | €200            | Balance      | €700           |
| **Growth**               | Deposit      | €200            | Balance      | €1,000         |
| **Premium**              | Deposit      | €200            | Balance      | €1,800         |

3. For each product:
   - Set **Name** (e.g. “Starter”).
   - Add **Price 1**: one-time payment, €200, currency EUR. Note the **Price ID** (e.g. `price_xxxxx`).
   - Add **Price 2**: one-time payment, correct balance in EUR. Note the **Price ID**.
4. After you’re done, you should have **6 Price IDs** in total (2 per package). Write them down in a list like this — you’ll put these in your app’s environment variables:

```text
Starter  deposit  price_xxxxx
Starter  balance  price_xxxxx
Growth   deposit  price_xxxxx
Growth   balance  price_xxxxx
Premium  deposit  price_xxxxx
Premium  balance  price_xxxxx
```

**In short:** You’re telling Stripe “I sell 3 products; each has a €200 deposit and a different balance.” The Price IDs are how your app will say “charge this exact amount” when creating a payment link.

---

## Step 3: Install Stripe in your project and add environment variables

1. In your project folder (e.g. `nextlevelie`), run:

```bash
npm install stripe
```

2. Open your **.env** file (create it if it doesn’t exist). Add these lines (use your **test** keys and the **real** Price IDs from Step 2):

```env
# Stripe (use sk_test_... and pk_test_... for testing)
STRIPE_SECRET_KEY=your_stripe_secret_key_from_dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_from_dashboard

# Stripe Price IDs (from Step 2 — replace with your actual IDs)
STRIPE_PRICE_STARTER_DEPOSIT=price_xxxxx
STRIPE_PRICE_STARTER_BALANCE=price_xxxxx
STRIPE_PRICE_GROWTH_DEPOSIT=price_xxxxx
STRIPE_PRICE_GROWTH_BALANCE=price_xxxxx
STRIPE_PRICE_PREMIUM_DEPOSIT=price_xxxxx
STRIPE_PRICE_PREMIUM_BALANCE=price_xxxxx
```

3. **Important:** The file `.env` must never be committed to Git. It should already be in `.gitignore`. Double-check that `.env` is listed there.

**In short:** The app will use the secret key on the server to create payments and the publishable key on the front end if you ever need it there. The six Price IDs tell Stripe which product/amount to charge for each package and payment type.

---

## Step 4: Create a “payment link” (Checkout) in your app

**This step is already implemented in your project.** Here’s what’s in place and what you need to do.

### What’s in the app

1. **`npm install stripe`** — Run this in your project folder if you haven’t already.
2. **`lib/stripe.ts`** — Reads `STRIPE_SECRET_KEY` and the six `STRIPE_PRICE_*` env vars; exposes `getCheckoutPriceId(packageId, 'deposit' | 'balance')` so the checkout route picks the right price.
3. **`POST /api/dashboard/checkout`** — Expects form field `type=deposit` or `type=balance`. Loads the logged-in lead, gets the correct Stripe Price ID for their package, creates a Stripe Checkout Session with `metadata: { leadId, paymentType }`, and redirects the customer to Stripe. After payment, Stripe sends them back to `/dashboard?paid=1`.
4. **Dashboard** — “Pay online — coming soon” is replaced by:
   - **Pay deposit (€200)** when deposit isn’t paid and a deposit price is configured for that package.
   - **Pay balance** when deposit is paid but balance isn’t, and a balance price is configured.
   - “You’re all paid” when both are paid.
   - “Payment link will be sent by email” if no Stripe price is set for that package (e.g. Growth/Premium until you add their Price IDs).

### What you must do

1. **Add your secret key to `.env`** (required for checkout to work):

   ```env
   STRIPE_SECRET_KEY=your_secret_key_from_stripe_dashboard
   ```

   Get it from [Stripe Dashboard → Developers → API keys](https://dashboard.stripe.com/apikeys) (use **Secret key**, test mode).

2. **Keep your Price IDs in `.env`** (you already have Starter):

   ```env
   STRIPE_PRICE_STARTER_DEPOSIT=price_xxxxx
   STRIPE_PRICE_STARTER_BALANCE=price_xxxxx
   ```

   When you create Growth and Premium prices in Stripe, add:

   ```env
   STRIPE_PRICE_GROWTH_DEPOSIT=price_xxxxx
   STRIPE_PRICE_GROWTH_BALANCE=price_xxxxx
   STRIPE_PRICE_PREMIUM_DEPOSIT=price_xxxxx
   STRIPE_PRICE_PREMIUM_BALANCE=price_xxxxx
   ```

3. **Restart the dev server** after changing `.env` (`npm run dev`).

4. **Test:** Log in as a customer with a **Starter** package, open the dashboard, and click **Pay deposit (€200)**. You should be sent to Stripe Checkout. Use test card `4242 4242 4242 4242`. After paying, you’ll return to `/dashboard?paid=1`; the admin will still show “Unpaid” until you add the webhook (Step 5).

**In short:** When the customer clicks “Pay deposit”, your server creates a Stripe checkout for the right €200 price and sends them to Stripe. Same idea for “Pay balance” with the right balance price.

---

## Step 5: Add a webhook so Stripe can tell your app when a payment succeeds

**This step is implemented.** The route `POST /api/webhooks/stripe` does the following:

1. Reads the raw body with `request.text()` (required for signature verification).
2. Verifies the request using the `Stripe-Signature` header and `STRIPE_WEBHOOK_SECRET`.
3. On `checkout.session.completed`: reads `metadata.leadId` and `metadata.paymentType` from the session, then updates the lead’s `paymentStatus` to `paid_deposit` or `paid_full` (and stores `stripeCustomerId` if present).
4. Returns 200 so Stripe doesn’t retry.

**What you need to do:** Add the webhook signing secret to `.env` (see Step 6) and register the endpoint in the Stripe Dashboard. For local testing, use the Stripe CLI to forward events: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` — it will print a temporary `whsec_...` secret to use in `.env` while testing.

---

## Step 6: Register the webhook in the Stripe Dashboard

Stripe doesn’t know your webhook URL until you add it.

1. In Stripe Dashboard go to **Developers** → **Webhooks**  
   [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**.
3. **Endpoint URL:** Your app must be reachable on the internet. For local development you can use a tunnel (e.g. [Stripe CLI](https://stripe.com/docs/stripe-cli) or [ngrok](https://ngrok.com)):
   - Example live URL: `https://yourdomain.com/api/webhooks/stripe`
   - Example local tunnel: `https://xxxx.ngrok.io/api/webhooks/stripe`
4. **Events to send:** Choose **checkout.session.completed** (or “Checkout session completed”). You can add more events later (e.g. `payment_intent.succeeded`) if you switch to a different flow.
5. After saving, Stripe shows a **Signing secret** (starts with `whsec_`). Put it in `.env` as `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`. Restart your app after changing `.env`.

**In short:** You tell Stripe “when a checkout is completed, POST to this URL.” Stripe gives you a secret so your app can verify that the request is really from Stripe.

---

## Step 7: Make sure the admin shows payments

Your admin already shows “Unpaid”, “Deposit paid”, or “Paid in full” based on the lead’s `paymentStatus`. Once the webhook updates `paymentStatus` (Step 5), the admin will automatically reflect:

- **Deposit paid** — when the customer has paid the €200 deposit (and not the balance).
- **Paid in full** — when the customer has paid the balance (or the full amount in one go, if you add that flow).

No extra admin code is needed for the “payment note” column; just ensure the dashboard and admin both read `paymentStatus` from the same Lead record (which they already do).

---

## Summary checklist

| Step | What you do |
|------|-------------|
| 1    | Create Stripe account; get **Publishable** and **Secret** API keys (test mode for dev). |
| 2    | Create 3 products (Starter, Growth, Premium), each with 2 prices (Deposit €200 + Balance). Copy all 6 **Price IDs**. |
| 3    | Run `npm install stripe`; add keys and 6 Price IDs to `.env`. |
| 4    | Add API route to create a Checkout Session (deposit or balance) and “Pay deposit” / “Pay balance” on the dashboard. |
| 5    | Add `POST /api/webhooks/stripe` to verify Stripe’s request and update the lead’s `paymentStatus` (and optionally `stripeCustomerId`). |
| 6    | In Stripe Dashboard, add webhook endpoint URL and subscribe to `checkout.session.completed`; add **Signing secret** to `.env`. |
| 7    | Confirm admin leads page shows Unpaid / Deposit paid / Paid in full (it already uses `paymentStatus`). |

---

## Your 3 prices (for reference)

Taken from your pricing page and `lib/pricing.ts`:

| Package | Total | Deposit | Balance |
|---------|--------|---------|---------|
| Starter | €900  | €200    | €700    |
| Growth  | €1,200| €200    | €1,000  |
| Premium | €2,000| €200    | €1,800  |

Use these exact amounts when creating the two prices per product in Stripe (Step 2).

---

## Going live later

- Switch Stripe Dashboard to **Live mode** and use live API keys in production `.env`.
- Create the same products/prices in Live mode (or duplicate the catalog) and update the 6 Price ID env vars to the live Price IDs.
- Set the production webhook URL (e.g. `https://yourdomain.com/api/webhooks/stripe`) and use the **live** webhook signing secret in production.

If you want, the next step can be concrete code for Step 4 (checkout route + dashboard buttons) and Step 5 (webhook route and DB update) in your repo.
