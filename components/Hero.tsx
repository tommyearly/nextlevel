import Image from 'next/image';
import Link from 'next/link';
import GradientButton from '@/components/GradientButton';
import HeroBackground from '@/components/HeroBackground';
import HeroTypewriter from '@/components/HeroTypewriter';

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden pt-20 pb-24 sm:pt-24 sm:pb-32"
    >
      <HeroBackground />
      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-7">
            <p className="text-accent-blue font-medium text-sm sm:text-base tracking-wider uppercase mb-4 animate-fade-in opacity-0 [animation-fill-mode:forwards] [animation-delay:100ms]">
              You&apos;ve found a service that&apos;s Irish and honest
            </p>
            <HeroTypewriter />
            <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:350ms]">
              Website design run by Irish people. No mad pricing, no surprises — just honest work and editable pages so you stay in control. You&apos;re in the right place.
            </p>
            <p className="mt-4 text-slate-500 text-sm animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:400ms]">
              100% Irish · Honest · Editable ·{' '}
              <Link href="/web-design-dublin" className="text-accent-blue hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface rounded">
                Web design Dublin
              </Link>
            </p>
            <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:500ms]">
              <GradientButton href="/contact" size="lg" ariaLabel="Get in touch">
                Get in touch
              </GradientButton>
              <GradientButton href="/services" variant="outline" size="lg" ariaLabel="What we do">
                What we do
              </GradientButton>
            </div>
            <div className="hero-title-3d-wrapper mt-8 max-w-xl">
              <p className="hero-title-3d-typewriter font-heading text-2xl sm:text-3xl font-bold text-slate-50">
                We guarantee a{' '}
                <span className="bg-gradient-to-r from-accent-blue via-accent-violet to-accent-violet bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  premium website
                </span>
                {' '}within 3 weeks.
              </p>
            </div>
          </div>
          <div className="lg:col-span-5 relative animate-fade-in-up opacity-0 [animation-fill-mode:forwards] [animation-delay:400ms]">
            {/* Decorative frame and shapes around image */}
            <div className="absolute -inset-3 sm:-inset-4 rounded-3xl bg-gradient-to-br from-accent-blue/20 via-transparent to-accent-violet/20 opacity-60 blur-xl pointer-events-none" aria-hidden />
            <div className="absolute -right-2 -top-2 w-24 h-24 rounded-full border border-accent-blue/30 pointer-events-none" aria-hidden />
            <div className="absolute -left-2 -bottom-2 w-16 h-16 rounded-full border border-accent-violet/25 pointer-events-none" aria-hidden />
            <div className="absolute -right-4 bottom-1/4 w-px h-20 bg-gradient-to-b from-transparent via-accent-glow/40 to-transparent pointer-events-none" aria-hidden />
            <div className="absolute -left-4 top-1/3 w-px h-16 bg-gradient-to-b from-transparent via-accent-blue/30 to-transparent pointer-events-none" aria-hidden />

            <div className="relative">
              {/* Outer gradient border */}
              <div className="absolute -inset-px rounded-[18px] bg-gradient-to-br from-accent-blue/50 via-accent-violet/30 to-accent-cyan/30 opacity-80 pointer-events-none" aria-hidden />
              {/* Corner accents */}
              <div className="absolute -top-px -left-px w-12 h-12 border-l-2 border-t-2 border-accent-blue/50 rounded-tl-2xl pointer-events-none" aria-hidden />
              <div className="absolute -top-px -right-px w-12 h-12 border-r-2 border-t-2 border-accent-violet/50 rounded-tr-2xl pointer-events-none" aria-hidden />
              <div className="absolute -bottom-px -left-px w-12 h-12 border-l-2 border-b-2 border-accent-violet/40 rounded-bl-2xl pointer-events-none" aria-hidden />
              <div className="absolute -bottom-px -right-px w-12 h-12 border-r-2 border-b-2 border-accent-blue/40 rounded-br-2xl pointer-events-none" aria-hidden />

              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-glow-sm aspect-[4/3] lg:aspect-auto lg:min-h-[380px] bg-brand-card">
                {/* Browser-style top bar */}
                <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-1.5 px-3 py-2 bg-black/40 backdrop-blur-sm border-b border-white/5">
                  <span className="w-2 h-2 rounded-full bg-white/20" aria-hidden />
                  <span className="w-2 h-2 rounded-full bg-white/20" aria-hidden />
                  <span className="w-2 h-2 rounded-full bg-white/20" aria-hidden />
                </div>
                <Image
                  src="/leixlip-hero.jpg"
                  alt="Leixlip, County Kildare — where we build next-level digital experiences"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" aria-hidden />
                {/* Overlay text — refined, corner badge style */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                  <div>
                    <p className="font-heading text-xs uppercase tracking-[0.2em] text-white/70">
                      Based in
                    </p>
                    <p className="font-heading text-lg sm:text-xl font-semibold text-white tracking-tight">
                      Leixlip · Kildare
                    </p>
                  </div>
                  <p className="text-xs text-white/60 max-w-[200px]">
                    Web design & development for Irish businesses
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
