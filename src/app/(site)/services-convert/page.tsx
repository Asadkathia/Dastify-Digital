import type { ComponentType } from 'react';
import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteNavbar } from '@/components/SiteNavbar';
import { JsonLd } from '@/components/JsonLd';
import { getNavigation, getFooter } from '@/lib/cms/queries';
import { buildBreadcrumbJsonLd, buildWebPageJsonLd } from '@/lib/seo/jsonld';
import registry from './editor-registry';
import { defaultContent } from './content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

export default async function ServicesConvertPage() {
  const [nav, footer] = await Promise.all([getNavigation(), getFooter()]);
  const content = defaultContent as unknown as Record<string, unknown>;

  return (
    <>
      <ScrollRevealController />
      {nav ? (
        <SiteNavbar
          nav={nav}
          activePath="/services"
          linkListClassName="svc-convert-nav-links"
          ctaClassName="svc-convert-btn-nav"
        />
      ) : null}
      <main>
        {registry.sections.map((section) => {
          const Component = section.Component as ComponentType<{ data: unknown }>;
          return <Component key={section.key} data={content[section.key]} />;
        })}
      </main>
      <SiteFooter footer={footer} />
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: 'Home', url: '/' },
          { name: 'Services', url: '/services' },
        ])}
      />
      <JsonLd
        data={buildWebPageJsonLd({
          title: defaultContent.meta.title,
          description: defaultContent.meta.description,
          pathname: '/services',
        })}
      />
    </>
  );
}
