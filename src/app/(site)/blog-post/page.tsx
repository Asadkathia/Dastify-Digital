import type { Metadata } from "next";
import { ScrollRevealController } from "@/app/components/home/ScrollRevealController";
import { findOneBySlug, isDraftEnabled, getNavigation, getFooter } from "@/lib/cms/queries";
import { mergeConvertedContent } from "@/lib/converted-pages/merge-content";
import { SiteNavbar } from "@/components/SiteNavbar";
import ArticleHero from "./components/ArticleHero";
import ArticleLayout from "./components/ArticleLayout";
import RelatedPosts from "./components/RelatedPosts";
import BlogPostCta from "./components/BlogPostCta";
import { SiteFooter } from "@/components/SiteFooter";
import { defaultContent } from "./content";
import type { PageContent } from "./content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "HIPAA-Compliant Google Ads: The Complete 2026 Setup Guide — Dastify Digital",
    description:
      "Server-side tagging, enhanced conversions without PHI, and the tracking pixel configurations that keep your healthcare ads legal and your leads flowing.",
  };
}

export default async function Page() {
  const draft = await isDraftEnabled();
  const [doc, nav, footer] = await Promise.all([
    findOneBySlug('pages', 'blog-post', draft),
    getNavigation(),
    getFooter(),
  ]);
  const docRecord = doc as unknown as Record<string, unknown> | null;
  const convertedContent =
    docRecord?.convertedContent && typeof docRecord.convertedContent === 'object'
      ? (docRecord.convertedContent as Record<string, unknown>)
      : null;
  const content: PageContent = convertedContent
    ? mergeConvertedContent(defaultContent, convertedContent)
    : defaultContent;

  return (
    <>
      <ScrollRevealController />
      {nav ? (
        <SiteNavbar
          nav={nav}
          activePath="/blog"
          linkListClassName="blog-post-nav-links"
          ctaClassName="btn-dk nav-cta"
        />
      ) : null}
      <main>
        <ArticleHero data={content.hero} />
        <ArticleLayout data={content.article} />
        <RelatedPosts data={content.relatedPosts} />
        <BlogPostCta data={content.cta} />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
