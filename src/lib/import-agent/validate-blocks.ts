import type {
  AIBlockMapping,
  PageBlocksPayload,
  PayloadBlock,
  PayloadSectionBlock,
  ValidationResult,
  ValidationWarning,
} from './types';

function injectStyles(html: string, css: string): string {
  if (!css) return html;
  return `<style>${css}</style>\n${html}`;
}

export const VALID_BLOCK_TYPES = new Set<string>([
  'hero-block',
  'rich-text-block',
  'text-image-block',
  'cta-block',
  'faq-block',
  'stats-block',
  'testimonials-block',
  'pricing-block',
  'card-grid-block',
  'accordion-block',
  'two-col-block',
  'three-col-block',
  'logo-carousel-block',
  'video-embed-block',
  'spacer-block',
  'heading-block',
  'button-block',
  'image-block',
  'alert-block',
  'tabs-block',
  'social-icons-block',
  'counter-block',
  'progress-bar-block',
  'image-gallery-block',
  'custom-html-block',
]);

const MIN_REQUIRED: Record<string, string[]> = {
  'hero-block': ['title'],
  'rich-text-block': ['content'],
  'text-image-block': ['text'],
  'cta-block': ['buttonLabel'],
  'faq-block': ['items'],
  'stats-block': ['items'],
  'testimonials-block': ['items'],
  'pricing-block': ['plans'],
  'card-grid-block': ['cards'],
  'accordion-block': ['items'],
};

const BLOCK_WIDTHS = ['1/1', '1/2', '1/3', '2/3', '1/4', '3/4'] as const;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function pickString(source: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = source[key];
    if (isNonEmptyString(value)) return value.trim();
  }
  return undefined;
}

function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isObj) : [];
}

function lexicalNodeToText(node: unknown, chunks: string[]): void {
  if (!isObj(node)) return;
  if (isNonEmptyString(node.text)) {
    chunks.push(node.text);
  }

  const children = Array.isArray(node.children) ? node.children : [];
  const before = chunks.length;
  children.forEach((child) => lexicalNodeToText(child, chunks));

  const type = typeof node.type === 'string' ? node.type : '';
  if (
    chunks.length > before &&
    ['p', 'paragraph', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'listitem', 'quote'].includes(type)
  ) {
    chunks.push('\n');
  }
}

function lexicalToText(value: unknown): string | undefined {
  if (isNonEmptyString(value)) return value;
  if (!isObj(value)) return undefined;

  const root = isObj(value.root) ? value.root : value;
  const chunks: string[] = [];
  lexicalNodeToText(root, chunks);

  const text = chunks.join('').replace(/\n{3,}/g, '\n\n').trim();
  return text || undefined;
}

function normalizeImageRef(value: unknown, alt?: string): Record<string, unknown> | undefined {
  if (isObj(value) && isNonEmptyString(value.src)) {
    return { src: value.src, alt: isNonEmptyString(value.alt) ? value.alt : alt };
  }
  if (isNonEmptyString(value)) {
    return { src: value, alt };
  }
  return undefined;
}

