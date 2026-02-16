import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'Next Level Web <onboarding@resend.dev>'; // Replace with your verified domain when ready

export type SendEmailResult = { ok: true } | { ok: false; message: string };

export async function sendMagicLinkEmail(to: string, magicLinkUrl: string): Promise<SendEmailResult> {
  if (!process.env.RESEND_API_KEY) {
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
