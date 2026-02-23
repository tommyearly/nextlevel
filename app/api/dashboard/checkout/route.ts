import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getSessionFromRequest } from '@/lib/auth';
import { getLeadForSession } from '@/lib/lead';
import { prisma } from '@/lib/db';
import { getPackagePricing } from '@/lib/pricing';
import { stripe, getCheckoutPriceId } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
  const session = await getSessionFromRequest(request);
  if (!session || session.role !== 'customer') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: 'Payments not configured. Add STRIPE_SECRET_KEY to .env' },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const typeRaw = formData.get('type');
  const type = typeRaw === 'deposit' || typeRaw === 'balance' ? typeRaw : null;
  if (!type) {
    return NextResponse.json({ error: 'Invalid type. Use deposit or balance.' }, { status: 400 });
  }

  const lead = await getLeadForSession(session);
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl?.origin ?? 'http://localhost:3000';
  const successUrl = `${baseUrl}/dashboard?paid=1`;
  const cancelUrl = `${baseUrl}/dashboard`;

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

  if (type === 'deposit') {
    const priceId = getCheckoutPriceId(lead.packageId, 'deposit');
    if (!priceId) {
      return NextResponse.json(
        { error: `No Stripe price configured for ${lead.packageId} deposit. Add STRIPE_PRICE_${(lead.packageId ?? '').toUpperCase()}_DEPOSIT to .env` },
        { status: 400 }
      );
    }
    lineItems = [{ price: priceId, quantity: 1 }];
  } else {
    const pricing = getPackagePricing(lead.packageId);
    const totalCents = pricing.total != null ? Math.round(pricing.total * 100) : null;
    const totalPaidCents = lead.totalPaidCents ?? 0;
    const amountOwingCents = totalCents != null ? Math.max(0, totalCents - totalPaidCents) : 0;
    if (amountOwingCents <= 0) {
      return NextResponse.json(
        { error: 'No balance owing. You have already paid in full for this package.' },
        { status: 400 }
      );
    }
    lineItems = [
      {
        price_data: {
          currency: 'eur',
          unit_amount: amountOwingCents,
          product_data: {
            name: `${pricing.label} — balance`,
            description: `${lead.packageLabel}. Remaining amount due before launch.`,
          },
        },
        quantity: 1,
      },
    ];
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: lead.email,
    line_items: lineItems,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      leadId: lead.id,
      paymentType: type,
    },
  });

  const url = checkoutSession.url;
  if (!url) {
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 });
  }

  return NextResponse.json({ redirectUrl: url });
  } catch (err) {
    console.error('Dashboard checkout error:', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
