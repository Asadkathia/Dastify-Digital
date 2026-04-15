import type { Field, GlobalConfig } from 'payload';
import { homepageContent } from '../../lib/homepage-content.ts';
import type { HomepageContent } from '../../lib/homepage-content.ts';
import { resolveHomepageContent } from '../../lib/resolve-homepage-content.ts';
import { isAdminOrEditor } from '../access.ts';
import { revalidateGlobalChange } from '../hooks/revalidate.ts';

const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  { name: 'href', type: 'text', required: true },
];

const headingLineFields: Field[] = [
  { name: 'text', type: 'text', required: true },
  { name: 'delay', type: 'number' },
  { name: 'colorVar', type: 'text' },
];

/** Structured link value stored by the visual editor for CTA buttons */
const ctaLinkFields: Field[] = [
  { name: 'url', type: 'text' },
  {
    name: 'type',
    type: 'select',
    options: [
      { label: 'Internal Page', value: 'internal' },
      { label: 'External URL', value: 'external' },
      { label: 'Anchor (#)', value: 'anchor' },
    ],
    defaultValue: 'internal',
  },
  { name: 'openInNewTab', type: 'checkbox', defaultValue: false },
];

function ctaLinkGroup(name: string, label: string): Field {
  return { name, type: 'group', label, fields: ctaLinkFields };
}

const STRUCTURED_SECTION_KEYS = [
  'nav',
  'hero',
  'brandAcronym',
  'about',
  'features',
  'caseStudies',
  'services',
  'mission',
  'insights',
  'faq',
  'cta',
  'footer',
] as const;

function getHomepagePreviewURL(slug = '/'): string | null {
  const secret = process.env.PREVIEW_SECRET || process.env.PAYLOAD_SECRET;
  const params = new URLSearchParams({
    slug,
  });

  if (secret) {
    params.set('secret', secret);
  }

  return `/api/preview?${params.toString()}`;
}

function toAdminShape(content: HomepageContent) {
  return {
    ...content,
    hero: {
      ...content.hero,
      marquee: content.hero.marquee.map((text) => ({ text })),
    },
    about: {
      ...content.about,
      paragraphs: content.about.paragraphs.map((text) => ({ text })),
    },
    services: {
      ...content.services,
      titleLines: content.services.titleLines.map((text) => ({ text })),
    },
    mission: {
      ...content.mission,
      checks: content.mission.checks.map((text) => ({ text })),
    },
  };
}

function hasStructuredInput(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return STRUCTURED_SECTION_KEYS.some((key) => typeof record[key] === 'object' && record[key] !== null);
}

function mergeStructuredInput(base: HomepageContent, input: Record<string, unknown>): Record<string, unknown> {
  return {
    ...base,
    nav: typeof input.nav === 'object' && input.nav !== null ? { ...base.nav, ...(input.nav as Record<string, unknown>) } : base.nav,
    hero:
      typeof input.hero === 'object' && input.hero !== null ? { ...base.hero, ...(input.hero as Record<string, unknown>) } : base.hero,
    brandAcronym:
      typeof input.brandAcronym === 'object' && input.brandAcronym !== null
        ? { ...base.brandAcronym, ...(input.brandAcronym as Record<string, unknown>) }
        : base.brandAcronym,
    about:
      typeof input.about === 'object' && input.about !== null
        ? { ...base.about, ...(input.about as Record<string, unknown>) }
        : base.about,
    features:
      typeof input.features === 'object' && input.features !== null
        ? { ...base.features, ...(input.features as Record<string, unknown>) }
        : base.features,
    caseStudies:
      typeof input.caseStudies === 'object' && input.caseStudies !== null
        ? { ...base.caseStudies, ...(input.caseStudies as Record<string, unknown>) }
        : base.caseStudies,
    services:
      typeof input.services === 'object' && input.services !== null
        ? { ...base.services, ...(input.services as Record<string, unknown>) }
        : base.services,
    mission:
      typeof input.mission === 'object' && input.mission !== null
        ? { ...base.mission, ...(input.mission as Record<string, unknown>) }
        : base.mission,
    insights:
      typeof input.insights === 'object' && input.insights !== null
        ? { ...base.insights, ...(input.insights as Record<string, unknown>) }
        : base.insights,
    faq:
      typeof input.faq === 'object' && input.faq !== null ? { ...base.faq, ...(input.faq as Record<string, unknown>) } : base.faq,
    cta:
      typeof input.cta === 'object' && input.cta !== null ? { ...base.cta, ...(input.cta as Record<string, unknown>) } : base.cta,
    footer:
      typeof input.footer === 'object' && input.footer !== null
        ? { ...base.footer, ...(input.footer as Record<string, unknown>) }
        : base.footer,
  };
}

