import 'server-only';
import type { AIProviderConfig } from '@/lib/import-agent/types';
import { parseHtml } from '@/lib/import-agent/parse-html';
import { mapToBlocks, AIParseError } from '@/lib/import-agent/map-to-blocks';
import { validateBlocks } from '@/lib/import-agent/validate-blocks';

/**
 * Converts a full HTML page into a flat array of Payload blocks ready to be
 * stored in a collection record's `blocks` field.
 *
 * Reuses the import-agent pipeline (HTML → AI → validated blocks) but stops
 * short of writing to Payload — the caller combines these blocks with the
 * structured fields extracted by the content-type-specific extractor and
 * writes everything in one collection.create() call.
 *
 * Flattens section-block wrappers to leaves so SQLite's adapter doesn't
 * double-insert (same fix as runImportAgent).
 */
export async function htmlToBlocks(args: {
  html: string;
  aiConfig: AIProviderConfig;
}): Promise<{
  ok: true;
  blocks: unknown[];
  warnings: string[];
  unmappedCount: number;
  totalSections: number;
} | {
  ok: false;
  error: string;
  rawAiResponse?: string;
}> {
  try {
    const parsedPage = parseHtml(args.html);

    let mapping;
    try {
      mapping = await mapToBlocks(parsedPage, args.aiConfig);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI mapping failed';
      const rawAiResponse = error instanceof AIParseError ? error.rawAiResponse : undefined;
      return { ok: false, error: message, rawAiResponse };
    }

    const validation = validateBlocks(mapping, mapping._pageStyles);

    // Flatten section-block wrappers (see runImportAgent comment for why).
    const flatBlocks = validation.blocks.flatMap((b) => {
      if (b.blockType === 'section-block' && Array.isArray(b.columns)) {
        return b.columns.flatMap((col: { blocks?: unknown[] }) =>
          Array.isArray(col.blocks) ? col.blocks : [],
        );
      }
      return [b];
    });

    // Flatten ValidationWarning[] to human strings for the converter UI.
    const warningStrings = validation.warnings.map((w) => {
      const section = w.sectionIndex !== undefined ? ` (section ${w.sectionIndex})` : '';
      return `Block ${w.blockIndex}${section}: ${w.detail}`;
    });

    return {
      ok: true,
      blocks: flatBlocks,
      warnings: warningStrings,
      unmappedCount: mapping.unmappedSections?.length ?? 0,
      totalSections: parsedPage.sections.length,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'HTML-to-blocks conversion failed',
    };
  }
}
