import { unstable_noStore as noStore } from 'next/cache';
import { draftMode } from 'next/headers';
import { About } from '../components/home/About';
import { BrandAcronym } from '../components/home/BrandAcronym';
import { CaseStudies } from '../components/home/CaseStudies';
import { Cta } from '../components/home/Cta';
import { FeatureStrip } from '../components/home/FeatureStrip';
import { Footer } from '../components/home/Footer';
import { Hero } from '../components/home/Hero';
import { Insights } from '../components/home/Insights';
import { Mission } from '../components/home/Mission';
import { Navbar } from '../components/home/Navbar';
import { NavbarScrollState } from '../components/home/NavbarScrollState';
import { LivePreviewSync } from '../components/home/LivePreviewSync';
import { ScrollRevealController } from '../components/home/ScrollRevealController';
import { Services } from '../components/home/Services';
import { Faq } from '../components/home/Faq';
import { getHomepageContent } from '@/lib/get-homepage-content';

export default async function Home() {
  const { isEnabled } = await draftMode();
  if (isEnabled) {
    noStore();
  }

  const homepageContent = await getHomepageContent({ draft: isEnabled });

  return (
    <>
      <LivePreviewSync enabled={isEnabled} />
      <NavbarScrollState />
      <ScrollRevealController />

      <Navbar data={homepageContent.nav} />
      <Hero data={homepageContent.hero} />
      <BrandAcronym data={homepageContent.brandAcronym} />
      <About data={homepageContent.about} />
      <FeatureStrip data={homepageContent.features} />
      <CaseStudies data={homepageContent.caseStudies} />
      <Services data={homepageContent.services} />
      <Mission data={homepageContent.mission} />
      <Insights data={homepageContent.insights} />
      <Faq data={homepageContent.faq} />
      <Cta data={homepageContent.cta} />
      <Footer data={homepageContent.footer} />
    </>
  );
}
