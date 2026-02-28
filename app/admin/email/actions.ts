'use server';

import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { signUnsubscribeToken } from '@/lib/unsubscribe';
import { sendCampaignEmail } from '@/lib/email';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.nextlevelweb.ie';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export type AddSubscriberResult =
  | { ok: true }
  | { ok: false; error: string };

export async function addSubscriber(formData: FormData): Promise<AddSubscriberResult> {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return { ok: false, error: 'Unauthorized' };
  }

  const rawEmail = formData.get('email');
  const email = typeof rawEmail === 'string' ? normalizeEmail(rawEmail) : '';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' };
  }

  const name = typeof formData.get('name') === 'string' ? formData.get('name') as string : null;
  const nameTrimmed = name?.trim() || null;

  const existing = await prisma.emailSubscriber.findUnique({
    where: { email },
  });

  if (existing && existing.status === 'unsubscribed') {
    return { ok: false, error: 'This address is unsubscribed and cannot be re-added. They must contact you to resubscribe.' };
  }

  if (existing) {
    return { ok: true }; // already subscribed
  }

  await prisma.emailSubscriber.create({
    data: {
      email,
      name: nameTrimmed,
      status: 'subscribed',
      source: 'admin',
    },
  });

  return { ok: true };
}

export type SendCampaignResult =
  | { ok: true; sent: number }
  | { ok: false; error: string };

const MAX_SEND = 500;

export async function sendCampaignToSubscribed(): Promise<SendCampaignResult> {
  const session = await getSessionFromCookie();
  if (!session || session.role !== 'admin') {
    return { ok: false, error: 'Unauthorized' };
  }

  const subscribers = await prisma.emailSubscriber.findMany({
    where: { status: 'subscribed' },
    take: MAX_SEND,
  });

  if (subscribers.length === 0) {
    return { ok: false, error: 'No subscribed recipients. Add subscribers first.' };
  }

  let sent = 0;
  for (const sub of subscribers) {
    const token = signUnsubscribeToken(sub.email);
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email=${encodeURIComponent(sub.email)}&token=${encodeURIComponent(token)}`;
    const result = await sendCampaignEmail(sub.email, unsubscribeUrl);
    if (result.ok) {
      sent++;
    } else {
      console.error(`Campaign send failed for ${sub.email}:`, result.message);
    }
  }

  return { ok: true, sent };
}
