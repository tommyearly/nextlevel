import Hero from '@/components/martin-kelly/home/Hero';
import PackageSteps from '@/components/martin-kelly/home/PackageSteps';
import FeaturedCourses from '@/components/martin-kelly/home/FeaturedCourses';
import AccommodationPreview from '@/components/martin-kelly/home/AccommodationPreview';
import Extras from '@/components/martin-kelly/home/Extras';
import Testimonials from '@/components/martin-kelly/home/Testimonials';
import CTA from '@/components/martin-kelly/home/CTA';

export default function MartinKellyHomePage() {
  return (
    <>
      <Hero />
      <PackageSteps />
      <FeaturedCourses />
      <AccommodationPreview />
      <Extras />
      <Testimonials />
      <CTA />
    </>
  );
}
