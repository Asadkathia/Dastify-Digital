import type { Metadata } from "next";
import { NavbarScrollState } from "@/app/components/home/NavbarScrollState";
import { ScrollRevealController } from "@/app/components/home/ScrollRevealController";
import BlogNavbar from "./components/BlogNavbar";
import BlogHero from "./components/BlogHero";
import BlogFilters from "./components/BlogFilters";
import FeaturedPost from "./components/FeaturedPost";
import BlogGrid from "./components/BlogGrid";
import TopicsSection from "./components/TopicsSection";
import NewsletterSection from "./components/NewsletterSection";
import BlogCta from "./components/BlogCta";
import { SiteFooter } from "@/components/SiteFooter";
import { getFooter } from "@/lib/cms/queries";
import { defaultContent } from "./content";
import { fetchCardsFromCollection } from "@/lib/converted-pages/section-cards";
import { resolveSectionType } from "@/lib/converted-pages/section-types";
import type { SectionCard } from "@/lib/converted-pages/section-types";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Healthcare Marketing Insights — Blog | Dastify Digital",
    description:
      "Expert healthcare marketing insights, HIPAA-compliant strategies, and patient acquisition tactics from the team at Dastify Digital.",
  };
}

export default async function Page() {
  const content = defaultContent;
  const gridResolved = resolveSectionType(content.grid.sectionType, "grid");
  const [footer, gridCards] = await Promise.all([
    getFooter(),
    gridResolved === "static"
      ? Promise.resolve(undefined as SectionCard[] | undefined)
      : fetchCardsFromCollection({
          type: gridResolved,
          limit: content.grid.sourceLimit ?? 6,
          filter:
            content.grid.source === "category"
              ? content.grid.sourceCategory
              : content.grid.source === "tag"
                ? content.grid.sourceTag
                : undefined,
          filterKind: content.grid.source === "category" ? "category" : content.grid.source === "tag" ? "tag" : undefined,
        }),
  ]);

  return (
    <>
      <NavbarScrollState />
      <ScrollRevealController />
      <BlogNavbar data={content.nav} />
      <main>
        <BlogHero data={content.hero} />
        <BlogFilters data={content.filters} />
        <FeaturedPost data={content.featured} />
        <BlogGrid data={content.grid} cards={gridCards && gridCards.length > 0 ? gridCards : undefined} />
        <TopicsSection data={content.topics} />
        <NewsletterSection data={content.newsletter} />
        <BlogCta data={content.cta} />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
