import type { Metadata } from 'next';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { getFooter } from '@/lib/cms/queries';
import { getPayloadClient } from '@/lib/payload';
import { resolveSectionType } from '@/lib/converted-pages/section-types';
import { defaultContent } from './content';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import type { CollectionServiceDoc } from './components/Services';
import Results from './components/Results';
import WhySection from './components/WhySection';
import Process from './components/Process';
import Cta from './components/Cta';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

async function fetchServiceDocs(limit: number): Promise<CollectionServiceDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'services',
      depth: 1,
      limit,
      sort: 'displayOrder',
      where: { _status: { equals: 'published' } } as never,
    });
    return (res.docs ?? []) as unknown as CollectionServiceDoc[];
  } catch (err) {
    console.error('[services-convert] failed to fetch services from collection:', err);
    return [];
  }
}

export default async function ServicesConvertPage() {
  const content = defaultContent;
  const servicesResolved = resolveSectionType(content.services.sectionType, 'services');

  const [footer, collectionItems] = await Promise.all([
    getFooter(),
    servicesResolved !== 'static'
      ? fetchServiceDocs(content.services.sourceLimit ?? 10)
      : Promise.resolve(undefined as CollectionServiceDoc[] | undefined),
  ]);

  return (
    <>
      <NavbarScrollState />
      <ScrollRevealController />
      <Navbar data={content.nav} />
      <main>
        <Hero data={content.hero} />
        <Services
          data={content.services}
          collectionItems={collectionItems && collectionItems.length > 0 ? collectionItems : undefined}
        />
        <Results data={content.results} />
        <WhySection data={content.why} />
        <Process data={content.process} />
        <Cta data={content.cta} />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
