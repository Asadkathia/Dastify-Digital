export type EditorNodeStyle = { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string };
export type EditorMeta = { nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: EditorNodeStyle }> };
export type PlaceholderMedia = { image?: string; imageAlt: string; imageFit?: string; imagePosition?: string; imageRadius?: string; preservePlaceholderChrome?: boolean; placeholderIcon: string; placeholderLabel: string; placeholderDimensions: string; placeholderDimensionsRatio?: string; placeholderBackground?: string; placeholderBorderColor?: string; placeholderBorderWidth?: string; placeholderBorderStyle?: string; placeholderPadding?: string; placeholderGap?: string; placeholderRadius?: string; placeholderShowOverlay?: boolean; placeholderOverlay?: string };
export type PageContent = {
  nav: {
    logoTextPrefix: string;
    logoAccent: string;
    logoTextSuffix: string;
    logoText: string;
    logoHref: string;
    links: { label: string; href: string; active?: boolean }[];
    cta: { label: string; href: string };
    editor?: EditorMeta;
  };
  hero: {
    watermark: string;
    chipText: string;
    title: string;
    titleTag?: "h1" | "h2" | "h3" | "h4";
    subtitle: string;
    stats: { value: string; label: string }[];
    editor?: EditorMeta;
  };
  filters: {
    items: { label: string; active?: boolean }[];
    editor?: EditorMeta;
  };
  featured: PlaceholderMedia & {
    label: string;
    categories: { label: string; variant?: "default" | "blue" }[];
    date: string;
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    excerpt: string;
    author: { avatar: string; name: string; role: string };
    editor?: EditorMeta;
  };
  grid: {
    watermark: string;
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    viewAll: { label: string; href: string };
    posts: (PlaceholderMedia & { href: string; category: string; date: string; title: string; excerpt: string; linkLabel: string })[];
    pagination: { label: string; active?: boolean; isArrow?: boolean }[];
    editor?: EditorMeta;
  };
  topics: {
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    subtitle: string;
    items: { icon: string; name: string; count: string }[];
    editor?: EditorMeta;
  };
  newsletter: {
    formId?: string | number | null;
    chipText: string;
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    subtitle: string;
    note: string;
    form: {
      rows: { name: string; type: "text" | "email" | "tel" | "url" | "number" | "textarea" | "select"; placeholder?: string; required?: boolean; width?: 50 | 100; options?: { label: string; value: string }[] }[][];
      submitLabel: string;
      successMessage: string;
      submitErrorMessage?: string;
    };
    editor?: EditorMeta;
  };
  cta: {
    title: string;
    titleTag?: "h2" | "h3" | "h4";
    subtitle: string;
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    editor?: EditorMeta;
  };
  footer: {
    brand: {
      namePrefix: string;
      accent: string;
      nameSuffix: string;
      description: string;
      social: { label: string; href: string }[];
    };
    columns: { title: string; links: { label: string; href: string; highlight?: boolean }[] }[];
    copy: string;
    badges: string[];
    editor?: EditorMeta;
  };
};

