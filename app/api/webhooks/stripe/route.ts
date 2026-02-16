import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/db';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
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

    if (leadId && (paymentType === 'deposit' || paymentType === 'balance')) {
      const paymentStatus = paymentType === 'deposit' ? 'paid_deposit' : 'paid_full';
      try {
        await prisma.lead.update({
          where: { id: leadId },
          data: {
            paymentStatus,
            ...(session.customer && typeof session.customer === 'string'
              ? { stripeCustomerId: session.customer }
              : {}),
          },
        });
      } catch (err) {
        console.error('Failed to update lead payment status:', err);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
