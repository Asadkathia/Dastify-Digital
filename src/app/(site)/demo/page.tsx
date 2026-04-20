import DemoHero from "./components/DemoHero";
import DemoProcess from "./components/DemoProcess";
import DemoResults from "./components/DemoResults";
import DemoTestimonial from "./components/DemoTestimonial";
import DemoUrgency from "./components/DemoUrgency";
import { SiteFooter } from "@/components/SiteFooter";
import { defaultContent } from "./content";
import type { PageContent } from "./components/types";
import { ScrollRevealController } from "@/app/components/home/ScrollRevealController";
import { findOneBySlug, isDraftEnabled, getNavigation, getFooter } from "@/lib/cms/queries";
import { mergeConvertedContent } from "@/lib/converted-pages/merge-content";
import { SiteNavbar } from "@/components/SiteNavbar";

export async function generateMetadata() {
  return {
    title: "Request a Free Marketing Audit — Dastify Digital | Healthcare Marketing",
    description:
      "Book a free 30-minute healthcare marketing audit. See exactly where your practice is losing patients and get a custom growth roadmap.",
  };
}


export default async function Page() {
  const draft = await isDraftEnabled();
  const [doc, nav, footer] = await Promise.all([
    findOneBySlug('pages', 'demo', draft),
    getNavigation(),
    getFooter(),
  ]);
  const convertedContent =
    doc?.convertedContent && typeof doc.convertedContent === 'object'
      ? (doc.convertedContent as Record<string, unknown>)
      : null;
  const content: PageContent = convertedContent
    ? mergeConvertedContent(defaultContent, convertedContent)
    : defaultContent;

  return (
    <>
      <ScrollRevealController />
      {nav ? <SiteNavbar nav={nav} activePath="/demo" ctaClassName="btn-dk nav-cta" /> : null}
      <main>
        <DemoHero data={content.hero} />
        <DemoProcess data={content.process} />
        <DemoResults data={content.results} />
        <DemoTestimonial data={content.testimonial} />
        <DemoUrgency data={content.urgency} />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
