import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getPackageIdFromFormValue } from '@/lib/packages';
import { createMagicLink } from '@/lib/magic-link';
import { sendMagicLinkEmail, sendContactCopyEmail } from '@/lib/email';

const ADMIN_EMAIL = 'hello@nextlevelweb.ie';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message, package: packageFormValue } = body;
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }
    const packageId = getPackageIdFromFormValue(packageFormValue) ?? 'custom';
    const packageLabel = typeof packageFormValue === 'string' ? packageFormValue : 'Custom';

    const lead = await prisma.lead.create({
      data: {
        email: String(email).trim().toLowerCase(),
        name: String(name).trim(),
        company: company ? String(company).trim() : null,
        packageId,
        packageLabel,
        message: String(message).trim(),
      },
    });

    const token = await createMagicLink(lead.email, 'customer');
    const magicLinkUrl = `${BASE_URL}/api/auth/verify?token=${encodeURIComponent(token)}`;
    await sendMagicLinkEmail(lead.email, magicLinkUrl);

    await sendContactCopyEmail(ADMIN_EMAIL, {
      name: lead.name,
      email: lead.email,
      company: lead.company,
      packageLabel: lead.packageLabel,
      message: lead.message,
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact API error:', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
