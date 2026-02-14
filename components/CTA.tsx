import GradientButton from './GradientButton';

type CTAProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

const defaultTitle = 'Go on you good thing — let\'s talk';
const defaultDescription =
  'You\'ve found Irish, honest website design. No mad pricing, no surprises. Get in touch and we\'ll take it from here.';
const defaultPrimary = 'Get in touch';
const defaultSecondary = 'What we do';

export default function CTA({
  title = defaultTitle,
  description = defaultDescription,
  primaryHref = '/contact',
  primaryLabel = defaultPrimary,
  secondaryHref = '/services',
  secondaryLabel = defaultSecondary,
}: CTAProps) {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20 sm:py-28 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" aria-hidden />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/10 rounded-full blur-3xl pointer-events-none" aria-hidden />
      <div className="container relative z-10 mx-auto px-4 sm:px-6 text-center">
        <h2 id="cta-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold knight-rider-text">
          {title}
        </h2>
        <p className="mt-4 text-slate-400 text-lg max-w-xl mx-auto">
          {description}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <GradientButton href={primaryHref} size="lg" ariaLabel={primaryLabel}>
            {primaryLabel}
          </GradientButton>
          <GradientButton href={secondaryHref} variant="outline" size="lg" ariaLabel={secondaryLabel}>
            {secondaryLabel}
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
