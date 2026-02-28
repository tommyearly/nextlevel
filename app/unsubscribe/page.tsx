import Link from 'next/link';
import { prisma } from '@/lib/db';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';
import HeroBackground from '@/components/HeroBackground';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.nextlevelweb.ie';

type Props = { searchParams: Promise<{ email?: string; token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const params = await searchParams;
  const email = params.email?.trim();
  const token = params.token?.trim();

  if (!email || !token) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
          <div className="rounded-2xl border border-white/5 bg-brand-card/80 backdrop-blur-xl p-8 text-center max-w-md">
            <h1 className="font-heading text-xl font-bold text-slate-50">Invalid link</h1>
            <p className="mt-2 text-slate-400 text-sm">
              This unsubscribe link is missing information. If you want to stop receiving emails, contact us and we&apos;ll remove you.
            </p>
            <Link href="/contact" className="mt-6 inline-block text-accent-blue hover:underline text-sm">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const verifiedEmail = verifyUnsubscribeToken(token);
  if (!verifiedEmail || verifiedEmail !== email.toLowerCase()) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <HeroBackground />
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
          <div className="rounded-2xl border border-white/5 bg-brand-card/80 backdrop-blur-xl p-8 text-center max-w-md">
            <h1 className="font-heading text-xl font-bold text-slate-50">Invalid or expired link</h1>
            <p className="mt-2 text-slate-400 text-sm">
              This unsubscribe link is invalid or has expired. If you still want to stop receiving emails, contact us.
            </p>
            <Link href="/contact" className="mt-6 inline-block text-accent-blue hover:underline text-sm">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  await prisma.emailSubscriber.upsert({
    where: { email: verifiedEmail },
    create: {
      email: verifiedEmail,
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
    },
    update: {
      status: 'unsubscribed',
      unsubscribedAt: new Date(),
    },
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <HeroBackground />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        <div className="rounded-2xl border border-white/5 bg-brand-card/80 backdrop-blur-xl p-8 text-center max-w-md">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
            <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 font-heading text-xl font-bold text-slate-50">You&apos;re unsubscribed</h1>
          <p className="mt-2 text-slate-400 text-sm">
            You won&apos;t receive any more marketing emails from Next Level Web. If you change your mind, get in touch and we can add you back.
          </p>
          <Link href="/" className="mt-6 inline-block text-accent-blue hover:underline text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
