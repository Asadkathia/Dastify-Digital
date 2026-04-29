import type { ComponentType } from 'react';
import { SiteNavbar } from '@/components/SiteNavbar';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import registry from '@/app/(site)/services-convert/editor-registry';
import { defaultContent } from '@/app/(site)/services-convert/content';
import { getNavigation, getFooter } from '@/lib/cms/queries';
import { SiteFooter } from '@/components/SiteFooter';

export default async function ConvertedServicesPreviewPage() {
  const [nav, footer] = await Promise.all([getNavigation(), getFooter()]);
  const content = defaultContent as unknown as Record<string, unknown>;

  return (
    <>
      <ScrollRevealController />
      <SiteNavbar
        nav={nav}
        activePath="/services"
        linkListClassName="svc-convert-nav-links"
      />
      <main>
        {registry.sections.map((section) => {
          const Component = section.Component as ComponentType<{ data: unknown }>;
          return <Component key={section.key} data={content[section.key]} />;
        })}
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
