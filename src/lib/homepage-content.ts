// v2 Homepage content — ten-section marketing homepage per the Dastify_Isaac
// design drop. Single source of truth for both the converted-page renderer in
// src/app/(site)/home/ and the Pages record that backs public `/`.

export type HeroStatItem = {
  value: string;
  label: string;
  sublabel?: string;
};

export type TrustLogo = {
  slug: string;
  label: string;
  src?: string;
  /** Optional path under /public for the badge image. When set the renderer
   *  outputs an <img>; otherwise the .iph placeholder is used. */
  image?: string;
};

export type ServiceItem = {
  icon: string;
  name: string;
  description: string;
};

export type ResultCardItem = {
  client: string;
  value: string;
  label: string;
  barPercent: number;
  featured?: boolean;
  subStats?: { value: string; label: string }[];
};

export type SpecialtyItem = {
  icon: string;
  name: string;
};

export type PricingPlan = {
  name: string;
  icon: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  badge?: string;
  featured?: boolean;
  color: 'primary' | 'accent' | 'support';
  features: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type BlogPostPreview = {
  tag: string;
  title: string;
  readTime: string;
  href?: string;
  /** Optional image path (e.g. /blog/<slug>.webp). When set renderer
   *  outputs an <img>; otherwise the .iph placeholder is used. */
  image?: string;
  imageAlt?: string;
};

export type GrowthFunnelStepItem = {
  n: string;
  d: string;
};

export type GrowthFunnelStep = {
  num: string;
  title: string;
  sub: string;
  desc: string;
  items: GrowthFunnelStepItem[];
};

export type HomepageContent = {
  heroVariant: 'A' | 'B' | 'C';

  hero: {
    kicker: string;
    eyebrow: string;
    badge: string;
    headingA: string;
    headingB: string;
    headingC: string;
    subA: string;
    subB: string;
    subC: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    phone: string;
    proofStats: HeroStatItem[];
    statTiles: HeroStatItem[];
    ticker: string[];
    image: string;
    imageAlt: string;
    trustLogosLabel: string;
    trustLogos: TrustLogo[];
  };

  trustBar: {
    label: string;
    logos: string[];
  };

  services: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    titleTail: string;
    intro: string;
    items: ServiceItem[];
  };

  growthFunnel: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    intro: string;
    steps: GrowthFunnelStep[];
    ctaLabel: string;
    ctaHref: string;
  };

  results: {
    eyebrow: string;
    titleLead: string;
    titleTail: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
    cards: ResultCardItem[];
  };

  testimonial: {
    quoteLead: string;
    quoteEm: string;
    quoteTail: string;
    authorInitials: string;
    authorName: string;
    authorRole: string;
  };

  weServe: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    intro: string;
    specialties: SpecialtyItem[];
    noteLead: string;
    noteLink: string;
  };

  aboutPreview: {
    eyebrow: string;
    titleLead: string;
    titleTail: string;
    body: string;
    stats: { value: string; label: string }[];
    ctaLabel: string;
    ctaHref: string;
    image: string;
    imageAlt: string;
  };

  pricing: {
    eyebrow: string;
    titleLead: string;
    titleEm: string;
    intro: string;
    plans: PricingPlan[];
    footnoteLead: string;
    footnoteLinkLabel: string;
    footnoteLinkHref: string;
    monthlyLabel: string;
    annualLabel: string;
    annualSavingsLabel: string;
  };

  blogPreview: {
    eyebrow: string;
    title: string;
    intro: string;
    ctaLabel: string;
    ctaHref: string;
    posts: BlogPostPreview[];
  };

  finalCta: {
    heading: string;
    body: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
};

