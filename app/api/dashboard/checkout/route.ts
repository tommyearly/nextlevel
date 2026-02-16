import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { stripe, getCheckoutPriceId } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
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

  const lead = await prisma.lead.findFirst({
    where: session.leadId ? { id: session.leadId, email: session.email } : { email: session.email },
    orderBy: { createdAt: 'desc' },
  });
  if (!lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
  }

  const priceId = getCheckoutPriceId(lead.packageId, type);
  if (!priceId) {
    return NextResponse.json(
      { error: `No Stripe price configured for ${lead.packageId} ${type}. Add STRIPE_PRICE_${(lead.packageId ?? '').toUpperCase()}_${type.toUpperCase()} to .env` },
      { status: 400 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl?.origin ?? 'http://localhost:3000';
  const successUrl = `${baseUrl}/dashboard?paid=1`;
  const cancelUrl = `${baseUrl}/dashboard`;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: lead.email,
    line_items: [{ price: priceId, quantity: 1 }],
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

  return NextResponse.redirect(url);
}
