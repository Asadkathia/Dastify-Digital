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
    cyclingWords: string[];
    sub: string;
    pills: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    image: { src: string; alt: string };
    trustLabel: string;
    trustLogos: { slug: string; alt: string; image?: string }[];
  }>;
  stats: EditableSection<{
    label: string;
    items: { value: string; arrow: '↑' | '↓' | null; label: string; color: 'primary' | 'accent' | 'support' }[];
  }>;
  comparison: EditableSection<{
    eyebrow: string;
    heading: string;
    intro: string;
    badHeader: string;
    goodHeader: string;
    rows: { bad: string; good: string; goodSub: string; icon: string }[];
    cta: { label: string; href: string };
  }>;
  whyDifferent: EditableSection<{
    eyebrow: string;
    heading: string;
    intro: string;
    challenges: { icon: string; title: string; problem: string; solution: string }[];
  }>;
  formula: EditableSection<{
    eyebrow: string;
    items: { icon: string; title: string; desc: string }[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  }>;
  setsApart: EditableSection<{
    eyebrow: string;
    heading: string;
    items: { icon: string; title: string; desc: string }[];
  }>;
  process: EditableSection<{
    heading: string;
    steps: { title: string; desc: string }[];
  }>;
  ctaBanner: EditableSection<{
    heading: string;
    sub: string;
    bullets: string[];
    cta: { label: string; href: string };
  }>;
  specialties: EditableSection<{
    eyebrow: string;
    heading: string;
    intro: string;
    tabs: { slug: string; label: string; headline: string; description: string; bullets: string[] }[];
    note: string;
    noteCta: { label: string; href: string };
  }>;
  faqs: EditableSection<{
    eyebrow: string;
    heading: string;
    items: { q: string; a: string }[];
  }>;
};

