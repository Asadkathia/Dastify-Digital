import { draftMode } from 'next/headers';
import { BLOG_PAGE_SIZE } from './constants';
import { getPayloadClient } from '@/lib/payload';
import type { Config } from '@/payload-types';

type CMSCollection = keyof Config['collections'];

// CMSDoc is intentionally a loose Record view. Payload's generated types are a
// discriminated union over every collection; site render code doesn't want to
// care which collection it got back. The `as unknown as CMSDoc[]` casts below
// are type-only erasures (no runtime cost) that bridge the generated union to
// this loose view. Do not replace with runtime type guards — there is nothing
// to guard at runtime.
export type CMSDoc = Record<string, unknown> & {
  id?: number | string;
  title?: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
  _status?: 'draft' | 'published';
  meta?: {
    title?: string;
    description?: string;
    image?: { url?: string } | number | string | null;
    canonicalURL?: string;
    noindex?: boolean;
    keywords?: string;
  };
};

export async function isDraftEnabled(): Promise<boolean> {
  const { isEnabled } = await draftMode();
  return isEnabled;
}

export async function findOneBySlug(collection: CMSCollection, slug: string, draft = false): Promise<CMSDoc | null> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection,
      depth: 2,
      draft,
      limit: 1,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    return (res.docs?.[0] as unknown as CMSDoc | undefined) ?? null;
  } catch (err) {
    console.error('[cms.queries] findOne failed:', err);
    return null;
  }
}

export async function findManyPublished(collection: CMSCollection, limit = 100): Promise<CMSDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection,
      depth: 1,
      draft: false,
      limit,
      where: {
        _status: {
          equals: 'published',
        },
      },
    });

    return (res.docs as unknown as CMSDoc[]) || [];
  } catch (err) {
    console.error('[cms.queries] findManyPublished failed:', err);
    return [];
  }
}

export async function findManyPublishedSlim(
  collection: CMSCollection,
  fields: Record<string, true>,
  limit = 500,
): Promise<CMSDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection,
      depth: 0,
      draft: false,
      limit,
      where: { _status: { equals: 'published' } },
      select: fields,
    });
    return (res.docs as unknown as CMSDoc[]) || [];
  } catch (err) {
    console.error('[cms.queries] findManyPublishedSlim failed:', err);
    return [];
  }
}

export async function findBlogPage(pageNumber: number, draft = false): Promise<{ docs: CMSDoc[]; totalPages: number }> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'blog-posts',
      depth: 2,
      draft,
      page: pageNumber,
      limit: BLOG_PAGE_SIZE,
      sort: '-publishedAt',
    });

    return {
      docs: (res.docs as unknown as CMSDoc[]) || [],
      totalPages: res.totalPages || 1,
    };
  } catch (err) {
    console.error('[cms.queries] findBlogPage failed:', err);
    return {
      docs: [],
      totalPages: 1,
    };
  }
}

export async function findByRelation(args: {
  collection: CMSCollection;
  relationField: string;
  value: string;
  draft?: boolean;
}): Promise<CMSDoc[]> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: args.collection,
      depth: 2,
      draft: args.draft ?? false,
      limit: 50,
      sort: '-publishedAt',
      where: {
        [args.relationField]: {
          contains: args.value,
        },
      },
    });

    return (res.docs as unknown as CMSDoc[]) || [];
  } catch (err) {
    console.error('[cms.queries] findByRelation failed:', err);
    return [];
  }
}

export async function findMenuByLocation(location: 'header' | 'footer'): Promise<CMSDoc | null> {
  try {
    const payload = await getPayloadClient();
    const res = await payload.find({
      collection: 'menus',
      depth: 2,
      draft: false,
      limit: 1,
      where: {
        location: {
          equals: location,
        },
      },
    });

    return (res.docs?.[0] as unknown as CMSDoc | undefined) ?? null;
  } catch (err) {
    console.error('[cms.queries] findOne failed:', err);
    return null;
  }
}

