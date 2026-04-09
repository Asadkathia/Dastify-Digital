import type { ConvertedPageRegistry } from './types';

type RegistryLoader = () => Promise<{ default: ConvertedPageRegistry }>;

const REGISTRY_LOADERS: Record<string, RegistryLoader> = {
  about: () => import('@/app/(site)/about/editor-registry'),
  'services-convert': () => import('@/app/(site)/services-convert/editor-registry'),
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

