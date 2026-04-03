export const CMS_COLLECTIONS = {
  pages: 'pages',
  services: 'services',
  caseStudies: 'case-studies',
  blogPosts: 'blog-posts',
  blogCategories: 'blog-categories',
  tags: 'tags',
  menus: 'menus',
} as const;

export const CMS_GLOBALS = {
  homepage: 'homepage',
  siteSettings: 'site-settings',
} as const;

export const BLOG_PAGE_SIZE = 10;

export const RESERVED_PAGE_PREFIXES = ['blog', 'services', 'case-studies', 'admin', 'api'] as const;