export const defaultContent: PageContent = {
  meta: {
    title: 'Healthcare Marketing Services — Dastify Digital',
    description:
      'AI-Powered Healthcare Digital Marketing Services. Strategic, focused, results-driven campaigns that bring high-intent patients to your practice.',
  },
  hero: {
    badge: 'Growth Agency',
    heading: 'AI-Powered Healthcare\nDigital Marketing Services',
    cyclingWords: ['Strategic.', 'Focused.', 'Results-Driven Digital'],
    sub: 'Dastify Digital puts your healthcare practice at the top of search results. Our award-winning digital marketing blends a status quo approach with technology-driven campaigns that attract the right patients, increase appointments, and deliver measurable ROI.',
    pills: ['Maximize Online Visibility', 'HIPAA Compliant', 'Award-Winning', 'Proven ROI & Lead Growth'],
    primaryCta: { label: 'Get your Free Growth Audit', href: '/contact' },
    secondaryCta: { label: 'See Real Results', href: '/case-studies' },
    image: { src: '', alt: 'Healthcare marketing dashboard' },
    trustLabel: 'Recognized by',
    trustLogos: [
      { slug: 'best-in-search', alt: 'Best in Search - TopSEOs', image: '' },
      { slug: 'google-partner', alt: 'Google Partner' },
      { slug: 'upcity-top', alt: 'UpCity Top Digital Agency' },
      { slug: 'clutch-top', alt: 'Clutch Top SEO Company Medical 2024' },
      { slug: 'seoblog-top', alt: 'SEO Blog Top Rated' },
    ],
  },
  stats: {
    label: 'Marketing That Talks Less, Converts More',
    items: [
      { value: '35%', arrow: '↑', label: 'Increase conversion', color: 'support' },
      { value: '50%', arrow: '↑', label: 'Improve engagement', color: 'primary' },
      { value: '30%', arrow: '↓', label: 'Decrease in CPC', color: 'accent' },
      { value: '1000+', arrow: null, label: 'Satisfied Customers', color: 'support' },
      { value: '95%', arrow: null, label: 'Client Retention Rate', color: 'primary' },
      { value: '$50M+', arrow: null, label: 'Revenue Generated', color: 'accent' },
    ],
  },
  comparison: {
    eyebrow: 'Want to Become the Practice Patients Find First?',
    heading: 'Get Ranked. Get Booked.\n<em>Grow Faster.</em>',
    intro:
      'Generic campaigns waste money. We build AI-powered, custom digital marketing for healthcare — campaigns that speak directly to your patients, resonate with your specialty, and convert searches into booked appointments.',
    badHeader: 'What Generic Marketing Gives You',
    goodHeader: 'How Dastify Boosts ROI',
    rows: [
      {
        bad: 'Patients Can’t Find You — Competitors Win Appointments',
        good: 'Front-Page Domination',
        goodSub: 'SEO & Google Maps strategy that puts your practice in front of high-intent patients fast.',
        icon: 'search',
      },
      {
        bad: 'Ads Don’t Convert & Drain Your Budget',
        good: 'ROI-Driven PPC Campaigns',
        goodSub: 'AI-driven, HIPAA-safe ads that bring high-intent patients straight to your schedule.',
        icon: 'bolt',
      },
      {
        bad: 'Your Website Loses Visitors — Bad UX',
        good: 'Conversion-Optimized Funnels',
        goodSub: 'Patient-focused optimized websites that turn visitors into scheduled appointments.',
        icon: 'spark',
      },
      {
        bad: 'Few Reviews, Low Trust, No New Patients',
        good: 'Automated Reviews',
        goodSub: 'Smart AI patient acquisition and 5-star review automation.',
        icon: 'shield',
      },
      {
        bad: 'No Marketing Clarity, Zero Transparency',
        good: 'Live Dashboards & Analytics',
        goodSub: 'Show exactly which campaigns bring patients and revenue.',
        icon: 'chart',
      },
    ],
    cta: { label: 'Book Your Practice Growth Plan Today', href: '/contact' },
  },
  whyDifferent: {
    eyebrow: 'Why is it different?',
    heading: 'Healthcare Marketing is Not\nEveryone’s <em>Cup of Tea</em>',
    intro:
      'Healthcare marketing demands compliance expertise, patient trust, and precision strategy. Dastify Digital brings all three together.',
    challenges: [
      {
        icon: 'shield',
        title: 'HIPAA & Compliance Risks',
        problem: 'One wrong ad, testimonial, or unsecured form can trigger serious legal and financial penalties.',
        solution: 'We build campaigns aligned with HIPAA, PHI handling, BAAs, and healthcare advertising regulations.',
      },
      {
        icon: 'calendar',
        title: 'Constantly Changing Regulations',
        problem: 'Google healthcare ad policies, state medical board rules, and platform restrictions change frequently.',
        solution: 'Our team tracks updates continuously so your campaigns stay compliant and up to date.',
      },
      {
        icon: 'heart',
        title: 'High Patient Trust Barrier',
        problem: 'Patients aren’t making casual purchases — they’re choosing someone to trust with their health.',
        solution: 'We create messaging that builds clinical credibility, empathy, and patient confidence.',
      },
      {
        icon: 'search',
        title: 'Long Patient Decision Cycles',
        problem: 'Healthcare decisions often involve weeks or months of research and comparison.',
        solution: 'We design education-driven funnels that guide patients from the first search to an appointment.',
      },
      {
        icon: 'users',
        title: 'Multiple Decision Makers',
        problem: 'Patients often consult family members, caregivers, and referring physicians before choosing.',
        solution: 'Our data-driven marketing addresses all stakeholders’ concerns in the decision-making process.',
      },
      {
        icon: 'chart',
        title: 'Reputation Driven Industry',
        problem: 'Online reviews and patient feedback can shape a practice’s credibility overnight.',
        solution: 'We manage and strengthen your reputation through review monitoring and patient experience strategies.',
      },
    ],
  },
  formula: {
    eyebrow: 'That’s the Dastify Formula',
    items: [
      {
        icon: 'search',
        title: 'Be Found',
        desc: 'We create digital pathways that put your practice front and center in search results.',
      },
      {
        icon: 'shield',
        title: 'Be Trusted',
        desc: 'We craft stories, content, and experiences that make patients feel confident in choosing you.',
      },
      {
        icon: 'check',
        title: 'Be Chosen',
        desc: 'We design seamless journeys that turn patient trust into booked appointments.',
      },
    ],
    primaryCta: { label: 'Go Digital Today', href: '/contact' },
    secondaryCta: { label: 'Free Website & SEO Audit', href: '/contact' },
  },
  setsApart: {
    eyebrow: 'A Sneak Peek into our Growth Lab',
    heading: 'What Sets Us <em>Apart</em>?',
    items: [
      {
        icon: 'stethoscope',
        title: 'Healthcare-Only, Patient-Focused',
        desc: 'We live and breathe healthcare digital marketing — every tactic is designed to attract, educate, and convert real patients.',
      },
      {
        icon: 'bolt',
        title: 'AI-Powered Smarts',
        desc: 'From automated campaigns to intelligent optimization, our predictive analytics makes strategies sharper, faster, and more effective.',
      },
      {
        icon: 'users',
        title: 'Dedicated Growth Team',
        desc: 'Your practice gets a personal marketing squad and dedicated account managers who know your goals, your patients, and your specialty inside out.',
      },
      {
        icon: 'chart',
        title: 'Total Transparency',
        desc: 'No smoke, no mirrors. See every campaign in real time with intuitive dashboards and our AI-powered healthcare CRM.',
      },
      {
        icon: 'shield',
        title: 'Compliance Without Compromise',
        desc: 'We navigate FDA, FTC, and state advertising rules so your campaigns stay compliant and your reputation stays untouchable.',
      },
    ],
  },
  process: {
    heading: 'Your Digital Growth is\n<em>Just 4 Steps</em> Away',
    steps: [
      {
        title: 'Discovery & Audit',
        desc: 'We analyze your digital presence, competitors, and patient behavior to identify growth opportunities.',
      },
      {
        title: 'Custom Strategy',
        desc: 'Build a tailored healthcare marketing plan aligned with your patient growth goals.',
      },
      {
        title: 'Launch & Execute',
        desc: 'Deploy SEO, ads, social, and email campaigns with HIPAA-compliant execution.',
      },
      {
        title: 'Optimize & Scale',
        desc: 'Track performance, run A/B tests, and continuously optimize to maximize ROI.',
      },
    ],
  },
  ctaBanner: {
    heading: 'Ready to Become the #1 Healthcare Practice in Your Area?',
    sub: 'Proudly serving all 50 states.',
    bullets: [
      'Free 30-minute strategy session',
      'Custom patient growth roadmap',
      'Competitor analysis included',
      'No obligation, no pressure',
    ],
    cta: { label: 'Book Your Free Session', href: '/contact' },
  },
  specialties: {
    eyebrow: 'Who Do We Serve?',
    heading: 'Built for High-Growth\n<em>Medical Specialties</em>',
    intro:
      'Our strategies are tailored to the unique patient journeys, compliance needs, and competitive landscapes of each specialty.',
    // TODO(copy): per-specialty descriptions/bullets are not in the design source — placeholder text below.
    tabs: [
      {
        slug: 'cosmetic',
        label: 'Cosmetic & Aesthetic',
        headline: 'Cosmetic & Aesthetic Clinics',
        description: 'Patient acquisition strategies tuned for elective, high-consideration aesthetic procedures.',
        bullets: ['Visual-first social campaigns', 'Before/after showcase funnels', 'Consultation booking optimization'],
      },
      {
        slug: 'dental',
        label: 'Dental',
        headline: 'Dental Practices',
        description: 'Local dominance and recall systems built for dental practices and DSOs.',
        bullets: ['Local SEO & GBP optimization', 'Implant & aligner campaigns', 'Recall & reactivation automation'],
      },
      {
        slug: 'fertility',
        label: 'Fertility & IVF',
        headline: 'Fertility & IVF Clinics',
        description: 'Empathy-driven, education-led marketing for long, high-stakes patient decisions.',
        bullets: ['Education-driven content funnels', 'HIPAA-safe inquiry forms', 'Long-cycle nurture sequences'],
      },
      {
        slug: 'plastic',
        label: 'Plastic Surgery',
        headline: 'Plastic & Reconstructive Surgery',
        description: 'High-trust marketing for elective and reconstructive surgical practices.',
        bullets: ['Surgeon authority content', 'Procedure-specific landing pages', 'Reputation management'],
      },
      {
        slug: 'orthopedic',
        label: 'Orthopedic & Sports',
        headline: 'Orthopedic & Sports Medicine',
        description: 'Multi-location SEO and referral channel growth for ortho groups.',
        bullets: ['Multi-location local SEO', 'Referring-physician outreach', 'Procedure-specific PPC'],
      },
      {
        slug: 'dermatology',
        label: 'Dermatology',
        headline: 'Dermatology Clinics',
        description: 'Balanced medical and cosmetic dermatology patient acquisition.',
        bullets: ['Cosmetic + medical funnel split', 'Skin condition content hubs', 'Annual skin-check recall'],
      },
      {
        slug: 'mental-health',
        label: 'Mental Health',
        headline: 'Mental Health & Behavioral Health',
        description: 'Compliant, sensitive marketing for behavioral and mental health providers.',
        bullets: ['Stigma-aware messaging', 'Insurance-aware funnels', 'Telehealth intake optimization'],
      },
      {
        slug: 'telehealth',
        label: 'Telehealth',
        headline: 'Telehealth & Virtual Care',
        description: 'Conversion-first marketing for virtual-care brands competing on convenience.',
        bullets: ['Multi-state SEO scaling', 'Subscription + visit funnels', 'Activation & retention email'],
      },
      {
        slug: 'cardiology',
        label: 'Cardiology',
        headline: 'Cardiology',
        description: 'Trust-led campaigns for cardiology groups serving high-acuity patient populations.',
        bullets: ['Symptom-led content strategy', 'Referral physician portals', 'Compliance-first paid media'],
      },
    ],
    note: 'Can’t find yours here? We work with all healthcare verticals.',
    noteCta: { label: 'Tell Us About Yours', href: '/contact' },
  },
  faqs: {
    eyebrow: 'FAQs',
    heading: 'Common Questions,\n<em>Clear Answers</em>',
    items: [
      {
        q: 'What does a healthcare marketing agency do?',
        a: 'A healthcare marketing agency helps medical practices attract more patients through digital channels like SEO, paid advertising, website optimization, social media marketing, and reputation management — while ensuring HIPAA compliance.',
      },
      {
        q: 'What is healthcare digital marketing?',
        a: 'Healthcare digital marketing uses online strategies — SEO, Google Ads, website optimization, content marketing, social media, and reputation management — to attract, educate, and convert patients into booked appointments.',
      },
      {
        q: 'Why is healthcare marketing important for doctors and clinics?',
        a: 'Most patients search online before choosing a provider. Effective marketing improves search visibility, builds trust through reviews and educational content, and increases appointment bookings.',
      },
      {
        q: 'How long does it take to see results?',
        a: 'Paid advertising can generate patient inquiries within weeks, while SEO typically takes 3–6 months. Long-term strategies like content marketing and reputation management continue improving over time.',
      },
      {
        q: 'What are the most effective strategies in 2026?',
        a: 'Local SEO, Google Ads for high-intent searches, AI-optimized content, reputation management, website conversion optimization, and patient education content drive the highest growth.',
      },
      {
        q: 'How does marketing campaign reporting work?',
        a: 'We track website traffic, patient inquiries, call tracking, appointment bookings, and advertising ROI. Monthly reports show exactly how digital marketing contributes to patient growth.',
      },
    ],
  },
};
