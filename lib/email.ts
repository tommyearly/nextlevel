import { Resend } from 'resend';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return typeof key === 'string' && key.length > 0 ? new Resend(key) : null;
}

const FROM = 'Next Level Web <noreply@nextlevelweb.ie>'; // e.g. onboarding@resend.devnoreply@nextlevelweb.ie after domain verify

const MAGIC_LINK_HTML_TEMPLATE = `<!DOCTYPE html>
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
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom: 8px;"><tr><td style="vertical-align: middle; padding-right: 10px;"><img src="{{LOGO_URL}}" width="32" height="32" alt="" style="display: block; border: 0;" /></td><td style="vertical-align: middle;"><h1 style="margin:0; font-size: 22px; font-weight: 700; color:#f8fafc; letter-spacing: -0.02em;">Next Level Web</h1></td></tr></table>
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
</html>`;

export type SendEmailResult = { ok: true } | { ok: false; message: string };

export type ContactCopyData = {
  name: string;
  email: string;
  company: string | null;
  packageLabel: string;
  message: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function contactCopyHtml(data: ContactCopyData): string {
  const rows = [
    ['Name', escapeHtml(data.name)],
    ['Email', escapeHtml(data.email)],
    ['Company', data.company ? escapeHtml(data.company) : '—'],
    ['Package', escapeHtml(data.packageLabel)],
    ['Message', escapeHtml(data.message).replace(/\n/g, '<br>')],
  ];
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px 8px 0; font-size:13px; color:#94a3b8; vertical-align:top;">${label}</td><td style="padding:8px 0; font-size:14px; color:#f8fafc;">${value}</td></tr>`
    )
    .join('');
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact — Next Level Web</title>
</head>
<body style="margin:0; padding:0; background-color:#0c1222; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0c1222;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color:#111827; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06);">
          <tr>
            <td style="padding: 32px 28px;">
              <h1 style="margin:0 0 8px 0; font-size: 22px; font-weight: 700; color:#f8fafc; letter-spacing: -0.02em;">Next Level Web</h1>
              <p style="margin:0 0 24px 0; font-size: 14px; color:#94a3b8;">New contact form submission</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0;">
                ${body}
              </table>
              <p style="margin: 24px 0 0 0; font-size: 13px; color:#94a3b8;">— Sent from your website</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendContactCopyEmail(to: string, data: ContactCopyData): Promise<SendEmailResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, message: 'RESEND_API_KEY not set' };
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: `New contact: ${data.name} — ${data.packageLabel} — Next Level Web`,
    html: contactCopyHtml(data),
  });
  if (error) {
    console.error('Resend contact copy error:', error);
    const msg = error.message ?? (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return { ok: false, message: msg };
  }
  return { ok: true };
}

export async function sendMagicLinkEmail(to: string, magicLinkUrl: string): Promise<SendEmailResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, message: 'RESEND_API_KEY not set' };
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://nextlevelweb.ie';
  const logoUrl = `${baseUrl}/icon-large.png`;
  const html = MAGIC_LINK_HTML_TEMPLATE.replace(/\{\{MAGIC_LINK_URL\}\}/g, magicLinkUrl).replace(/\{\{LOGO_URL\}\}/g, logoUrl);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Your login link — Next Level Web',
    html,
  });
  if (error) {
    console.error('Resend error:', error);
    const msg = error.message ?? (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return { ok: false, message: msg };
  }
  return { ok: true };
}

export type PaymentReceiptData = {
  leadName: string;
  leadEmail: string;
  packageLabel: string;
  paymentType: 'deposit' | 'balance';
  amountFormatted: string;
  date: string;
};

export async function sendPaymentReceiptEmail(
  to: string,
  data: PaymentReceiptData,
  opts?: { recipientType: 'customer' | 'admin' }
): Promise<SendEmailResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, message: 'RESEND_API_KEY not set' };
  }
  const paymentLabel = data.paymentType === 'deposit' ? 'Deposit (€200)' : 'Balance';
  const subject =
    opts?.recipientType === 'admin'
      ? `Payment received from ${data.leadEmail} — ${data.amountFormatted} (${paymentLabel}) — Next Level Web`
      : `Payment received — ${data.amountFormatted} (${paymentLabel}) — Next Level Web`;
  const { data: sendData, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject,
    html: `
      <p>Hi${data.leadName ? ` ${data.leadName}` : ''},</p>
      <p>This is your receipt for payment to Next Level Web.</p>
      <ul style="margin:16px 0; padding-left:20px;">
        <li><strong>Amount:</strong> ${data.amountFormatted}</li>
        <li><strong>Type:</strong> ${paymentLabel}</li>
        <li><strong>Package:</strong> ${data.packageLabel}</li>
        <li><strong>Date:</strong> ${data.date}</li>
      </ul>
      <p>Thank you for your payment.</p>
      <p>— Next Level Web</p>
    `,
  });
  if (error) {
    console.error('Resend payment receipt error:', error);
    const msg = error.message ?? (typeof error === 'object' ? JSON.stringify(error) : String(error));
    return { ok: false, message: msg };
  }
  return { ok: true };
}
