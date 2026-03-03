import Link from 'next/link';
import { mkPath } from '@/lib/martin-kelly-base';

const FOOTER_LINKS = [
  { href: '/courses', label: 'Golf Courses' },
  { href: '/accommodation', label: 'Accommodation' },
  { href: '/design-your-package', label: 'Design Your Package' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export default function MartinKellyFooter() {
  return (
    <footer className="bg-[#0f172a] text-white mt-auto" role="contentinfo">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link href={mkPath('/')} className="font-accent text-xl font-bold text-white hover:text-costa-sand transition-colors">
              Costa del Sol Golf
            </Link>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">
              Tailor-made golf holidays on the Costa del Sol for Irish travellers. Courses, accommodation and packages — we take care of the rest.
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Quick links</h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link href={mkPath(href)} className="text-slate-300 hover:text-white text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] rounded">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h3>
            <p className="text-slate-300 text-sm">
              <a href="tel:+353866006202" className="hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a] rounded">
                086 600 6202
              </a>
              <br />
              <span className="text-slate-400">Ireland</span>
            </p>
          </div>
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Destination</h3>
            <p className="text-slate-300 text-sm">
              Costa del Sol only — Malaga to Gibraltar. Golf, sun and sea for Irish golfers.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Costa del Sol Golf. For Irish travellers.</p>
          <p className="text-slate-500 text-xs">
            Built by{' '}
            <a href="https://www.nextlevelweb.ie" className="text-slate-400 hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              Next Level Web
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
