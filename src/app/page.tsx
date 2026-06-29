import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import Brands from '@/components/sections/Brands';
import Products from '@/components/sections/Products';
import Stats from '@/components/sections/Stats';
import Process from '@/components/sections/Process';
import Showcase from '@/components/sections/Showcase';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import JsonLD from '@/components/seo/JsonLD';
import {
  organizationSchema,
  localBusinessSchema,
  faqSchema,
} from '@/lib/structured-data';

// ISR: homepage regenerates every hour
export const revalidate = 3600;

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="relative">
        <Navbar />
        <JsonLD data={organizationSchema} />
        <JsonLD data={localBusinessSchema} />
        <JsonLD data={faqSchema} />
        <Hero />
        <Brands />
        <Products />
        <Stats />
        <Process />
        <Showcase />
        <Services />
        <Testimonials />
        <FAQ />
        <Contact />
        <Footer />
      </main>
    </ErrorBoundary>
  );
}
