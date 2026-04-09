import type { Metadata } from 'next';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import AboutNavbar from '@/app/(site)/about/components/AboutNavbar';
import AboutHero from '@/app/(site)/about/components/AboutHero';
import AboutManifesto from '@/app/(site)/about/components/AboutManifesto';
import AboutDifference from '@/app/(site)/about/components/AboutDifference';
import AboutStory from '@/app/(site)/about/components/AboutStory';
import AboutTeam from '@/app/(site)/about/components/AboutTeam';
import AboutValues from '@/app/(site)/about/components/AboutValues';
import AboutCta from '@/app/(site)/about/components/AboutCta';
import AboutFooter from '@/app/(site)/about/components/AboutFooter';
import { defaultContent } from '@/app/(site)/about/content';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: defaultContent.meta.title,
    description: defaultContent.meta.description,
  };
}

export default async function ConvertedAboutPreviewPage() {
  const content = defaultContent;

  return (
    <>
      <NavbarScrollState selector=".nav" solidClass="scrolled" offset={80} />
      <ScrollRevealController />
      <AboutNavbar data={content.nav} />
      <main>
        <AboutHero data={content.hero} />
        <AboutManifesto data={content.manifesto} />
        <AboutDifference data={content.difference} />
        <AboutStory data={content.story} />
        <AboutTeam data={content.team} />
        <AboutValues data={content.values} />
        <AboutCta data={content.cta} />
      </main>
      <AboutFooter data={content.footer} />
    </>
  );
}