function normalizeLeafBlock(rawLeaf: Record<string, unknown>): Record<string, unknown> {
  const blockType = String(rawLeaf.blockType || '');
  const out: Record<string, unknown> = { ...rawLeaf };

  if (blockType === 'hero-block') {
    out.subtitle = pickString(out, ['subtitle', 'description', 'text']) ?? out.subtitle;
    out.primaryCtaLabel = pickString(out, ['primaryCtaLabel', 'buttonLabel', 'ctaLabel']) ?? out.primaryCtaLabel;
    out.primaryCtaHref = pickString(out, ['primaryCtaHref', 'buttonHref', 'ctaHref', 'href']) ?? out.primaryCtaHref;
    out.secondaryCtaLabel =
      pickString(out, ['secondaryCtaLabel', 'secondaryButtonLabel']) ?? out.secondaryCtaLabel;
    out.secondaryCtaHref = pickString(out, ['secondaryCtaHref', 'secondaryButtonHref']) ?? out.secondaryCtaHref;
    const imageAlt = pickString(out, ['imageAlt', 'alt']);
    const imageRef = normalizeImageRef(out.image ?? out.imageUrl ?? out.imageURL ?? out.src, imageAlt);
    if (imageRef) out.image = imageRef;
  }

  if (blockType === 'rich-text-block') {
    const content = lexicalToText(out.content ?? out.body ?? out.text ?? out.description);
    if (content) out.content = content;
  }

  if (blockType === 'text-image-block') {
    out.text = lexicalToText(out.text ?? out.body ?? out.description) ?? out.text;
    const imageAlt = pickString(out, ['imageAlt', 'alt']);
    const imageRef = normalizeImageRef(out.image ?? out.imageUrl ?? out.imageURL ?? out.src, imageAlt);
    if (imageRef) out.image = imageRef;
  }

  if (blockType === 'cta-block') {
    out.title = pickString(out, ['title', 'heading']) ?? out.title;
    out.subtitle = lexicalToText(out.subtitle ?? out.description ?? out.text) ?? out.subtitle;
    out.buttonLabel = pickString(out, ['buttonLabel', 'ctaLabel', 'primaryCtaLabel']) ?? out.buttonLabel;
    out.buttonHref = pickString(out, ['buttonHref', 'ctaHref', 'primaryCtaHref', 'href']) ?? out.buttonHref;
  }

  if (blockType === 'faq-block') {
    const items = asRecordArray(out.items).map((item) => ({
      question: pickString(item, ['question', 'title', 'heading']) ?? '',
      answer: lexicalToText(item.answer ?? item.body ?? item.content) ?? '',
    }));
    out.items = items.filter((item) => item.question);
  }

  if (blockType === 'accordion-block') {
    const items = asRecordArray(out.items).map((item) => ({
      heading: pickString(item, ['heading', 'title', 'question', 'label']) ?? '',
      body: lexicalToText(item.body ?? item.answer ?? item.content ?? item.description) ?? '',
    }));
    out.items = items.filter((item) => item.heading);
  }

  if (blockType === 'stats-block') {
    const items = asRecordArray(out.items).map((item) => ({
      label: pickString(item, ['label', 'title', 'name']) ?? '',
      value: pickString(item, ['value', 'stat', 'number']) ?? '',
    }));
    out.items = items.filter((item) => item.label && item.value);
  }

  if (blockType === 'testimonials-block') {
    const items = asRecordArray(out.items).map((item) => ({
      quote: lexicalToText(item.quote ?? item.text ?? item.body ?? item.content) ?? '',
      name: pickString(item, ['name', 'author']) ?? '',
      role: pickString(item, ['role', 'title']),
    }));
    out.items = items.filter((item) => item.quote && item.name);
  }

  if (blockType === 'card-grid-block') {
    const cards = asRecordArray(out.cards).map((card) => {
      const imageRef = normalizeImageRef(card.image ?? card.imageUrl ?? card.imageURL ?? card.src, pickString(card, ['imageAlt', 'alt']));
      return {
        title: pickString(card, ['title', 'heading', 'name']) ?? '',
        text: lexicalToText(card.text ?? card.description ?? card.body),
        eyebrow: pickString(card, ['eyebrow', 'tag']),
        ctaLabel: pickString(card, ['ctaLabel', 'buttonLabel']),
        ctaHref: pickString(card, ['ctaHref', 'buttonHref', 'href']),
        image: imageRef,
      };
    });
    out.cards = cards.filter((card) => card.title);
  }

  if (blockType === 'tabs-block') {
    const tabs = asRecordArray(out.tabs ?? out.items).map((item) => ({
      label: pickString(item, ['label', 'title']) ?? '',
      content: lexicalToText(item.content ?? item.body ?? item.text) ?? '',
    }));
    out.tabs = tabs.filter((tab) => tab.label);
  }

  if (blockType === 'social-icons-block') {
    const links = asRecordArray(out.links ?? out.items).map((item) => ({
      platform: pickString(item, ['platform', 'label', 'name']) ?? '',
      url: pickString(item, ['url', 'href']) ?? '',
    }));
    out.links = links.filter((link) => link.platform && link.url);
  }

  if (blockType === 'heading-block') {
    out.text = pickString(out, ['text', 'title', 'heading']) ?? out.text;
  }

  if (blockType === 'button-block') {
    out.label = pickString(out, ['label', 'text', 'buttonLabel', 'ctaLabel']) ?? out.label;
    out.href = pickString(out, ['href', 'url', 'buttonHref', 'ctaHref']) ?? out.href;
  }

  if (blockType === 'alert-block') {
    out.body = lexicalToText(out.body ?? out.text ?? out.content ?? out.description) ?? out.body;
  }

  if (blockType === 'image-block') {
    const imageAlt = pickString(out, ['imageAlt', 'alt']);
    const imageRef = normalizeImageRef(out.image ?? out.imageUrl ?? out.imageURL ?? out.src, imageAlt);
    if (imageRef) out.image = imageRef;
  }

  return out;
}

