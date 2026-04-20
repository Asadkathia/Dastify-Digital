import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
// Search plugin disabled: no frontend search UI implemented yet.
// Re-enable when /search page is built.
// import { searchPlugin } from '@payloadcms/plugin-search';
import { seoPlugin } from '@payloadcms/plugin-seo';
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import { BlogCategories } from './src/payload/collections/BlogCategories.ts';
import { BlogPosts } from './src/payload/collections/BlogPosts.ts';
import { CaseStudies } from './src/payload/collections/CaseStudies.ts';
import { Users } from './src/payload/collections/Users.ts';
import { Media } from './src/payload/collections/Media.ts';
import { Menus } from './src/payload/collections/Menus.ts';
import { Pages } from './src/payload/collections/Pages.ts';
import { Services } from './src/payload/collections/Services.ts';
import { Tags } from './src/payload/collections/Tags.ts';
import { ImportReports } from './src/payload/collections/ImportReports.ts';
import { Footer } from './src/payload/globals/Footer.ts';
import { Homepage } from './src/payload/globals/Homepage.ts';
import { Navigation } from './src/payload/globals/Navigation.ts';
import { SiteSettings } from './src/payload/globals/SiteSettings.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const defaultDatabaseURI = `file:${path.resolve(dirname, 'payload.db')}`;
const databaseURI = process.env.DATABASE_URI || defaultDatabaseURI;
const isLocalSqlite = databaseURI.startsWith('file:');
const isPostgres = /^postgres(ql)?:\/\//i.test(databaseURI);
const enableSchemaPush = process.env.PAYLOAD_SCHEMA_PUSH === 'true';
const disableLexical = process.env.PAYLOAD_DISABLE_LEXICAL === 'true';

const rewriteFormBuilderRichTextFields = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => rewriteFormBuilderRichTextFields(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const nextValue = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [key, rewriteFormBuilderRichTextFields(nestedValue)]),
  ) as Record<string, unknown>;

  if (nextValue.type === 'richText') {
    return {
      ...nextValue,
      type: 'textarea',
    };
  }

  return nextValue;
};

const attachEditorToFormBuilderRichTextFields = (
  value: unknown,
  createEditor: () => unknown,
): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => attachEditorToFormBuilderRichTextFields(item, createEditor));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const nextValue = Object.fromEntries(
    Object.entries(value).map(([key, nestedValue]) => [
      key,
      attachEditorToFormBuilderRichTextFields(nestedValue, createEditor),
    ]),
  ) as Record<string, unknown>;

  if (nextValue.type === 'richText' && !nextValue.editor) {
    return {
      ...nextValue,
      editor: createEditor(),
    };
  }

  return nextValue;
};

