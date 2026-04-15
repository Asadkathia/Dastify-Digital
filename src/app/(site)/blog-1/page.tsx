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
import BlogFooter from "./components/BlogFooter";
import { defaultContent } from "./content";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Healthcare Marketing Insights — Blog | Dastify Digital",
    description:
      "Expert healthcare marketing insights, HIPAA-compliant strategies, and patient acquisition tactics from the team at Dastify Digital.",
  };
}

export default async function Page() {
  const content = defaultContent;

  return (
    <>
      <NavbarScrollState />
      <ScrollRevealController />
      <BlogNavbar data={content.nav} />
      <main>
        <BlogHero data={content.hero} />
        <BlogFilters data={content.filters} />
        <FeaturedPost data={content.featured} />
        <BlogGrid data={content.grid} />
        <TopicsSection data={content.topics} />
        <NewsletterSection data={content.newsletter} />
        <BlogCta data={content.cta} />
      </main>
      <BlogFooter data={content.footer} />
    </>
  );
}