function mergeAdminShape(
  current: Record<string, unknown>,
  adminShape: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    ...current,
    ...adminShape,
  };

  for (const key of STRUCTURED_SECTION_KEYS) {
    const currentSection = current[key];
    const nextSection = adminShape[key];
    if (
      typeof currentSection === 'object' &&
      currentSection !== null &&
      !Array.isArray(currentSection) &&
      typeof nextSection === 'object' &&
      nextSection !== null &&
      !Array.isArray(nextSection)
    ) {
      merged[key] = {
        ...(currentSection as Record<string, unknown>),
        ...(nextSection as Record<string, unknown>),
      };
    }
  }

  return merged;
}

function mergeStructuredRecords(base: Record<string, unknown>, input: Record<string, unknown>): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    ...base,
    ...input,
  };

  for (const key of STRUCTURED_SECTION_KEYS) {
    const baseSection = base[key];
    const inputSection = input[key];
    if (
      typeof baseSection === 'object' &&
      baseSection !== null &&
      !Array.isArray(baseSection) &&
      typeof inputSection === 'object' &&
      inputSection !== null &&
      !Array.isArray(inputSection)
    ) {
      merged[key] = {
        ...(baseSection as Record<string, unknown>),
        ...(inputSection as Record<string, unknown>),
      };
    }
  }

  return merged;
}

function withRequiredSectionIds(
  input: Record<string, unknown>,
  normalized: HomepageContent,
): Record<string, unknown> {
  const output: Record<string, unknown> = { ...input };
  const sections = [
    { key: 'hero', id: normalized.hero.id },
    { key: 'brandAcronym', id: normalized.brandAcronym.id },
    { key: 'about', id: normalized.about.id },
    { key: 'caseStudies', id: normalized.caseStudies.id },
    { key: 'services', id: normalized.services.id },
    { key: 'insights', id: normalized.insights.id },
    { key: 'faq', id: normalized.faq.id },
  ] as const;

  for (const section of sections) {
    const current = output[section.key];
    if (typeof current === 'object' && current !== null && !Array.isArray(current)) {
      const record = current as Record<string, unknown>;
      output[section.key] = {
        ...record,
        id: typeof record.id === 'string' && record.id.length > 0 ? record.id : section.id,
      };
    } else {
      output[section.key] = { id: section.id };
    }
  }

  return output;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is Record<string, unknown> => asRecord(item) !== null);
}

function hasMediaRef(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (typeof value === 'number') {
    return true;
  }
  const record = asRecord(value);
  if (!record) {
    return false;
  }
  return typeof record.id === 'number' || typeof record.id === 'string' || typeof record.url === 'string';
}

