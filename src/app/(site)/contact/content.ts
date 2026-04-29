import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
};

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  full?: boolean;
  options?: string[];
};

export type FormData = {
  title: string;
  sub: string;
  rows: { fields: FormField[] }[];
  consent: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
};

export type InfoData = {
  contact: {
    title: string;
    items: { icon: string; label: string; value: string }[];
  };
  office: {
    title: string;
    mapImage: string;
    mapAlt: string;
    address: string;
  };
  social: {
    title: string;
    links: { label: string; href: string }[];
  };
};

export type PageContent = {
  meta: {
    title: string;
    description: string;
  };
  hero: EditableSection<{
    badge: string;
    heading: string;
    sub: string;
  }>;
  main: EditableSection<{
    form: FormData;
    info: InfoData;
  }>;
};

export const defaultContent: PageContent = {
  meta: {
    title: 'Contact — Dastify Digital | Get In Touch',
    description:
      "Whether you're exploring options or ready to move, we're here to help your practice grow. Send us a message and a strategist will respond within one business day.",
  },
  hero: {
    badge: 'Get in Touch',
    heading: "Let's start a <em>conversation</em>.",
    sub: "Whether you're exploring options or ready to move, we're here to help your practice grow.",
  },
  main: {
    form: {
      title: 'Send us a message',
      sub: "Fill out the form below and we'll get back to you within one business day.",
      rows: [
        {
          fields: [
            { name: 'fullName', label: 'Full Name *', type: 'text', placeholder: 'Dr. Jane Smith', required: true },
            { name: 'email', label: 'Email *', type: 'email', placeholder: 'jane@practice.com', required: true },
          ],
        },
        {
          fields: [
            { name: 'phone', label: 'Phone', type: 'tel', placeholder: '(555) 123-4567' },
            { name: 'practiceName', label: 'Practice Name', type: 'text', placeholder: 'Atlanta Orthopedics' },
          ],
        },
        {
          fields: [
            {
              name: 'specialty',
              label: 'Specialty',
              type: 'select',
              options: [
                'Select specialty...',
                'Orthopedic',
                'Dental',
                'Dermatology',
                'Cosmetic/Aesthetic',
                'Mental Health',
                'Cardiology',
                'Fertility/IVF',
                'Telehealth',
                'Other',
              ],
            },
            {
              name: 'budget',
              label: 'Monthly Marketing Budget',
              type: 'select',
              options: [
                'Select range...',
                'Under $5,000',
                '$5,000 – $10,000',
                '$10,000 – $25,000',
                '$25,000 – $50,000',
                '$50,000+',
              ],
            },
          ],
        },
        {
          fields: [
            {
              name: 'message',
              label: 'Message',
              type: 'textarea',
              placeholder: 'Tell us about your goals, challenges, or questions...',
              rows: 4,
              full: true,
            },
          ],
        },
      ],
      consent:
        'I acknowledge this form is HIPAA-compliant and does not collect protected health information (PHI).',
      submitLabel: 'Send Message',
      successTitle: 'Thanks — your message is on its way.',
      successBody: "We'll be in touch within one business day.",
      errorTitle: "Something didn't go through.",
      errorBody: 'Please try again, or email us directly at hello@dastifydigital.com.',
    },
    info: {
      contact: {
        title: 'Contact Information',
        items: [
          { icon: 'phone', label: 'Phone', value: '(770) 462-4237' },
          { icon: 'calendar', label: 'Email', value: 'hello@dastifydigital.com' },
          { icon: 'search', label: 'Office Hours', value: 'Mon–Fri, 9:00 AM – 6:00 PM EST' },
        ],
      },
      office: {
        title: 'Our Office',
        mapImage: '',
        mapAlt: 'Atlanta office',
        address: 'Dastify Digital\nAtlanta, GA, United States',
      },
      social: {
        title: 'Follow Us',
        links: [
          { label: 'LinkedIn', href: '#' },
          { label: 'Instagram', href: '#' },
          { label: 'X (Twitter)', href: '#' },
        ],
      },
    },
  },
};
