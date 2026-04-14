import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
};

export type PageContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: EditableSection<{
    logo: { text: string; accent: string; href: string };
    links: { label: string; href: string; active?: boolean }[];
    cta: { label: string; href: string };
  }>;
  hero: EditableSection<{
    chip: string;
    title: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    lead: string;
    ctas: { label: string; href: string; variant: "dark" | "outline" }[];
    stats: { value: string; label: string }[];
    visual: {
      image?: string | { url?: string; alt?: string; filename?: string } | null;
      imageAlt?: string;
      imageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
      imagePosition?: string;
      imageRadius?: string;
      preservePlaceholderChrome?: boolean;
      placeholderBackground?: string;
      placeholderBorderColor?: string;
      placeholderBorderWidth?: string;
      placeholderBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
      placeholderPadding?: string;
      placeholderGap?: string;
      placeholderRadius?: string;
      placeholderShowOverlay?: boolean;
      placeholderOverlay?: string;
      placeholderLabelColor?: string;
      placeholderLabelSize?: string;
      placeholderDimColor?: string;
      placeholderDimSize?: string;
      placeholderIconSize?: string;
      icon: string;
      label: string;
      dimensions: string;
    };
    marquee: string[];
  }>;
  manifesto: EditableSection<{
    watermark: string;
    headline: string;
    headlineTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    highlight: string;
    statements: string[];
    paragraphs: string[];
  }>;
  difference: EditableSection<{
    chip: string;
    title: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    intro: string;
    cards: { number: string; title: string; description: string }[];
  }>;
  story: EditableSection<{
    watermark: string;
    chip: string;
    title: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    intro: string;
    items: { year: string; title: string; description: string }[];
  }>;
  team: EditableSection<{
    watermark: string;
    chip: string;
    title: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    description: string;
    stats: { value: string; label: string }[];
    cta: { label: string; href: string };
    visuals: {
      image?: string | { url?: string; alt?: string; filename?: string } | null;
      imageAlt?: string;
      imageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
      imagePosition?: string;
      imageRadius?: string;
      preservePlaceholderChrome?: boolean;
      placeholderBackground?: string;
      placeholderBorderColor?: string;
      placeholderBorderWidth?: string;
      placeholderBorderStyle?: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
      placeholderPadding?: string;
      placeholderGap?: string;
      placeholderRadius?: string;
      placeholderShowOverlay?: boolean;
      placeholderOverlay?: string;
      placeholderLabelColor?: string;
      placeholderLabelSize?: string;
      placeholderDimColor?: string;
      placeholderDimSize?: string;
      placeholderIconSize?: string;
      icon: string;
      label: string;
      dimensions: string;
      height: string;
      className: string;
    }[];
  }>;
  values: EditableSection<{
    chip: string;
    title: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    intro: string;
    items: { icon: string; title: string; description: string }[];
  }>;
  cta: EditableSection<{
    title: string;
    titleTag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
    subtext: string;
    buttons: { label: string; href: string; variant: "primary" | "ghost" }[];
  }>;
  footer: EditableSection<{
    brand: { name: string; accent: string; tagline: string };
    columns: { title: string; links: { label: string; href: string; highlight?: boolean }[] }[];
    copyright: string;
    legalLinks: { label: string; href: string }[];
  }>;
};