export const defaultContent: PageContent = {
  "nav": {
    "logoTextPrefix": "Dastify",
    "logoAccent": ".",
    "logoTextSuffix": "Digital",
    "logoText": "Dastify.Digital",
    "logoHref": "/",
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
        "logoText": {
          "tag": "span",
          "styles": {}
        }
      }
    }
  },
  "hero": {
    "watermark": "Blog",
    "chipText": "Healthcare Marketing Insights",
    "title": "Strategies That Move the Needle in Healthcare.",
    "titleTag": "h1",
    "subtitle": "HIPAA-compliant tactics, patient acquisition playbooks, and growth strategies — from marketers who've worked inside health systems.",
    "stats": [
      {
        "value": "120+",
        "label": "Articles Published"
      },
      {
        "value": "50K",
        "label": "Monthly Readers"
      }
    ],
    "editor": {
      "nodes": {
        "title": {
          "tag": "h1",
          "styles": {}
        },
        "subtitle": {
          "tag": "p",
          "styles": {}
        }
      }
    }
  },
  "filters": {
    "items": [
      {
        "label": "All Posts",
        "active": true
      },
      {
        "label": "Patient Acquisition"
      },
      {
        "label": "Healthcare SEO"
      },
      {
        "label": "HIPAA Compliance"
      },
      {
        "label": "Paid Media"
      },
      {
        "label": "Reputation Management"
      },
      {
        "label": "Case Studies"
      }
    ]
  },
  "featured": {
    "image": "",
    "imageAlt": "Featured Article Image",
    "imageFit": "cover",
    "imagePosition": "center",
    "imageRadius": "4px",
    "preservePlaceholderChrome": true,
    "placeholderIcon": "📊",
    "placeholderLabel": "Featured Article Image",
    "placeholderDimensions": "640 × 400 · WebP ≤200kb",
    "placeholderDimensionsRatio": "16 / 10",
    "placeholderBackground": "var(--bg3)",
    "placeholderBorderColor": "var(--bd-md)",
    "placeholderBorderWidth": "1.5px",
    "placeholderBorderStyle": "dashed",
    "placeholderPadding": "40px 24px",
    "placeholderGap": "10px",
    "placeholderRadius": "4px",
    "placeholderShowOverlay": true,
    "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)",
    "label": "★ Featured Article",
    "categories": [
      {
        "label": "Patient Acquisition",
        "variant": "default"
      },
      {
        "label": "Healthcare SEO",
        "variant": "blue"
      }
    ],
    "date": "April 8, 2026 · 12 min read",
    "title": "Google's March 2026 Core Update: What Healthcare Marketers Must Do Now",
    "titleTag": "h2",
    "excerpt": "The latest core update hit healthcare sites hard. Here's our 90-day recovery playbook — built from actual recovery campaigns across 14 multi-location practices that regained 93% of lost traffic.",
    "author": {
      "avatar": "👤",
      "name": "Sarah Mitchell",
      "role": "VP of SEO Strategy"
    },
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2",
          "styles": {}
        }
      }
    }
  },
  "grid": {
    "watermark": "Read",
    "title": "Latest Insights",
    "titleTag": "h2",
    "viewAll": {
      "label": "View All Articles →",
      "href": "/blog"
    },
    "posts": [
      {
        "href": "/blog/hipaa-compliant-google-ads",
        "category": "HIPAA Compliance",
        "date": "Apr 3, 2026",
        "title": "HIPAA-Compliant Google Ads: The Complete 2026 Setup Guide",
        "excerpt": "Server-side tagging, enhanced conversions without PHI, and the tracking pixel configurations that keep your ads legal and your leads flowing.",
        "linkLabel": "Read Article →",
        "image": "",
        "imageAlt": "Blog Post Image 01",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "🔒",
        "placeholderLabel": "Blog Post Image 01",
        "placeholderDimensions": "480 × 300 · WebP ≤150kb",
        "placeholderDimensionsRatio": "16 / 10",
        "placeholderBackground": "var(--bg3)",
        "placeholderBorderColor": "var(--bd-md)",
        "placeholderBorderWidth": "1.5px",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "40px 24px",
        "placeholderGap": "10px",
        "placeholderRadius": "0px",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
      },
      {
        "href": "/blog/dental-practice-seo",
        "category": "Healthcare SEO",
        "date": "Mar 28, 2026",
        "title": "Dental Practice SEO: 47 Patients in 60 Days From Organic Search",
        "excerpt": "A step-by-step breakdown of how we took a 3-location dental group from page 4 to the map pack — and the exact content strategy that drove it.",
        "linkLabel": "Read Article →",
        "image": "",
        "imageAlt": "Blog Post Image 02",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "🦷",
        "placeholderLabel": "Blog Post Image 02",
        "placeholderDimensions": "480 × 300 · WebP ≤150kb",
        "placeholderDimensionsRatio": "16 / 10",
        "placeholderBackground": "var(--bg3)",
        "placeholderBorderColor": "var(--bd-md)",
        "placeholderBorderWidth": "1.5px",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "40px 24px",
        "placeholderGap": "10px",
        "placeholderRadius": "0px",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
      },
      {
        "href": "/blog/patient-retention-email",
        "category": "Patient Acquisition",
        "date": "Mar 21, 2026",
        "title": "The Patient Retention Email System That Cut No-Shows by 34%",
        "excerpt": "Automated sequences, SMS reminders, and the exact cadence that reduced appointment gaps across 8 orthopedic locations in Q1 2026.",
        "linkLabel": "Read Article →",
        "image": "",
        "imageAlt": "Blog Post Image 03",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "📧",
        "placeholderLabel": "Blog Post Image 03",
        "placeholderDimensions": "480 × 300 · WebP ≤150kb",
        "placeholderDimensionsRatio": "16 / 10",
        "placeholderBackground": "var(--bg3)",
        "placeholderBorderColor": "var(--bd-md)",
        "placeholderBorderWidth": "1.5px",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "40px 24px",
        "placeholderGap": "10px",
        "placeholderRadius": "0px",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
      },
      {
        "href": "/blog/healthcare-ppc-benchmarks",
        "category": "Paid Media",
        "date": "Mar 14, 2026",
        "title": "2026 Healthcare PPC Benchmarks: Cost-Per-Patient by Specialty",
        "excerpt": "Updated benchmarks across 12 healthcare verticals. Know your numbers before you spend another dollar on Google or Meta ads.",
        "linkLabel": "Read Article →",
        "image": "",
        "imageAlt": "Blog Post Image 04",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "💰",
        "placeholderLabel": "Blog Post Image 04",
        "placeholderDimensions": "480 × 300 · WebP ≤150kb",
        "placeholderDimensionsRatio": "16 / 10",
        "placeholderBackground": "var(--bg3)",
        "placeholderBorderColor": "var(--bd-md)",
        "placeholderBorderWidth": "1.5px",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "40px 24px",
        "placeholderGap": "10px",
        "placeholderRadius": "0px",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
      },
      {
        "href": "/blog/reputation-management-physicians",
        "category": "Reputation",
        "date": "Mar 7, 2026",
        "title": "From 3.2 to 4.8 Stars: A Physician's Review Management Playbook",
        "excerpt": "The response templates, timing strategy, and review-generation system that transformed a cardiology practice's online presence in 120 days.",
        "linkLabel": "Read Article →",
        "image": "",
        "imageAlt": "Blog Post Image 05",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "⭐",
        "placeholderLabel": "Blog Post Image 05",
        "placeholderDimensions": "480 × 300 · WebP ≤150kb",
        "placeholderDimensionsRatio": "16 / 10",
        "placeholderBackground": "var(--bg3)",
        "placeholderBorderColor": "var(--bd-md)",
        "placeholderBorderWidth": "1.5px",
        "placeholderBorderStyle": "dashed",
        "placeholderPadding": "40px 24px",
        "placeholderGap": "10px",
        "placeholderRadius": "0px",
        "placeholderShowOverlay": true,
        "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
      },
      {
        "href": "/blog/ai-healthcare-marketing",
        "category": "Case Studies",
        "date": "Feb 28, 2026",
        "title": "How AI-Powered Chat Booked 200+ Appointments for a Dermatology Group",
        "excerpt": "The chatbot implementation, HIPAA-safe data handling, and conversion flow that turned website visitors into booked patients at scale.",
        "linkLabel": "Read Article →",
        "image": "",
        "imageAlt": "Blog Post Image 06",
        "imageFit": "cover",
        "imagePosition": "center",
        "imageRadius": "0px",
        "preservePlaceholderChrome": true,
        "placeholderIcon": "🤖",
        "placeholderLabel": "Blog Post Image 06",
        "placeholderDimensions": "480 × 300 · WebP ≤150kb",
        "placeholderDimensionsRatio": "16 / 10",
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
    ],
    "pagination": [
      {
        "label": "←",
        "isArrow": true
      },
      {
        "label": "1",
        "active": true
      },
      {
        "label": "2"
      },
      {
        "label": "3"
      },
      {
        "label": "4"
      },
      {
        "label": "→",
        "isArrow": true
      }
    ],
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2",
          "styles": {}
        }
      }
    }
  },
  "topics": {
    "title": "Browse by Topic",
    "titleTag": "h2",
    "subtitle": "Deep dives into the strategies that drive healthcare growth.",
    "items": [
      {
        "icon": "🔍",
        "name": "Healthcare SEO",
        "count": "28 Articles"
      },
      {
        "icon": "📱",
        "name": "Paid Media",
        "count": "22 Articles"
      },
      {
        "icon": "🔒",
        "name": "HIPAA Compliance",
        "count": "18 Articles"
      },
      {
        "icon": "📈",
        "name": "Patient Acquisition",
        "count": "34 Articles"
      }
    ],
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2",
          "styles": {}
        }
      }
    }
  },
  "newsletter": {
    "formId": "newsletter",
    "chipText": "Weekly Newsletter",
    "title": "Healthcare Marketing Intel. Delivered Weekly.",
    "titleTag": "h2",
    "subtitle": "Join 4,200+ healthcare marketers getting HIPAA-compliant strategies, benchmark data, and growth playbooks every Tuesday.",
    "note": "No spam. Unsubscribe anytime. We never share your data.",
    "form": {
      "rows": [
        [
          {
            "name": "email",
            "type": "email",
            "placeholder": "your@email.com",
            "required": true,
            "width": 100
          }
        ]
      ],
      "submitLabel": "Subscribe →",
      "successMessage": "Thanks for subscribing.",
      "submitErrorMessage": "Something went wrong. Please try again."
    },
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2",
          "styles": {}
        }
      }
    }
  },
  "cta": {
    "title": "Ready to Fill Your Schedule?",
    "titleTag": "h2",
    "subtitle": "Book a free 30-minute strategy call. We'll show you exactly where your practice is leaving patients on the table.",
    "primary": {
      "label": "Book Free Audit →",
      "href": "/demo"
    },
    "secondary": {
      "label": "See Real Results",
      "href": "/work"
    },
    "editor": {
      "nodes": {
        "title": {
          "tag": "h2",
          "styles": {}
        }
      }
    }
  },
  "footer": {
    "brand": {
      "namePrefix": "Dastify",
      "accent": ".",
      "nameSuffix": "Digital",
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
    "copy": "© 2026 Dastify Digital. All rights reserved.",
    "badges": [
      "HIPAA Compliant",
      "Google Partner"
    ]
  }
};