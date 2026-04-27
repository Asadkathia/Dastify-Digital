import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteNavbar } from '@/components/SiteNavbar';
import registry from '@/app/(site)/about/editor-registry';
import { defaultContent } from '@/app/(site)/about/content';
import { getNavigation, getFooter } from '@/lib/cms/queries';
import { SiteFooter } from '@/components/SiteFooter';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

export default async function ConvertedAboutPreviewPage() {
  const [nav, footer] = await Promise.all([getNavigation(), getFooter()]);
  const content = defaultContent as unknown as Record<string, unknown>;

  return (
    <>
      <ScrollRevealController />
      <SiteNavbar nav={nav} activePath="/about" />
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
