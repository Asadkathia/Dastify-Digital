import type { HomepageContent } from './homepage-content.ts';
import { homepageContent } from './homepage-content.ts';
import { getPayloadClient } from './payload.ts';
import { resolveHomepageContent } from './resolve-homepage-content.ts';

type HomepageContentOptions = {
  draft?: boolean;
};

export async function getHomepageContent(options?: HomepageContentOptions): Promise<HomepageContent> {
  try {
    const payload = await getPayloadClient();
    const global = await payload.findGlobal({
      slug: 'homepage',
      depth: 1,
      draft: options?.draft === true,
    });
    return resolveHomepageContent(global);
  } catch {
    return homepageContent;
  }
}
