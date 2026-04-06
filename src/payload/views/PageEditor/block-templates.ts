import type { BlockInstance } from './types';
import { createBlockInstance } from './block-registry';

export type BlockTemplate = {
  id: string;
  label: string;
  description: string;
  icon: string;
  blocks: () => BlockInstance[];
};

function make(blockType: string, overrides: Record<string, unknown> = {}): BlockInstance {
  const instance = createBlockInstance(blockType)!;
  instance.data = { ...instance.data, ...overrides };
  return instance;
}

export const blockTemplates: BlockTemplate[] = [
  {
    id: 'landing-page',
    label: 'Landing Page',
    description: 'Hero, stats, CTA, testimonials, FAQ',
    icon: '🚀',
    blocks: () => [
      make('hero-block', {
        eyebrow: 'Healthcare Marketing',
        title: 'Grow Your Practice With Proven Marketing',
        subtitle: 'Dastify Digital helps healthcare providers reach more patients and build lasting brand authority.',
        primaryCtaLabel: 'Get a Free Consultation',
        primaryCtaHref: '/contact',
        secondaryCtaLabel: 'See Our Work',
        secondaryCtaHref: '/case-studies',
      }),
      make('stats-block', {
        title: 'Our Impact in Numbers',
        items: [
          { value: '500+', label: 'Clients Served' },
          { value: '95%', label: 'Satisfaction Rate' },
          { value: '10x', label: 'Average ROI' },
          { value: '8 Years', label: 'Industry Experience' },
        ],
      }),
      make('testimonials-block', {
        title: 'What Our Clients Say',
        items: [
          { quote: 'Dastify transformed our patient acquisition. We saw a 3x increase in new bookings within 6 months.', name: 'Dr. Sarah Johnson', role: 'Medical Director, CityHealth Clinic' },
          { quote: 'The team understood our brand and delivered results that exceeded every expectation.', name: 'Dr. Mike Chen', role: 'Founder, Chen Family Practice' },
          { quote: 'Professional, responsive, and incredibly effective. Highly recommend to any healthcare provider.', name: 'Dr. Lisa Park', role: 'Practice Owner, Park Dental' },
        ],
      }),
      make('cta-block', {
        title: 'Ready to Grow Your Practice?',
        subtitle: 'Join 500+ healthcare providers who trust Dastify Digital.',
        buttonLabel: 'Start Today',
        buttonHref: '/contact',
      }),
      make('faq-block', {
        title: 'Frequently Asked Questions',
        items: [
          { question: 'What types of healthcare providers do you work with?', answer: 'We work with physicians, dentists, specialists, clinics, hospitals, and allied health providers across all specialties.' },
          { question: 'How long does it take to see results?', answer: 'Most clients see measurable improvements within 60–90 days, with significant growth typically achieved within 6 months.' },
          { question: 'Do you offer a free consultation?', answer: 'Yes — we offer a complimentary 30-minute strategy call to understand your goals and explain how we can help.' },
        ],
      }),
    ],
  },

  {
    id: 'service-page',
    label: 'Service Page',
    description: 'Hero, feature detail, stats, CTA',
    icon: '🏥',
    blocks: () => [
      make('hero-block', {
        eyebrow: 'Our Services',
        title: 'Service Name',
        subtitle: 'A brief description of what this service delivers and why it matters to your clients.',
        primaryCtaLabel: 'Get Started',
        primaryCtaHref: '/contact',
      }),
      make('text-image-block', {
        title: 'What We Deliver',
        text: 'Describe the core value of this service, how it works, and the outcomes clients can expect. Focus on benefits, not just features.',
        layout: 'right',
      }),
      make('stats-block', {
        title: 'Results That Speak for Themselves',
        items: [
          { value: '300%', label: 'Average Traffic Increase' },
          { value: '60 Days', label: 'Time to First Results' },
          { value: '98%', label: 'Client Retention Rate' },
        ],
      }),
      make('cta-block', {
        title: 'Let\'s Build Your Growth Strategy',
        subtitle: 'Talk to one of our specialists today.',
        buttonLabel: 'Book a Free Call',
        buttonHref: '/contact',
      }),
    ],
  },

  {
    id: 'about-page',
    label: 'About Page',
    description: 'Hero, story, values, team CTA',
    icon: '👥',
    blocks: () => [
      make('hero-block', {
        eyebrow: 'About Us',
        title: 'The Creative Authority for Healthcare Growth',
        subtitle: 'We are a specialist healthcare marketing agency helping providers grow their practice and reach more patients.',
        primaryCtaLabel: 'Meet the Team',
        primaryCtaHref: '#team',
      }),
      make('rich-text-block', {
        content: 'Founded in 2016, Dastify Digital was built on a single belief: healthcare providers deserve marketing partners who truly understand their world.\n\nWe combine deep industry knowledge with cutting-edge digital strategy to deliver campaigns that attract patients, build trust, and drive sustainable growth.\n\nToday we work with over 500 healthcare providers across the region, from solo practitioners to multi-location hospital networks.',
      }),
      make('stats-block', {
        title: 'Dastify by the Numbers',
        items: [
          { value: '2016', label: 'Founded' },
          { value: '500+', label: 'Clients' },
          { value: '40+', label: 'Team Members' },
          { value: '12', label: 'Industry Awards' },
        ],
      }),
      make('testimonials-block', {
        title: 'Trusted by Leading Providers',
        items: [
          { quote: 'Dastify doesn\'t just understand marketing — they understand healthcare. That makes all the difference.', name: 'Dr. James Wilson', role: 'CEO, MedGroup Network' },
          { quote: 'A genuine partner. They care about our patients almost as much as we do.', name: 'Dr. Priya Sharma', role: 'Director, Sharma Wellness' },
        ],
      }),
      make('cta-block', {
        title: 'Work With Us',
        subtitle: 'Let\'s talk about what we can build together.',
        buttonLabel: 'Get in Touch',
        buttonHref: '/contact',
      }),
    ],
  },

  {
    id: 'contact-page',
    label: 'Contact Page',
    description: 'Hero, details, FAQ',
    icon: '📬',
    blocks: () => [
      make('hero-block', {
        eyebrow: 'Contact Us',
        title: 'Let\'s Start a Conversation',
        subtitle: 'Tell us about your practice and your goals. We\'ll get back to you within one business day.',
        primaryCtaLabel: 'Send a Message',
        primaryCtaHref: '#contact-form',
      }),
      make('text-image-block', {
        title: 'Get in Touch',
        text: 'Email: hello@dastify.com\nPhone: +1 (555) 123-4567\nOffice: 123 Healthcare Blvd, Suite 400\n\nBusiness hours: Monday – Friday, 9am – 6pm',
        layout: 'right',
      }),
      make('faq-block', {
        title: 'Common Questions',
        items: [
          { question: 'How quickly will you respond?', answer: 'We respond to all enquiries within one business day. Urgent matters can be flagged by phone.' },
          { question: 'Do you work with international clients?', answer: 'Yes — we work with healthcare providers across multiple countries and time zones.' },
          { question: 'Is the initial consultation free?', answer: 'Absolutely. Our 30-minute discovery call is complimentary and comes with no obligation.' },
        ],
      }),
    ],
  },
];

export function getTemplateById(id: string): BlockTemplate | undefined {
  return blockTemplates.find((t) => t.id === id);
}
