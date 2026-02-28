import Hero from '@/components/Hero';
import CreateInspire from '@/components/CreateInspire';
import Services from '@/components/Services';
import Process from '@/components/Process';
import CustomerReview from '@/components/CustomerReview';
import Pricing from '@/components/Pricing';
import KnightRiderBar from '@/components/KnightRiderBar';
import CTA from '@/components/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CreateInspire />
      <Services />
      <Process />
      <CustomerReview />
      <Pricing />
      <div className="container mx-auto px-4 sm:px-6 mt-16 sm:mt-20 max-w-4xl">
        <KnightRiderBar />
      </div>
      <CTA />
    </>
  );
}
