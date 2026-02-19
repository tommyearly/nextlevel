# Resend setup — Pro + custom magic-link email

Instructions for [Resend](https://resend.com/): upgrade to Pro, verify your domain, and use a custom magic-link email that matches the Next Level Web site.

---

## 1. Resend account and Pro

- Sign in or sign up: **https://resend.com/**
- **Upgrade to Pro** (Billing in dashboard) so you can:
  - Send from your own domain (e.g. `noreply@nextlevelweb.ie`)
  - Higher sending limits and better deliverability

---

## 2. Verify your domain

So the “From” address can be `Next Level Web <noreply@nextlevelweb.ie>` (or similar):

1. In Resend: **Domains** → **Add Domain**
2. Enter your domain (e.g. `nextlevelweb.ie`)
3. Add the DNS records Resend shows (MX, SPF, DKIM, optional DMARC) at your DNS provider
4. Wait for verification (usually a few minutes)
5. In the app, set the “From” address to a verified identity, e.g. `noreply@nextlevelweb.ie` or `hello@nextlevelweb.ie`

Docs: [Resend – Domain authentication](https://resend.com/docs/dashboard/domains/introduction)

---

## 2a. DNS on Vercel — exact records from Resend

Your DNS for **nextlevelweb.ie** is on **Vercel**. Add these in **Vercel** → **Domains** → **nextlevelweb.ie** → **DNS**. (Ignore LetsHost’s DKIM/SPF — those are for LetsHost’s mail server, not Resend.)

Resend uses the **send** subdomain for MX/SPF and **resend._domainkey** for DKIM. Add exactly what Resend shows; below is the shape for nextlevelweb.ie.

| Type | Name (Vercel) | Content / Value | TTL | Priority (MX only) |
|------|----------------|------------------|-----|--------------------|
| **TXT** | `resend._domainkey` | Copy the full Content from Resend (DKIM). If Resend shows only `p=MIGfMA0...`, use `v=DKIM1; k=rsa; p=` + that `p=` value. | 3600 or Auto | — |
| **MX** | `send` | `feedback-smtp.eu-west-1.amazonses.com` | 60 | 10 |
| **TXT** | `send` | `v=spf1 include:amazonses.com ~all` | 60 | — |
| **TXT** | `_dmarc` | `v=DMARC1; p=none;` | 3600 or Auto | — |

- **Name in Vercel:** enter only the label (e.g. `send`, `resend._domainkey`, `_dmarc`). Vercel will qualify with `nextlevelweb.ie`.
- **DKIM:** paste the exact Content from Resend’s DKIM row. If the UI shows only the `p=...` part, the full TXT value is usually `v=DKIM1; k=rsa; p=<paste the p= value including MIGfMA0...>`.
- After saving in Vercel, wait a few minutes then click **Verify** in Resend. If it fails, re-check names and wait up to 24–48 h for propagation.

---

## 3. API key

- **API Keys** → Create key (e.g. “Production”)
- Put it in `.env` as `RESEND_API_KEY=re_xxxx...`
- The app already uses this in `lib/email.ts`; after domain verification you only need to change the `FROM` value (see below).

---

## 4. Custom magic-link template (matches your website)

Your site uses:

- Background: `#0c1222` (base), `#111827` (surface)
- Accent blue: `#3b82f6`
- Accent violet: `#8b5cf6`
- Text: `#f8fafc` (primary), `#94a3b8` (muted)
- Font: system stack (e.g. `font-sans` → Inter or system-ui)

Use the HTML below for the **magic link** email so it matches the site. Replace `{{MAGIC_LINK_URL}}` with the actual URL when sending.

### HTML template (inline for Resend)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your login link — Next Level Web</title>
</head>
<body style="margin:0; padding:0; background-color:#0c1222; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0c1222;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color:#111827; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
          <tr>
            <td style="padding: 32px 28px;">
              <h1 style="margin:0 0 8px 0; font-size: 22px; font-weight: 700; color:#f8fafc; letter-spacing: -0.02em;">Next Level Web</h1>
              <p style="margin:0 0 24px 0; font-size: 14px; color:#94a3b8;">Your login link</p>
              <p style="margin:0 0 16px 0; font-size: 15px; line-height: 1.5; color:#f8fafc;">Use the link below to sign in. This link expires in 30 minutes and can only be used once.</p>
              <p style="margin:0 0 24px 0;">
                <a href="{{MAGIC_LINK_URL}}" style="display: inline-block; padding: 12px 24px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); color:#ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 8px;">Sign in</a>
              </p>
              <p style="margin:0; font-size: 13px; color:#94a3b8;">If you didn't request this, you can ignore this email.</p>
              <p style="margin: 24px 0 0 0; font-size: 13px; color:#94a3b8;">— Next Level Web</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

---

## 5. Use the template in the app

In **`lib/email.ts`**:

1. Set `FROM` to your verified address, e.g.  
   `Next Level Web <noreply@nextlevelweb.ie>`
2. In `sendMagicLinkEmail`, replace the inline `html` string with the template above, and substitute the magic link:

```ts
const html = MAGIC_LINK_HTML_TEMPLATE.replace(/\{\{MAGIC_LINK_URL\}\}/g, magicLinkUrl);
```

You can define `MAGIC_LINK_HTML_TEMPLATE` in the same file (or in a separate `emails/magic-link.html.ts`) as the full HTML string above (with `{{MAGIC_LINK_URL}}` as placeholder).

---

## 6. Optional: React Email (design in code)

For a template you can preview and edit in React:

- [React Email](https://react.email) – [Getting started](https://react.email/docs/introduction)
- Resend supports sending from React Email components; see [Resend + React Email](https://resend.com/docs/send-with-react-email).

You’d add `@react-email/components`, create a `MagicLinkEmail` component using the same colors and copy as above, then in `sendMagicLinkEmail` use `render()` from `@react-email/components` and pass the result as `html` (or use Resend’s React Email API if you prefer).

---

## 7. Checklist

- [ ] Resend Pro (or plan that allows custom domain)
- [ ] Domain added and verified in Resend
- [ ] `RESEND_API_KEY` in production env (e.g. Vercel)
- [ ] `FROM` in `lib/email.ts` set to e.g. `Next Level Web <noreply@nextlevelweb.ie>`
- [ ] Magic-link HTML template in use (replace placeholder with `magicLinkUrl`)

After that, magic-link emails will be sent from your domain and will match your site’s look.