const db = isPostgres
  ? postgresAdapter({
    // Keep schema changes migration-driven to avoid runtime DDL conflicts.
    push: enableSchemaPush,
    pool: {
      connectionString: databaseURI,
    },
  })
  : sqliteAdapter({
    // Keep schema changes migration-driven by default.
    // Set PAYLOAD_SCHEMA_PUSH=true only for one-off local schema sync.
    push: enableSchemaPush && isLocalSqlite,
    // Store block arrays as a single JSON column instead of per-block side tables.
    // The per-block-table code path in @payloadcms/drizzle accumulates duplicate
    // rows for our `pages.blocks` field when the doc is updated (edit title, publish,
    // re-upload). Storing blocks as JSON sidesteps the entire delete/insert mismatch,
    // which was the root cause of the duplicate "custom-html-block" rows and the
    // blank canvas after slug rename.
    blocksAsJSON: true,
    client: {
      // Use absolute local path to avoid CWD-dependent SQLite file mismatches.
      url: databaseURI,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  });

const createConfig = async () => {
  let createRichTextEditor: (() => unknown) | null = null;

  if (!disableLexical) {
    const lexical = await import('@payloadcms/richtext-lexical');
    createRichTextEditor = () => lexical.lexicalEditor({});
  }

  if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('PAYLOAD_SECRET must be set in production.');
  }

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.SERVER_URL || 'http://localhost:3000';

  return buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-payload-secret-change-me',
  // CSRF allowlist: Payload rejects admin POSTs whose Origin doesn't match.
  // Required because our auth cookie is SameSite=Lax by default, but CSRF
  // provides defense-in-depth for any form that relaxes that.
  csrf: [siteURL].filter(Boolean),
  admin: {
    user: Users.slug,
    livePreview: {
      globals: ['homepage'],
      url: siteURL,
    },
    components: {
      beforeNavLinks: [
        '/src/payload/components/PageConverterNavLink#PageConverterNavLink',
      ],
      views: {
        visualEditor: {
          Component: '/src/payload/views/PageEditor/index#default',
          path: '/visual-editor/:id',
        },
        homepageEditor: {
          Component: '/src/payload/views/HomepageEditor/index#default',
          path: '/homepage-editor',
        },
        pageConverter: {
          Component: '/src/payload/views/PageConverter/index#default',
          path: '/convert-page',
        },
        convertedPages: {
          Component: '/src/payload/views/ConvertedPages/index#default',
          path: '/converted-pages',
        },
        convertedPageEditor: {
          Component: '/src/payload/views/ConvertedPageEditor/index#default',
          path: '/edit-converted-page/:pageName',
        },
      },
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    Services,
    CaseStudies,
    BlogCategories,
    Tags,
    BlogPosts,
    Menus,
    ImportReports,
  ],
  globals: [Homepage, Navigation, Footer, SiteSettings],
  plugins: [
    seoPlugin({
      collections: ['pages', 'services', 'case-studies', 'blog-posts'],
      globals: ['homepage', 'site-settings'],
      uploadsCollection: 'media',
      tabbedUI: true,
      fields: ({ defaultFields }) => [
        ...defaultFields,
        {
          name: 'canonicalURL',
          type: 'text',
          admin: {
            description: 'Optional canonical URL override (absolute URL).',
          },
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'Noindex / Nofollow',
          defaultValue: false,
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Optional comma-separated keywords.',
          },
        },
      ],
    }),
    // nestedDocsPlugin disabled for pages: its resaveSelfAfterCreate hook calls
    // payload.update() after every create, which triggers a second saveVersion()
    // and doubles block rows in _pages_v_blocks_custom_html_block. Breadcrumbs
    // are not used in this project.
    nestedDocsPlugin({
      collections: [],
    }),
    redirectsPlugin({
      collections: ['pages', 'services', 'case-studies', 'blog-posts'],
    }),
    formBuilderPlugin({
      formOverrides: {
        fields: ({ defaultFields }) =>
          (disableLexical || !createRichTextEditor
            ? rewriteFormBuilderRichTextFields(defaultFields as unknown[])
            : attachEditorToFormBuilderRichTextFields(defaultFields as unknown[], createRichTextEditor)) as never[],
      },
      formSubmissionOverrides: {
        hooks: {
          beforeValidate: [
            ({ data, req }) => {
              // Honeypot: reject silently if a hidden bot-bait field is filled.
              // Any submissionData entry with a field named "website", "url",
              // "hp_url", "hp", or "bot_field" whose value is non-empty is junk.
              const HONEYPOT_FIELDS = new Set(['website', 'url', 'hp_url', 'hp', 'bot_field']);
              const items = Array.isArray(data?.submissionData) ? data.submissionData : [];
              for (const item of items as Array<{ field?: unknown; value?: unknown }>) {
                if (
                  typeof item.field === 'string' &&
                  HONEYPOT_FIELDS.has(item.field.toLowerCase()) &&
                  typeof item.value === 'string' &&
                  item.value.trim().length > 0
                ) {
                  throw new Error('Submission rejected');
                }
              }

              // Origin check: in production, require the request to come from
              // our own site. Skip in dev so local testing works.
              if (process.env.NODE_ENV === 'production') {
                const origin = req?.headers?.get?.('origin') ?? '';
                const host = req?.headers?.get?.('host') ?? '';
                const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? '';
                const allowed = [siteURL, `https://${host}`].filter(Boolean);
                if (origin && !allowed.some((a) => origin.startsWith(a))) {
                  throw new Error('Submission rejected');
                }
              }

              return data;
            },
          ],
        },
      },
    }),
    // Search plugin disabled: no frontend search UI implemented yet.
    // Re-enable when /search page is built.
    // searchPlugin({
    //   collections: ['pages', 'services', 'case-studies', 'blog-posts'],
    // }),
    vercelBlobStorage({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
    }),
  ],
  db,
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  });
};

export default createConfig();
