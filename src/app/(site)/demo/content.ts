export type PageContent = {
  nav: {
    logoText: string;
    logoDot: string;
    logoHref: string;
    links: { label: string; href: string }[];
    cta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  hero: {
    watermark: string;
    badge: string;
    title: string;
    titleTag?: "h1" | "h2" | "h3";
    subtitle: string;
    formId?: string | number | null;
    deliverables: { number: string; color: "purple" | "blue" | "green"; title: string; description: string }[];
    trustItems: { icon: string; label: string }[];
    form: {
      title: string;
      subtitle: string;
      rows: {
        fields: {
          name: string;
          label: string;
          type: "text" | "email" | "tel" | "url" | "select";
          placeholder: string;
          full?: boolean;
          options?: string[];
        }[];
      }[];
      submitLabel: string;
      note: string;
      noteLink: { label: string; href: string };
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  process: {
    watermark: string;
    chip: string;
    title: string;
    titleTag?: "h2" | "h3";
    subtitle: string;
    steps: { number: string; title: string; description: string; time: string }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  results: {
    chip: string;
    title: string;
    titleTag?: "h2" | "h3";
    subtitle: string;
    items: { stat: string; label: string; description: string; clientBadge: string }[];
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  testimonial: {
    quoteMark: string;
    quote: string;
    name: string;
    role: string;
    avatar: {
      image?: string;
      imageAlt?: string;
      placeholderIcon: string;
      placeholderLabel: string;
      placeholderDimensions: string;
      imageFit?: string;
      imagePosition?: string;
      imageRadius?: string;
      preservePlaceholderChrome?: boolean;
      placeholderBackground?: string;
      placeholderBorderColor?: string;
      placeholderBorderWidth?: string;
      placeholderBorderStyle?: string;
      placeholderPadding?: string;
      placeholderGap?: string;
      placeholderRadius?: string;
      placeholderShowOverlay?: boolean;
      placeholderOverlay?: string;
    };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  urgency: {
    title: string;
    titleTag?: "h2" | "h3";
    subtitle: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
  footer: {
    brandName: string;
    brandDot: string;
    brandDescription: string;
    socialLinks: { label: string; href: string }[];
    columns: {
      title: string;
      links: { label: string; href: string; emphasis?: boolean }[];
    }[];
    copy: string;
    badges: string[];
    editor?: {
      nodes?: Record<string, { tag?: "h1" | "h2" | "h3" | "h4" | "p" | "span"; styles?: { color?: string; backgroundColor?: string; fontSize?: string; fontWeight?: string; lineHeight?: string; letterSpacing?: string; textTransform?: string; textAlign?: "left" | "center" | "right"; marginTop?: string; marginBottom?: string; paddingTop?: string; paddingBottom?: string; paddingLeft?: string; paddingRight?: string; borderColor?: string; borderWidth?: string; borderRadius?: string } }>;
    };
  };
};

export const defaultContent: PageContent = {
  nav: {
    logoText: "Dastify",
    logoDot: ".Digital",
    logoHref: "/",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" }
    ],
    cta: { label: "Book Free Audit →", href: "/demo" },
    editor: { nodes: {} }
  },
  hero: {
    watermark: "Go",
    badge: "✓ Free · No Obligation",
    title: "Get Your Free Healthcare Marketing Audit.",
    titleTag: "h1",
    subtitle: "30 minutes. A senior strategist — not a sales rep — will show you exactly where your practice is leaving patients on the table and how to fix it.",
    deliverables: [
      { number: "1", color: "purple", title: "Competitor Gap Analysis", description: "We'll show you who's outranking you, how much they're spending, and where the opportunities are in your market." },
      { number: "2", color: "blue", title: "HIPAA Compliance Check", description: "We'll audit your current tracking setup and identify any PHI exposure risks in your website and ad campaigns." },
      { number: "3", color: "green", title: "Custom Growth Roadmap", description: "You'll leave with a prioritized 90-day action plan — channels, budget allocation, and expected patient volume impact." }
    ],
    trustItems: [
      { icon: "✓", label: "HIPAA Compliant" },
      { icon: "✓", label: "No contracts required" },
      { icon: "✓", label: "1000+ practices served" }
    ],
    form: {
      title: "Request Your Free Audit",
      subtitle: "Takes 60 seconds. We'll reach out within one business day.",
      rows: [
        { fields: [
          { name: "firstName", label: "First Name *", type: "text", placeholder: "Jane" },
          { name: "lastName", label: "Last Name *", type: "text", placeholder: "Smith" }
        ]},
        { fields: [
          { name: "workEmail", label: "Work Email *", type: "email", placeholder: "jane@practice.com", full: true }
        ]},
        { fields: [
          { name: "phone", label: "Phone *", type: "tel", placeholder: "(555) 123-4567" },
          { name: "practiceName", label: "Practice Name *", type: "text", placeholder: "Your practice name" }
        ]},
        { fields: [
          { name: "specialty", label: "Specialty *", type: "select", placeholder: "Select your specialty", options: ["Dental","Orthopedics","Dermatology","Cardiology","Mental Health","Primary Care","Ophthalmology","Plastic Surgery","Multi-Specialty Group","Health System / Hospital","Other"] },
          { name: "locations", label: "Number of Locations", type: "select", placeholder: "Select", options: ["1 location","2–5 locations","6–20 locations","20+ locations"] }
        ]},
        { fields: [
          { name: "challenge", label: "What's Your Biggest Marketing Challenge?", type: "select", placeholder: "Select", full: true, options: ["Not enough new patients","Poor online reviews","Website doesn't convert","Wasting money on ads","No online visibility (SEO)","HIPAA compliance concerns","Need a full strategy overhaul","Other / multiple challenges"] }
        ]},
        { fields: [
          { name: "websiteUrl", label: "Website URL (optional)", type: "url", placeholder: "https://yourpractice.com", full: true }
        ]}
      ],
      submitLabel: "Request Free Audit →",
      note: "Your data is secure. We never share information with third parties.",
      noteLink: { label: "Privacy Policy", href: "/privacy" }
    },
    editor: { nodes: {} }
  },
  process: {
    watermark: "Next",
    chip: "What Happens Next",
    title: "From Form to Growth Plan in 72 Hours.",
    titleTag: "h2",
    subtitle: "A clear, no-pressure process designed for busy healthcare professionals.",
    steps: [
      { number: "1", title: "You Submit", description: "Fill out the form above. Takes 60 seconds. We start researching your market immediately.", time: "Today" },
      { number: "2", title: "We Research", description: "Our team audits your online presence, competitors, and HIPAA compliance posture before we meet.", time: "Within 24 hours" },
      { number: "3", title: "Strategy Call", description: "30-minute call with a senior strategist. We walk through findings and your custom growth roadmap.", time: "Within 48 hours" },
      { number: "4", title: "Your Roadmap", description: "You receive a documented 90-day action plan with channels, budget ranges, and projected patient impact.", time: "Within 72 hours" }
    ],
    editor: { nodes: {} }
  },
  results: {
    chip: "Real Results",
    title: "What Happens After the Audit.",
    titleTag: "h2",
    subtitle: "Results from practices that started with the same free audit you're about to request.",
    items: [
      { stat: "+309%", label: "Organic Traffic Growth", description: "Multi-location dermatology group went from 1,200 to 4,900 monthly organic visits in 6 months through targeted healthcare SEO.", clientBadge: "Dermatology · 5 Locations" },
      { stat: "47", label: "New Patients in 60 Days", description: "Dental practice captured 47 new patients from organic search alone after rebuilding their local SEO and content strategy.", clientBadge: "Dental · 3 Locations" },
      { stat: "$2.1M", label: "Revenue Attributed to PPC", description: "Orthopedic surgery center generated $2.1M in attributable revenue through HIPAA-compliant Google Ads in the first year.", clientBadge: "Orthopedics · 8 Locations" }
    ],
    editor: { nodes: {} }
  },
  testimonial: {
    quoteMark: '"',
    quote: "The audit alone was worth more than what we were paying our previous agency monthly. They found three HIPAA compliance gaps in our ad tracking that could have cost us six figures in fines.",
    name: "Dr. Rebecca Okonkwo",
    role: "CMO, Heartland Cardiology Associates",
    avatar: {
      placeholderIcon: "👤",
      placeholderLabel: "Avatar",
      placeholderDimensions: "48x48",
      image: "",
      imageAlt: "",
      imageFit: "cover",
      imagePosition: "center",
      imageRadius: "50%",
      preservePlaceholderChrome: true,
      placeholderBackground: "var(--bg4)",
      placeholderBorderColor: "var(--bd-md)",
      placeholderBorderWidth: "1px",
      placeholderBorderStyle: "dashed",
      placeholderPadding: "0",
      placeholderGap: "0",
      placeholderRadius: "50%",
      placeholderShowOverlay: false,
      placeholderOverlay: ""
    },
    editor: { nodes: {} }
  },
  urgency: {
    title: "Your Competitors Are Already Marketing to Your Patients.",
    titleTag: "h2",
    subtitle: "Every day without a compliant growth strategy is a day they capture patients that should be yours. The audit is free. The insight is priceless.",
    primaryCta: { label: "Request Free Audit ↑", href: "#top" },
    secondaryCta: { label: "Contact Us Instead", href: "/contact" },
    editor: { nodes: {} }
  },
  footer: {
    brandName: "Dastify",
    brandDot: ".Digital",
    brandDescription: "The creative authority for healthcare growth. HIPAA-compliant marketing that fills schedules.",
    socialLinks: [
      { label: "Li", href: "#" },
      { label: "X", href: "#" },
      { label: "Ig", href: "#" }
    ],
    columns: [
      { title: "Services", links: [
        { label: "Healthcare SEO", href: "#" },
        { label: "Paid Media", href: "#" },
        { label: "Web Design", href: "#" },
        { label: "Content Marketing", href: "#" },
        { label: "Reputation Management", href: "#" },
        { label: "Marketing Automation", href: "#" }
      ]},
      { title: "Specialties", links: [
        { label: "Dental Practices", href: "#" },
        { label: "Orthopedics", href: "#" },
        { label: "Dermatology", href: "#" },
        { label: "Cardiology", href: "#" },
        { label: "Mental Health", href: "#" },
        { label: "Multi-Location", href: "#" }
      ]},
      { title: "Contact", links: [
        { label: "hello@dastifydigital.com", href: "mailto:hello@dastifydigital.com" },
        { label: "(888) 555-1234", href: "tel:+18885551234" },
        { label: "Book a Strategy Call →", href: "/demo", emphasis: true }
      ]}
    ],
    copy: "© 2026 Dastify Digital. All rights reserved.",
    badges: ["HIPAA Compliant", "Google Partner"],
    editor: { nodes: {} }
  }
};
