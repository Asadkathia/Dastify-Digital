import { getPayload } from 'payload';
import payloadConfig from '@payload-config';
import { parseHtml } from './parse-html';
import { buildSeo } from './build-seo';
import { mapToBlocks, AIParseError } from './map-to-blocks';
import { validateBlocks } from './validate-blocks';
import type { ImportReport, ImportRequest, ImportResponse } from './types';

export async function runImportAgent(request: ImportRequest): Promise<ImportResponse> {
  try {
    const parsedPage = parseHtml(request.html);
    const seo = buildSeo(parsedPage, request.slug);

    let mapping;
    try {
      mapping = await mapToBlocks(parsedPage, request.ai);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'AI mapping failed';
      const rawAiResponse = error instanceof AIParseError ? error.rawAiResponse : undefined;
      return { ok: false, error: message, rawAiResponse };
    }

    const validation = validateBlocks(mapping, mapping._pageStyles);

    const payload = await getPayload({ config: await payloadConfig });
    const createdPage = await payload.create({
      collection: 'pages',
      data: {
        title: request.title,
        slug: request.slug,
        _status: 'draft',
        blocks: validation.blocks as never,
        meta: {
          title: mapping.seo?.title || seo.title,
          description: mapping.seo?.description || seo.description,
          keywords: mapping.seo?.keywords || seo.keywords,
          canonicalURL: mapping.seo?.canonicalURL || seo.canonicalURL,
          noindex: typeof mapping.seo?.noindex === 'boolean' ? mapping.seo.noindex : seo.noindex,
        },
      },
    });

    const externalImages = parsedPage.sections.flatMap((section) =>
      section.images
        .filter((img) => img.isExternal)
        .map((img) => ({ src: img.src, alt: img.alt, blockIndex: section.index })),
    );

    const report: ImportReport = {
      slug: request.slug,
      title: request.title,
      provider: request.ai.provider,
      model: request.ai.model,
      totalSections: parsedPage.sections.length,
      mappedSections: Math.max(parsedPage.sections.length - (mapping.unmappedSections?.length ?? 0), 0),
      fallbackSections: mapping.unmappedSections?.length ?? 0,
      warnings: validation.warnings,
      externalImages,
      seo: {
        ...seo,
        ...mapping.seo,
      },
      createdPageId: String((createdPage as { id?: string | number }).id ?? ''),
      importedAt: new Date().toISOString(),
    };

    await payload.create({
      collection: 'import-reports' as never,
      data: {
        slug: report.slug,
        title: report.title,
        provider: report.provider,
        model: report.model,
        totalSections: report.totalSections,
        mappedSections: report.mappedSections,
        fallbackSections: report.fallbackSections,
        warnings: report.warnings,
        externalImages: report.externalImages,
        seo: report.seo,
        createdPageId: report.createdPageId,
        importedAt: report.importedAt,
      } as never,
    });

    return {
      ok: true,
      pageId: report.createdPageId,
      slug: request.slug,
      report,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Import agent failed',
    };
  }
}
