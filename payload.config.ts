import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs';
import { redirectsPlugin } from '@payloadcms/plugin-redirects';
import { searchPlugin } from '@payloadcms/plugin-search';
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
import { Homepage } from './src/payload/globals/Homepage.ts';
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

  return buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-payload-secret-change-me',
  admin: {
    user: Users.slug,
    livePreview: {
      globals: ['homepage'],
      url:
        process.env.NEXT_PUBLIC_SITE_URL
        || process.env.SERVER_URL
        || 'http://localhost:3000',
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
  globals: [Homepage, SiteSettings],
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
    nestedDocsPlugin({
      collections: ['pages'],
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
    }),
    searchPlugin({
      collections: ['pages', 'services', 'case-studies', 'blog-posts'],
    }),
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
