import type { ConvertedSectionEditorState } from '@/lib/converted-pages/types';

type EditableSection<T> = T & {
  editor?: ConvertedSectionEditorState;
};

export type ExpectItem = { icon: string; text: string };

export type SchedulerData = {
  title: string;
  datesLabel: string;
  timesLabel: string;
  timezoneLabel: string;
  // Times shown per day. Verbatim copy from design.
  times: string[];
  // How many business days forward to show. Default 10 weekdays.
  daysToShow: number;
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

export type BookingFormData = {
  title: string;
  rows: { fields: FormField[] }[];
  submitLabel: string;
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
};

export type SidebarCard =
  | { kind: 'list'; title: string; items: ExpectItem[] }
  | { kind: 'note'; title: string; body: string }
  | { kind: 'call'; title: string; body: string; phoneLabel: string; phoneHref: string };

export type SidebarData = {
  cards: SidebarCard[];
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
  scheduler: EditableSection<SchedulerData>;
  form: EditableSection<BookingFormData>;
  sidebar: EditableSection<SidebarData>;
};

export const defaultContent: PageContent = {
  meta: {
    title: 'Book A Session — Dastify Digital | Healthcare Marketing Strategy Call',
    description:
      '30 minutes with a healthcare marketing strategist. No obligation, no pressure — just a clear view of where your practice stands and where it can go.',
  },
  hero: {
    badge: 'Book A Session',
    heading: 'Your growth audit<br/>starts <em>here</em>.',
    sub:
      '30 minutes with a healthcare marketing strategist. No obligation, no pressure — just a clear view of where your practice stands and where it can go.',
  },
  scheduler: {
      title: 'Select a Date & Time',
      datesLabel: 'Available dates',
      timesLabel: 'Available times (EST)',
      timezoneLabel: 'EST',
      times: [
        '9:00 AM',
        '9:30 AM',
        '10:00 AM',
        '10:30 AM',
        '11:00 AM',
        '11:30 AM',
        '1:00 PM',
        '1:30 PM',
        '2:00 PM',
        '2:30 PM',
        '3:00 PM',
        '3:30 PM',
        '4:00 PM',
        '4:30 PM',
      ],
      daysToShow: 10,
    },
    form: {
      title: 'Your Information',
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
              full: true,
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
          ],
        },
        {
          fields: [
            {
              name: 'notes',
              label: 'Goals & Notes',
              type: 'textarea',
              placeholder: 'What are your biggest growth challenges right now?',
              rows: 3,
              full: true,
            },
          ],
        },
      ],
      submitLabel: 'Confirm Booking',
      successTitle: 'You’re booked.',
      successBody: 'A confirmation is on its way to your inbox. We’ll see you soon.',
      errorTitle: "Something didn’t go through.",
      errorBody: 'Please try again, or email us directly at hello@dastifydigital.com.',
    },
    sidebar: {
      cards: [
        {
          kind: 'list',
          title: 'What to Expect',
          items: [
            { icon: 'check', text: '30-minute video or phone call' },
            { icon: 'check', text: 'Review of your current digital presence' },
            { icon: 'check', text: 'Competitor landscape snapshot' },
            { icon: 'check', text: '3 actionable growth opportunities' },
            { icon: 'check', text: 'Custom roadmap if we’re a fit' },
          ],
        },
        {
          kind: 'note',
          title: 'No Obligation',
          body:
            'This is a genuine strategy conversation, not a sales pitch. If we’re not the right fit, we’ll tell you — and point you in the right direction.',
        },
        {
          kind: 'call',
          title: 'Prefer to Call?',
          body: 'Reach us directly at:',
          phoneLabel: '(770) 462-4237',
          phoneHref: 'tel:+17704624237',
        },
    ],
  },
};
