import type { ConvertedPageRegistry } from './types';

type RegistryLoader = () => Promise<{ default: ConvertedPageRegistry }>;

const REGISTRY_LOADERS: Record<string, RegistryLoader> = {
  home: () => import('@/app/(site)/home/editor-registry'),
  about: () => import('@/app/(site)/about/editor-registry'),
  'services-convert': () => import('@/app/(site)/services-convert/editor-registry'),
  demo: () => import('@/app/(site)/demo/editor-registry'),
  'contact-2': () => import('@/app/(site)/contact-2/editor-registry'),
  'blog-post': () => import('@/app/(site)/blog-post/editor-registry'),
  'blog-1': () => import('@/app/(site)/blog-1/editor-registry'),
  'case-studies': () => import('@/app/(site)/case-studies/editor-registry'),
};
export function getSupportedConvertedPages(): string[] {
  return Object.keys(REGISTRY_LOADERS);
}

export async function loadConvertedPageRegistry(pageName: string): Promise<ConvertedPageRegistry | null> {
  const loader = REGISTRY_LOADERS[pageName];
  if (!loader) return null;
  const mod = await loader();
  return mod.default;
}