export const defaultContent: PageContent = {
  "meta": {
    "title": "About Us — Dastify Digital | The Creative Authority for Healthcare Growth",
    "description": "Meet the healthcare marketing agency that refuses to look like a hospital. We're strategists who've worked inside health systems, now building growth engines for practices that demand more."
  },
  "nav": {
    "logo": {
      "text": "Dastify",
      "accent": ".Digital",
      "href": "/"
    },
    "links": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "About",
        "href": "/about",
        "active": true
      },
      {
        "label": "Services",
        "href": "/services"
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
    "cta": {
      "label": "Book a Call",
      "href": "/contact"
    }
  },
  "hero": {
    "chip": "About Dastify Digital",
    "title": "Built By MarketersWho've Been InsideThe Health Systemm.",
    "lead": "We didn't learn healthcare from a textbook. We learned it from 12-hour days inside hospital marketing departments, fighting for budget, navigating compliance, and proving ROI to skeptical CMOs.",
    "ctas": [
      {
        "label": "Meet The Team →",
        "href": "/contact",
        "variant": "dark"
      },
      {
        "label": "See Our Work",
        "href": "/work",
        "variant": "outline"
      }
    ],
    "stats": [
      {
        "value": "50+",
        "label": "Healthcare Clients Served"
      },
      {
        "value": "$40M+",
        "label": "Patient Revenue Generated"
      }
    ],
    "visual": {
      "image": null,
      "imageAlt": "",
      "imageFit": "cover",
      "imagePosition": "center",
      "imageRadius": "0",
      "preservePlaceholderChrome": false,
      "placeholderBackground": "",
      "placeholderBorderColor": "",
      "placeholderBorderWidth": "",
      "placeholderBorderStyle": "dashed",
      "placeholderPadding": "",
      "placeholderGap": "",
      "placeholderRadius": "4",
      "placeholderShowOverlay": true,
      "placeholderOverlay": "",
      "placeholderLabelColor": "",
      "placeholderLabelSize": "",
      "placeholderDimColor": "",
      "placeholderDimSize": "",
      "placeholderIconSize": "",
      "icon": "🏥",
      "label": "Hero Visual",
      "dimensions": "580 × 520px"
    },
    "marquee": [
      "Healthcare SEO",
      "•",
      "Patient Acquisition",
      "•",
      "HIPAA-Compliant Campaigns",
      "•",
      "Medical Practice Growth",
      "•",
      "Physician Referral Marketing",
      "•"
    ]
  },
  "manifesto": {
    "watermark": "A",
    "headline": "Most healthcare marketing",
    "highlight": "fails.",
    "statements": [
      "Because the agency doesn't understand HIPAA. Or patient journeys. Or why a 2.3% conversion rate is actually exceptional for orthopedic surgery.",
      "Because they're generalists who learned \"healthcare\" from a Wikipedia article last Tuesday.",
      "Because they measure impressions instead of appointments. Clicks instead of patients."
    ],
    "paragraphs": [
      "We started Dastify Digital after watching this cycle repeat for years. <strong>Healthcare organizations hiring agencies that didn't speak their language</strong>—and then wondering why the campaigns flopped.",
      "Our founding team came from inside the system. Hospital marketing directors. Health system strategists. Practice administrators who actually signed the checks. We know what it's like to defend a marketing budget to a CFO who thinks \"digital\" means a fancier brochure.",
      "So we built the agency we wished existed: one that combines <strong>world-class creative with deep healthcare intelligence</strong>. One that knows how to work with compliance, not against it. One that measures success the same way you do—in patients, not pageviews.",
      "<strong>This isn't marketing for healthcare. It's healthcare marketing.</strong> There's a difference."
    ]
  },
  "difference": {
    "chip": "Why Dastify Digital",
    "title": "Three things we do that nobody else will.",
    "intro": "Any agency can run Google Ads. Very few can do it while navigating BAA requirements, HIPAA-compliant tracking, and physician skepticism.",
    "cards": [
      {
        "number": "01",
        "title": "Compliance as Creative Fuel",
        "description": "HIPAA isn't a roadblock—it's a filter. Constraints force better ideas. We've built campaigns that outperform non-healthcare competitors while staying fully compliant with PHI regulations, BAA requirements, and platform-specific healthcare policies."
      },
      {
        "number": "02",
        "title": "Patient Journey Obsession",
        "description": "We map every touchpoint from symptom search to scheduled appointment. We know that a dermatology patient researches differently than a bariatric surgery candidate. And we build campaigns that meet them exactly where they are."
      },
      {
        "number": "03",
        "title": "Revenue Attribution, Not Vanity",
        "description": "We connect marketing spend to actual patient revenue. Not \"estimated conversions.\" Not \"projected value.\" Real appointments. Real patients. Real ROI that you can show your CFO without crossing your fingers."
      }
    ]
  },
  "story": {
    "watermark": "T",
    "chip": "Our Journey",
    "title": "From hospital hallways to healthcare growth.",
    "intro": "The short version: we got tired of watching healthcare organizations settle for mediocre marketing.",
    "items": [
      {
        "year": "2018",
        "title": "The Breaking Point",
        "description": "Our founders—working in separate health systems—independently reach the same conclusion: healthcare marketing is broken. Generic agencies don't understand the space. In-house teams are stretched too thin."
      },
      {
        "year": "2019",
        "title": "Dastify Digital Launches",
        "description": "We open with three clients, all multi-location specialty practices. First-year goal: prove that compliance and creativity can coexist. Spoiler: they can."
      },
      {
        "year": "2021",
        "title": "The Pandemic Pivot",
        "description": "COVID changes everything. Telehealth explodes. Patient acquisition moves entirely digital. We help 20+ practices navigate the shift—and discover that crisis is where healthcare marketing expertise matters most."
      },
      {
        "year": "2023",
        "title": "Vertical Expansion",
        "description": "We expand beyond specialty practices into dental, behavioral health, senior care, and urgent care. Each vertical gets its own dedicated team with deep expertise in that patient journey."
      },
      {
        "year": "Today",
        "title": "50+ Healthcare Clients",
        "description": "Now serving practices across 6 healthcare verticals, with a team of 25+ healthcare marketing specialists. Still obsessing over the same thing we did on day one: measurable patient growth."
      }
    ]
  },
  "team": {
    "watermark": "D",
    "chip": "The Team",
    "title": "Marketers who've worked your side of the desk.",
    "description": "No one on our team learned healthcare marketing from a course. Every strategist, designer, and media buyer has worked inside health systems, medical practices, or healthcare tech companies. When you explain your challenges, we already know the landscape.",
    "stats": [
      {
        "value": "25+",
        "label": "Healthcare Specialists"
      },
      {
        "value": "120+",
        "label": "Combined Years"
      }
    ],
    "cta": {
      "label": "Meet The Full Team →",
      "href": "/team"
    },
    "visuals": [
      {
        "image": null,
        "imageAlt": "",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0",
        "preservePlaceholderChrome": false,
        "placeholderBackground": "",
        "placeholderBorderColor": "",
        "placeholderBorderWidth": "",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "",
        "placeholderGap": "",
        "placeholderRadius": "4",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "",
        "placeholderLabelColor": "",
        "placeholderLabelSize": "",
        "placeholderDimColor": "",
        "placeholderDimSize": "",
        "placeholderIconSize": "",
        "icon": "👥",
        "label": "Team Photo 1",
        "dimensions": "320 × 400px",
        "height": "400px",
        "className": "about-team-img-1"
      },
      {
        "image": null,
        "imageAlt": "",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0",
        "preservePlaceholderChrome": false,
        "placeholderBackground": "",
        "placeholderBorderColor": "",
        "placeholderBorderWidth": "",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "",
        "placeholderGap": "",
        "placeholderRadius": "4",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "",
        "placeholderLabelColor": "",
        "placeholderLabelSize": "",
        "placeholderDimColor": "",
        "placeholderDimSize": "",
        "placeholderIconSize": "",
        "icon": "💼",
        "label": "Team Photo 2",
        "dimensions": "280 × 188px",
        "height": "188px",
        "className": "about-team-img-2"
      },
      {
        "image": null,
        "imageAlt": "",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0",
        "preservePlaceholderChrome": false,
        "placeholderBackground": "",
        "placeholderBorderColor": "",
        "placeholderBorderWidth": "",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "",
        "placeholderGap": "",
        "placeholderRadius": "4",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "",
        "placeholderLabelColor": "",
        "placeholderLabelSize": "",
        "placeholderDimColor": "",
        "placeholderDimSize": "",
        "placeholderIconSize": "",
        "icon": "🎯",
        "label": "Team Photo 3",
        "dimensions": "280 × 188px",
        "height": "188px",
        "className": "about-team-img-3"
      }
    ]
  },
  "values": {
    "chip": "Our Values",
    "title": "What we believe.",
    "intro": "Not mission statements. Not corporate fluff. The principles that actually guide how we work.",
    "items": [
      {
        "icon": "📊",
        "title": "Outcomes Over Optics",
        "description": "We'd rather show you 50 new patients than 50,000 impressions. Pretty campaigns that don't convert are just expensive wallpaper."
      },
      {
        "icon": "🔒",
        "title": "Compliance as Craft",
        "description": "HIPAA isn't a box to check. It's a design constraint that makes us more creative. We've never had a compliance violation. Ever."
      },
      {
        "icon": "🎯",
        "title": "Radical Transparency",
        "description": "You'll see exactly where every dollar goes. No hidden fees. No mysterious \"platform costs.\" Real-time dashboards you actually understand."
      },
      {
        "icon": "🤝",
        "title": "Partnership, Not Vendorship",
        "description": "We're not here to \"manage your account.\" We're here to grow your practice. That means challenging you when needed and celebrating wins together."
      }
    ]
  },
  "cta": {
    "title": "Ready to see what healthcare\nmarketing should look like?",
    "subtext": "30 minutes. No pitch deck. Just a conversation about what's working, what's not, and where the opportunities are.",
    "buttons": [
      {
        "label": "Book a Strategy Call →",
        "href": "/contact",
        "variant": "primary"
      },
      {
        "label": "See Case Studies",
        "href": "/work",
        "variant": "ghost"
      }
    ]
  },
  "footer": {
    "brand": {
      "name": "Dastify",
      "accent": ".Digital",
      "tagline": "The creative authority for healthcare growth. HIPAA-compliant, AI-powered, obsessively measurable."
    },
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
            "href": "/contact",
            "highlight": true
          },
          {
            "label": "hello@dastify.digital",
            "href": "mailto:hello@dastify.digital"
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
