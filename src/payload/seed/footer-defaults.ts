import type { SiteFooterData } from '@/lib/cms/queries';

export const footerDefaults: SiteFooterData = {
  brand: {
    namePrefix: 'Dastify',
    accent: '.',
    nameSuffix: 'Digital',
    tagline:
      'The creative authority for healthcare growth. HIPAA-compliant campaigns that fill your calendar.',
    socials: [
      { platform: 'x', href: '#' },
      { platform: 'linkedin', href: '#' },
      { platform: 'youtube', href: '#' },
    ],
  },
  columns: [
    {
      title: 'Services',
      links: [
        { label: 'Healthcare SEO', href: '/services' },
        { label: 'Google Ads & PPC', href: '/services' },
        { label: 'Website Design', href: '/services' },
        { label: 'Reputation Management', href: '/services' },
        { label: 'Social Media', href: '/services' },
        { label: 'Email & SMS', href: '/services' },
      ],
    },
    {
      title: 'Specialties',
      links: [
        { label: 'Dental Practices', href: '/case-studies' },
        { label: 'Dermatology', href: '/case-studies' },
        { label: 'Mental Health', href: '/case-studies' },
        { label: 'Fertility & IVF', href: '/case-studies' },
        { label: 'Plastic Surgery', href: '/case-studies' },
        { label: 'Telehealth', href: '/case-studies' },
      ],
    },
    {
      title: 'Contact',
      links: [
        { label: 'Book Strategy Call', href: '/#cta' },
        { label: 'Free Growth Audit', href: '/#cta' },
        { label: 'hello@dastifydigital.com', href: 'mailto:hello@dastifydigital.com' },
        { label: '1-800-DASTIFY', href: 'tel:+18003278439' },
      ],
    },
  ],
  copyright: '© 2026 Dastify Digital. All rights reserved.',
  badges: [
    { label: 'HIPAA', tone: 'purple' },
    { label: 'Google Partner', tone: 'blue' },
    { label: 'Award-Winning', tone: 'green' },
  ],
};
