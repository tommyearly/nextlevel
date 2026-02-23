import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';
import { sendPaymentReceiptEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || typeof webhookSecret !== 'string') {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe not configured. Add STRIPE_SECRET_KEY to .env' },
      { status: 500 }
    );
  }

  let body: string;
  try {
    body = await request.text();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Stripe webhook signature verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const leadId = session.metadata?.leadId;
    const paymentType = session.metadata?.paymentType;

    // Idempotency: skip if we already processed this session (Stripe retries can send duplicate events)
    try {
      await prisma.processedStripeSession.create({
        data: { sessionId: session.id },
      });
    } catch (err: unknown) {
      const isUniqueViolation = err && typeof err === 'object' && 'code' in err && (err as { code?: string }).code === 'P2002';
      if (isUniqueViolation) {
        return NextResponse.json({ received: true });
      }
      throw err;
    }

    if (leadId && (paymentType === 'deposit' || paymentType === 'balance')) {
      try {
        const paymentStatus = paymentType === 'deposit' ? 'paid_deposit' : 'paid_full';
        const amountTotal = typeof session.amount_total === 'number' ? session.amount_total : 0;
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            paymentStatus,
            totalPaidCents: { increment: amountTotal },
            ...(session.customer && typeof session.customer === 'string'
              ? { stripeCustomerId: session.customer }
              : {}),
          },
        });

        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (lead) {
          const amountCents = session.amount_total ?? 0;
          const amountFormatted = `€${(amountCents / 100).toFixed(2)}`;
          const receiptData = {
            leadName: lead.name,
            leadEmail: lead.email,
            packageLabel: lead.packageLabel,
            paymentType: paymentType as 'deposit' | 'balance',
            amountFormatted,
            date: new Date().toLocaleDateString('en-IE', { dateStyle: 'long' }),
          };
          await sendPaymentReceiptEmail(lead.email, receiptData);
          const adminEmail = process.env.ADMIN_EMAIL;
          if (adminEmail && adminEmail !== lead.email) {
            await sendPaymentReceiptEmail(adminEmail, { ...receiptData, leadName: '' }, { recipientType: 'admin' });
          }

          let receiptUrl: string | null = null;
          try {
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ['payment_intent.latest_charge'],
            });
            const pi = fullSession.payment_intent as Stripe.PaymentIntent | null;
            const charge = pi && typeof pi === 'object' && pi.latest_charge;
            const chargeObj = typeof charge === 'object' && charge && 'receipt_url' in charge ? charge : null;
            if (chargeObj?.receipt_url) receiptUrl = chargeObj.receipt_url as string;
          } catch (e) {
            console.error('Could not fetch Stripe receipt URL:', e);
          }

          if (receiptUrl) {
            const existing = (lead.paymentReceipts as Array<{ receiptUrl: string; amountCents: number; paymentType: string; paidAt: string }>) ?? [];
            const next = [
              ...existing,
              {
                receiptUrl,
                amountCents,
                paymentType,
                paidAt: new Date().toISOString(),
              },
            ];
            await prisma.lead.update({
              where: { id: leadId },
              data: { paymentReceipts: next },
            });
          }
        }
      } catch (err) {
        console.error('Failed to process checkout session:', err);
        await prisma.processedStripeSession.delete({ where: { sessionId: session.id } }).catch(() => {});
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
