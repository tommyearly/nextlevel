import type { Metadata } from 'next';
import GlassCard from '@/components/GlassCard';

const title = 'Terms of Service';
const description =
  'Terms for using Next Level Web website design services. Irish law, plain language.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: '/terms',
    title: `${title} | Next Level Web`,
    description,
  },
  twitter: {
    title: `${title} | Next Level Web`,
    description,
  },
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <header className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-50">
            Terms of Service
          </h1>
          <p className="mt-2 text-slate-400">
            Next Level Web — Irish website design. These terms apply when you buy a website package from us. Last updated: 2025.
          </p>
        </header>

        <div className="space-y-8">
          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              What you’re agreeing to
            </h2>
            <p className="mt-3 text-slate-400">
              When you pay a deposit or ask us to start work, you’re agreeing to these terms. They’re a contract between you and Next Level Web under Irish law. If anything is unclear, ask us before you pay.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              What we’ll do for you
            </h2>
            <p className="mt-3 text-slate-400">
              We’ll build your website and deliver what’s in the package you chose (e.g. 5 pages, contact form, domain, hosting, Google Business, email, Facebook page, privacy and cookie pages, WhatsApp link, etc.). We’ll do it in a professional way and aim to finish in about three weeks once we have what we need from you.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Deposit and payment
            </h2>
            <p className="mt-3 text-slate-400">
              You pay a €200 deposit to secure your project. We’ll send a payment link (e.g. Stripe). The rest of the price is due before we go live with your site. The price we quoted is the price you pay — no surprise fees. If you cancel before we’ve done substantial work, we may keep part of the deposit to cover time spent; we’ll be fair and tell you.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              What we need from you
            </h2>
            <p className="mt-3 text-slate-400">
              We need your content (text, images, logo, contact details) and any logins or info we need to set things up. If we’re waiting on you for a long time and it holds up the project, we might need to adjust timelines. We’ll keep you updated.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Your content and legal stuff
            </h2>
            <p className="mt-3 text-slate-400">
              You’re responsible for making sure the text and images you give us are yours or you have permission to use them, and that they’re not defamatory or breaking any law. We’re not liable for content you provide. Once the site is live, you’re responsible for keeping it legal (e.g. privacy policy, cookie consent).
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              If something goes wrong
            </h2>
            <p className="mt-3 text-slate-400">
              We’ll put things right if we’ve made a mistake on our side (e.g. the site doesn’t match what we agreed). Our liability is limited to what you paid us for that project, except where the law doesn’t allow that (e.g. death or personal injury caused by our negligence). We’re not liable for things outside our control (e.g. hosting outages, your own edits breaking something).
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Irish law and disputes
            </h2>
            <p className="mt-3 text-slate-400">
              These terms are governed by Irish law. If we can’t sort a dispute between us, the courts of Ireland have jurisdiction. We’re based in Leixlip, County Kildare.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Contact
            </h2>
            <p className="mt-3 text-slate-400">
              For any question about these terms, email us at{' '}
              <a href="mailto:hello@nextlevelweb.ie" className="text-accent-blue hover:underline">
                hello@nextlevelweb.ie
              </a>
              . We’re happy to explain anything in plain English.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
