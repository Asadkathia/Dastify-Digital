import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';
import type { BlogPostSeed } from '../blog-1/content';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
};

export type Author = {
  name: string;
  role: string;
  /** Path under /public, optional. */
  avatar?: string;
};

export type ArticleSidebarLink = { label: string; anchor: string };

export type SidebarCta = {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export type PageContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: EditableSection<{
    backLabel: string;
    backHref: string;
    category: string;
    title: string;
    date: string;
    read: string;
    author: Author;
  }>;
  article: EditableSection<{
    /** Lead paragraph (rendered with `renderEmHtml`). */
    lead: string;
    /** Body HTML — paragraphs, h2, h3, lists. Trusted markup from CMS or editor. */
    bodyHtml: string;
    inlineCta: {
      heading: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
    sidebar: {
      tocTitle: string;
      toc: ArticleSidebarLink[];
      cta: SidebarCta;
      categoriesTitle: string;
      categories: { label: string; href: string }[];
    };
  }>;
  related: EditableSection<{
    title: string;
    backHref: string;
    posts: BlogPostSeed[];
  }>;
};

const DEFAULT_AUTHOR: Author = {
  name: 'Dastify Digital',
  role: 'Healthcare Marketing Team',
};

// Verbatim from /tmp/design-drop/dastify-digital-isaac/project/src/blog-single.jsx
const DEFAULT_BODY_HTML = `
<h2 id="why-medical-seo-is-different">Why Medical SEO Is Different</h2>
<p>Healthcare search is fundamentally different from e-commerce or SaaS. Patients aren’t browsing — they’re anxious, often in pain, and making decisions that affect their health. The stakes are higher, the trust threshold is steeper, and the regulatory landscape adds layers of complexity that generic SEO strategies simply aren’t built for.</p>
<p>When someone searches “orthopedic surgeon near me,” they’re not comparing 20 options. They’re looking at the top 3 results, reading reviews, and calling the practice that feels most credible. Your job is to be in that top 3 — and to make the best first impression when they click.</p>
<h2 id="the-2026-priority-stack">The 2026 Priority Stack</h2>
<p>Based on what we’re seeing across 120+ medical practice clients, here’s the priority stack for 2026:</p>
<h3>1. Local Search Dominance</h3>
<p>Google Business Profile optimization remains the single highest-ROI activity for most practices. Accurate NAP data, regular posts, Q&amp;A management, and review velocity are non-negotiable. In 2026, we’re seeing Google surface more GBP content directly in AI Overviews — making profile completeness even more critical.</p>
<h3>2. Service Page Depth</h3>
<p>Thin service pages are a liability. Each procedure or treatment you offer should have a dedicated page with physician-reviewed content, FAQ schema, before/after context (where compliant), and clear booking CTAs. The practices winning organic traffic are the ones treating each service page like a landing page.</p>
<h3>3. Physician Authority Content</h3>
<p>E-E-A-T rewards content tied to real practitioners. Named physician authors with linked bios, credentials, and practice affiliations outperform anonymous blog posts by a significant margin. If your doctors aren’t visible in your content strategy, you’re leaving rankings on the table.</p>
<h3>4. Technical Hygiene</h3>
<p>Core Web Vitals, mobile performance, and crawlability aren’t glamorous, but they’re table stakes. We’ve seen practices jump 15–20 positions just from fixing render-blocking scripts and improving LCP on their top service pages.</p>
<h2 id="what-hasn-t-changed">What Hasn’t Changed</h2>
<p>The fundamentals that worked in 2020 still work in 2026: write for patients first, earn real reviews, build local authority, and make it easy to book. The practices that win are the ones that do the boring things consistently, not the ones chasing algorithm hacks.</p>
`.trim();

const DEFAULT_RELATED: BlogPostSeed[] = [
  {
    id: 'cost-per-lead',
    cat: 'Paid Media',
    title: 'Why Your Cost-Per-Lead Is Lying to You (And What to Track Instead)',
    excerpt: '',
    date: 'Mar 28, 2026',
    read: '5 min read',
    href: '/blog-post',
  },
  {
    id: 'review-strategy',
    cat: 'Reputation',
    title: 'From 3.2 to 4.8 Stars: A 90-Day Physician Review Strategy',
    excerpt: '',
    date: 'Mar 15, 2026',
    read: '6 min read',
    href: '/blog-post',
  },
  {
    id: 'social-for-surgeons',
    cat: 'Social Media',
    title: 'Social Media for Surgeons: What Actually Works in 2026',
    excerpt: '',
    date: 'Feb 22, 2026',
    read: '7 min read',
    href: '/blog-post',
  },
];

export const defaultContent: PageContent = {
  meta: {
    title: 'The 2026 Medical SEO Playbook — Dastify Digital',
    description:
      'Google’s algorithm evolves, but the fundamentals of medical SEO remain rooted in E-E-A-T, local intent, and technical hygiene. Here’s what to prioritize this year.',
  },
  hero: {
    backLabel: 'Back to Blog',
    backHref: '/blog-1',
    category: 'SEO',
    title: 'The 2026 Medical SEO Playbook: What Changed and What Didn’t',
    date: 'Apr 12, 2026',
    read: '8 min read',
    author: DEFAULT_AUTHOR,
  },
  article: {
    lead: 'Google’s algorithm evolves every year, but the fundamentals of medical SEO remain rooted in experience, expertise, authoritativeness, and trustworthiness (E-E-A-T). For healthcare practices, this isn’t just a ranking factor — it’s a reflection of what patients actually need when they search.',
    bodyHtml: DEFAULT_BODY_HTML,
    inlineCta: {
      heading: 'Want a custom SEO audit for your practice?',
      body: 'We’ll analyze your current rankings, identify gaps, and show you exactly where to focus first.',
      ctaLabel: 'Book your free audit',
      ctaHref: '/book-session',
    },
    sidebar: {
      tocTitle: 'Table of Contents',
      toc: [
        { label: 'Why Medical SEO Is Different', anchor: 'why-medical-seo-is-different' },
        { label: 'The 2026 Priority Stack', anchor: 'the-2026-priority-stack' },
        { label: 'What Hasn’t Changed', anchor: 'what-hasn-t-changed' },
      ],
      cta: {
        heading: 'Ready to Grow?',
        body: 'Get a free 30-minute strategy session with our healthcare marketing team.',
        ctaLabel: 'Book a session',
        ctaHref: '/book-session',
      },
      categoriesTitle: 'Categories',
      categories: [
        { label: 'SEO', href: '/blog-1' },
        { label: 'Paid Media', href: '/blog-1' },
        { label: 'Reputation', href: '/blog-1' },
        { label: 'Social Media', href: '/blog-1' },
        { label: 'Websites', href: '/blog-1' },
        { label: 'Analytics', href: '/blog-1' },
      ],
    },
  },
  related: {
    title: 'Related Articles',
    backHref: '/blog-1',
    posts: DEFAULT_RELATED,
  },
};
