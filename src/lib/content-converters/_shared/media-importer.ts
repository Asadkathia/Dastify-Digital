import 'server-only';
import { getPayloadClient } from '@/lib/payload';

/**
 * Downloads an image from a URL and creates a Media collection document.
 * Returns the new Media doc's id, or null on failure (logged).
 *
 * Resolves relative URLs against `baseUrl` when provided.
 */
export async function importMediaFromUrl(args: {
  src: string;
  alt?: string;
  baseUrl?: string;
}): Promise<{ id: number; url: string; alt: string } | null> {
  const { src, alt = '', baseUrl } = args;
  if (!src) return null;

  let absoluteUrl: string;
  try {
    absoluteUrl = new URL(src, baseUrl).toString();
  } catch {
    console.warn(`[media-importer] skipping invalid URL: ${src}`);
    return null;
  }

  // Only handle http/https. Skip data:, blob:, mailto:, etc.
  if (!/^https?:\/\//i.test(absoluteUrl)) return null;

  try {
    const res = await fetch(absoluteUrl, {
      headers: { 'user-agent': 'Mozilla/5.0 DastifyContentImporter/1.0' },
    });
    if (!res.ok) {
      console.warn(`[media-importer] ${res.status} on ${absoluteUrl}`);
      return null;
    }

    const contentType = res.headers.get('content-type') ?? '';
    if (!/^image\//i.test(contentType)) {
      console.warn(`[media-importer] skipping non-image content-type "${contentType}" for ${absoluteUrl}`);
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = deriveFilename(absoluteUrl, contentType);
    const resolvedAlt = alt || deriveAltFromFilename(filename);

    const payload = await getPayloadClient();
    const created = await payload.create({
      collection: 'media',
      data: { alt: resolvedAlt },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.byteLength,
      },
    });

    const mediaId = typeof created.id === 'number' ? created.id : Number(created.id);
    const createdUrl = typeof (created as { url?: unknown }).url === 'string' ? (created as { url: string }).url : '';
    return { id: mediaId, url: createdUrl, alt: resolvedAlt };
  } catch (err) {
    console.error(`[media-importer] failed to import ${absoluteUrl}:`, err);
    return null;
  }
}

function deriveFilename(url: string, contentType: string): string {
  const pathname = new URL(url).pathname;
  const last = pathname.split('/').pop() ?? 'image';
  if (last.includes('.')) return last.split('?')[0].slice(0, 100);
  const ext = contentType.split('/')[1]?.split(';')[0] || 'jpg';
  return `${last || 'image'}.${ext}`.slice(0, 100);
}

function deriveAltFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim() || 'Imported image';
}