export const homepageContent: HomepageContent = {
  heroVariant: 'A',

  hero: {
    kicker: 'Healthcare marketing that moves numbers',
    eyebrow: 'Award-winning healthcare marketing',
    badge: 'HIPAA-trained · Medical-only since 2014',
    headingA: 'Your next <em>10,000 patients</em> are already searching.',
    headingB: "We don't do <em>general</em> marketing.\nWe do <em>medical</em> growth.",
    headingC: 'Growth, <em>prescribed</em>.',
    subA: 'Dastify Digital is the growth engine behind 120+ medical practices — turning search intent into booked appointments with measurable, HIPAA-safe campaigns.',
    subB: 'SEO, paid media, reputation, and reporting — built exclusively for medical practices since 2014. Every dollar tracked from click to booked appointment.',
    subC: '120+ medical practices trust Dastify Digital to turn search intent into booked appointments — with full-funnel attribution and zero compliance risk.',
    primaryCta: { label: 'Get your free growth audit', href: '/book-session' },
    secondaryCta: { label: 'See real results', href: '/case-studies' },
    phone: '(770) 462-4237',
    proofStats: [
      { value: '94%', label: 'avg traffic lift' },
      { value: '$6.80', label: 'cost per urgent visit' },
      { value: '120+', label: 'practices served' },
      { value: '10+', label: 'years medical-only' },
    ],
    statTiles: [
      { value: '575%', label: 'Ad conversion lift', sublabel: 'Tennessee Orthopaedic Alliance' },
      { value: '94%', label: 'Avg organic traffic growth', sublabel: 'Across 120+ practices' },
      { value: '$6.80', label: 'Cost per urgent care visit', sublabel: 'Midlands Orthopaedics' },
      { value: '23.4%', label: 'More booked consults / month', sublabel: 'HOPCO Orthopedics' },
    ],
    ticker: [
      '+575% conversions',
      '+94% traffic',
      '$6.80 per visit',
      '+312% organic leads',
      '10 yrs medical focus',
    ],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80&auto=format&fit=crop',
    imageAlt: 'Healthcare digital marketing',
    trustLogosLabel: 'Recognized by',
    trustLogos: [
      { slug: 'bis-seo', label: 'Best in Search' },
      { slug: 'google-partner', label: 'Google Partner' },
      { slug: 'upcity-top', label: 'UpCity Top Digital Agency' },
      { slug: 'clutch-top', label: 'Clutch Top SEO Company' },
      { slug: 'seoblog-top', label: 'SEO Blog Top Rated' },
    ],
  },

  trustBar: {
    label: 'Trusted by 120+ medical practices',
    logos: ['ORTHO TENNESSEE', 'CONA', 'MIDLANDS ORTHO', 'HOPCO', 'CVR MEDICAL', 'SUMMIT HEALTH'],
  },

  services: {
    eyebrow: 'What we do',
    titleLead: 'Six disciplines.',
    titleEm: 'One obsession: patient volume',
    titleTail: '.',
    intro: "Every service is built for medical practices — we don't do restaurants, we don't do retail. That focus is our edge.",
    items: [
      {
        icon: 'search',
        name: 'Medical SEO',
        description: 'Dominate the first page for your highest-revenue procedures — not just your brand name. Specialty-specific keyword strategy, technical optimization, and local authority building.',
      },
      {
        icon: 'bolt',
        name: 'Paid Media',
        description: 'Google Ads, Meta, and programmatic campaigns with real-time ROI tracking. Every dollar mapped from click to booked appointment.',
      },
      {
        icon: 'users',
        name: 'Social & Content',
        description: 'Physician-led social strategy and educational content that builds trust before the first visit. White-glove production for busy practices.',
      },
      {
        icon: 'spark',
        name: 'Custom Websites',
        description: 'Conversion-engineered medical websites with ADA compliance, fast load times, and booking integrations that reduce front-desk friction.',
      },
      {
        icon: 'shield',
        name: 'Reputation Management',
        description: 'Review generation, listing accuracy, and physician trust signals across 80+ directories. Your online reputation, actively managed.',
      },
      {
        icon: 'chart',
        name: 'Reporting & Attribution',
        description: 'Lead-to-patient attribution wired into your EHR. Know exactly which campaigns drive booked surgeries, not just form fills.',
      },
    ],
  },

  growthFunnel: {
    eyebrow: 'Not an Average Digital Marketing Agency',
    titleLead: 'We created a 4-step',
    titleEm: '<em>Growth Funnel</em> for Healthcare',
    intro:
      'From ambitious clinics to hyperscaling provider groups, we engineer smarter healthcare marketing that outperforms generic agencies.',
    ctaLabel: 'Get a Tailored Marketing Plan',
    ctaHref: '/book-session',
    steps: [
      {
        num: '01',
        title: 'Foundation & Awareness',
        sub: 'Build Your Brand',
        desc: 'Create a strong, memorable brand that patients recognize and trust.',
        items: [
          { n: 'Branding & Identity', d: 'Craft a distinctive healthcare brand that resonates with your ideal patients.' },
          { n: 'Graphic & Logo Design', d: 'Professional visual assets that convey trust, credibility, and medical expertise.' },
          { n: 'Content Marketing', d: 'Educational blogs, guides, and articles that establish thought leadership.' },
          { n: 'Email Marketing', d: 'Nurture sequences that keep your practice top-of-mind with prospects.' },
          { n: 'Video Marketing', d: 'Patient testimonials, procedure explainers, and doctor profiles that humanize your brand.' },
        ],
      },
      {
        num: '02',
        title: 'Visibility & Discovery',
        sub: 'Get Found Online',
        desc: 'Dominate search results and appear exactly where patients are looking.',
        items: [
          { n: 'SEO', d: 'Rank #1 for high-intent keywords like “dentist near me” or “orthopedic surgeon.”' },
          { n: 'Website Design & Dev', d: 'Fast, mobile-first, HIPAA-compliant websites that convert visitors into appointments.' },
          { n: 'Local SEO & GBP', d: 'Dominate the local map pack and drive foot traffic from nearby patients.' },
          { n: 'Medical Copywriting', d: 'Compelling, compliant website copy that speaks to patient pain points.' },
        ],
      },
      {
        num: '03',
        title: 'Conversion & Acquisition',
        sub: 'Drive Patient Appointments',
        desc: 'Turn online visibility into booked appointments with targeted campaigns.',
        items: [
          { n: 'Medical PPC / Google Ads', d: 'High-ROI paid search campaigns targeting patients actively seeking care.' },
          { n: 'Social Media Ads', d: 'Precision-targeted Facebook & Instagram ads for new patient acquisition.' },
          { n: 'Landing Page Optimization', d: 'Conversion-focused pages that turn clicks into confirmed appointments.' },
          { n: 'Analytics & Tracking', d: 'Full-funnel attribution so you know exactly which campaigns drive revenue.' },
        ],
      },
      {
        num: '04',
        title: 'Loyalty & Growth',
        sub: 'Engage & Retain',
        desc: 'Build lasting relationships, earn 5-star reviews, and turn patients into referral sources.',
        items: [
          { n: 'Social Media Management', d: 'Consistent, engaging social presence that builds community and trust.' },
          { n: 'Reputation Management', d: 'Proactive review generation and monitoring across Google, Healthgrades, and Yelp.' },
          { n: 'Patient Retention', d: 'Automated recall, re-engagement, and loyalty email sequences.' },
          { n: 'Referral Programs', d: 'Structured referral systems that turn happy patients into your best marketers.' },
          { n: 'SMS & WhatsApp', d: 'Appointment reminders and follow-ups that reduce no-shows by up to 40%.' },
        ],
      },
    ],
  },

  results: {
    eyebrow: 'Proof, not promises',
    titleLead: 'Results that survive',
    titleTail: 'a board meeting.',
    intro: 'Real numbers from real practices. Every metric tracked from first click to seated patient.',
    ctaLabel: 'View all case studies',
    ctaHref: '/case-studies',
    cards: [
      {
        client: 'Tennessee Orthopaedic Alliance',
        value: '+575%',
        label: 'Ad conversions in 12 months',
        barPercent: 87,
        featured: true,
        subStats: [
          { value: '2.3', label: 'ROAS' },
          { value: '$42', label: 'cost/booked' },
          { value: '1284', label: 'leads/mo' },
        ],
      },
      { client: 'CONA Orthopedics', value: '+312%', label: 'Organic leads, 8 months', barPercent: 72 },
      { client: 'Midlands Orthopaedics', value: '$6.80', label: 'Per urgent care visit', barPercent: 65 },
      { client: 'HOPCO Orthopedics', value: '+23.4%', label: 'Booked consults per month', barPercent: 58 },
    ],
  },

  testimonial: {
    quoteLead: 'For everything a practice needs an expert on, Dastify ',
    quoteEm: 'shows up',
    quoteTail: '. They speak the language of medicine and the language of growth — and that combination is incredibly rare.',
    authorInitials: 'KP',
    authorName: 'Kristy Parker, MBA',
    authorRole: 'Marketing Director · Tennessee Orthopaedic Alliance',
  },

  weServe: {
    eyebrow: 'Who We Serve',
    titleLead: 'Our Medical Specialties',
    titleEm: 'of Focus',
    intro: 'Tailored strategies for the unique patient journeys, compliance needs, and competitive landscapes of each specialty.',
    specialties: [
      { icon: 'heart', name: 'Cosmetic & Aesthetic Clinics' },
      { icon: 'stethoscope', name: 'Dental Practices' },
      { icon: 'pulse', name: 'Fertility & IVF Clinics' },
      { icon: 'spark', name: 'Plastic & Reconstructive Surgery' },
      { icon: 'bolt', name: 'Orthopedic & Sports Medicine' },
      { icon: 'shield', name: 'Dermatology Clinics' },
      { icon: 'users', name: 'Mental Health & Behavioral Health' },
      { icon: 'calendar', name: 'Telehealth & Virtual Care' },
      { icon: 'pulse', name: 'Cardiology' },
    ],
    noteLead: "Can't find yours? We work with all healthcare verticals.",
    noteLink: 'Tell us about yours',
  },

  aboutPreview: {
    eyebrow: 'Who we are',
    titleLead: 'Medical marketing',
    titleTail: 'is all we do.',
    body: 'Since 2014, Dastify Digital has worked exclusively with healthcare organizations — orthopedic groups, med spas, urgent care networks, and PE-backed platforms. That singular focus means deeper benchmarks, faster ramp, and strategies that actually fit the compliance reality of medicine.',
    stats: [
      { value: '10+', label: 'Years medical-only' },
      { value: '120+', label: 'Practices served' },
      { value: '48', label: 'States covered' },
    ],
    ctaLabel: 'Meet the team',
    ctaHref: '/about',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=900&q=80&auto=format&fit=crop',
    imageAlt: 'Dastify Digital team',
  },

  pricing: {
    eyebrow: 'Transparent Pricing',
    titleLead: 'No Hidden Fees.',
    titleEm: 'No Surprises.',
    intro: 'Simple monthly plans built for medical practices. Every plan includes onboarding, reporting, and a dedicated account manager.',
    monthlyLabel: 'Monthly',
    annualLabel: 'Annual',
    annualSavingsLabel: '-15%',
    plans: [
      {
        name: 'Starter',
        icon: 'search',
        priceMonthly: 2990,
        priceAnnual: 2500,
        description: 'For single-location practices ready to get found online.',
        color: 'primary',
        features: [
          'Local SEO & GBP Optimization',
          'Basic Website Audit & Fixes',
          'Review Generation Setup',
          'Monthly Performance Report',
          '1 Dedicated Account Manager',
        ],
        ctaLabel: 'Get Started',
        ctaHref: '/book-session',
      },
      {
        name: 'Growth',
        icon: 'chart',
        priceMonthly: 6990,
        priceAnnual: 5800,
        description: 'For practices serious about dominating their market.',
        badge: 'Most Popular',
        featured: true,
        color: 'accent',
        features: [
          'Everything In Starter',
          'Full Medical SEO Program',
          'Google & Meta Ads Management',
          'Content Marketing (4 Pieces/Mo)',
          'Reputation Management',
          'Landing Page Optimization',
          'Bi-Weekly Strategy Calls',
        ],
        ctaLabel: 'Get Started',
        ctaHref: '/book-session',
      },
      {
        name: 'Dominate',
        icon: 'bolt',
        priceMonthly: 12500,
        priceAnnual: 10500,
        description: 'For multi-location groups & PE-backed platforms.',
        badge: 'Best ROI',
        color: 'support',
        features: [
          'Everything In Growth',
          'Multi-Location SEO',
          'Full-Funnel Paid Media',
          'Custom Website Development',
          'EHR & CRM Integration',
          'Weekly Reporting & Analytics',
          'Dedicated Growth Team (3 Specialists)',
          'HIPAA Compliance Audit',
        ],
        ctaLabel: 'Get Started',
        ctaHref: '/book-session',
      },
    ],
    footnoteLead: 'All plans include a free onboarding audit. Prices in USD. Custom enterprise pricing available for hospital systems and PE-backed groups.',
    footnoteLinkLabel: 'Contact Us',
    footnoteLinkHref: '/contact',
  },

  blogPreview: {
    eyebrow: 'Resources',
    title: 'Thinking that earns its keep.',
    intro: 'Tactical guides, benchmarks, and frameworks — written for practice administrators and marketing directors, not interns.',
    ctaLabel: 'View all resources',
    ctaHref: '/blog',
    posts: [
      {
        tag: 'SEO',
        title: "The 2026 Medical SEO Playbook: What Changed and What Didn't",
        readTime: '8 min read',
      },
      {
        tag: 'Paid Media',
        title: 'Why Your Cost-Per-Lead Is Lying to You (And What to Track Instead)',
        readTime: '5 min read',
      },
      {
        tag: 'Reputation',
        title: 'From 3.2 to 4.8 Stars: A 90-Day Physician Review Strategy',
        readTime: '6 min read',
      },
    ],
  },

  finalCta: {
    heading: 'Ready to speak to a patient growth expert?',
    body: "A 30-minute assessment with no obligation. We'll audit your current program and show you three places to move first.",
    primaryCta: { label: 'Book a growth session', href: '/book-session' },
    secondaryCta: { label: '(770) 462-4237', href: 'tel:7704624237' },
  },
};