export function extractSeoMeta(doc: CMSDoc | null | undefined) {
  if (!doc || !doc.meta || typeof doc.meta !== 'object') {
    return undefined;
  }

  const imageValue = doc.meta.image;
  const image =
    imageValue && typeof imageValue === 'object' && 'url' in imageValue
      ? String((imageValue as { url?: string }).url || '')
      : typeof imageValue === 'string'
        ? imageValue
        : undefined;

  return {
    title: typeof doc.meta.title === 'string' ? doc.meta.title : undefined,
    description: typeof doc.meta.description === 'string' ? doc.meta.description : undefined,
    image,
    canonicalURL: typeof doc.meta.canonicalURL === 'string' ? doc.meta.canonicalURL : undefined,
    noindex: doc.meta.noindex === true,
    keywords: typeof doc.meta.keywords === 'string' ? doc.meta.keywords : undefined,
  };
}

// ─── Footer global ────────────────────────────────────────────────────────────

export type SiteFooterSocial = {
  platform: 'x' | 'linkedin' | 'youtube' | 'facebook' | 'instagram';
  href: string;
};

export type SiteFooterLink = {
  label: string;
  href: string;
  highlight?: boolean;
};

export type SiteFooterColumn = {
  title: string;
  links: SiteFooterLink[];
};

export type SiteFooterCtaColumn = {
  title?: string;
  links?: { label: string; href: string }[];
  buttonLabel?: string;
  buttonHref?: string;
};

export type SiteFooterBadge = {
  label: string;
  tone?: 'purple' | 'blue' | 'green';
};

export type SiteFooterData = {
  brand: {
    logoImage?: string | null;
    namePrefix: string;
    accent: string;
    nameSuffix: string;
    tagline: string;
    socials: SiteFooterSocial[];
  };
  columns: SiteFooterColumn[];
  ctaColumn?: SiteFooterCtaColumn;
  copyright: string;
  badges: SiteFooterBadge[];
};

const FOOTER_FALLBACK: SiteFooterData = {
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
      { platform: 'facebook', href: '#' },
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

export async function getFooter(): Promise<SiteFooterData> {
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findGlobal({ slug: 'footer' as never })) as Record<string, unknown>;
    if (!doc) return FOOTER_FALLBACK;

    const brand = doc.brand && typeof doc.brand === 'object'
      ? (doc.brand as Record<string, unknown>)
      : {};

    const socials = Array.isArray(brand.socials)
      ? (brand.socials as Array<{ platform?: unknown; href?: unknown }>)
          .filter((s) => typeof s.platform === 'string' && typeof s.href === 'string')
          .map((s) => ({ platform: String(s.platform) as SiteFooterSocial['platform'], href: String(s.href) }))
      : FOOTER_FALLBACK.brand.socials;

    const columns = Array.isArray(doc.columns)
      ? (doc.columns as Array<{ title?: unknown; links?: unknown[] }>).map((col) => ({
          title: typeof col.title === 'string' ? col.title : '',
          links: Array.isArray(col.links)
            ? (col.links as Array<{ label?: unknown; href?: unknown; highlight?: unknown }>)
                .filter((l) => typeof l.label === 'string' && typeof l.href === 'string')
                .map((l) => ({
                  label: String(l.label),
                  href: String(l.href),
                  highlight: l.highlight === true,
                }))
            : [],
        }))
      : FOOTER_FALLBACK.columns;

    const ctaRaw = doc.ctaColumn && typeof doc.ctaColumn === 'object'
      ? (doc.ctaColumn as Record<string, unknown>)
      : null;
    const ctaColumn: SiteFooterCtaColumn | undefined =
      ctaRaw && typeof ctaRaw.title === 'string' && ctaRaw.title
        ? {
            title: ctaRaw.title,
            links: Array.isArray(ctaRaw.links)
              ? (ctaRaw.links as Array<{ label?: unknown; href?: unknown }>)
                  .filter((l) => typeof l.label === 'string')
                  .map((l) => ({ label: String(l.label), href: String(l.href ?? '') }))
              : [],
            buttonLabel: typeof ctaRaw.buttonLabel === 'string' ? ctaRaw.buttonLabel : undefined,
            buttonHref: typeof ctaRaw.buttonHref === 'string' ? ctaRaw.buttonHref : undefined,
          }
        : undefined;

    const badges = Array.isArray(doc.badges)
      ? (doc.badges as Array<{ label?: unknown; tone?: unknown }>)
          .filter((b) => typeof b.label === 'string')
          .map((b) => ({
            label: String(b.label),
            tone: (['purple', 'blue', 'green'] as const).includes(b.tone as never)
              ? (b.tone as 'purple' | 'blue' | 'green')
              : undefined,
          }))
      : FOOTER_FALLBACK.badges;

    const brandLogoRaw = brand.logoImage;
    const brandLogoImage =
      brandLogoRaw && typeof brandLogoRaw === 'object' && 'url' in (brandLogoRaw as object)
        ? String((brandLogoRaw as { url?: string }).url ?? '')
        : typeof brandLogoRaw === 'string' && brandLogoRaw.trim()
          ? brandLogoRaw.trim()
          : null;

    return {
      brand: {
        logoImage: brandLogoImage || null,
        namePrefix:
          typeof brand.namePrefix === 'string' && brand.namePrefix
            ? brand.namePrefix
            : FOOTER_FALLBACK.brand.namePrefix,
        accent:
          typeof brand.accent === 'string' && brand.accent
            ? brand.accent
            : FOOTER_FALLBACK.brand.accent,
        nameSuffix:
          typeof brand.nameSuffix === 'string' && brand.nameSuffix
            ? brand.nameSuffix
            : FOOTER_FALLBACK.brand.nameSuffix,
        tagline:
          typeof brand.tagline === 'string' && brand.tagline
            ? brand.tagline
            : FOOTER_FALLBACK.brand.tagline,
        socials,
      },
      columns: columns.length > 0 ? columns : FOOTER_FALLBACK.columns,
      ctaColumn,
      copyright:
        typeof doc.copyright === 'string' && doc.copyright
          ? doc.copyright
          : FOOTER_FALLBACK.copyright,
      badges: badges.length > 0 ? badges : FOOTER_FALLBACK.badges,
    };
  } catch (err) {
    console.error('[cms.queries] getFooter failed, using fallback:', err);
    return FOOTER_FALLBACK;
  }
}

