import Link from 'next/link';
import Image from 'next/image';
import { COURSES } from '@/data/martin-kelly/content';
import { mkPath } from '@/lib/martin-kelly-base';

const featured = COURSES.filter((c) => c.featured);

export default function FeaturedCourses() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 bg-section-pattern" aria-labelledby="courses-heading">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <h2 id="courses-heading" className="font-accent text-3xl md:text-4xl text-golf-dark">
              Golf courses on the Costa del Sol
            </h2>
            <p className="mt-3 text-slate-600 max-w-xl">
              Over 70 eighteen-hole courses between Malaga and Gibraltar. Preferential green fees and tee-time access for Irish visitors.
            </p>
          </div>
          <Link href={mkPath('/courses')} className="text-golf-primary font-semibold hover:text-golf-dark transition-colors rounded shrink-0">
            View all courses
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((course) => (
            <Link key={course.id} href={mkPath('/courses#' + course.slug)} className="group block rounded-xl overflow-hidden bg-white border border-slate-200 shadow-card hover:shadow-card-hover hover:scale-[1.02] transition-all duration-300">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={mkPath(course.image)} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-card-gradient" aria-hidden />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-accent font-semibold text-white text-lg">{course.name}</h3>
                  <p className="text-white/80 text-sm">{course.location}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-slate-600 text-sm line-clamp-2">{course.shortDescription}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
