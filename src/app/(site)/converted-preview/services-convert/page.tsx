import { SiteNavbar } from '@/components/SiteNavbar';
import Hero from '@/app/(site)/services-convert/components/Hero';
import Services from '@/app/(site)/services-convert/components/Services';
import Results from '@/app/(site)/services-convert/components/Results';
import WhySection from '@/app/(site)/services-convert/components/WhySection';
import Process from '@/app/(site)/services-convert/components/Process';
import Cta from '@/app/(site)/services-convert/components/Cta';
import Footer from '@/app/(site)/services-convert/components/Footer';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { defaultContent } from '@/app/(site)/services-convert/content';
import { getNavigation } from '@/lib/cms/queries';

export default async function ConvertedServicesPreviewPage() {
  const [content, nav] = await Promise.all([
    Promise.resolve(defaultContent),
    getNavigation(),
  ]);

  return (
    <>
      <ScrollRevealController />
      <SiteNavbar nav={nav} activePath="/services" linkListClassName="svc-convert-nav-links" ctaClassName="svc-convert-btn-nav" />
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

