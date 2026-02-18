import { Resend } from 'resend';

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return typeof key === 'string' && key.length > 0 ? new Resend(key) : null;
}

const FROM = 'Next Level Web <onboarding@resend.dev>'; // Replace with your verified domain when ready

export type SendEmailResult = { ok: true } | { ok: false; message: string };

export async function sendMagicLinkEmail(to: string, magicLinkUrl: string): Promise<SendEmailResult> {
  const resend = getResend();
  if (!resend) {
    return { ok: false, message: 'RESEND_API_KEY not set' };
  }
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: [to],
    subject: 'Your login link — Next Level Web',
    html: `
      <p>Hi,</p>
      <p>Use the link below to sign in. This link expires in 30 minutes and can only be used once.</p>
      <p><a href="${magicLinkUrl}" style="color:#3b82f6;">Sign in</a></p>
      <p>If you didn't request this, you can ignore this email.</p>
      <p>— Next Level Web</p>
    `,
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
