import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { SiteNavbar } from '@/components/SiteNavbar';
import AboutHero from '@/app/(site)/about/components/AboutHero';
import AboutManifesto from '@/app/(site)/about/components/AboutManifesto';
import AboutDifference from '@/app/(site)/about/components/AboutDifference';
import AboutStory from '@/app/(site)/about/components/AboutStory';
import AboutTeam from '@/app/(site)/about/components/AboutTeam';
import AboutValues from '@/app/(site)/about/components/AboutValues';
import AboutCta from '@/app/(site)/about/components/AboutCta';
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
  const [content, nav, footer] = await Promise.all([
    Promise.resolve(defaultContent),
    getNavigation(),
    getFooter(),
  ]);

  return (
    <>
      <ScrollRevealController />
      <SiteNavbar nav={nav} activePath="/about" navClassName="about-nav" linkListClassName="about-nav-links" ctaClassName="about-btn-nav" />
      <main>
        <AboutHero data={content.hero} />
        <AboutManifesto data={content.manifesto} />
        <AboutDifference data={content.difference} />
        <AboutStory data={content.story} />
        <AboutTeam data={content.team} />
        <AboutValues data={content.values} />
        <AboutCta data={content.cta} />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}

