export type PageContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    logoText: string;
    logoAccent: string;
    links: { label: string; href: string; active?: boolean }[];
    ctaLabel: string;
    ctaHref: string;
  };
  hero: {
    chip: string;
    title: string;
    lead: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    placeholderIcon: string;
    placeholderLabel: string;
    placeholderDimensions: string;
    marqueeItems: string[];
  };
  services: {
    chip: string;
    title: string;
    intro: string;
    items: {
      id: string;
      number: string;
      name: string;
      tagline: string;
      outcomesTitle: string;
      outcomes: string[];
      description: string;
      cta: { label: string; href: string };
    }[];
  };
  results: {
    headline: string;
    stats: { value: string; label: string }[];
  };
  why: {
    chip: string;
    title: string;
    lead: string;
    cards: { icon: string; title: string; description: string }[];
  };
  process: {
    chip: string;
    title: string;
    intro: string;
    steps: { number: string; title: string; description: string }[];
    placeholderIcon: string;
    placeholderLabel: string;
    placeholderDimensions: string;
  };
  cta: {
    title: string;
    subtext: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  footer: {
    logoText: string;
    logoAccent: string;
    tagline: string;
    columns: {
      title: string;
      links: { label: string; href: string }[];
    }[];
    copyright: string;
    legalLinks: { label: string; href: string }[];
  };
};

