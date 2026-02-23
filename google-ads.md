# Google Ads Campaign Setup — Next Level Web

**Goal:** Lead form submissions | **Budget:** €5/day | **Account:** nextlevelweb.ie@gmail.com

---

## 1. Campaign Type & Goal

**Choose:** **Submit lead form** (not Purchases)

- Your site converts via the contact form, not checkout.
- Google will optimize for people who fill out your form.

**Conversion setup:** Select **"Set up manually using code after you create the campaign"**

- Your form stays on the same page and shows a success message — no separate thank-you URL.
- We’ll add conversion tracking code that fires when the form successfully submits.

---

## 2. Business Information

| Field | Value |
|-------|--------|
| Business name | Next Level Web |
| Phone | 956-966-6900 or 089 278 1782 |
| Email | nextlevelweb.ie@gmail.com |
| Website | https://www.nextlevelweb.ie |
| Address | 38 Easton Drive, Leixlip, Co. Kildare |

Use these consistently so extensions and account info match.

---

## 3. Campaign Settings

| Setting | Value |
|---------|-------|
| Campaign type | Search |
| Goal | Leads |
| Campaign name | Next Level Web – Lead Gen – IE |
| Location | Ireland |
| Language | English |
| Budget | €5.00/day |
| Bid strategy | Maximize conversions (or Maximize clicks for learning) |

**Locations:** Target Ireland only (or Ireland + UK if you serve both). Avoid “People in or regularly in your targeted locations” unless you want broader reach.

---

## 4. Search Themes (formerly Keywords)

Add 5–10 themes so Google can match relevant queries. For a €5 budget, start tight.

**Primary themes:**

- website design Ireland  
- web design Dublin  
- website builder for business Ireland  
- affordable website design  
- small business website Ireland  

**Optional (slightly broader):**

- create a website for my business  
- professional website design  
- WordPress website design Ireland  

Add these as **search themes**, not exact keywords. Google uses them to find similar searches.

---

## 5. Ad Group & Ad Copy

**Ad group name:** Lead Gen – Web Design Ireland

**Headlines (up to 3, 30 chars each):**

1. Irish Website Design  
2. Affordable Web Design  
3. Get Your Site Built  

**Descriptions (up to 2, 90 chars each):**

1. Irish-run, honest pricing. Starter €900. Get a quote in 24hrs. Domain & hosting included.  
2. No surprises, no hassle. Tell us your goals. We respond within 24 hours.  

**Final URL:** https://www.nextlevelweb.ie/contact  
**Display path:** nextlevelweb.ie/contact  

---

## 6. Bid Strategy at €5/day

- Start with **Maximize clicks** for 2–4 weeks to gather data.
- Switch to **Maximize conversions** once you see 20–30 conversions.
- If “Maximize conversions” isn’t available, use **Manual CPC** and set a max CPC around €0.80–€1.20 for Ireland.

---

## 7. Payment

- Card or bank account as per Google’s prompts.
- You’ll be charged for clicks, not impressions.

---

## 8. Conversion Tracking (After Campaign Creation)

Because you chose “Set up manually using code”:

### Step A: Get conversion details in Google Ads

1. Google Ads → **Goals** → **Conversions**
2. Create conversion: **Website** → **Manually add a conversion action**
3. Category: **Submit lead form**
4. Name: `Contact form submit`
5. Value: Optional (e.g. €50 for lead value)
6. Count: **One** (one conversion per ad click)
7. Click-through window: 30 days  
8. Attribution: **Data-driven** or **Last click**
9. Save and get:
   - **Conversion ID** (e.g. `AW-123456789`)
   - **Conversion label** (e.g. `AbCdEfGhIjK`)

### Step B: Add gtag.js (if not already on site)

Ensure your `layout.tsx` or root HTML includes:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-XXXXXXXXX'); // Replace with your Conversion ID
</script>
```

### Step C: Fire conversion on form success

In `components/ContactForm.tsx`, after a successful submit (when you call `setStatus('sent')`), add:

```ts
// After setStatus('sent') in the try block:
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('event', 'conversion', {
    send_to: 'AW-XXXXXXXXX/AbCdEfGhIjK', // Replace with your ID/label
  });
}
```

And extend the `Window` type in that file:

```ts
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    // ... existing grecaptcha
  }
}
```

---

## 9. Checklist Before Going Live

- [ ] Goal: Submit lead form  
- [ ] Conversion: Set up manually (code)  
- [ ] Budget: €5/day  
- [ ] Location: Ireland  
- [ ] Search themes added  
- [ ] Ad copy and URL set  
- [ ] Payment method added  
- [ ] After launch: conversion action created and code added to ContactForm  

---

## 10. Weekly Checks (First Month)

1. **Conversions:** Are form submits recorded in Google Ads?
2. **Cost per lead:** €5/day × 30 ≈ €150/month — aim for 3–10 leads if CPC ≈ €1–2.
3. **Search terms report:** Remove irrelevant terms.
4. **Landing page:** Confirm traffic goes to `/contact`.

---

## Summary

| Item | Action |
|------|--------|
| Goal | Submit lead form |
| Conversion URL | Skip — use code setup |
| Budget | €5/day |
| Location | Ireland |
| Keywords | Search themes (web design Ireland, etc.) |
| Landing page | nextlevelweb.ie/contact |
| Post-launch | Add gtag conversion fire in ContactForm on success |
