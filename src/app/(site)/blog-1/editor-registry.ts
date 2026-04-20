import BlogNavbar from "./components/BlogNavbar";
import BlogHero from "./components/BlogHero";
import BlogFilters from "./components/BlogFilters";
import FeaturedPost from "./components/FeaturedPost";
import BlogGrid from "./components/BlogGrid";
import TopicsSection from "./components/TopicsSection";
import NewsletterSection from "./components/NewsletterSection";
import BlogCta from "./components/BlogCta";
import { defaultContent } from "./content";
import type { ConvertedPageRegistry } from "@/lib/converted-pages/types";
import type { FormDefinition } from "@/lib/forms/types";

const registry: ConvertedPageRegistry & { formDefinitions?: Record<string, FormDefinition> } = {
  pageName: "blog-1",
  defaultContent,
  sections: [
    { key: "nav", label: "Navbar", icon: "🧭", className: "nav", Component: BlogNavbar as never },
    { key: "hero", label: "Hero", icon: "🦸", className: "blog1-blog-hero", Component: BlogHero as never },
    { key: "filters", label: "Filters", icon: "🏷️", className: "blog1-blog-filters", Component: BlogFilters as never },
    { key: "featured", label: "Featured Post", icon: "⭐", className: "blog1-featured-section", Component: FeaturedPost as never },
    { key: "grid", label: "Blog Grid", icon: "📰", className: "blog1-blog-grid-section", Component: BlogGrid as never },
    { key: "topics", label: "Topics", icon: "🗂️", className: "blog1-topics-section", Component: TopicsSection as never },
    { key: "newsletter", label: "Newsletter", icon: "✉️", className: "blog1-newsletter-section", Component: NewsletterSection as never },
    { key: "cta", label: "CTA", icon: "🚀", className: "blog1-cta-section", Component: BlogCta as never },
  ],
};

registry.formDefinitions = {
  newsletter: {
    title: "Healthcare Marketing Insights — Blog | Dastify Digital — Newsletter",
    submitButtonLabel: "Subscribe →",
    confirmationMessage: "Thanks for subscribing.",
    fields: defaultContent.newsletter.form.rows.flat().map((field) => ({
      name: field.name,
      label: field.name.charAt(0).toUpperCase() + field.name.slice(1),
      type: field.type,
      required: field.required,
      width: field.width,
      placeholder: field.placeholder,
      options: field.options?.map((option) => ({ label: option.label, value: option.value })) || undefined,
    })),
  },
};

export default registry;
