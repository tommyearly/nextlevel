import Link from 'next/link';
import Image from 'next/image';
import { mkPath } from '@/lib/martin-kelly-base';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden" aria-label="Hero">
      {/* Golf field graphic layer (subtle, behind image) */}
      <div className="absolute inset-0 z-0 opacity-40" aria-hidden>
        <svg className="absolute inset-0 w-full h-full object-cover" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="hero-fairway" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#14532d" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#15803d" stopOpacity="0.2" />
            </linearGradient>
            <pattern id="hero-stripes" patternUnits="userSpaceOnUse" width="60" height="6">
              <rect width="60" height="3" fill="rgba(34, 197, 94, 0.4)" />
              <rect y="3" width="60" height="3" fill="rgba(22, 101, 52, 0.5)" />
            </pattern>
          </defs>
          <ellipse cx="600" cy="820" rx="750" ry="400" fill="url(#hero-fairway)" />
          <ellipse cx="600" cy="820" rx="720" ry="370" fill="url(#hero-stripes)" />
        </svg>
      </div>
      <div className="absolute inset-0 z-0">
        <Image
          src={mkPath('/images/hero-costa-del-sol-golf.jpg')}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-hero-gradient" aria-hidden />
      </div>
      <div className="container relative z-10 py-20 text-center">
        <p className="text-costa-gold font-semibold text-sm uppercase tracking-widest mb-4 opacity-0 animate-fade-in">
          Golf holidays for Irish travellers
        </p>
        <h1 className="font-accent text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl mx-auto leading-tight text-3d-light opacity-0 animate-text-3d-pop">
          Your Costa del Sol
          <br />
          <span className="text-golf-light">golf break</span>, tailored
        </h1>
        <p className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl mx-auto opacity-0 animate-stagger-3">
          Courses, accommodation and packages on the Costa del Sol. From Ireland — we do the rest.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-stagger-4">
          <Link
            href={mkPath('/design-your-package')}
            className="inline-flex items-center justify-center px-8 py-4 bg-golf-primary text-white font-semibold rounded-lg hover:bg-golf-dark hover:scale-105 transition-all duration-300 shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-golf-light focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            Design your package
          </Link>
          <Link
            href={mkPath('/courses')}
            className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white font-semibold rounded-lg border-2 border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          >
            View golf courses
          </Link>
        </div>
        <p className="mt-8 text-slate-300 text-sm opacity-0 animate-stagger-5">
          Direct flights from Dublin and Cork to Malaga · 70+ courses · Preferential rates
        </p>
      </div>
    </section>
  );
}
