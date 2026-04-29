import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
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
  missionVision: EditableSection<{
    mission: { icon: string; title: string; body: string };
    vision: { icon: string; title: string; body: string };
  }>;
  coreValues: EditableSection<{
    eyebrow: string;
    heading: string;
    items: { icon: string; title: string; description: string }[];
  }>;
  stats: EditableSection<{
    eyebrow: string;
    heading: string;
    items: { value: string; label: string }[];
  }>;
  timeline: EditableSection<{
    eyebrow: string;
    heading: string;
    milestones: { year: string; title: string; description: string }[];
  }>;
  trust: EditableSection<{
    eyebrow: string;
    heading: string;
    logos: { slug: string; label: string }[];
    badgesLabel: string;
    badges: { slug: string; alt: string; image?: string }[];
  }>;
  certifications: EditableSection<{
    eyebrow: string;
    heading: string;
    items: { icon: string; title: string; description: string }[];
  }>;
  finalCta: EditableSection<{
    heading: string;
    sub: string;
    primary: { label: string; href: string };
    phone: { label: string; href: string };
  }>;
};

export const defaultContent: PageContent = {
  meta: {
    title: 'About Us — Dastify Digital | Healthcare Marketing With Clinical Precision',
    description:
      "We didn't start a marketing agency — we started a mission. Meet the team building growth engines for 120+ healthcare practices nationwide.",
  },
  hero: {
    badge: 'Our Story',
    heading: "We didn't start a marketing agency.\nWe started a <em>mission</em>.",
    sub: "In 2014, we saw healthcare practices pouring money into generic marketing that didn't understand their world — the compliance demands, the patient trust barrier, the long decision cycles. So we built something different: an agency that speaks medicine first and marketing second.",
  },
  missionVision: {
    mission: {
      icon: 'pulse',
      title: 'Our Mission',
      body: 'To be the growth partner every healthcare practice deserves — one that understands the weight of what they do, respects the regulations they navigate, and delivers marketing that fills waiting rooms with the right patients.',
    },
    vision: {
      icon: 'spark',
      title: 'Our Vision',
      body: 'A world where every quality healthcare provider is easy to find, easy to trust, and easy to choose — because their digital presence is as excellent as their clinical care.',
    },
  },
  coreValues: {
    eyebrow: 'What We Stand For',
    heading: 'Six principles that guide\nevery <em>decision</em> we make.',
    items: [
      {
        icon: 'stethoscope',
        title: 'Medical-Only Focus',
        description:
          "We don’t do restaurants. We don’t do retail. Every strategy, benchmark, and campaign is built for healthcare — and it shows.",
      },
      {
        icon: 'shield',
        title: 'Compliance First',
        description:
          'HIPAA, FDA, FTC, state medical board rules — we navigate them all so your campaigns stay safe and your reputation stays untouchable.',
      },
      {
        icon: 'chart',
        title: 'Radical Transparency',
        description:
          'No smoke, no mirrors. Every campaign is visible in real time. You see what we see — live dashboards, honest reporting, no vanity metrics.',
      },
      {
        icon: 'heart',
        title: 'Patient-Centered Thinking',
        description:
          'We build campaigns the way you build care plans — starting with the patient. Their search, their fears, their journey to your door.',
      },
      {
        icon: 'bolt',
        title: 'Measurable Impact',
        description:
          "If we can’t measure it, we don’t recommend it. Every dollar is tracked from first click to seated patient.",
      },
      {
        icon: 'users',
        title: 'Long-Term Partnership',
        description:
          "95% client retention doesn’t happen by accident. We invest in relationships that compound over years, not quick wins that fade.",
      },
    ],
  },
  stats: {
    eyebrow: 'By the Numbers',
    heading: 'Results that speak\n<em>louder than promises</em>.',
    items: [
      { value: '10+', label: 'Years medical-only' },
      { value: '120+', label: 'Practices served' },
      { value: '48', label: 'States covered' },
      { value: '95%', label: 'Client retention' },
      { value: '$50M+', label: 'Revenue generated' },
      { value: '575%', label: 'Best conversion lift' },
    ],
  },
  timeline: {
    eyebrow: 'Our Journey',
    heading: 'From five clients to\n<em>120+ practices</em> nationwide.',
    milestones: [
      {
        year: '2014',
        title: 'The Beginning',
        description:
          'Founded with a single belief: healthcare practices deserve marketing that understands medicine. First 5 clients onboarded.',
      },
      {
        year: '2016',
        title: 'Medical-Only Commitment',
        description:
          'Made the decision to serve healthcare exclusively. Dropped all non-medical clients to go all-in.',
      },
      {
        year: '2018',
        title: '50 Practices Served',
        description:
          'Built proprietary reporting dashboards connecting marketing spend to patient bookings.',
      },
      {
        year: '2020',
        title: 'Telehealth Pivot',
        description:
          'Helped practices rapidly shift to digital-first patient acquisition during the pandemic.',
      },
      {
        year: '2022',
        title: 'AI-Powered Growth',
        description:
          'Integrated AI-driven campaign optimization and predictive analytics into our stack.',
      },
      {
        year: '2024',
        title: '120+ Practices',
        description:
          'Recognized by Clutch, Google, and SEO Blog as a top healthcare marketing agency.',
      },
      {
        year: '2026',
        title: 'The Next Chapter',
        description:
          'Expanding into PE-backed platform marketing and next-gen patient attribution technology.',
      },
    ],
  },
  trust: {
    eyebrow: 'Trusted Partners',
    heading: 'Proud to work with <em>120+</em>\nmedical practices nationwide.',
    logos: [
      { slug: 'ortho-tennessee', label: 'ORTHO TENNESSEE' },
      { slug: 'cona', label: 'CONA' },
      { slug: 'midlands-ortho', label: 'MIDLANDS ORTHO' },
      { slug: 'hopco', label: 'HOPCO' },
      { slug: 'cvr-medical', label: 'CVR MEDICAL' },
      { slug: 'summit-health', label: 'SUMMIT HEALTH' },
    ],
    badgesLabel: 'Recognized by',
    badges: [
      { slug: 'best-in-search', alt: 'Best in Search', image: '' },
      { slug: 'google-partner', alt: 'Google Partner', image: '' },
      { slug: 'upcity-top', alt: 'UpCity Top Digital Agency', image: '' },
      { slug: 'clutch-top', alt: 'Clutch Top SEO Company', image: '' },
      { slug: 'seoblog-top', alt: 'SEO Blog Top Rated', image: '' },
    ],
  },
  certifications: {
    eyebrow: 'Compliance & Certifications',
    heading: 'Marketing you can trust\nwith your <em>reputation</em>.',
    items: [
      {
        icon: 'shield',
        title: 'HIPAA-Trained',
        description:
          'All staff complete annual HIPAA training. We handle your marketing data with the same care you handle patient records.',
      },
      {
        icon: 'check',
        title: 'BAA Available',
        description:
          'Business Associate Agreements available on request for all client partnerships.',
      },
      {
        icon: 'stethoscope',
        title: 'HIPAA-Safe Forms',
        description:
          'No PHI is collected on marketing surfaces. Forms route to a HIPAA-compliant CRM with a signed BAA.',
      },
      {
        icon: 'shield',
        title: 'FDA & FTC Compliant',
        description:
          'We navigate FDA, FTC, and state advertising regulations so your campaigns are always above board.',
      },
    ],
  },
  finalCta: {
    heading: "Let’s talk about growing your practice.",
    sub: "A 30-minute conversation — no pressure, no obligation. We’ll listen first, then show you where the biggest opportunities are.",
    primary: { label: 'Book a growth session', href: '/contact' },
    phone: { label: '(770) 462-4237', href: 'tel:+17704624237' },
  },
};