function toCustomHtmlBlock(source: unknown, label = 'Auto-fallback', pageStyles?: string): PayloadBlock {
  const rawHtml = typeof source === 'string'
    ? source
    : isObj(source) && typeof source.rawHtml === 'string'
      ? source.rawHtml
      : `<pre>${JSON.stringify(source ?? {}, null, 2)}</pre>`;

  const html = pageStyles ? injectStyles(rawHtml, pageStyles) : rawHtml;
  return { blockType: 'custom-html-block', html, label };
}

function wrapSection(block: PayloadBlock): PayloadSectionBlock {
  return {
    blockType: 'section-block',
    columns: [{ width: '1/1', blocks: [block] }],
  };
}

function hasMissingRequired(block: Record<string, unknown>): string[] {
  const blockType = String(block.blockType || '');
  const required = MIN_REQUIRED[blockType] ?? [];
  return required.filter((field) => {
    const value = block[field];
    if (Array.isArray(value)) return value.length === 0;
    return value === undefined || value === null || value === '';
  });
}

function collectImageWarnings(
  block: Record<string, unknown>,
  warnings: ValidationWarning[],
  blockIndex: number,
  sectionIndex: number,
): void {
  const imageKeys = ['image', 'src', 'imageUrl', 'imageURL', 'backgroundImage'];
  for (const key of imageKeys) {
    const value = block[key];
    if (typeof value === 'string' && /^https?:\/\//i.test(value)) {
      warnings.push({
        blockIndex,
        sectionIndex,
        reason: 'unresolved_image',
        detail: `Block ${String(block.blockType)} has external image URL in ${key}`,
        autoFallback: false,
      });
    }
    if (isObj(value) && typeof value.src === 'string' && /^https?:\/\//i.test(value.src)) {
      warnings.push({
        blockIndex,
        sectionIndex,
        reason: 'unresolved_image',
        detail: `Block ${String(block.blockType)} has external image URL in ${key}.src`,
        autoFallback: false,
      });
    }
    if (Array.isArray(value)) {
      value.filter(isObj).forEach((item, i) => {
        if (typeof item.src === 'string' && /^https?:\/\//i.test(item.src)) {
          warnings.push({
            blockIndex,
            sectionIndex,
            reason: 'unresolved_image',
            detail: `Block ${String(block.blockType)} has external image URL in ${key}[${i}].src`,
            autoFallback: false,
          });
        }
      });
    }
  }
}

