import Navbar from '@/app/(site)/services-convert/components/Navbar';
import Hero from '@/app/(site)/services-convert/components/Hero';
import Services from '@/app/(site)/services-convert/components/Services';
import Results from '@/app/(site)/services-convert/components/Results';
import WhySection from '@/app/(site)/services-convert/components/WhySection';
import Process from '@/app/(site)/services-convert/components/Process';
import Cta from '@/app/(site)/services-convert/components/Cta';
import Footer from '@/app/(site)/services-convert/components/Footer';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { defaultContent } from '@/app/(site)/services-convert/content';

export default function ConvertedServicesPreviewPage() {
  const content = defaultContent;

  return (
    <>
      <NavbarScrollState selector=".nav" solidClass="scrolled" offset={80} />
      <ScrollRevealController />
      <Navbar data={content.nav} />
      <Hero data={content.hero} />
      <Services data={content.services} />
      <Results data={content.results} />
      <WhySection data={content.why} />
      <Process data={content.process} />
      <Cta data={content.cta} />
      <Footer data={content.footer} />
    </>
  );
}

