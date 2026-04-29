import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
};

export type BlogPostSeed = {
  id: string;
  cat: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  href: string;
  /** Optional path under /public/blog. When absent, render the .iph placeholder. */
  image?: string;
  imageAlt?: string;
  featured?: boolean;
};

export type PageContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: EditableSection<{
    badge: string;
    heading: string;
    sub: string;
  }>;
  main: EditableSection<{
    categories: string[];
    posts: BlogPostSeed[];
  }>;
};

export const defaultContent: PageContent = {
  meta: {
    title: 'Blog — Dastify Digital | Healthcare Marketing Insights',
    description:
      'Tactical guides, benchmarks, and frameworks — written for practice administrators and marketing directors, not interns.',
  },
  hero: {
    badge: 'Resources',
    heading: 'Thinking that earns<br/>its <em>keep</em>.',
    sub: 'Tactical guides, benchmarks, and frameworks — written for practice administrators and marketing directors, not interns.',
  },
  main: {
    categories: ['All', 'SEO', 'Paid Media', 'Reputation', 'Social Media', 'Websites', 'Analytics'],
    // Verbatim from /tmp/design-drop/dastify-digital-isaac/project/src/blog-main.jsx
    posts: [
      {
        id: 'medical-seo-2026',
        cat: 'SEO',
        title: 'The 2026 Medical SEO Playbook: What Changed and What Didn’t',
        excerpt:
          'Google’s algorithm evolves, but the fundamentals of medical SEO remain rooted in E-E-A-T, local intent, and technical hygiene. Here’s what to prioritize this year.',
        date: 'Apr 12, 2026',
        read: '8 min read',
        href: '/blog-post',
        image: '',
        featured: true,
      },
      {
        id: 'cost-per-lead',
        cat: 'Paid Media',
        title: 'Why Your Cost-Per-Lead Is Lying to You (And What to Track Instead)',
        excerpt:
          'CPL looks great on a dashboard, but it tells you nothing about patient quality. We break down the metrics that actually predict revenue.',
        date: 'Mar 28, 2026',
        read: '5 min read',
        href: '/blog-post',
        image: '',
      },
      {
        id: 'review-strategy',
        cat: 'Reputation',
        title: 'From 3.2 to 4.8 Stars: A 90-Day Physician Review Strategy',
        excerpt:
          'A step-by-step framework for generating authentic patient reviews without crossing compliance lines.',
        date: 'Mar 15, 2026',
        read: '6 min read',
        href: '/blog-post',
        image: '',
      },
      {
        id: 'social-for-surgeons',
        cat: 'Social Media',
        title: 'Social Media for Surgeons: What Actually Works in 2026',
        excerpt:
          'Forget dancing reels. The surgeon social strategies that build referral pipelines look very different from consumer brands.',
        date: 'Feb 22, 2026',
        read: '7 min read',
        href: '/blog-post',
        image: '',
      },
      {
        id: 'website-conversions',
        cat: 'Websites',
        title: '7 Website Fixes That Doubled Appointment Bookings for an Ortho Group',
        excerpt:
          'Small UX changes — not redesigns — that moved the needle for a 12-location orthopedic practice.',
        date: 'Feb 8, 2026',
        read: '6 min read',
        href: '/blog-post',
        image: '',
      },
      {
        id: 'attribution-guide',
        cat: 'Analytics',
        title: 'The Practice Administrator’s Guide to Marketing Attribution',
        excerpt:
          'How to connect ad spend to actual booked surgeries — not just form fills. A plain-language guide to full-funnel tracking.',
        date: 'Jan 20, 2026',
        read: '9 min read',
        href: '/blog-post',
        image: '',
      },
    ],
  },
};
