import DemoNavbar from './components/DemoNavbar';
import DemoHero from './components/DemoHero';
import DemoProcess from './components/DemoProcess';
import DemoResults from './components/DemoResults';
import DemoTestimonial from './components/DemoTestimonial';
import DemoUrgency from './components/DemoUrgency';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';
import type { FormDefinition } from '@/lib/forms/types';

const registry: ConvertedPageRegistry & { formDefinitions?: Record<string, FormDefinition> } = {
  pageName: 'demo',
  defaultContent: defaultContent as unknown as Record<string, unknown>,
  sections: [
    { key: 'nav',         label: 'Navbar',      icon: '🧭', className: 'demo-nav',         Component: DemoNavbar as never },
    { key: 'hero',        label: 'Hero',        icon: '🦸', className: 'demo-hero',        Component: DemoHero as never },
    { key: 'process',     label: 'Process',     icon: '⚙️', className: 'demo-process',     Component: DemoProcess as never },
    { key: 'results',     label: 'Results',     icon: '📈', className: 'demo-results',     Component: DemoResults as never },
    { key: 'testimonial', label: 'Testimonial', icon: '💬', className: 'demo-testimonial', Component: DemoTestimonial as never },
    { key: 'urgency',     label: 'Urgency',     icon: '⚡', className: 'demo-urgency',     Component: DemoUrgency as never },
  ],
};

registry.formDefinitions = {
  // key = section key that receives the formId (hero.formId)
  hero: {
    title: 'Demo — Free Audit Request',
    submitButtonLabel: 'Request Free Audit →',
    confirmationMessage: "Thank you! A senior strategist will reach out within one business day.",
    fields: [
      { name: 'firstName',   label: 'First Name',              type: 'text',     required: true,  width: 50, placeholder: 'Jane' },
      { name: 'lastName',    label: 'Last Name',               type: 'text',     required: true,  width: 50, placeholder: 'Smith' },
      { name: 'workEmail',   label: 'Work Email',              type: 'email',    required: true,  width: 100, placeholder: 'jane@practice.com' },
      { name: 'phone',       label: 'Phone',                   type: 'tel',      required: true,  width: 50, placeholder: '(555) 123-4567' },
      { name: 'practiceName',label: 'Practice Name',           type: 'text',     required: true,  width: 50, placeholder: 'Your practice name' },
      { name: 'specialty',   label: 'Specialty',               type: 'select',   required: true,  width: 50, placeholder: 'Select your specialty', options: [
        { label: 'Dental',                    value: 'dental' },
        { label: 'Orthopedics',               value: 'orthopedics' },
        { label: 'Dermatology',               value: 'dermatology' },
        { label: 'Cardiology',                value: 'cardiology' },
        { label: 'Mental Health',             value: 'mental-health' },
        { label: 'Primary Care',              value: 'primary-care' },
        { label: 'Ophthalmology',             value: 'ophthalmology' },
        { label: 'Plastic Surgery',           value: 'plastic-surgery' },
        { label: 'Multi-Specialty Group',     value: 'multi-specialty' },
        { label: 'Health System / Hospital',  value: 'health-system' },
        { label: 'Other',                     value: 'other' },
      ]},
      { name: 'locations',   label: 'Number of Locations',     type: 'select',   required: false, width: 50, placeholder: 'Select', options: [
        { label: '1 location',      value: '1' },
        { label: '2–5 locations',   value: '2-5' },
        { label: '6–20 locations',  value: '6-20' },
        { label: '20+ locations',   value: '20+' },
      ]},
      { name: 'challenge',   label: "Biggest Marketing Challenge", type: 'select', required: false, width: 100, placeholder: 'Select', options: [
        { label: 'Not enough new patients',         value: 'new-patients' },
        { label: 'Poor online reviews',             value: 'reviews' },
        { label: "Website doesn't convert",         value: 'conversion' },
        { label: 'Wasting money on ads',            value: 'ads' },
        { label: 'No online visibility (SEO)',       value: 'seo' },
        { label: 'HIPAA compliance concerns',        value: 'hipaa' },
        { label: 'Need a full strategy overhaul',    value: 'strategy' },
        { label: 'Other / multiple challenges',      value: 'other' },
      ]},
      { name: 'websiteUrl',  label: 'Website URL (optional)',  type: 'url',      required: false, width: 100, placeholder: 'https://yourpractice.com' },
    ],
  },
};

export default registry;
