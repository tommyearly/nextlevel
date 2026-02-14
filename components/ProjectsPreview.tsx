import Link from 'next/link';
import GradientButton from './GradientButton';

const projects = [
  {
    slug: 'fintech-dashboard',
    title: 'Fintech Dashboard',
    category: 'Web app',
    gradient: 'from-blue-500/20 to-violet-500/20',
  },
  {
    slug: 'ecommerce-store',
    title: 'E-commerce Store',
    category: 'E-commerce',
    gradient: 'from-violet-500/20 to-cyan-500/20',
  },
  {
    slug: 'saas-landing',
    title: 'SaaS Landing',
    category: 'Marketing',
    gradient: 'from-cyan-500/20 to-blue-500/20',
  },
];

export default function ProjectsPreview() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="py-20 sm:py-28 scroll-mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2
              id="projects-heading"
              className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-slate-50"
            >
              Selected work
            </h2>
            <p className="mt-4 text-slate-400 text-lg">
              A sample of recent projects — from startups to established brands.
            </p>
          </div>
          <GradientButton
            href="/projects"
            variant="outline"
            size="md"
            className="self-start sm:self-auto"
          >
            View all projects
          </GradientButton>
        </div>
        <ul className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8" role="list">
          {projects.map(({ slug, title, category, gradient }) => (
            <li key={slug}>
              <Link
                href={`/projects#${slug}`}
                className="group block rounded-2xl overflow-hidden border border-white/5 bg-brand-card/60 backdrop-blur-sm hover:border-accent-glow/30 hover:shadow-glow-sm transition-all duration-300"
              >
                <div
                  className={`aspect-[4/3] bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <span className="text-4xl font-heading font-bold text-white/20 group-hover:text-white/30 transition-colors">
                    {title.slice(0, 1)}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-medium text-accent-blue uppercase tracking-wider">
                    {category}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-semibold text-slate-50 group-hover:text-accent-blue transition-colors">
                    {title}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
