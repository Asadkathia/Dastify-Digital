export type NavLinkItem = {
  label: string;
  href: string;
};

export type HeroStat = {
  value: string;
  counterTarget?: number;
  suffix?: string;
  label: string;
};

export type FeatureCard = {
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

export type CaseTab = {
  id: string;
  label: string;
};

export type CaseStudyMain = {
  tag: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  image: string;
  alt: string;
};

export type CaseStudyMini = {
  tag: string;
  title: string;
  stat: string;
  statLabel: string;
  image: string;
  alt: string;
};

export type ServiceItem = {
  number: string;
  name: string;
  description: string;
  image: string;
  alt: string;
};

export type InsightItem = {
  date: string;
  title: string;
  image: string;
  alt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type BrandAcronymItem = {
  l: string;
  word: 'DASTIFY' | 'DIGITAL';
  dir: 'up' | 'down';
  color: 'purple' | 'blue';
  t1: string;
  t2: string;
};

export type HomepageContent = {
  nav: {
    logo: string;
    links: NavLinkItem[];
    cta: string;
  };
  hero: {
    id: string;
    chip: string;
    headingLines: { text: string; delay?: number; colorVar?: string }[];
    description: string;
    primaryCta: string;
    secondaryCta: string;
    stats: HeroStat[];
    image: string;
    imageAlt: string;
    badgeValue: string;
    badgeLabel: string;
    marquee: string[];
  };
  brandAcronym: {
    id: string;
    chip: string;
    title: string;
    subtitle: string;
    items: BrandAcronymItem[];
  };
  about: {
    id: string;
    chip: string;
    headingLines: { text: string; delay?: number; colorVar?: string }[];
    paragraphs: string[];
    cta: string;
    image: string;
    imageAlt: string;
  };
  features: {
    cards: FeatureCard[];
  };
  caseStudies: {
    id: string;
    chip: string;
    title: string;
    cta: string;
    tabs: CaseTab[];
    main: CaseStudyMain;
    minis: CaseStudyMini[];
  };
  services: {
    id: string;
    chip: string;
    titleLines: string[];
    description: string;
    items: ServiceItem[];
  };
  mission: {
    chip: string;
    title: string;
    description: string;
    checks: string[];
    cta: string;
    image: string;
    imageAlt: string;
  };
  insights: {
    id: string;
    chip: string;
    title: string;
    cta: string;
    items: InsightItem[];
  };
  faq: {
    id: string;
    chip: string;
    title: string;
    intro: string;
    cta: string;
    items: FaqItem[];
  };
  cta: {
    chip: string;
    headingLines: { text: string; delay?: number; color?: string }[];
    subtitle: string;
    inputPlaceholder: string;
    button: string;
    note: string;
  };
  footer: {
    logo: string;
    tagline: string;
    socials: { label: string; href: string }[];
    columns: {
      title: string;
      links: { label: string; href: string }[];
      button?: string;
    }[];
    copyright: string;
    badges: { label: string; tone?: 'blue' | 'green' }[];
  };
};

export const homepageContent: HomepageContent = {
  nav: {
    logo: 'Dastify.Digital',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Results', href: '/case-studies' },
      { label: 'Insights', href: '/blog' },
      { label: 'About', href: '#about' },
    ],
    cta: 'Book Free Audit →',
  },
  hero: {
    id: 'hero',
    chip: 'AI-Powered Healthcare Marketing',
    headingLines: [
      { text: 'The Creative' },
      { text: 'Agency', delay: 1 },
      { text: 'Healthcare', delay: 2, colorVar: 'var(--blue)' },
      { text: 'Deserves.', delay: 3 },
    ],
    description:
      'Generic agencies waste healthcare budgets. We build HIPAA-compliant, AI-powered campaigns that fill your calendar and deliver measurable ROI for medical practices across every specialty.',
    primaryCta: 'Get Free Growth Audit →',
    secondaryCta: 'See Real Results',
    stats: [
      { value: '0', counterTarget: 1000, suffix: '+', label: 'Practices Served' },
      { value: '0', counterTarget: 95, suffix: '%', label: 'Client Retention' },
      { value: '$50M', suffix: '+', label: 'Revenue Generated' },
    ],
    image: '/images/hero-image.webp',
    imageAlt: 'Hero Image',
    badgeValue: '309%',
    badgeLabel: 'Patient inquiry lift — 90 days',
    marquee: [
      'Healthcare SEO',
      'Google Ads & PPC',
      'Website Design',
      'Reputation Management',
      'Social Media',
      'HIPAA Campaigns',
      'AI Analytics',
      'Patient Acquisition',
      'Local SEO',
      'Email & SMS',
    ],
  },
  brandAcronym: {
    id: 'brand',
    chip: 'Our Name. Our Promise.',
    title: 'Every Letter Stands for Something.',
    subtitle:
      'DASTIFY DIGITAL — our complete commitment to healthcare marketing excellence, decoded letter by letter.',
    items: [
      { l: 'D', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Data-Driven', t2: 'Marketing' },
      { l: 'A', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Advanced', t2: 'Targeting' },
      { l: 'S', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Strategic', t2: 'Solutions' },
      { l: 'T', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Trust-Focused', t2: 'Campaigns' },
      { l: 'I', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Innovative', t2: 'Growth' },
      { l: 'F', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Full-Service', t2: 'Marketing' },
      { l: 'Y', word: 'DASTIFY', dir: 'up', color: 'purple', t1: 'Yield-Oriented', t2: 'Results' },
      { l: 'D', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Digital', t2: 'Presence' },
      { l: 'I', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Integrated', t2: 'Marketing' },
      { l: 'G', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Growth', t2: 'Strategy' },
      { l: 'I', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Insightful', t2: 'Analytics' },
      { l: 'T', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Tech-Powered', t2: 'Solutions' },
      { l: 'A', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Attractive', t2: 'Branding' },
      { l: 'L', word: 'DIGITAL', dir: 'down', color: 'blue', t1: 'Lead', t2: 'Generation' },
    ],
  },
  about: {
    id: 'about',
    chip: 'About Dastify Digital',
    headingLines: [
      { text: 'Experience innovative' },
      { text: 'marketing that transforms', delay: 1 },
      { text: 'your practice.', delay: 2, colorVar: 'var(--blue)' },
    ],
    paragraphs: [
      'We craft data-driven campaigns that blend clinical intelligence with bold creative direction — turning patient searches into booked appointments and your practice into the recognised authority in your specialty.',
      'Every strategy is built with full HIPAA compliance, deep healthcare expertise, and the creative precision that separates elite agencies from generalists who dabble in medical marketing.',
    ],
    cta: 'Learn More →',
    image: '/images/about-image-02.webp',
    imageAlt: 'About Image',
  },
  features: {
    cards: [
      {
        category: 'Specialty Marketing',
        title: 'HIPAA-Safe Digital Campaigns',
        description:
          'Campaigns built from the ground up with healthcare privacy compliance, PHI-safe tracking, and clinical messaging that resonates.',
        image: '/images/feature-image-3.webp',
        alt: 'Feature Image 1',
      },
      {
        category: 'AI Analytics',
        title: 'Live Performance Dashboards',
        description:
          'Real-time visibility into every campaign metric — from cost-per-acquisition to booked appointments — updated daily.',
        image: '/images/feature-image-03.webp',
        alt: 'Feature Image 2',
      },
    ],
  },
  caseStudies: {
    id: 'cases',
    chip: 'Our Latest Results',
    title: 'We deliver exceptional patient growth for healthcare.',
    cta: 'View All Case Studies →',
    tabs: [
      { id: 'dental', label: 'Dental' },
      { id: 'derm', label: 'Dermatology' },
      { id: 'plastic', label: 'Plastic Surgery' },
      { id: 'mental', label: 'Mental Health' },
      { id: 'fertility', label: 'Fertility' },
      { id: 'ortho', label: 'Orthopedics' },
    ],
    main: {
      tag: 'Dental Practices · Dallas, TX',
      title: 'Multi-location Dental Group',
      description:
        'Complete digital overhaul — HIPAA-safe PPC, local SEO dominance, and a conversion-optimised site rebuilt from scratch for 8 locations.',
      stat: '+309%',
      statLabel: 'Patient inquiry lift',
      image: '/images/case-study-image-4.webp',
      alt: 'Case Study Image',
    },
    minis: [
      {
        tag: 'Dermatology · Austin, TX',
        title: 'Aesthetics & Skin Clinic',
        stat: '+42%',
        statLabel: 'Lower CPA',
        image: '/images/case-study-image-04.webp',
        alt: 'Case Image 1',
      },
      {
        tag: 'Mental Health · Chicago, IL',
        title: 'Therapy Practice Group',
        stat: '+178%',
        statLabel: 'Organic traffic',
        image: '/images/case-study-image-44.webp',
        alt: 'Case Image 2',
      },
    ],
  },
  services: {
    id: 'services',
    chip: 'Services',
    titleLines: ['Seamless patient growth', 'solutions tailored for you.'],
    description:
      'From ambitious solo clinics to hyperscaling multi-location provider groups — one integrated strategy, fully measurable, fully HIPAA-compliant.',
    items: [
      {
        number: '01',
        name: 'Brand & Identity',
        description:
          'Creative branding, content marketing, and video production that builds clinical authority and a distinctive presence.',
        image: '/images/services-1.webp',
        alt: 'Brand & Identity',
      },
      {
        number: '02',
        name: 'Healthcare SEO',
        description:
          'Rank #1 for high-intent patient searches. HIPAA-compliant website design. Local SEO and Google Business Profile dominance.',
        image: '/images/services-image-2.webp',
        alt: 'Healthcare SEO',
      },
      {
        number: '03',
        name: 'Google Ads & PPC',
        description:
          'HIPAA-safe paid campaigns with AI-optimised bidding, precision targeting, and conversion-focused landing pages.',
        image: '/images/services-image-3.webp',
        alt: 'Google Ads & PPC',
      },
      {
        number: '04',
        name: 'Social Media Marketing',
        description:
          'Precision-targeted patient acquisition on Meta, TikTok, and Instagram with compliant creative that converts.',
        image: '/images/services-image-4.webp',
        alt: 'Social Media Marketing',
      },
      {
        number: '05',
        name: 'Reputation Management',
        description:
          "5-star review generation at scale, proactive monitoring, and crisis response to protect your practice's standing.",
        image: '/images/services-image-5.webp',
        alt: 'Reputation Management',
      },
      {
        number: '06',
        name: 'Email & SMS Automation',
        description:
          'HIPAA-compliant patient retention sequences, no-show reduction, and reactivation campaigns that run automatically.',
        image: '/images/services-image-6.webp',
        alt: 'Email & SMS Automation',
      },
    ],
  },
  mission: {
    chip: 'About Dastify Digital',
    title: 'With a commitment to excellence\nand measurable results.',
    description:
      "With a commitment to HIPAA compliance, clinical precision, and creative ambition, we bring your practice's growth vision to life. Our team of dedicated healthcare marketers turns your unique positioning into a patient-generating engine.",
    checks: [
      'Full HIPAA compliance on every campaign, BAAs signed',
      '40+ medical specialties — we know your patient journey',
      "Live performance dashboards — you see exactly what's working",
      'All 50 states — from solo practices to national groups',
    ],
    cta: 'Book a Strategy Call →',
    image: '/images/mission-image.webp',
    imageAlt: 'Mission Image',
  },
  insights: {
    id: 'insights',
    chip: 'Our featured insights',
    title: 'Healthcare marketing,\ndecoded.',
    cta: 'View All Articles →',
    items: [
      {
        date: 'March 2026',
        title: 'Why Healthcare PPC Fails Without HIPAA-Safe Tracking',
        image: '/images/our-feature-insight-01.webp',
        alt: 'Insight 1',
      },
      {
        date: 'February 2026',
        title: 'Local SEO for Medical Practices: The 2026 Complete Guide',
        image: '/images/our-feature-insight-02.webp',
        alt: 'Insight 2',
      },
      {
        date: 'February 2026',
        title: 'How to Generate 5-Star Reviews Without Violating Healthcare Ethics',
        image: '/images/our-feature-insight-03.webp',
        alt: 'Insight 3',
      },
      {
        date: 'January 2026',
        title: 'The Real Cost of Hiring a Generalist Agency for Your Medical Practice',
        image: '/images/our-feature-insight-04.webp',
        alt: 'Insight 4',
      },
      {
        date: 'January 2026',
        title: 'Patient Trust in the Digital Age: Building Credibility That Converts',
        image: '/images/our-feature-insight-05.webp',
        alt: 'Insight 5',
      },
      {
        date: 'December 2025',
        title: "AI-Powered Ad Bidding for Healthcare: What's Working in 2026",
        image: '/images/our-feature-insight-06.webp',
        alt: 'Insight 6',
      },
    ],
  },
  faq: {
    id: 'faq',
    chip: 'Get started',
    title: 'Frequently\nasked questions.',
    intro:
      'Everything you need to know about healthcare digital marketing and how Dastify Digital helps practices grow faster.',
    cta: 'Book Free Strategy Call →',
    items: [
      {
        question: 'How do I start the process of growing my practice?',
        answer:
          'We start with a free 30-minute strategy session where we assess your current digital presence, competitive landscape, and biggest growth opportunities. From there we build a custom roadmap — no obligation required.',
      },
      {
        question: 'How long does it take to see results?',
        answer:
          'Google Ads campaigns generate patient inquiries within the first 2–3 weeks. SEO compounds over 3–6 months. Reputation and content strategies build durable authority that grows month over month — creating a compounding engine that gets stronger over time.',
      },
      {
        question: 'How does Dastify ensure HIPAA compliance?',
        answer:
          "We sign Business Associate Agreements with all relevant vendors, use HIPAA-compliant tracking solutions (no standard Meta or Google pixels), avoid PHI in all campaign data, and run regular compliance audits. Your patients' data is always protected.",
      },
      {
        question: 'What specialties do you work with?',
        answer:
          'We work across 40+ medical specialties including dental, dermatology, plastic surgery, fertility & IVF, mental health, orthopedics, cosmetics, telehealth, cardiology, pediatrics, weight loss, ophthalmology, urology, and more.',
      },
      {
        question: 'Do you offer advice on patient retention?',
        answer:
          'Absolutely. Patient retention is one of our core pillars. We build automated email and SMS sequences that reduce no-shows, reactivate lapsed patients, and generate referrals — all HIPAA-compliant. Retention strategies are included in every engagement.',
      },
    ],
  },
  cta: {
    chip: 'Get started',
    headingLines: [
      { text: 'Schedule a' },
      { text: 'free consultation.', delay: 1, color: '#EDE6FF' },
    ],
    subtitle:
      'We build HIPAA-compliant, AI-powered campaigns that fill your calendar and deliver measurable ROI for medical practices — all 50 states, every specialty.',
    inputPlaceholder: 'Enter your work email',
    button: 'Get started →',
    note: 'No obligation · Free 30-minute strategy session · HIPAA-compliant',
  },
  footer: {
    logo: 'Dastify.Digital',
    tagline:
      'The creative authority for healthcare growth. HIPAA-compliant campaigns that fill your calendar.',
    socials: [
      { label: '𝕏', href: '#' },
      { label: 'in', href: '#' },
      { label: '▷', href: '#' },
      { label: 'f', href: '#' },
    ],
    columns: [
      {
        title: 'Services',
        links: [
          { label: 'Healthcare SEO', href: '/services' },
          { label: 'Google Ads & PPC', href: '/services' },
          { label: 'Website Design', href: '/services' },
          { label: 'Reputation Management', href: '/services' },
          { label: 'Social Media', href: '/services' },
          { label: 'Email & SMS', href: '/services' },
        ],
      },
      {
        title: 'Specialties',
        links: [
          { label: 'Dental Practices', href: '/case-studies' },
          { label: 'Dermatology', href: '/case-studies' },
          { label: 'Mental Health', href: '/case-studies' },
          { label: 'Fertility & IVF', href: '/case-studies' },
          { label: 'Plastic Surgery', href: '/case-studies' },
          { label: 'Telehealth', href: '/case-studies' },
        ],
      },
      {
        title: 'Contact',
        links: [
          { label: 'Book Strategy Call', href: '/#cta' },
          { label: 'Free Growth Audit', href: '/#cta' },
          { label: 'hello@dastifydigital.com', href: 'mailto:hello@dastifydigital.com' },
          { label: '1-800-DASTIFY', href: 'tel:+18003278439' },
        ],
        button: 'Book Free Audit →',
      },
    ],
    copyright: '© 2026 Dastify Digital. All rights reserved.',
    badges: [
      { label: 'HIPAA' },
      { label: 'Google Partner', tone: 'blue' },
      { label: 'Award-Winning', tone: 'green' },
    ],
  },
};
