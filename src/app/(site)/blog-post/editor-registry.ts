import BlogPostNavbar from "./components/BlogPostNavbar";
import ArticleHero from "./components/ArticleHero";
import ArticleLayout from "./components/ArticleLayout";
import RelatedPosts from "./components/RelatedPosts";
import BlogPostCta from "./components/BlogPostCta";
import { defaultContent } from "./content";
import type { ConvertedPageRegistry } from "@/lib/converted-pages/types";
import type { FormDefinition } from "@/lib/forms/types";

const registry: ConvertedPageRegistry & { formDefinitions?: Record<string, FormDefinition> } = {
  pageName: "blog-post",
  defaultContent: defaultContent as unknown as Record<string, unknown>,
  sections: [
    { key: "nav", label: "Navbar", icon: "🧭", className: "nav", Component: BlogPostNavbar as never },
    { key: "hero", label: "Article Hero", icon: "📰", className: "article-hero", Component: ArticleHero as never },
    { key: "article", label: "Article Body", icon: "📄", className: "article-layout", Component: ArticleLayout as never },
    { key: "relatedPosts", label: "Related Posts", icon: "🔗", className: "related-section", Component: RelatedPosts as never },
    { key: "cta", label: "CTA", icon: "📣", className: "cta-section", Component: BlogPostCta as never },
  ],
};

export default registry;