export function validateBlocks(mapping: AIBlockMapping, pageStyles?: string): ValidationResult {
  const rawBlocks = Array.isArray(mapping.blocks) ? mapping.blocks : [];
  const warnings: ValidationWarning[] = [];
  const output: PageBlocksPayload = [];

  let nextBlockIndex = 0;

  rawBlocks.forEach((rawTop, topIndex) => {
    if (!isObj(rawTop)) {
      const fallback = wrapSection(toCustomHtmlBlock(rawTop, 'Invalid top-level block', pageStyles));
      output.push(fallback);
      warnings.push({
        blockIndex: nextBlockIndex++,
        sectionIndex: topIndex,
        reason: 'unknown_block_type',
        detail: 'Top-level item is not an object.',
        autoFallback: true,
      });
      return;
    }

    const topType = String(rawTop.blockType || '');

    // Enforce section topology by wrapping naked blocks.
    let section: PayloadSectionBlock;
    if (topType === 'section-block') {
      section = rawTop as PayloadSectionBlock;
    } else {
      const fallbackLeaf = VALID_BLOCK_TYPES.has(topType)
        ? (rawTop as PayloadBlock)
        : toCustomHtmlBlock(rawTop, 'Unknown top-level block fallback', pageStyles);

      section = wrapSection(fallbackLeaf);
      warnings.push({
        blockIndex: nextBlockIndex,
        sectionIndex: topIndex,
        reason: 'unknown_block_type',
        detail: `Top-level block ${topType || '(missing)'} wrapped into section-block.`,
        autoFallback: !VALID_BLOCK_TYPES.has(topType),
      });
    }

    const columns = Array.isArray(section.columns) ? section.columns : [];

    if (columns.length === 0) {
      warnings.push({
        blockIndex: nextBlockIndex,
        sectionIndex: topIndex,
        reason: 'empty_section',
        detail: 'Section removed because it has no columns.',
        autoFallback: true,
      });
      return;
    }

    const normalizedColumns = columns.map((col) => {
      const width = isObj(col) && typeof col.width === 'string' ? col.width : '1/1';
      const blocks = isObj(col) && Array.isArray(col.blocks) ? col.blocks : [];

      const normalizedBlocks = blocks.map((rawLeaf) => {
        if (!isObj(rawLeaf)) {
          warnings.push({
            blockIndex: nextBlockIndex,
            sectionIndex: topIndex,
            reason: 'unknown_block_type',
            detail: 'Non-object leaf block replaced with custom-html-block.',
            autoFallback: true,
          });
          nextBlockIndex += 1;
          return toCustomHtmlBlock(rawLeaf, 'Leaf fallback', pageStyles);
        }

        const normalizedLeaf = normalizeLeafBlock(rawLeaf);
        const blockType = String(normalizedLeaf.blockType || '');
        if (!VALID_BLOCK_TYPES.has(blockType)) {
          warnings.push({
            blockIndex: nextBlockIndex,
            sectionIndex: topIndex,
            reason: 'unknown_block_type',
            detail: `Leaf block type ${blockType || '(missing)'} replaced with custom-html-block.`,
            autoFallback: true,
          });
          nextBlockIndex += 1;
          return toCustomHtmlBlock(rawLeaf, 'Unknown block fallback', pageStyles);
        }

        const missing = hasMissingRequired(normalizedLeaf);
        if (missing.length > 0) {
          warnings.push({
            blockIndex: nextBlockIndex,
            sectionIndex: topIndex,
            reason: 'missing_required_field',
            detail: `${blockType} missing required fields: ${missing.join(', ')}`,
            autoFallback: false,
          });
        }

        collectImageWarnings(normalizedLeaf, warnings, nextBlockIndex, topIndex);

        nextBlockIndex += 1;
        return normalizedLeaf as PayloadBlock;
      });

      return {
        width: (BLOCK_WIDTHS.includes(width as (typeof BLOCK_WIDTHS)[number]) ? width : '1/1') as
          | '1/1'
          | '1/2'
          | '1/3'
          | '2/3'
          | '1/4'
          | '3/4',
        blocks: normalizedBlocks,
      };
    });

    const hasAnyBlocks = normalizedColumns.some((c) => c.blocks.length > 0);
    if (!hasAnyBlocks) {
      warnings.push({
        blockIndex: nextBlockIndex,
        sectionIndex: topIndex,
        reason: 'empty_section',
        detail: 'Section removed because all columns are empty.',
        autoFallback: true,
      });
      return;
    }

    output.push({
      blockType: 'section-block',
      paddingTop: typeof section.paddingTop === 'number' ? section.paddingTop : undefined,
      paddingBottom: typeof section.paddingBottom === 'number' ? section.paddingBottom : undefined,
      backgroundColor: typeof section.backgroundColor === 'string' ? section.backgroundColor : undefined,
      columns: normalizedColumns,
    });
  });

  return {
    blocks: output,
    warnings,
    isValid: !warnings.some((w) => w.autoFallback),
  };
}
