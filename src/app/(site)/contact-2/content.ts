export type PageContent = {
  nav: {
    logoTextPrimary: string;
    logoTextAccent: string;
    logoTextSecondary: string;
    logoText: string;
    logoHref: string;
    links: { label: string; href: string; active?: boolean }[];
    cta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  hero: {
    chipText: string;
    watermark: string;
    title: string;
    titleTag: "h1"|"h2"|"h3"|"h4";
    subtitle: string;
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  methods: {
    items: {
      icon: string;
      iconSize?: number;
      iconOffsetX?: number;
      iconOffsetY?: number;
      color: "purple"|"blue"|"green";
      showBg?: boolean;
      title: string;
      link?: { label: string; href: string };
      detail: string;
      editor?: {
        nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
      };
    }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  contactForm: {
    watermark: string;
    info: {
      title: string;
      titleTag: "h1"|"h2"|"h3"|"h4";
      description: string;
      promises: { icon: string; title: string; text: string }[];
      response: { icon: string; title: string; text: string };
      editor?: {
        nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
      };
    };
    form: {
      rows: {
        fields: {
          name: string;
          label: string;
          type: "text"|"email"|"tel"|"select"|"textarea";
          placeholder?: string;
          full?: boolean;
          options?: string[];
        }[];
      }[];
      submitLabel: string;
      privacyText: string;
      privacyLink: { label: string; href: string };
      editor?: {
        nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
      };
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  map: {
    embedHtml?: string;
    image?: string;
    imageAlt: string;
    imageFit?: string;
    imagePosition?: string;
    imageRadius?: string;
    placeholder: {
      icon: string;
      label: string;
      dimText: string;
      dimensions: string;
      preservePlaceholderChrome: boolean;
      placeholderBackground: string;
      placeholderBorderColor: string;
      placeholderBorderWidth: string;
      placeholderBorderStyle: string;
      placeholderPadding: string;
      placeholderGap: string;
      placeholderRadius: string;
      placeholderShowOverlay: boolean;
      placeholderOverlay: string;
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  faq: {
    chipText: string;
    title: string;
    titleTag: "h1"|"h2"|"h3"|"h4";
    description: string;
    callCta: { label: string; href: string };
    items: { question: string; answer: string }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  cta: {
    title: string;
    titleTag: "h1"|"h2"|"h3"|"h4";
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  footer: {
    brand: {
      namePrimary: string;
      nameAccent: string;
      nameSecondary: string;
      description: string;
      social: { label: string; href: string }[];
    };
    columns: {
      title: string;
      links: { label: string; href: string; highlight?: boolean }[];
    }[];
    copy: string;
    badges: string[];
    editor?: {
      nodes?: Record<string, { tag?: "h1"|"h2"|"h3"|"h4"|"p"|"span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left"|"center"|"right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
};

export const defaultContent: PageContent = {
  "nav": {
    "logoTextPrimary": "Dastify",
    "logoTextAccent": ".",
    "logoTextSecondary": "Digital",
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
        "href": "/blog"
      },
      {
        "label": "Contact",
        "href": "/contact",
        "active": true
      }
    ],
    "cta": {
      "label": "Book Free Audit →",
      "href": "/demo"
    }
  },
  "hero": {
    "chipText": "Get in Touch",
    "watermark": "Hi",
    "title": "Let's Talk About Growing Your Practice.",
    "titleTag": "h1",
    "subtitle": "Whether you're ready to start or just exploring options — we're here. No pressure, no generic pitch deck. Just a real conversation about your growth goals."
  },
  "methods": {
    "items": [
      {
        "icon": "📞",
        "iconSize": 32,
        "iconOffsetX": 0,
        "iconOffsetY": 0,
        "color": "purple",
        "showBg": true,
        "title": "Call Us",
        "link": {
          "label": "(888) 555-1234",
          "href": "tel:+18885551234"
        },
        "detail": "Mon–Fri · 8am–6pm CT"
      },
      {
        "icon": "📧",
        "iconSize": 32,
        "iconOffsetX": 0,
        "iconOffsetY": 0,
        "color": "blue",
        "showBg": true,
        "title": "Email",
        "link": {
          "label": "hello@dastifydigital.com",
          "href": "mailto:hello@dastifydigital.com"
        },
        "detail": "We reply within 4 hours"
      },
      {
        "icon": "📅",
        "iconSize": 32,
        "iconOffsetX": 0,
        "iconOffsetY": 0,
        "color": "green",
        "showBg": true,
        "title": "Book a Call",
        "link": {
          "label": "Schedule a 30-min strategy call",
          "href": "/demo"
        },
        "detail": "Free. No strings attached."
      },
      {
        "icon": "📍",
        "iconSize": 32,
        "iconOffsetX": 0,
        "iconOffsetY": 0,
        "color": "purple",
        "showBg": true,
        "title": "Visit Us",
        "detail": "2100 Ross Avenue, Suite 800 Dallas, TX 75201"
      }
    ]
  },
  "contactForm": {
    "watermark": "Talk",
    "info": {
      "title": "Tell Us About Your Practice.",
      "titleTag": "h2",
      "description": "Fill out the form and a healthcare marketing strategist — not a sales rep — will reach out within one business day to discuss your specific situation.",
      "promises": [
        {
          "icon": "✓",
          "title": "No generic proposals.",
          "text": "Every response is tailored to your specialty, market, and growth stage."
        },
        {
          "icon": "✓",
          "title": "HIPAA-aware from first contact.",
          "text": "Our team is trained on healthcare compliance from day one."
        },
        {
          "icon": "✓",
          "title": "Transparent pricing.",
          "text": "We'll give you a clear scope and investment range on the first call."
        }
      ],
      "response": {
        "icon": "⚡",
        "title": "Average response time: 4 hours.",
        "text": "Most inquiries receive a personalized reply the same business day."
      }
    },
    "form": {
      "rows": [
        {
          "fields": [
            {
              "name": "firstName",
              "label": "First Name *",
              "type": "text",
              "placeholder": "Jane"
            },
            {
              "name": "lastName",
              "label": "Last Name *",
              "type": "text",
              "placeholder": "Smith"
            }
          ]
        },
        {
          "fields": [
            {
              "name": "workEmail",
              "label": "Work Email *",
              "type": "email",
              "placeholder": "jane@practice.com"
            },
            {
              "name": "phone",
              "label": "Phone",
              "type": "tel",
              "placeholder": "(555) 123-4567"
            }
          ]
        },
        {
          "fields": [
            {
              "name": "organization",
              "label": "Practice / Organization *",
              "type": "text",
              "placeholder": "Your practice or health system name"
            },
            {
              "name": "specialty",
              "label": "Specialty",
              "type": "select",
              "options": [
                "Select your specialty",
                "Dental",
                "Orthopedics",
                "Dermatology",
                "Cardiology",
                "Mental Health",
                "Primary Care",
                "Ophthalmology",
                "Plastic Surgery",
                "Multi-Specialty Group",
                "Health System / Hospital",
                "Other"
              ]
            }
          ]
        },
        {
          "fields": [
            {
              "name": "locations",
              "label": "Number of Locations",
              "type": "select",
              "options": [
                "Select",
                "1 location",
                "2–5 locations",
                "6–20 locations",
                "20+ locations"
              ]
            },
            {
              "name": "interest",
              "label": "What Are You Interested In?",
              "type": "select",
              "options": [
                "Select a service",
                "Healthcare SEO",
                "Paid Media (PPC)",
                "Website Design",
                "Content Marketing",
                "Reputation Management",
                "Full-Service Marketing",
                "Not sure — need guidance"
              ]
            }
          ]
        },
        {
          "fields": [
            {
              "name": "goals",
              "label": "Tell Us About Your Goals",
              "type": "textarea",
              "placeholder": "What challenges are you facing? What does success look like for your practice?",
              "full": true
            }
          ]
        }
      ],
      "submitLabel": "Send Message →",
      "privacyText": "Your information is secure. We never share data with third parties.",
      "privacyLink": {
        "label": "Privacy Policy",
        "href": "/privacy"
      }
    }
  },
  "map": {
    "embedHtml": "",
    "imageAlt": "Interactive Map Embed",
    "placeholder": {
      "icon": "🗺️",
      "label": "Interactive Map Embed",
      "dimText": "Full Width × 400px · Google Maps Embed",
      "dimensions": "3 / 1",
      "preservePlaceholderChrome": false,
      "placeholderBackground": "var(--bg3)",
      "placeholderBorderColor": "transparent",
      "placeholderBorderWidth": "0",
      "placeholderBorderStyle": "none",
      "placeholderPadding": "40px 24px",
      "placeholderGap": "10px",
      "placeholderRadius": "0px",
      "placeholderShowOverlay": true,
      "placeholderOverlay": "linear-gradient(135deg,var(--blue-lt),transparent 60%)"
    }
  },
  "faq": {
    "chipText": "Common Questions",
    "title": "Before You Reach Out",
    "titleTag": "h2",
    "description": "Answers to the questions healthcare marketers ask most often. Still have questions? We're a phone call away.",
    "callCta": {
      "label": "Call (888) 555-1234 →",
      "href": "tel:+18885551234"
    },
    "items": [
      {
        "question": "How quickly can you start working on our account?",
        "answer": "Most engagements kick off within 2 weeks of contract signing. We start with a comprehensive market audit and competitive analysis during the first week, then move into strategy architecture and campaign build. Paid media campaigns are typically live within 3 weeks of kickoff."
      },
      {
        "question": "Do you require long-term contracts?",
        "answer": "We work on 6-month minimum engagements for most services. Healthcare marketing requires time to build momentum — SEO results take 90+ days, and PPC campaigns need 4–6 weeks of optimization. We're transparent about timelines and will never lock you into a contract that doesn't make sense for your growth stage."
      },
      {
        "question": "What makes you different from other healthcare marketing agencies?",
        "answer": "Three things: our team has worked inside health systems (not just marketed to them), every campaign we run is HIPAA-compliant by default (not as an afterthought), and we report on patient metrics — not vanity metrics like impressions or clicks. We track patients booked, revenue generated, and cost-per-acquisition."
      },
      {
        "question": "What's your pricing structure?",
        "answer": "Pricing depends on scope, number of locations, and services needed. Most single-location practices invest $3,000–$8,000/month. Multi-location groups and health systems typically invest $8,000–$25,000/month. We provide transparent pricing after the initial strategy call — no hidden fees, no surprise invoices."
      },
      {
        "question": "Can you work with our existing website and EMR system?",
        "answer": "Yes. We integrate with all major EMR systems including Epic, Athenahealth, Kareo, and DrChrono for conversion tracking and appointment attribution. For websites, we can optimize your existing site or build a new one from scratch — depending on what your growth goals require."
      }
    ]
  },
  "cta": {
    "title": "Your Competitors Aren't Waiting.",
    "titleTag": "h2",
    "subtitle": "Every day without a growth strategy is a day your competitors capture patients that should be yours.",
    "primaryCta": {
      "label": "Book Free Audit →",
      "href": "/demo"
    },
    "secondaryCta": {
      "label": "See Real Results",
      "href": "/work"
    }
  },
  "footer": {
    "brand": {
      "namePrimary": "Dastify",
      "nameAccent": ".",
      "nameSecondary": "Digital",
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