import type { HomepageContent } from '@/lib/homepage-content';
import { findMenuByLocation } from './queries';

type MenuItem = {
  label?: unknown;
  href?: unknown;
};

function normalizeItems(value: unknown): Array<{ label: string; href: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => item as MenuItem)
    .filter((item) => typeof item.label === 'string' && typeof item.href === 'string')
    .map((item) => ({ label: String(item.label), href: String(item.href) }));
}

export async function withManagedMenus(content: HomepageContent): Promise<HomepageContent> {
  const [header, footer] = await Promise.all([findMenuByLocation('header'), findMenuByLocation('footer')]);

  const headerItems = normalizeItems(header?.items);
  const footerItems = normalizeItems(footer?.items);

  return {
    ...content,
    nav: {
      ...content.nav,
      links: headerItems.length > 0 ? headerItems : content.nav.links,
    },
    footer: {
      ...content.footer,
      columns:
        footerItems.length > 0
          ? [
              {
                title: 'Navigation',
                links: footerItems,
              },
              ...content.footer.columns.slice(1),
            ]
          : content.footer.columns,
    },
  };
}
