import type { Metadata } from 'next';
import GlassCard from '@/components/GlassCard';

const title = 'Privacy Policy';
const description =
  'How Next Level Web uses your data. Irish website design — we keep it simple and respect your privacy.';

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    url: '/privacy',
    title: `${title} | Next Level Web`,
    description,
  },
  twitter: {
    title: `${title} | Next Level Web`,
    description,
  },
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <div className="pt-16 sm:pt-24 pb-20 sm:pb-28">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <header className="mb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-slate-50">
            Privacy Policy
          </h1>
          <p className="mt-2 text-slate-400">
            Next Level Web — Irish website design. Last updated: 2025.
          </p>
        </header>

        <div className="space-y-8">
          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              In plain English
            </h2>
            <p className="mt-3 text-slate-400">
              We run an Irish website design business. When you contact us or buy a package, we need some of your details. This page explains what we collect, why, and what your rights are under Irish and EU law (including GDPR).
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              What we collect
            </h2>
            <p className="mt-3 text-slate-400">
              When you use our contact form or get in touch, we get your name, email, and whatever you put in the message (e.g. company name, phone). If you become a client, we also hold your contact details and project info so we can build and host your site and stay in touch about the work.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Why we use it
            </h2>
            <p className="mt-3 text-slate-400">
              To reply to your enquiry, to deliver the website and related services (domain, hosting, email, etc.), and to run our business in a proper way. We don&apos;t sell your data or use it for marketing you didn&apos;t ask for.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              How long we keep it
            </h2>
            <p className="mt-3 text-slate-400">
              For as long as we&apos;re working together and as long as we need it for legal or tax reasons. After that we delete or anonymise it where we can.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Your rights (GDPR)
            </h2>
            <p className="mt-3 text-slate-400">
              You can ask us for a copy of your data, to fix anything wrong, or to delete it where the law allows. You can also complain to the Data Protection Commission in Ireland (dataprotection.ie). We&apos;re the &quot;data controller&quot; for the data you give us — you can contact us at hello@nextlevelweb.ie for any privacy request.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Cookies and this website
            </h2>
            <p className="mt-3 text-slate-400">
              Our site may use cookies for things like making the site work and understanding how it&apos;s used. We have a cookie notice on the site. We don&apos;t do anything sneaky with your data.
            </p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-heading text-xl font-semibold text-slate-50">
              Questions
            </h2>
            <p className="mt-3 text-slate-400">
              If you have any question about your privacy or how we use your data, email us at{' '}
              <a href="mailto:hello@nextlevelweb.ie" className="text-accent-blue hover:underline">
                hello@nextlevelweb.ie
              </a>
              . We&apos;re based in Ireland and we follow Irish and EU data protection law.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
