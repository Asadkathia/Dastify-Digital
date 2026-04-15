export type EditorNodeStyle = { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string };
export type EditorMeta = { nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: EditorNodeStyle }> };
export type LinkItem = { label: string; href: string; active?: boolean; highlight?: boolean };
export type MediaSlot = { image?: string; imageAlt?: string; aspectRatio?: string; imageFit?: string; imagePosition?: string; imageRadius?: string; preservePlaceholderChrome?: boolean; placeholderIcon?: string; placeholderLabel?: string; placeholderDimensions?: string; placeholderBackground?: string; placeholderBorderColor?: string; placeholderBorderWidth?: string; placeholderBorderStyle?: string; placeholderPadding?: string; placeholderGap?: string; placeholderRadius?: string; placeholderShowOverlay?: boolean; placeholderOverlay?: string };
export type ArticleBlock =
  | { type: "paragraph"; text: string; html?: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "heading"; level: 2 | 3; id: string; text: string; tag?: "h2" | "h3" | "h4" }
  | { type: "callout"; title: string; text: string }
  | { type: "image"; media: MediaSlot }
  | { type: "list"; ordered?: boolean; items: { text: string; html?: string }[] }
  | { type: "quote"; text: string }
  | { type: "authorBio"; avatar: MediaSlot; name: string; role: string; description: string };
export type PageContent = {
  nav: {
    logo: { text: string; dot: string; href: string };
    links: LinkItem[];
    cta: { label: string; href: string };
    editor?: EditorMeta;
  };
  hero: {
    breadcrumbs: { label: string; href?: string }[];
    categories: { label: string; variant?: "purple" | "blue" }[];
    title: string;
    titleTag?: "h1" | "h2" | "h3" | "h4";
    author: { name: string; role: string; avatar: MediaSlot };
    publishDate: string;
    readTime: string;
    editor?: EditorMeta;
  };
  article: {
    featuredImage: MediaSlot;
    blocks: ArticleBlock[];
    sidebar: {
      tocTitle: string;
      toc: { label: string; href: string }[];
      cta: { title: string; description: string; button: { label: string; href: string } };
      relatedTitle: string;
      related: { category: string; title: string; href: string }[];
    };
    editor?: EditorMeta;
  };
  relatedPosts: {
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    items: { category: string; title: string; date: string; href: string; media: MediaSlot }[];
    editor?: EditorMeta;
  };
  cta: {
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    subtitle: string;
    primaryButton: { label: string; href: string };
    secondaryButton: { label: string; href: string };
    editor?: EditorMeta;
  };
  footer: {
    brand: { name: string; dot: string; suffix: string; description: string; social: LinkItem[] };
    columns: { title: string; links: LinkItem[] }[];
    bottom: { copy: string; badges: string[] };
    editor?: EditorMeta;
  };
};

