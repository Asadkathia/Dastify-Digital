import 'server-only';
import { importMediaFromUrl } from './media-importer';

/**
 * Scans HTML for <img src="..."> tags, downloads each image to the Media
 * collection, and replaces the src with the local Payload media URL.
 *
 * Images that fail to download are left with their original external src so
 * the body still renders (just from an external host). Per-image failures are
 * returned as warnings rather than thrown.
 *
 * Skips: data: URIs, already-local paths (/...), and non-http URLs.
 */
export async function downloadInlineImages(args: {
  html: string;
  baseUrl?: string;
}): Promise<{ html: string; warnings: string[] }> {
  const warnings: string[] = [];
  if (!args.html) return { html: args.html, warnings };

  // Collect unique external src values to avoid downloading the same image twice.
  const srcPattern = /(<img[^>]+\bsrc=["'])([^"']+)(["'][^>]*>)/gi;
  const seen = new Map<string, string>(); // original src → local URL
  const jobs: Array<{ src: string; fullMatch: string; before: string; after: string }> = [];

  let m: RegExpExecArray | null;
  while ((m = srcPattern.exec(args.html)) !== null) {
    const src = m[2];
    if (seen.has(src)) continue;
    if (src.startsWith('data:')) continue;
    // Skip already-local relative paths that don't need downloading.
    if (src.startsWith('/') && !src.startsWith('//')) continue;
    if (!/^(https?:|\/\/)/i.test(src)) continue;
    jobs.push({ src, fullMatch: m[0], before: m[1], after: m[3] });
  }

  if (jobs.length === 0) return { html: args.html, warnings };

  for (const job of jobs) {
    if (seen.has(job.src)) continue;
    const imported = await importMediaFromUrl({ src: job.src, baseUrl: args.baseUrl });
    if (imported?.url) {
      seen.set(job.src, imported.url);
    } else {
      warnings.push(`Inline image not downloaded (left as external): ${job.src}`);
      seen.set(job.src, job.src); // keep original
    }
  }

  // Replace all occurrences (including duplicates) in one pass.
  const result = args.html.replace(srcPattern, (_full, before, src, after) => {
    const replacement = seen.get(src);
    return replacement && replacement !== src ? `${before}${replacement}${after}` : _full;
  });

  return { html: result, warnings };
}
