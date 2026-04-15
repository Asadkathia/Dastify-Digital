import ContactNavbar from './components/ContactNavbar';
import ContactHero from './components/ContactHero';
import ContactMethods from './components/ContactMethods';
import ContactFormSection from './components/ContactFormSection';
import ContactMap from './components/ContactMap';
import ContactFaq from './components/ContactFaq';
import ContactCta from './components/ContactCta';
import ContactFooter from './components/ContactFooter';
import { defaultContent } from './content';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';
import type { FormDefinition } from '@/lib/forms/types';

const registry: ConvertedPageRegistry & { formDefinitions?: Record<string, FormDefinition> } = {
  pageName: 'contact-2',
  defaultContent: defaultContent as unknown as Record<string, unknown>,
  sections: [
    { key: 'nav',         label: 'Navbar',       icon: '🧭', className: 'nav',                  Component: ContactNavbar as never },
    { key: 'hero',        label: 'Hero',         icon: '🦸', className: 'contact2-hero',         Component: ContactHero as never },
    { key: 'methods',     label: 'Methods',      icon: '📞', className: 'contact2-methods',      Component: ContactMethods as never },
    { key: 'contactForm', label: 'Contact Form', icon: '📋', className: 'contact-form-section',  Component: ContactFormSection as never },
    { key: 'map',         label: 'Map',          icon: '🗺️', className: 'contact2-map',          Component: ContactMap as never },
    { key: 'faq',         label: 'FAQ',          icon: '❓', className: 'contact2-faq',          Component: ContactFaq as never },
    { key: 'cta',         label: 'CTA',          icon: '🎯', className: 'contact2-cta',          Component: ContactCta as never },
    { key: 'footer',      label: 'Footer',       icon: '🏁', className: 'contact2-footer',       Component: ContactFooter as never },
  ],
};

registry.formDefinitions = {
  contactForm: {
    title: 'Contact — Get In Touch',
    submitButtonLabel: 'Send Message →',
    confirmationMessage: "Thank you! We'll be in touch within one business day.",
    fields: [
      { name: 'firstName',    label: 'First Name',               type: 'text',     required: true,  width: 50,  placeholder: 'Jane' },
      { name: 'lastName',     label: 'Last Name',                type: 'text',     required: true,  width: 50,  placeholder: 'Smith' },
      { name: 'workEmail',    label: 'Work Email',               type: 'email',    required: true,  width: 50,  placeholder: 'jane@practice.com' },
      { name: 'phone',        label: 'Phone',                    type: 'tel',      required: false, width: 50,  placeholder: '(555) 123-4567' },
      { name: 'organization', label: 'Practice / Organization',  type: 'text',     required: true,  width: 50,  placeholder: 'Your practice or health system name' },
      { name: 'specialty',    label: 'Specialty',                type: 'select',   required: false, width: 50,  placeholder: 'Select your specialty', options: [
        { label: 'Dental',                   value: 'dental' },
        { label: 'Orthopedics',              value: 'orthopedics' },
        { label: 'Dermatology',              value: 'dermatology' },
        { label: 'Cardiology',               value: 'cardiology' },
        { label: 'Mental Health',            value: 'mental-health' },
        { label: 'Primary Care',             value: 'primary-care' },
        { label: 'Ophthalmology',            value: 'ophthalmology' },
        { label: 'Plastic Surgery',          value: 'plastic-surgery' },
        { label: 'Multi-Specialty Group',    value: 'multi-specialty' },
        { label: 'Health System / Hospital', value: 'health-system' },
        { label: 'Other',                    value: 'other' },
      ]},
      { name: 'locations', label: 'Number of Locations', type: 'select', required: false, width: 50, placeholder: 'Select', options: [
        { label: '1 location',    value: '1' },
        { label: '2–5 locations', value: '2-5' },
        { label: '6–20 locations', value: '6-20' },
        { label: '20+ locations', value: '20+' },
      ]},
      { name: 'interest', label: 'What Are You Interested In?', type: 'select', required: false, width: 50, placeholder: 'Select a service', options: [
        { label: 'Healthcare SEO',          value: 'seo' },
        { label: 'Paid Media (PPC)',         value: 'ppc' },
        { label: 'Website Design',          value: 'web-design' },
        { label: 'Content Marketing',       value: 'content' },
        { label: 'Reputation Management',   value: 'reputation' },
        { label: 'Full-Service Marketing',  value: 'full-service' },
        { label: 'Not sure — need guidance', value: 'guidance' },
      ]},
      { name: 'goals', label: 'Tell Us About Your Goals', type: 'textarea', required: false, width: 100, placeholder: 'What challenges are you facing? What does success look like for your practice?' },
    ],
  },
};

export default registry;