function hasText(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function getPublishValidationErrors(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const pushError = (field: string, message: string) => {
    errors.push(`${field}: ${message}`);
  };

  const hero = asRecord(data.hero);
  if (hero) {
    if (!hasMediaRef(hero.imageMedia)) {
      pushError('Hero > Image Media', 'is required for publish');
    }
    if (!hasText(hero.imageAlt)) {
      pushError('Hero > Image Alt', 'is required for publish');
    }
    if (!hasText(hero.chip)) {
      pushError('Hero > Chip', 'is required for publish');
    }
  }

  const about = asRecord(data.about);
  if (about) {
    if (!hasMediaRef(about.imageMedia)) {
      pushError('About > Image Media', 'is required for publish');
    }
    if (!hasText(about.imageAlt)) {
      pushError('About > Image Alt', 'is required for publish');
    }
  }

  const features = asRecord(data.features);
  const featureCards = features ? asRecordArray(features.cards) : [];
  featureCards.forEach((card, index) => {
    if (!hasMediaRef(card.imageMedia)) {
      pushError(`Features > Cards[${index + 1}] > Image Media`, 'is required for publish');
    }
    if (!hasText(card.alt)) {
      pushError(`Features > Cards[${index + 1}] > Alt`, 'is required for publish');
    }
  });

  const caseStudies = asRecord(data.caseStudies);
  if (caseStudies) {
    const main = asRecord(caseStudies.main);
    if (main) {
      if (!hasMediaRef(main.imageMedia)) {
        pushError('Case Studies > Main > Image Media', 'is required for publish');
      }
      if (!hasText(main.alt)) {
        pushError('Case Studies > Main > Alt', 'is required for publish');
      }
      if (!hasText(main.title)) {
        pushError('Case Studies > Main > Title', 'is required for publish');
      }
    }

    const minis = asRecordArray(caseStudies.minis);
    minis.forEach((mini, index) => {
      if (!hasMediaRef(mini.imageMedia)) {
        pushError(`Case Studies > Minis[${index + 1}] > Image Media`, 'is required for publish');
      }
      if (!hasText(mini.alt)) {
        pushError(`Case Studies > Minis[${index + 1}] > Alt`, 'is required for publish');
      }
    });
  }

  const services = asRecord(data.services);
  const serviceItems = services ? asRecordArray(services.items) : [];
  serviceItems.forEach((item, index) => {
    if (!hasMediaRef(item.imageMedia)) {
      pushError(`Services > Items[${index + 1}] > Image Media`, 'is required for publish');
    }
    if (!hasText(item.alt)) {
      pushError(`Services > Items[${index + 1}] > Alt`, 'is required for publish');
    }
  });

  const mission = asRecord(data.mission);
  if (mission) {
    if (!hasMediaRef(mission.imageMedia)) {
      pushError('Mission > Image Media', 'is required for publish');
    }
    if (!hasText(mission.imageAlt)) {
      pushError('Mission > Image Alt', 'is required for publish');
    }
  }

  const insights = asRecord(data.insights);
  const insightItems = insights ? asRecordArray(insights.items) : [];
  insightItems.forEach((item, index) => {
    if (!hasMediaRef(item.imageMedia)) {
      pushError(`Insights > Items[${index + 1}] > Image Media`, 'is required for publish');
    }
    if (!hasText(item.alt)) {
      pushError(`Insights > Items[${index + 1}] > Alt`, 'is required for publish');
    }
  });

  return errors;
}

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage Content',
  admin: {
    components: {
      elements: {
        beforeDocumentControls: [
          // Primary: opens full Homepage Visual Editor
          '@/payload/components/HomepageEditorButton#default',
          // Secondary: original live preview link still available
          '@/payload/components/HomepagePreviewLink#HomepagePreviewLink',
        ],
      },
    },
    preview: () => getHomepagePreviewURL('/'),
    livePreview: {
      url: () => getHomepagePreviewURL('/'),
    },
  },
  versions: {
    max: 50,
    drafts: {
      autosave: {
        interval: 1200,
        showSaveDraftButton: true,
      },
      validate: false,
      schedulePublish: true,
    },
  },
  access: {
    read: () => true,
    update: ({ req }) => isAdminOrEditor(req),
  },
  hooks: {
    afterChange: [revalidateGlobalChange('homepage', ['/'])],
    beforeChange: [
      ({ data, originalDoc }) => {
        if (!hasStructuredInput(data)) {
          return data;
        }

        const status = (data as Record<string, unknown>)._status;
        if (status !== 'published') {
          return data;
        }

        const original = hasStructuredInput(originalDoc) ? (originalDoc as Record<string, unknown>) : {};
        const merged = mergeStructuredRecords(original, data as Record<string, unknown>);
        const validationErrors = getPublishValidationErrors(merged);

        if (validationErrors.length > 0) {
          throw new Error(
            `Homepage publish blocked. Fix the following fields first:\n- ${validationErrors.join('\n- ')}`,
          );
        }

        return data;
      },
    ],
    beforeRead: [
      ({ doc }) => {
        const normalized = resolveHomepageContent(doc ?? {});
        // For current structured docs, do not rewrite section payloads here.
        // Rewriting can drop relation fields like imageMedia from array items.
        if (hasStructuredInput((doc ?? {}) as Record<string, unknown>)) {
          return {
            ...(doc ?? {}),
            content: normalized,
          };
        }

        const adminShape = toAdminShape(normalized);
        return mergeAdminShape((doc ?? {}) as Record<string, unknown>, {
          ...adminShape,
          content: normalized,
        });
      },
    ],
    beforeValidate: [
      ({ data, originalDoc }) => {
        const input = data ?? {};
        const baseStructured = hasStructuredInput(originalDoc)
          ? (originalDoc as Record<string, unknown>)
          : toAdminShape(homepageContent);
        const baseContent = resolveHomepageContent(baseStructured);
        const source = hasStructuredInput(input)
          ? { ...mergeStructuredInput(baseContent, input), content: undefined }
          : input;
        const normalized = resolveHomepageContent(source);
        // Preserve all structured admin fields as-entered, only refresh canonical content.
        if (hasStructuredInput(input)) {
          const withIds = withRequiredSectionIds(source as Record<string, unknown>, normalized);
          return {
            ...withIds,
            content: normalized,
          };
        }
        const adminShape = toAdminShape(normalized);
        return mergeAdminShape(input as Record<string, unknown>, {
          ...input,
          ...adminShape,
          content: normalized,
        });
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Navigation',
          fields: [
            {
              name: 'nav',
              type: 'group',
              defaultValue: homepageContent.nav,
              fields: [
                { name: 'logo', type: 'text', required: true },
                { name: 'cta', type: 'text', required: true },
                ctaLinkGroup('ctaHref', 'CTA Button Link'),
                {
                  name: 'links',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.nav.links,
                  fields: linkFields,
                },
              ],
            },
          ],
        },
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              defaultValue: homepageContent.hero,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'primaryCta', type: 'text', required: true },
                ctaLinkGroup('primaryCtaHref', 'Primary CTA Link'),
                { name: 'secondaryCta', type: 'text', required: true },
                ctaLinkGroup('secondaryCtaHref', 'Secondary CTA Link'),
                {
                  name: 'image',
                  type: 'text',
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'imageMedia',
                  type: 'upload',
                  relationTo: 'media',
                },
                { name: 'imageAlt', type: 'text', required: true },
                { name: 'badgeValue', type: 'text', required: true },
                { name: 'badgeLabel', type: 'text', required: true },
                {
                  name: 'headingLines',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.hero.headingLines,
                  fields: headingLineFields,
                },
                {
                  name: 'stats',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.hero.stats,
                  fields: [
                    { name: 'value', type: 'text', required: true },
                    { name: 'counterTarget', type: 'number' },
                    { name: 'suffix', type: 'text' },
                    { name: 'label', type: 'text', required: true },
                  ],
                },
                {
                  name: 'marquee',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.hero.marquee.map((text) => ({ text })),
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
          ],
        },
        {
          label: 'Brand Acronym',
          fields: [
            {
              name: 'brandAcronym',
              type: 'group',
              defaultValue: homepageContent.brandAcronym,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'subtitle', type: 'textarea', required: true },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.brandAcronym.items,
                  fields: [
                    { name: 'l', type: 'text', required: true },
                    {
                      name: 'word',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'DASTIFY', value: 'DASTIFY' },
                        { label: 'DIGITAL', value: 'DIGITAL' },
                      ],
                    },
                    {
                      name: 'dir',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Up', value: 'up' },
                        { label: 'Down', value: 'down' },
                      ],
                    },
                    {
                      name: 'color',
                      type: 'select',
                      required: true,
                      options: [
                        { label: 'Purple', value: 'purple' },
                        { label: 'Blue', value: 'blue' },
                      ],
                    },
                    { name: 't1', type: 'text', required: true },
                    { name: 't2', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'About + Features',
          fields: [
            {
              name: 'about',
              type: 'group',
              defaultValue: homepageContent.about,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'cta', type: 'text', required: true },
                ctaLinkGroup('ctaHref', 'CTA Link'),
                {
                  name: 'image',
                  type: 'text',
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'imageMedia',
                  type: 'upload',
                  relationTo: 'media',
                },
                { name: 'imageAlt', type: 'text', required: true },
                {
                  name: 'headingLines',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.about.headingLines,
                  fields: headingLineFields,
                },
                {
                  name: 'paragraphs',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.about.paragraphs.map((text) => ({ text })),
                  fields: [{ name: 'text', type: 'textarea', required: true }],
                },
              ],
            },
            {
              name: 'features',
              type: 'group',
              defaultValue: homepageContent.features,
              fields: [
                {
                  name: 'cards',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.features.cards,
                  fields: [
                    { name: 'category', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                    {
                      name: 'image',
                      type: 'text',
                      admin: {
                        hidden: true,
                      },
                    },
                    {
                      name: 'imageMedia',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    { name: 'alt', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Cases + Services',
          fields: [
            {
              name: 'caseStudies',
              type: 'group',
              defaultValue: homepageContent.caseStudies,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'cta', type: 'text', required: true },
                ctaLinkGroup('ctaHref', 'CTA Link'),
                {
                  name: 'tabs',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.caseStudies.tabs,
                  fields: [
                    { name: 'id', type: 'text', required: true },
                    { name: 'label', type: 'text', required: true },
                  ],
                },
                {
                  name: 'main',
                  type: 'group',
                  defaultValue: homepageContent.caseStudies.main,
                  fields: [
                    { name: 'tag', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                    { name: 'stat', type: 'text', required: true },
                    { name: 'statLabel', type: 'text', required: true },
                    {
                      name: 'image',
                      type: 'text',
                      admin: {
                        hidden: true,
                      },
                    },
                    {
                      name: 'imageMedia',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    { name: 'alt', type: 'text', required: true },
                  ],
                },
                {
                  name: 'minis',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.caseStudies.minis,
                  fields: [
                    { name: 'tag', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'stat', type: 'text', required: true },
                    { name: 'statLabel', type: 'text', required: true },
                    {
                      name: 'image',
                      type: 'text',
                      admin: {
                        hidden: true,
                      },
                    },
                    {
                      name: 'imageMedia',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    { name: 'alt', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'services',
              type: 'group',
              defaultValue: homepageContent.services,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                {
                  name: 'titleLines',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.services.titleLines.map((text) => ({ text })),
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.services.items,
                  fields: [
                    { name: 'number', type: 'text', required: true },
                    { name: 'name', type: 'text', required: true },
                    { name: 'description', type: 'textarea', required: true },
                    {
                      name: 'image',
                      type: 'text',
                      admin: {
                        hidden: true,
                      },
                    },
                    {
                      name: 'imageMedia',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    { name: 'alt', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Mission + Insights + FAQ',
          fields: [
            {
              name: 'mission',
              type: 'group',
              defaultValue: homepageContent.mission,
              fields: [
                { name: 'chip', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'cta', type: 'text', required: true },
                ctaLinkGroup('ctaHref', 'CTA Link'),
                {
                  name: 'image',
                  type: 'text',
                  admin: {
                    hidden: true,
                  },
                },
                {
                  name: 'imageMedia',
                  type: 'upload',
                  relationTo: 'media',
                },
                { name: 'imageAlt', type: 'text', required: true },
                {
                  name: 'checks',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.mission.checks.map((text) => ({ text })),
                  fields: [{ name: 'text', type: 'text', required: true }],
                },
              ],
            },
            {
              name: 'insights',
              type: 'group',
              defaultValue: homepageContent.insights,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'cta', type: 'text', required: true },
                ctaLinkGroup('ctaHref', 'CTA Link'),
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.insights.items,
                  fields: [
                    { name: 'date', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    {
                      name: 'image',
                      type: 'text',
                      admin: {
                        hidden: true,
                      },
                    },
                    {
                      name: 'imageMedia',
                      type: 'upload',
                      relationTo: 'media',
                    },
                    { name: 'alt', type: 'text', required: true },
                  ],
                },
              ],
            },
            {
              name: 'faq',
              type: 'group',
              defaultValue: homepageContent.faq,
              fields: [
                { name: 'id', type: 'text', required: true },
                { name: 'chip', type: 'text', required: true },
                { name: 'title', type: 'text', required: true },
                { name: 'intro', type: 'textarea', required: true },
                { name: 'cta', type: 'text', required: true },
                ctaLinkGroup('ctaHref', 'CTA Link'),
                {
                  name: 'items',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.faq.items,
                  fields: [
                    { name: 'question', type: 'text', required: true },
                    { name: 'answer', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'CTA + Footer',
          fields: [
            {
              name: 'cta',
              type: 'group',
              defaultValue: homepageContent.cta,
              fields: [
                { name: 'chip', type: 'text', required: true },
                { name: 'subtitle', type: 'textarea', required: true },
                { name: 'inputPlaceholder', type: 'text', required: true },
                { name: 'button', type: 'text', required: true },
                { name: 'note', type: 'text', required: true },
                {
                  name: 'headingLines',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.cta.headingLines,
                  fields: [
                    { name: 'text', type: 'text', required: true },
                    { name: 'delay', type: 'number' },
                    { name: 'color', type: 'text' },
                  ],
                },
              ],
            },
            {
              name: 'footer',
              type: 'group',
              defaultValue: homepageContent.footer,
              fields: [
                { name: 'logo', type: 'text', required: true },
                { name: 'tagline', type: 'textarea', required: true },
                { name: 'copyright', type: 'text', required: true },
                {
                  name: 'socials',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.footer.socials,
                  fields: linkFields,
                },
                {
                  name: 'columns',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.footer.columns,
                  fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'button', type: 'text' },
                    {
                      name: 'links',
                      type: 'array',
                      defaultValue: [],
                      fields: linkFields,
                    },
                  ],
                },
                {
                  name: 'badges',
                  type: 'array',
                  minRows: 1,
                  defaultValue: homepageContent.footer.badges,
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    {
                      name: 'tone',
                      type: 'select',
                      options: [
                        { label: 'Blue', value: 'blue' },
                        { label: 'Green', value: 'green' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'json',
      admin: {
        hidden: true,
      },
    },
  ],
};
