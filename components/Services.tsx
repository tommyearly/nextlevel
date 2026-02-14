import GlassCard from './GlassCard';

const services = [
  {
    title: 'Web Design',
    description:
      'Custom UI/UX tailored to your brand. Modern, responsive layouts that convert and delight users.',
    icon: '◇',
  },
  {
    title: 'Web Development',
    description:
      'Fast, scalable sites built with Next.js and TypeScript. SEO-ready and performance-optimised.',
    icon: '◆',
  },
  {
    title: 'E‑commerce',
    description:
      'Online stores that sell. Secure payments, inventory, and growth-focused storefronts.',
    icon: '▣',
  },
  {
    title: 'Maintenance & Support',
    description:
      'Ongoing updates, security, and support so your site stays fast and secure.',
    icon: '◈',
  },
];

export default function Services() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-20 sm:py-28 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-2xl">
          <h2 id="services-heading" className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50">
            What we do
          </h2>
          <p className="mt-4 text-slate-400 text-lg">
            Irish and honest. We build websites you can edit yourself — no jargon, no surprises.
          </p>
        </div>
        <ul className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
          {services.map(({ title, description, icon }) => (
            <li key={title}>
              <GlassCard className="h-full transition-transform duration-300 hover:scale-[1.02]">
                <span
                  className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-accent-blue/10 text-accent-blue text-xl"
                  aria-hidden
                >
                  {icon}
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-slate-50">{title}</h3>
                <p className="mt-2 text-slate-400 text-sm leading-relaxed">{description}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