export const defaultContent: PageContent = {
  "nav": {
    "logo": {
      "text": "Dastify",
      "dot": ".",
      "href": "/"
    },
    "links": [
      {
        "label": "About",
        "href": "/about"
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
        "label": "Blog",
        "href": "/blog",
        "active": true
      },
      {
        "label": "Contact",
        "href": "/contact"
      }
    ],
    "cta": {
      "label": "Book Free Audit →",
      "href": "/demo"
    },
    "editor": {
      "nodes": {
        "logo": {
          "tag": "span"
        }
      }
    }
  },
  "hero": {
    "breadcrumbs": [
      {
        "label": "Home",
        "href": "/"
      },
      {
        "label": "Blog",
        "href": "/blog"
      },
      {
        "label": "HIPAA-Compliant Google Ads"
      }
    ],
    "categories": [
      {
        "label": "HIPAA Compliance",
        "variant": "purple"
      },
      {
        "label": "Paid Media",
        "variant": "blue"
      }
    ],
    "title": "HIPAA-Compliant Google Ads: The Complete 2026 Setup Guide",
    "titleTag": "h1",
    "author": {
      "name": "Dr. Marcus Rivera",
      "role": "Director of Compliance & Paid Media",
      "avatar": {
        "image": "",
        "imageAlt": "Author avatar",
        "aspectRatio": "1/1",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "999px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "👤",
        "placeholderLabel": "Author Avatar",
        "placeholderDimensions": "44 × 44",
        "placeholderBackground": "var(--bg3)",
        "placeholderBorderColor": "var(--bd-md)",
        "placeholderBorderWidth": "1px",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "0",
        "placeholderGap": "0",
        "placeholderRadius": "999px",
        "placeholderShowOverlay": false,
        "placeholderOverlay": ""
      }
    },
    "publishDate": "April 3, 2026",
    "readTime": "12 min read",
    "editor": {
      "nodes": {
        "title": {
          "tag": "h1"
        }
      }
    }
  },
  "article": {
    "featuredImage": {
      "image": "",
      "imageAlt": "Article hero image",
      "aspectRatio": "16/9",
      "imageFit": "cover",
      "imagePosition": "center",
      "imageRadius": "4px",
      "preservePlaceholderChrome": true,
      "placeholderIcon": "📊",
      "placeholderLabel": "Article Hero Image",
      "placeholderDimensions": "720 × 405 · WebP ≤250kb",
      "placeholderBackground": "var(--bg3)",
      "placeholderBorderColor": "var(--bd-md)",
      "placeholderBorderWidth": "1.5px",
      "placeholderBorderStyle": "dashed",
      "placeholderPadding": "40px 24px",
      "placeholderGap": "10px",
      "placeholderRadius": "4px",
      "placeholderShowOverlay": true,
      "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
    },
    "blocks": [
      {
        "type": "paragraph",
        "text": "Running Google Ads for a healthcare practice in 2026 is a compliance minefield.",
        "html": "<strong>Running Google Ads for a healthcare practice in 2026 is a compliance minefield.</strong> Between Google's enhanced conversion tracking, Meta's broad targeting changes, and OCR enforcement actions, most healthcare marketers are either leaving money on the table or unknowingly violating HIPAA with every ad click."
      },
      {
        "type": "paragraph",
        "text": "This guide covers the exact technical setup we use across 40+ healthcare advertising accounts — the same configuration that drives an average 3.2x return on ad spend while keeping every patient touchpoint PHI-safe.",
        "html": "This guide covers the exact technical setup we use across 40+ healthcare advertising accounts — the same configuration that drives an average 3.2x return on ad spend while keeping every patient touchpoint PHI-safe."
      },
      {
        "type": "stats",
        "items": [
          {
            "value": "40+",
            "label": "Healthcare Ad Accounts"
          },
          {
            "value": "3.2×",
            "label": "Average ROAS"
          },
          {
            "value": "0",
            "label": "Compliance Violations"
          }
        ]
      },
      {
        "type": "heading",
        "level": 2,
        "id": "section-1",
        "text": "Why Standard Google Ads Tracking Violates HIPAA",
        "tag": "h2"
      },
      {
        "type": "paragraph",
        "text": "When a patient clicks your Google Ad and lands on a page about anxiety treatment near me, that URL itself becomes protected health information.",
        "html": "When a patient clicks your Google Ad and lands on a page about \"anxiety treatment near me,\" that URL itself becomes protected health information. Standard Google Ads conversion tracking captures that URL, the user's IP address, and browser data — transmitting it directly to Google's servers."
      },
      {
        "type": "paragraph",
        "text": "Under HIPAA's expanded interpretation by the OCR, this constitutes an unauthorized disclosure of PHI.",
        "html": "Under HIPAA's expanded interpretation by the OCR (issued December 2022, reinforced March 2025), this constitutes an unauthorized disclosure of PHI to a third party without a Business Associate Agreement."
      },
      {
        "type": "callout",
        "title": "⚠️ Key Compliance Point",
        "text": "Google explicitly states it will not sign a BAA for Google Ads or Google Analytics. This means any tracking implementation must prevent PHI from reaching Google's servers in the first place."
      },
      {
        "type": "heading",
        "level": 2,
        "id": "section-2",
        "text": "The Server-Side Tagging Architecture",
        "tag": "h2"
      },
      {
        "type": "paragraph",
        "text": "The solution is server-side Google Tag Manager (sGTM).",
        "html": "The solution is server-side Google Tag Manager (sGTM). Instead of sending data directly from the patient's browser to Google, all tracking events pass through your own server first — where PHI can be stripped before anything reaches Google."
      },
      {
        "type": "paragraph",
        "text": "Here's the architecture we deploy for every healthcare PPC client:",
        "html": "Here's the architecture we deploy for every healthcare PPC client:"
      },
      {
        "type": "image",
        "media": {
          "image": "",
          "imageAlt": "Server-side architecture diagram",
          "aspectRatio": "16/8",
          "imageFit": "cover",
          "imagePosition": "center",
          "imageRadius": "4px",
          "preservePlaceholderChrome": true,
          "placeholderIcon": "🔧",
          "placeholderLabel": "Server-Side Architecture Diagram",
          "placeholderDimensions": "720 × 360 · WebP ≤200kb",
          "placeholderBackground": "var(--bg3)",
          "placeholderBorderColor": "var(--bd-md)",
          "placeholderBorderWidth": "1.5px",
          "placeholderBorderStyle": "dashed",
          "placeholderPadding": "40px 24px",
          "placeholderGap": "10px",
          "placeholderRadius": "4px",
          "placeholderShowOverlay": true,
          "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
        }
      },
      {
        "type": "heading",
        "level": 3,
        "id": "section-2a",
        "text": "Step 1: Deploy a First-Party sGTM Container",
        "tag": "h3"
      },
      {
        "type": "paragraph",
        "text": "Your server-side container runs on a subdomain of your practice's website.",
        "html": "Your server-side container runs on a subdomain of your practice's website (e.g., track.yourpractice.com). This is critical — it keeps the data flow under your HIPAA umbrella and your BAA with the hosting provider."
      },
      {
        "type": "paragraph",
        "text": "We recommend Google Cloud Run for hosting, configured with:",
        "html": "We recommend Google Cloud Run for hosting, configured with:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          {
            "text": "HIPAA-eligible Google Cloud project with BAA signed"
          },
          {
            "text": "Cloud Run instance in a US region with logging disabled for PHI fields"
          },
          {
            "text": "Custom domain mapping to your practice's subdomain"
          },
          {
            "text": "Automatic scaling set to handle traffic spikes during campaign launches"
          }
        ]
      },
      {
        "type": "heading",
        "level": 3,
        "id": "section-2b",
        "text": "Step 2: Configure PHI-Safe Event Transformation",
        "tag": "h3"
      },
      {
        "type": "paragraph",
        "text": "Inside the server-side container, every incoming event passes through a transformation template.",
        "html": "Inside the server-side container, every incoming event passes through a transformation template that strips:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          {
            "text": "URL paths containing condition or treatment names",
            "html": "<strong>URL paths</strong> containing condition or treatment names"
          },
          {
            "text": "Query parameters with patient identifiers or form data",
            "html": "<strong>Query parameters</strong> with patient identifiers or form data"
          },
          {
            "text": "Referrer URLs that reveal the patient's healthcare interest",
            "html": "<strong>Referrer URLs</strong> that reveal the patient's healthcare interest"
          },
          {
            "text": "User-agent strings that could contribute to re-identification",
            "html": "<strong>User-agent strings</strong> that could contribute to re-identification"
          }
        ]
      },
      {
        "type": "quote",
        "text": "The goal isn't to lose data — it's to transform identifiable health data into non-identifiable conversion signals that still let Google optimize your campaigns."
      },
      {
        "type": "heading",
        "level": 2,
        "id": "section-3",
        "text": "Enhanced Conversions Without PHI",
        "tag": "h2"
      },
      {
        "type": "paragraph",
        "text": "Google's Enhanced Conversions feature normally requires sending hashed email addresses or phone numbers.",
        "html": "Google's Enhanced Conversions feature normally requires sending hashed email addresses or phone numbers. In healthcare, this creates a direct link between a patient's identity and their health-seeking behavior."
      },
      {
        "type": "paragraph",
        "text": "Our approach uses consent-gated first-party data.",
        "html": "<strong>Our approach:</strong> We use a consent-gated, first-party data layer that only fires enhanced conversion data when the patient has explicitly opted in through a HIPAA-compliant authorization form — not just a cookie banner."
      },
      {
        "type": "heading",
        "level": 2,
        "id": "section-4",
        "text": "Campaign Structure for Healthcare Verticals",
        "tag": "h2"
      },
      {
        "type": "paragraph",
        "text": "Compliance architecture is the foundation, but campaign performance requires healthcare-specific structure.",
        "html": "Compliance architecture is the foundation, but campaign performance requires healthcare-specific structure. We organize every account around three tiers:"
      },
      {
        "type": "list",
        "ordered": false,
        "items": [
          {
            "text": "Tier 1 — Condition Campaigns",
            "html": "<strong>Tier 1 — Condition Campaigns:</strong> Target patients searching for specific conditions (e.g., \"knee pain treatment\"). These drive the highest-intent traffic but require the strictest PHI controls."
          },
          {
            "text": "Tier 2 — Service Campaigns",
            "html": "<strong>Tier 2 — Service Campaigns:</strong> Target patients searching for procedures or services (e.g., \"knee replacement surgeon near me\"). Lower PHI risk, strong commercial intent."
          },
          {
            "text": "Tier 3 — Brand + Competitor Campaigns",
            "html": "<strong>Tier 3 — Brand + Competitor Campaigns:</strong> Protect your brand terms and capture competitor-intent searches. Minimal PHI risk, high conversion rate."
          }
        ]
      },
      {
        "type": "callout",
        "title": "💡 Pro Tip",
        "text": "Separate your campaign tiers into distinct sGTM event streams. Tier 1 conditions get the strictest URL scrubbing, while Tier 3 brand campaigns can pass through more data safely since the search terms don't reveal health conditions."
      },
      {
        "type": "heading",
        "level": 2,
        "id": "section-5",
        "text": "Audit Checklist: Is Your Current Setup Compliant?",
        "tag": "h2"
      },
      {
        "type": "paragraph",
        "text": "Run through these checks on your current Google Ads account.",
        "html": "Run through these checks on your current Google Ads account. If any answer is \"no,\" your practice may be at risk:"
      },
      {
        "type": "list",
        "ordered": true,
        "items": [
          {
            "text": "Is your Google Tag Manager container running server-side?"
          },
          {
            "text": "Do you have a BAA with your sGTM hosting provider?"
          },
          {
            "text": "Are condition-specific URLs being stripped before reaching Google?"
          },
          {
            "text": "Is Enhanced Conversions gated behind HIPAA authorization (not just cookie consent)?"
          },
          {
            "text": "Are your landing pages free of third-party scripts that transmit PHI?"
          },
          {
            "text": "Do you have documented evidence of your tracking architecture for OCR audits?"
          }
        ]
      },
      {
        "type": "paragraph",
        "text": "If you checked no on even one item, your practice needs a compliance audit.",
        "html": "<strong>If you checked \"no\" on even one item,</strong> your practice needs a compliance audit before spending another dollar on paid media. We offer a free 30-minute assessment that covers all six checkpoints."
      },
      {
        "type": "authorBio",
        "avatar": {
          "image": "",
          "imageAlt": "Author bio avatar",
          "aspectRatio": "1/1",
          "imageFit": "cover",
          "imagePosition": "center",
          "imageRadius": "999px",
          "preservePlaceholderChrome": true,
          "placeholderIcon": "👤",
          "placeholderLabel": "Author Bio Avatar",
          "placeholderDimensions": "72 × 72",
          "placeholderBackground": "var(--bg3)",
          "placeholderBorderColor": "var(--bd-md)",
          "placeholderBorderWidth": "1px",
          "placeholderBorderStyle": "dashed",
          "placeholderPadding": "0",
          "placeholderGap": "0",
          "placeholderRadius": "999px",
          "placeholderShowOverlay": false,
          "placeholderOverlay": ""
        },
        "name": "Dr. Marcus Rivera",
        "role": "Director of Compliance & Paid Media",
        "description": "Marcus leads HIPAA-compliant advertising strategy at Dastify Digital. A former healthcare administrator turned digital marketer, he's built compliant PPC frameworks for over 120 healthcare organizations across 14 specialties."
      }
    ],
    "sidebar": {
      "tocTitle": "In This Article",
      "toc": [
        {
          "label": "Why Standard Tracking Violates HIPAA",
          "href": "#section-1"
        },
        {
          "label": "Server-Side Tagging Architecture",
          "href": "#section-2"
        },
        {
          "label": "Enhanced Conversions Without PHI",
          "href": "#section-3"
        },
        {
          "label": "Campaign Structure for Healthcare",
          "href": "#section-4"
        },
        {
          "label": "Audit Checklist",
          "href": "#section-5"
        }
      ],
      "cta": {
        "title": "Free Compliance Audit",
        "description": "Is your healthcare PPC setup HIPAA-safe? Get a 30-minute assessment from our compliance team.",
        "button": {
          "label": "Book Free Audit →",
          "href": "/demo"
        }
      },
      "relatedTitle": "Related Articles",
      "related": [
        {
          "category": "Healthcare SEO",
          "title": "Google's March 2026 Core Update: What Healthcare Marketers Must Do Now",
          "href": "#"
        },
        {
          "category": "Paid Media",
          "title": "2026 Healthcare PPC Benchmarks: Cost-Per-Patient by Specialty",
          "href": "#"
        },
        {
          "category": "HIPAA Compliance",
          "title": "Meta Ads for Healthcare: The PHI-Safe Setup Guide",
          "href": "#"
        }
      ]
    },
    "editor": {
      "nodes": {}
    }
  },
  "relatedPosts": {
    "title": "You Might Also Like",
    "titleTag": "h2",
    "items": [
      {
        "category": "Healthcare SEO",
        "title": "Dental Practice SEO: 47 Patients in 60 Days From Organic Search",
        "date": "Mar 28, 2026",
        "href": "#",
        "media": {
          "image": "",
          "imageAlt": "Related post 01 image",
          "aspectRatio": "16/10",
          "imageFit": "cover",
          "imagePosition": "center",
          "imageRadius": "0px",
          "preservePlaceholderChrome": true,
          "placeholderIcon": "🦷",
          "placeholderLabel": "Related Post 01",
          "placeholderDimensions": "480 × 300 · WebP",
          "placeholderBackground": "var(--bg3)",
          "placeholderBorderColor": "var(--bd-md)",
          "placeholderBorderWidth": "1.5px",
          "placeholderBorderStyle": "dashed",
          "placeholderPadding": "40px 24px",
          "placeholderGap": "10px",
          "placeholderRadius": "0px",
          "placeholderShowOverlay": true,
          "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
        }
      },
      {
        "category": "Patient Acquisition",
        "title": "The Patient Retention Email System That Cut No-Shows by 34%",
        "date": "Mar 21, 2026",
        "href": "#",
        "media": {
          "image": "",
          "imageAlt": "Related post 02 image",
          "aspectRatio": "16/10",
          "imageFit": "cover",
          "imagePosition": "center",
          "imageRadius": "0px",
          "preservePlaceholderChrome": true,
          "placeholderIcon": "📧",
          "placeholderLabel": "Related Post 02",
          "placeholderDimensions": "480 × 300 · WebP",
          "placeholderBackground": "var(--bg3)",
          "placeholderBorderColor": "var(--bd-md)",
          "placeholderBorderWidth": "1.5px",
          "placeholderBorderStyle": "dashed",
          "placeholderPadding": "40px 24px",
          "placeholderGap": "10px",
          "placeholderRadius": "0px",
          "placeholderShowOverlay": true,
          "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
        }
      },
      {
        "category": "Paid Media",
        "title": "2026 Healthcare PPC Benchmarks: Cost-Per-Patient by Specialty",
        "date": "Mar 14, 2026",
        "href": "#",
        "media": {
          "image": "",
          "imageAlt": "Related post 03 image",
          "aspectRatio": "16/10",
          "imageFit": "cover",
          "imagePosition": "center",
          "imageRadius": "0px",
          "preservePlaceholderChrome": true,
          "placeholderIcon": "💰",
          "placeholderLabel": "Related Post 03",
          "placeholderDimensions": "480 × 300 · WebP",
          "placeholderBackground": "var(--bg3)",
          "placeholderBorderColor": "var(--bd-md)",
          "placeholderBorderWidth": "1.5px",
          "placeholderBorderStyle": "dashed",
          "placeholderPadding": "40px 24px",
          "placeholderGap": "10px",
          "placeholderRadius": "0px",
          "placeholderShowOverlay": true,
          "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
        }
      }
    ],
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2"
        }
      }
    }
  },
  "cta": {
    "title": "Your Ads Are Either Compliant or They're Not.",
    "titleTag": "h2",
    "subtitle": "Find out in 30 minutes. Our free compliance audit covers tracking, targeting, and landing page PHI exposure.",
    "primaryButton": {
      "label": "Book Free Audit →",
      "href": "/demo"
    },
    "secondaryButton": {
      "label": "See Real Results",
      "href": "/work"
    },
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2"
        }
      }
    }
  },
  "footer": {
    "brand": {
      "name": "Dastify",
      "dot": ".",
      "suffix": "Digital",
      "description": "The creative authority for healthcare growth. HIPAA-compliant marketing that fills schedules.",
      "social": [
        {
          "label": "Li",
          "href": "#"
        },
        {
          "label": "X",
          "href": "#"
        },
        {
          "label": "Ig",
          "href": "#"
        }
      ]
    },
    "columns": [
      {
        "title": "Services",
        "links": [
          {
            "label": "Healthcare SEO",
            "href": "#"
          },
          {
            "label": "Paid Media",
            "href": "#"
          },
          {
            "label": "Web Design",
            "href": "#"
          },
          {
            "label": "Content Marketing",
            "href": "#"
          },
          {
            "label": "Reputation Management",
            "href": "#"
          },
          {
            "label": "Marketing Automation",
            "href": "#"
          }
        ]
      },
      {
        "title": "Specialties",
        "links": [
          {
            "label": "Dental Practices",
            "href": "#"
          },
          {
            "label": "Orthopedics",
            "href": "#"
          },
          {
            "label": "Dermatology",
            "href": "#"
          },
          {
            "label": "Cardiology",
            "href": "#"
          },
          {
            "label": "Mental Health",
            "href": "#"
          },
          {
            "label": "Multi-Location",
            "href": "#"
          }
        ]
      },
      {
        "title": "Contact",
        "links": [
          {
            "label": "hello@dastifydigital.com",
            "href": "mailto:hello@dastifydigital.com"
          },
          {
            "label": "(888) 555-1234",
            "href": "tel:+18885551234"
          },
          {
            "label": "Book a Strategy Call →",
            "href": "/demo",
            "highlight": true
          }
        ]
      }
    ],
    "bottom": {
      "copy": "© 2026 Dastify Digital. All rights reserved.",
      "badges": [
        "HIPAA Compliant",
        "Google Partner"
      ]
    },
    "editor": {
      "nodes": {}
    }
  }
};