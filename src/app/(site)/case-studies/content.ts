import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
};

export type CaseStudyResult = {
  n: string;
  l: string;
};

export type CaseStudySeed = {
  client: string;
  specialty: string;
  challenge: string;
  strategy: string;
  results: CaseStudyResult[];
  quote: string;
  author: string;
  role: string;
  tags: string[];
  /** v2 token color for accent border / numerals — primary | accent | support */
  color: 'primary' | 'accent' | 'support';
  /** Optional slug — when present and a Payload `case-studies` doc with the same slug exists, the Payload doc wins. */
  slug?: string;
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
  caseStudies: EditableSection<{
    /** Static seed entries — used as fallback when the Payload `case-studies` collection is empty. */
    items: CaseStudySeed[];
  }>;
};

export const defaultContent: PageContent = {
  meta: {
    title: 'Case Studies — Dastify Digital',
    description:
      'Real practices. Real results. Every case study is a full-funnel story — challenge, strategy, and measurable outcomes. No cherry-picking, no rounding up.',
  },
  hero: {
    badge: 'Proof of Work',
    heading: 'Real practices.\n<em>Real results.</em>',
    sub: 'Every case study is a full-funnel story — challenge, strategy, and measurable outcomes. No cherry-picking, no rounding up.',
  },
  caseStudies: {
    items: [
      {
        client: 'Tennessee Orthopaedic Alliance',
        specialty: 'Orthopedic Surgery',
        challenge:
          'TOA was invisible online for high-value procedure searches. Competitors dominated Google Maps and paid search, draining potential surgical consults.',
        strategy:
          'We rebuilt their SEO architecture around procedure-level intent, launched HIPAA-safe Google Ads for 8 surgical categories, and overhauled their Google Business Profiles across 12 locations.',
        results: [
          { n: '+575%', l: 'Ad conversions' },
          { n: '+94%', l: 'Organic traffic' },
          { n: '$42', l: 'Cost per booked visit' },
          { n: '12 mo', l: 'Timeline' },
        ],
        quote:
          'For everything a practice needs an expert on, Dastify shows up. They speak the language of medicine and the language of growth.',
        author: 'Kristy Parker, MBA',
        role: 'Marketing Director',
        tags: ['SEO', 'Paid Media', 'Multi-location'],
        color: 'primary',
      },
      {
        client: 'CONA Orthopedics',
        specialty: 'Sports Medicine & Orthopedics',
        challenge:
          'CONA had strong clinical reputation but zero digital visibility outside their existing patient base. New patient acquisition had plateaued for 18 months.',
        strategy:
          'Launched a local SEO domination campaign targeting 40+ sports injury keywords, built 6 physician authority content hubs, and implemented automated review generation.',
        results: [
          { n: '+312%', l: 'Organic leads' },
          { n: '4.9★', l: 'Google rating' },
          { n: '8 mo', l: 'Timeline' },
          { n: '#1', l: 'Rankings for 40+ terms' },
        ],
        quote: 'We went from invisible to unavoidable in less than a year.',
        author: 'Dr. James Chen',
        role: 'Managing Partner',
        tags: ['SEO', 'Reputation', 'Content'],
        color: 'accent',
      },
      {
        client: 'Midlands Orthopaedics',
        specialty: 'Orthopedic & Spine',
        challenge:
          'High ad spend with poor ROI — $180 CPL for urgent care visits that should cost under $10.',
        strategy:
          'Audited and rebuilt their entire Google Ads account. Introduced dayparting, negative keyword architecture, and landing page CRO focused on urgent care intent.',
        results: [
          { n: '$6.80', l: 'Cost per urgent visit' },
          { n: '-96%', l: 'CPL reduction' },
          { n: '3.2×', l: 'ROAS' },
          { n: '6 mo', l: 'Timeline' },
        ],
        quote: 'The ROI improvement was so dramatic our CFO asked us to double the budget.',
        author: 'Sarah Mitchell',
        role: 'Practice Administrator',
        tags: ['Paid Media', 'CRO', 'Analytics'],
        color: 'support',
      },
    ],
  },
};
