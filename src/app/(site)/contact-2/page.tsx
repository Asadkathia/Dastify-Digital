import type { Metadata } from "next";
import { NavbarScrollState } from "@/app/components/home/NavbarScrollState";
import { ScrollRevealController } from "@/app/components/home/ScrollRevealController";
import ContactNavbar from "./components/ContactNavbar";
import ContactHero from "./components/ContactHero";
import ContactMethods from "./components/ContactMethods";
import ContactFormSection from "./components/ContactFormSection";
import ContactMap from "./components/ContactMap";
import ContactFaq from "./components/ContactFaq";
import ContactCta from "./components/ContactCta";
import { SiteFooter } from "@/components/SiteFooter";
import { getFooter } from "@/lib/cms/queries";
import type { PageContent } from "./components/types";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Contact Us — Dastify Digital | Healthcare Marketing Agency",
    description:
      "Get in touch with Dastify Digital. Book a strategy call, request a proposal, or ask about our HIPAA-compliant healthcare marketing services.",
  };
}

const defaultContent: PageContent = {
  nav: {
    logoTextPrimary: "Dastify",
    logoTextAccent: ".",
    logoTextSecondary: "Digital",
    logoText: "Dastify.Digital",
    logoHref: "/",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/work" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact", active: true },
    ],
    cta: { label: "Book Free Audit →", href: "/demo" },
  },
  hero: {
    chipText: "Get in Touch",
    watermark: "Hi",
    title: "Let's Talk About Growing Your Practice.",
    titleTag: "h1",
    subtitle:
      "Whether you're ready to start or just exploring options — we're here. No pressure, no generic pitch deck. Just a real conversation about your growth goals.",
  },
  methods: {
    items: [
      {
        icon: "📞",
        color: "purple",
        title: "Call Us",
        link: { label: "(888) 555-1234", href: "tel:+18885551234" },
        detail: "Mon–Fri · 8am–6pm CT",
      },
      {
        icon: "📧",
        color: "blue",
        title: "Email",
        link: { label: "hello@dastifydigital.com", href: "mailto:hello@dastifydigital.com" },
        detail: "We reply within 4 hours",
      },
      {
        icon: "📅",
        color: "green",
        title: "Book a Call",
        link: { label: "Schedule a 30-min strategy call", href: "/demo" },
        detail: "Free. No strings attached.",
      },
      {
        icon: "📍",
        color: "purple",
        title: "Visit Us",
        detail: "2100 Ross Avenue, Suite 800 Dallas, TX 75201",
      },
    ],
  },
  contactForm: {
    watermark: "Talk",
    info: {
      title: "Tell Us About Your Practice.",
      titleTag: "h2",
      description:
        "Fill out the form and a healthcare marketing strategist — not a sales rep — will reach out within one business day to discuss your specific situation.",
      promises: [
        {
          icon: "✓",
          title: "No generic proposals.",
          text: "Every response is tailored to your specialty, market, and growth stage.",
        },
        {
          icon: "✓",
          title: "HIPAA-aware from first contact.",
          text: "Our team is trained on healthcare compliance from day one.",
        },
        {
          icon: "✓",
          title: "Transparent pricing.",
          text: "We'll give you a clear scope and investment range on the first call.",
        },
      ],
      response: {
        icon: "⚡",
        title: "Average response time: 4 hours.",
        text: "Most inquiries receive a personalized reply the same business day.",
      },
    },
    form: {
      rows: [
        {
          fields: [
            { name: "firstName", label: "First Name *", type: "text", placeholder: "Jane" },
            { name: "lastName", label: "Last Name *", type: "text", placeholder: "Smith" },
          ],
        },
        {
          fields: [
            { name: "workEmail", label: "Work Email *", type: "email", placeholder: "jane@practice.com" },
            { name: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
          ],
        },
        {
          fields: [
            {
              name: "organization",
              label: "Practice / Organization *",
              type: "text",
              placeholder: "Your practice or health system name",
            },
            {
              name: "specialty",
              label: "Specialty",
              type: "select",
              options: [
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
                "Other",
              ],
            },
          ],
        },
        {
          fields: [
            {
              name: "locations",
              label: "Number of Locations",
              type: "select",
              options: ["Select", "1 location", "2–5 locations", "6–20 locations", "20+ locations"],
            },
            {
              name: "interest",
              label: "What Are You Interested In?",
              type: "select",
              options: [
                "Select a service",
                "Healthcare SEO",
                "Paid Media (PPC)",
                "Website Design",
                "Content Marketing",
                "Reputation Management",
                "Full-Service Marketing",
                "Not sure — need guidance",
              ],
            },
          ],
        },
        {
          fields: [
            {
              name: "goals",
              label: "Tell Us About Your Goals",
              type: "textarea",
              placeholder:
                "What challenges are you facing? What does success look like for your practice?",
              full: true,
            },
          ],
        },
      ],
      submitLabel: "Send Message →",
      privacyText: "Your information is secure. We never share data with third parties.",
      privacyLink: { label: "Privacy Policy", href: "/privacy" },
    },
  },
  map: {
    imageAlt: "Interactive Map Embed",
    placeholder: {
      icon: "🗺️",
      label: "Interactive Map Embed",
      dimText: "Full Width × 400px · Google Maps Embed",
      dimensions: "3 / 1",
      preservePlaceholderChrome: false,
      placeholderBackground: "var(--bg3)",
      placeholderBorderColor: "transparent",
      placeholderBorderWidth: "0",
      placeholderBorderStyle: "none",
      placeholderPadding: "40px 24px",
      placeholderGap: "10px",
      placeholderRadius: "0px",
      placeholderShowOverlay: true,
      placeholderOverlay: "linear-gradient(135deg,var(--blue-lt),transparent 60%)",
    },
  },
  faq: {
    chipText: "Common Questions",
    title: "Before You Reach Out",
    titleTag: "h2",
    description:
      "Answers to the questions healthcare marketers ask most often. Still have questions? We're a phone call away.",
    callCta: { label: "Call (888) 555-1234 →", href: "tel:+18885551234" },
    items: [
      {
        question: "How quickly can you start working on our account?",
        answer:
          "Most engagements kick off within 2 weeks of contract signing. We start with a comprehensive market audit and competitive analysis during the first week, then move into strategy architecture and campaign build. Paid media campaigns are typically live within 3 weeks of kickoff.",
      },
      {
        question: "Do you require long-term contracts?",
        answer:
          "We work on 6-month minimum engagements for most services. Healthcare marketing requires time to build momentum — SEO results take 90+ days, and PPC campaigns need 4–6 weeks of optimization. We're transparent about timelines and will never lock you into a contract that doesn't make sense for your growth stage.",
      },
      {
        question: "What makes you different from other healthcare marketing agencies?",
        answer:
          "Three things: our team has worked inside health systems (not just marketed to them), every campaign we run is HIPAA-compliant by default (not as an afterthought), and we report on patient metrics — not vanity metrics like impressions or clicks. We track patients booked, revenue generated, and cost-per-acquisition.",
      },
      {
        question: "What's your pricing structure?",
        answer:
          "Pricing depends on scope, number of locations, and services needed. Most single-location practices invest $3,000–$8,000/month. Multi-location groups and health systems typically invest $8,000–$25,000/month. We provide transparent pricing after the initial strategy call — no hidden fees, no surprise invoices.",
      },
      {
        question: "Can you work with our existing website and EMR system?",
        answer:
          "Yes. We integrate with all major EMR systems including Epic, Athenahealth, Kareo, and DrChrono for conversion tracking and appointment attribution. For websites, we can optimize your existing site or build a new one from scratch — depending on what your growth goals require.",
      },
    ],
  },
  cta: {
    title: "Your Competitors Aren't Waiting.",
    titleTag: "h2",
    subtitle:
      "Every day without a growth strategy is a day your competitors capture patients that should be yours.",
    primaryCta: { label: "Book Free Audit →", href: "/demo" },
    secondaryCta: { label: "See Real Results", href: "/work" },
  },
};

export default async function Page() {
  const content = defaultContent;
  const footer = await getFooter();

  return (
    <>
      <NavbarScrollState />
      <ScrollRevealController />
      <ContactNavbar data={content.nav} />
      <main>
        <ContactHero data={content.hero} />
        <ContactMethods data={content.methods} />
        <ContactFormSection data={content.contactForm} />
        <ContactMap data={content.map} />
        <ContactFaq data={content.faq} />
        <ContactCta data={content.cta} />
      </main>
      <SiteFooter footer={footer} />
    </>
  );
}