export const defaultContent: ServicesConvertContent = {
  "meta": {
    "title": "Services — Dastify Digital | Healthcare Marketing That Fills Schedules",
    "description": "Six HIPAA-compliant marketing services built for healthcare. SEO, PPC, content, social, web design, and reputation management — all measured in patients, not pageviews."
  },
  "nav": {
    "logoText": "Dastify",
    "logoAccent": ".Digital",
    "links": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "About",
        "href": "/about"
      },
      {
        "label": "Services",
        "href": "/services",
        "active": true
      },
      {
        "label": "Work",
        "href": "/work"
      },
      {
        "label": "Insights",
        "href": "/insights"
      },
      {
        "label": "Contact",
        "href": "/contact"
      }
    ],
    "ctaLabel": "Book a Call",
    "ctaHref": "/contact"
  },
  "hero": {
    "chip": "Healthcare Marketing Services",
    "title": "Six Services.\nOne Goal: More Patients.",
    "lead": "Every service is built for healthcare. HIPAA-compliant tracking. Patient journey mapping. Revenue attribution you can actually trust. No generalist guesswork—just measurable growth.",
    "primaryCta": {
      "label": "Explore Services ↓",
      "href": "#services"
    },
    "secondaryCta": {
      "label": "Book a Strategy Call",
      "href": "/contact"
    },
    "placeholderIcon": "📊",
    "placeholderLabel": "Hero Visual",
    "placeholderDimensions": "520 × 480px",
    "marqueeItems": [
      "Healthcare SEO",
      "•",
      "Medical PPC",
      "•",
      "Content Marketing",
      "•",
      "Social Media",
      "•",
      "Website Design",
      "•",
      "Reputation Management",
      "•"
    ]
  },
  "services": {
    "chip": "What We Do",
    "title": "Full-funnel healthcare marketing—built for compliance.",
    "intro": "Click any service to see what's included and the outcomes we deliver.",
    "items": [
      {
        "id": "seo",
        "number": "01",
        "name": "Healthcare SEO",
        "tagline": "Get found when patients search for your services",
        "outcomesTitle": "What You Get",
        "outcomes": [
          "Local SEO optimization for multi-location practices",
          "Medical schema markup and structured data",
          "HIPAA-compliant analytics and tracking setup",
          "Condition and procedure page optimization",
          "Google Business Profile management",
          "Monthly ranking reports tied to patient volume"
        ],
        "description": "Patients searching for \"orthopedic surgeon near me\" or \"best dermatologist Dallas\" should find you first. We make that happen—with SEO built for healthcare's unique ranking factors.",
        "cta": {
          "label": "Learn More →",
          "href": "/services/seo"
        }
      },
      {
        "id": "ppc",
        "number": "02",
        "name": "Medical PPC & Paid Media",
        "tagline": "High-intent patients, compliant campaigns, real ROI",
        "outcomesTitle": "What You Get",
        "outcomes": [
          "Google Ads campaigns with healthcare policy compliance",
          "Meta (Facebook/Instagram) ads with LegitScript certification",
          "HIPAA-compliant conversion tracking and attribution",
          "Landing pages optimized for appointment booking",
          "Geo-targeting for service area precision",
          "Weekly optimization and transparent cost reporting"
        ],
        "description": "Healthcare PPC is full of landmines—disapproved ads, tracking restrictions, compliance headaches. We navigate all of it so you can focus on what matters: more patients calling.",
        "cta": {
          "label": "Learn More →",
          "href": "/services/ppc"
        }
      },
      {
        "id": "content",
        "number": "03",
        "name": "Healthcare Content Marketing",
        "tagline": "Educational content that builds trust and ranks",
        "outcomesTitle": "What You Get",
        "outcomes": [
          "Physician-reviewed blog content and articles",
          "Condition and treatment educational pages",
          "Patient FAQ libraries optimized for voice search",
          "Email nurture sequences for patient retention",
          "Video scripts and production guidance",
          "Content calendars aligned with seasonal demand"
        ],
        "description": "Patients research before they book. Our content answers their questions, builds authority, and guides them to your practice—not your competitor's.",
        "cta": {
          "label": "Learn More →",
          "href": "/services/content"
        }
      },
      {
        "id": "social",
        "number": "04",
        "name": "Social Media Marketing",
        "tagline": "Build community and humanize your practice",
        "outcomesTitle": "What You Get",
        "outcomes": [
          "Platform-specific content strategies (Instagram, Facebook, LinkedIn)",
          "Physician thought leadership positioning",
          "Patient testimonial and UGC campaigns (HIPAA-compliant)",
          "Community management and engagement",
          "Paid social advertising integration",
          "Monthly analytics tied to practice goals"
        ],
        "description": "Social media for healthcare isn't about going viral. It's about building trust, showcasing your team, and staying top-of-mind when patients need you.",
        "cta": {
          "label": "Learn More →",
          "href": "/services/social"
        }
      },
      {
        "id": "web",
        "number": "05",
        "name": "Medical Website Design",
        "tagline": "Fast, accessible, conversion-optimized sites",
        "outcomesTitle": "What You Get",
        "outcomes": [
          "Custom website design built for patient conversion",
          "Mobile-first, WCAG 2.1 AA accessible development",
          "Online scheduling and patient portal integration",
          "Provider profile pages optimized for SEO",
          "HIPAA-compliant forms and secure data handling",
          "Ongoing maintenance and performance monitoring"
        ],
        "description": "Your website is your 24/7 front desk. We build sites that load fast, look professional, and make it effortless for patients to book—on any device.",
        "cta": {
          "label": "Learn More →",
          "href": "/services/web"
        }
      },
      {
        "id": "reputation",
        "number": "06",
        "name": "Reputation Management",
        "tagline": "Turn happy patients into 5-star reviews",
        "outcomesTitle": "What You Get",
        "outcomes": [
          "Automated review request workflows (SMS + email)",
          "Multi-platform monitoring (Google, Healthgrades, Vitals, Yelp)",
          "Professional response templates and crisis management",
          "Review generation campaigns tied to patient visits",
          "Competitive benchmarking and sentiment analysis",
          "Monthly reputation health reports"
        ],
        "description": "87% of patients check reviews before booking. We help you systematically collect positive reviews while managing the occasional negative one with grace.",
        "cta": {
          "label": "Learn More →",
          "href": "/services/reputation"
        }
      }
    ]
  },
  "results": {
    "headline": "Real results from healthcare practices like yours.",
    "stats": [
      {
        "value": "+309%",
        "label": "Organic Traffic"
      },
      {
        "value": "8.2x",
        "label": "PPC ROI"
      },
      {
        "value": "4.8★",
        "label": "Avg. Client Rating"
      }
    ]
  },
  "why": {
    "chip": "Why It Matters",
    "title": "Healthcare marketing isn't regular marketing.",
    "lead": "Generic agencies learn your industry on your dime. We already know it—because we've worked inside it. Here's what makes healthcare different.",
    "cards": [
      {
        "icon": "🔒",
        "title": "HIPAA Compliance",
        "description": "Tracking pixels, form data, remarketing audiences—all require PHI-safe handling. One mistake can mean a breach."
      },
      {
        "icon": "📋",
        "title": "Platform Restrictions",
        "description": "Google and Meta have specific healthcare ad policies. We know them cold—and how to work within them."
      },
      {
        "icon": "🏥",
        "title": "Patient Journeys",
        "description": "A dermatology patient researches differently than a bariatric surgery candidate. We map every touchpoint."
      },
      {
        "icon": "📊",
        "title": "Revenue Attribution",
        "description": "Impressions don't pay bills. We connect marketing spend to actual appointments and patient revenue."
      }
    ]
  },
  "process": {
    "chip": "How We Work",
    "title": "From audit to acceleration in 5 steps.",
    "intro": "Every engagement starts with understanding your practice, your patients, and your goals.",
    "steps": [
      {
        "number": "1",
        "title": "Market Audit",
        "description": "We study your competitors, your patients, and your current marketing performance."
      },
      {
        "number": "2",
        "title": "Strategy",
        "description": "Campaign structure, channel selection, compliance framework—all built for your goals."
      },
      {
        "number": "3",
        "title": "Build",
        "description": "Copy, design, landing pages, tracking—everything built to healthcare standards."
      },
      {
        "number": "4",
        "title": "Launch",
        "description": "Phased rollout with real-time monitoring to catch issues before they cost you."
      },
      {
        "number": "5",
        "title": "Optimize",
        "description": "Monthly reviews, data-driven iteration, and continuous improvement."
      }
    ],
    "placeholderIcon": "🎯",
    "placeholderLabel": "Process Visual",
    "placeholderDimensions": "480 × 520px"
  },
  "cta": {
    "title": "Ready to see what these\nservices look like for you?",
    "subtext": "30 minutes. No pitch deck. We'll audit your current marketing and show you where the opportunities are.",
    "primaryCta": {
      "label": "Book a Strategy Call →",
      "href": "/contact"
    },
    "secondaryCta": {
      "label": "See Case Studies",
      "href": "/work"
    }
  },
  "footer": {
    "logoText": "Dastify",
    "logoAccent": ".Digital",
    "tagline": "The creative authority for healthcare growth. HIPAA-compliant, AI-powered, obsessively measurable.",
    "columns": [
      {
        "title": "Services",
        "links": [
          {
            "label": "Healthcare SEO",
            "href": "/services/seo"
          },
          {
            "label": "Medical PPC",
            "href": "/services/ppc"
          },
          {
            "label": "Content Marketing",
            "href": "/services/content"
          },
          {
            "label": "Social Media",
            "href": "/services/social"
          },
          {
            "label": "Website Design",
            "href": "/services/web"
          },
          {
            "label": "Reputation Management",
            "href": "/services/reputation"
          }
        ]
      },
      {
        "title": "Verticals",
        "links": [
          {
            "label": "Specialty Practices",
            "href": "/verticals/specialty"
          },
          {
            "label": "Dental & DSOs",
            "href": "/verticals/dental"
          },
          {
            "label": "Behavioral Health",
            "href": "/verticals/behavioral"
          },
          {
            "label": "Senior Care",
            "href": "/verticals/senior"
          },
          {
            "label": "Urgent Care",
            "href": "/verticals/urgent"
          },
          {
            "label": "Med Spas",
            "href": "/verticals/medspa"
          }
        ]
      },
      {
        "title": "Contact",
        "links": [
          {
            "label": "Book a Strategy Call",
            "href": "/contact"
          },
          {
            "label": "hello@dastify.digital",
            "href": "/contact"
          },
          {
            "label": "Careers",
            "href": "/careers"
          },
          {
            "label": "About Us",
            "href": "/about"
          }
        ]
      }
    ],
    "copyright": "© 2026 Dastify Digital. All rights reserved.",
    "legalLinks": [
      {
        "label": "Privacy Policy",
        "href": "/privacy"
      },
      {
        "label": "Terms of Service",
        "href": "/terms"
      },
      {
        "label": "HIPAA Compliance",
        "href": "/hipaa"
      }
    ]
  }
};