// ─── Navigation global ────────────────────────────────────────────────────────

export type NavigationData = {
  logoImage?: string | null;
  logoText: string;
  logoAccent: string;
  logoHref: string;
  links: { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
};

const NAVIGATION_FALLBACK: NavigationData = {
  logoText: 'Dastify',
  logoAccent: '.Digital',
  logoHref: '/',
  links: [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Work', href: '/work' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ],
  ctaLabel: 'Book a Call',
  ctaHref: '/contact',
};

export async function getNavigation(): Promise<NavigationData> {
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findGlobal({ slug: 'navigation' as never })) as Record<string, unknown>;
    if (!doc) return NAVIGATION_FALLBACK;
    const logoImageRaw = doc.logoImage;
    const logoImage =
      logoImageRaw && typeof logoImageRaw === 'object' && 'url' in (logoImageRaw as object)
        ? String((logoImageRaw as { url?: string }).url ?? '')
        : typeof logoImageRaw === 'string' && logoImageRaw.trim()
          ? logoImageRaw.trim()
          : null;
    return {
      logoImage: logoImage || null,
      logoText: typeof doc.logoText === 'string' && doc.logoText ? doc.logoText : NAVIGATION_FALLBACK.logoText,
      logoAccent: typeof doc.logoAccent === 'string' && doc.logoAccent ? doc.logoAccent : NAVIGATION_FALLBACK.logoAccent,
      logoHref: typeof doc.logoHref === 'string' && doc.logoHref ? doc.logoHref : NAVIGATION_FALLBACK.logoHref,
      links: Array.isArray(doc.links)
        ? (doc.links as Array<{ label?: unknown; href?: unknown }>)
            .filter((l) => typeof l.label === 'string' && typeof l.href === 'string')
            .map((l) => ({ label: String(l.label), href: String(l.href) }))
        : NAVIGATION_FALLBACK.links,
      ctaLabel: typeof doc.ctaLabel === 'string' && doc.ctaLabel ? doc.ctaLabel : NAVIGATION_FALLBACK.ctaLabel,
      ctaHref: typeof doc.ctaHref === 'string' && doc.ctaHref ? doc.ctaHref : NAVIGATION_FALLBACK.ctaHref,
    };
  } catch (err) {
    console.error('[cms.queries] getNavigation failed, using fallback:', err);
    return NAVIGATION_FALLBACK;
  }
}
