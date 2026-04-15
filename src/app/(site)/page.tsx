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
import { SiteNavbar } from '@/components/SiteNavbar';
import { LivePreviewSync } from '../components/home/LivePreviewSync';
import { ScrollRevealController } from '../components/home/ScrollRevealController';
import { Services } from '../components/home/Services';
import { Faq } from '../components/home/Faq';
import { getHomepageContent } from '@/lib/get-homepage-content';
import { withManagedMenus } from '@/lib/cms/menus';
import { getNavigation } from '@/lib/cms/queries';
import { JsonLd } from '@/components/JsonLd';
import { buildFAQJsonLd, buildOrganizationJsonLd, buildWebsiteJsonLd } from '@/lib/seo/jsonld';
import { buildMetadata } from '@/lib/seo/metadata';
import { getSiteSettings } from '@/lib/site-settings';
import { getPayloadClient } from '@/lib/payload';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const [payload, settings] = await Promise.all([getPayloadClient(), getSiteSettings()]);

  try {
    const homepage = (await payload.findGlobal({ slug: 'homepage', depth: 1 })) as {
      meta?: {
        title?: string;
        description?: string;
        canonicalURL?: string;
        keywords?: string;
        noindex?: boolean;
        image?: { url?: string };
      };
    };

    return buildMetadata({
      pathname: '/',
      settings,
      seo: {
        title: homepage.meta?.title,
        description: homepage.meta?.description,
        canonicalURL: homepage.meta?.canonicalURL,
        keywords: homepage.meta?.keywords,
        noindex: homepage.meta?.noindex,
        image: homepage.meta?.image?.url,
      },
      fallbackTitle: settings.siteName,
      fallbackDescription: settings.siteDescription,
    });
  } catch {
    return buildMetadata({
      pathname: '/',
      settings,
      fallbackTitle: settings.siteName,
      fallbackDescription: settings.siteDescription,
    });
  }
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { isEnabled } = await draftMode();
  noStore();

  const [homepageContent, settings, nav] = await Promise.all([
    withManagedMenus(await getHomepageContent({ draft: isEnabled })),
    getSiteSettings(),
    getNavigation(),
  ]);

  const organizationJsonLd = buildOrganizationJsonLd(settings);
  const websiteJsonLd = buildWebsiteJsonLd(settings);
  const faqJsonLd = buildFAQJsonLd(homepageContent.faq?.items ?? []);

  return (
    <>
      <LivePreviewSync enabled={isEnabled} />
      <ScrollRevealController />
      <SiteNavbar nav={nav} activePath="/" scrolledClass="solid" linkListClassName="nav-links" ctaClassName="btn-dk nav-cta" />
      <Hero data={homepageContent.hero} />
      <BrandAcronym data={homepageContent.brandAcronym} />
      <About data={homepageContent.about} />
      <FeatureStrip data={homepageContent.features} />
      <CaseStudies data={homepageContent.caseStudies} />
      <Services data={homepageContent.services} />
      <Mission data={homepageContent.mission} />
      <Insights data={homepageContent.insights} />
      <Faq data={homepageContent.faq ?? { items: [] }} />
      <Cta data={homepageContent.cta} />
      <Footer data={homepageContent.footer} />
      <JsonLd data={organizationJsonLd} />
      <JsonLd data={websiteJsonLd} />
      <JsonLd data={faqJsonLd} />
    </>
  );
}
