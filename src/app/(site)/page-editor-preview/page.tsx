'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
import { Navbar } from '@/app/components/home/Navbar';
import { Hero } from '@/app/components/home/Hero';
import { BrandAcronym } from '@/app/components/home/BrandAcronym';
import { About } from '@/app/components/home/About';
import { FeatureStrip } from '@/app/components/home/FeatureStrip';
import { CaseStudies } from '@/app/components/home/CaseStudies';
import { Services } from '@/app/components/home/Services';
import { Mission } from '@/app/components/home/Mission';
import { Insights } from '@/app/components/home/Insights';
import { Faq } from '@/app/components/home/Faq';
import { Cta } from '@/app/components/home/Cta';
import { Footer } from '@/app/components/home/Footer';
import { NavbarScrollState } from '@/app/components/home/NavbarScrollState';
import { ScrollRevealController } from '@/app/components/home/ScrollRevealController';
import { sectionsToHomepagePatch } from '@/payload/views/HomepageEditor/homepage-adapter';
import { resolveHomepageContent } from '@/lib/resolve-homepage-content';
import { homepageContent, type HomepageContent } from '@/lib/homepage-content';
import { loadConvertedPageRegistry } from '@/lib/converted-pages/preview-registry';
import type { ConvertedPageRegistry } from '@/lib/converted-pages/types';
import { sectionsToConvertedPageContent } from '@/lib/converted-pages/editor-adapter';
import type { EditorMessage, SectionInstance, BlockInstance } from '@/payload/views/PageEditor/types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const COL_FRACTION: Record<string, string> = {
  '1/1': '1fr',
  '1/2': '1fr',
  '1/3': '1fr',
  '2/3': '2fr',
  '1/4': '1fr',
  '3/4': '3fr',
};

function buildPayloadShape(block: BlockInstance): Record<string, unknown> {
  return { blockType: block.blockType, ...block.data };
}

const INLINE_TEXT_FIELDS = [
  'title', 'subtitle', 'eyebrow', 'content', 'text', 'buttonLabel',
  'leftTitle', 'leftText', 'rightTitle', 'rightText',
  'col1Title', 'col1Text', 'col2Title', 'col2Text', 'col3Title', 'col3Text',
  // homepage fields
  'chip', 'description', 'primaryCta', 'secondaryCta', 'logo', 'cta',
  'tagline', 'copyright', 'note', 'button', 'intro',
];

const INSPECTED_STYLE_KEYS = [
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'textTransform',
  'color',
  'backgroundColor',
  'borderColor',
  'borderWidth',
  'borderRadius',
  'marginTop',
  'marginBottom',
  'paddingTop',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
] as const;

function sendToParent(msg: EditorMessage) {
  window.parent.postMessage(msg, '*');
}

function findInspectableElement(target: HTMLElement, root: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== root) {
    if (el.dataset?.field) return el;
    el = el.parentElement;
  }
  return null;
}

function buildNodeSelection(blockId: string, element: HTMLElement) {
  const computed = window.getComputedStyle(element);
  const computedStyles = Object.fromEntries(
    INSPECTED_STYLE_KEYS.map((key) => [key, computed[key]]),
  ) as Record<string, string>;

  return {
    blockId,
    fieldName: element.dataset.field ?? '',
    styleField: element.dataset.styleField || undefined,
    tagField: element.dataset.tagField || undefined,
    allowedTags: element.dataset.allowedTags?.split(',').map((tag) => tag.trim()).filter(Boolean),
    tagName: element.tagName.toLowerCase(),
    className: element.className,
    textValue: element.innerText || element.textContent || '',
    computedStyles,
  };
}

// ─── Shared block click/inline-edit wrapper ───────────────────────────────────

function BlockWrapper({
  block,
  isSelected,
  responsiveMode,
  children,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const styles = block.styles;

  const hiddenOn = styles?.hiddenOn ?? [];
  if (hiddenOn.includes(responsiveMode as 'desktop' | 'tablet' | 'mobile')) return null;

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    sendToParent({ type: 'BLOCK_CLICKED', blockId: block.id });
    const target = e.target as HTMLElement;
    const inspectable = findInspectableElement(target, ref.current);
    if (inspectable) {
      sendToParent({ type: 'CONVERTED_NODE_SELECTED', node: buildNodeSelection(block.id, inspectable) });
    } else {
      sendToParent({ type: 'CONVERTED_NODE_SELECTED', node: null });
    }
  }

  function handleDoubleClick(e: React.MouseEvent) {
    e.stopPropagation();
    const target = e.target as HTMLElement;
    let el: HTMLElement | null = target;
    while (el && el !== ref.current) {
      if (el.dataset?.field) break;
      el = el.parentElement;
    }
    if (!el || !el.dataset?.field) {
      el = findNearestTextField(target, ref.current);
    }
    if (!el?.dataset?.field) return;
    const fieldName = el.dataset.field;
    if (!fieldName) return;
    if (!block.blockType.startsWith('cp-') && !INLINE_TEXT_FIELDS.includes(fieldName)) return;

    // Snapshot the original plain-text content before editing begins.
    // We'll restore it on blur so React sees a clean DOM to reconcile against.
    const originalText = el.innerText || el.textContent || '';

    el.contentEditable = 'true';
    el.focus();
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (range) { const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }

    function handleBlur() {
      if (!el) return;
      const isRich = el.dataset.richText === 'true';
      const value = isRich ? el.innerHTML : (el.innerText || el.textContent || '');

      // Turn off editing first
      el.contentEditable = 'false';

      // Restore the element to its original plain-text content so React can
      // reconcile without fighting browser-extension-injected span nodes.
      // The store update will immediately re-render with the new value.
      if (!isRich) {
        el.textContent = originalText;
      }

      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('keydown', handleKeyDown);

      // Defer the store update one tick so the DOM has fully settled
      // (contentEditable cleanup, extension span removal) before React re-renders.
      requestAnimationFrame(() => {
        sendToParent({ type: 'INLINE_EDIT_END', blockId: block.id, fieldName: fieldName!, value });
      });
    }
    function handleKeyDown(ke: KeyboardEvent) {
      if (ke.key === 'Escape' || (ke.key === 'Enter' && !ke.shiftKey)) {
        ke.preventDefault();
        (ke.currentTarget as HTMLElement).blur();
      }
    }
    el.addEventListener('blur', handleBlur);
    el.addEventListener('keydown', handleKeyDown);
  }

  const fontWeightMap: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };

  // Merge breakpoint overrides on top of base styles
  const bpOverrides = responsiveMode === 'mobile'
    ? (styles?.mobile ?? {})
    : responsiveMode === 'tablet'
      ? (styles?.tablet ?? {})
      : {};
  const effective = { ...styles, ...bpOverrides };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(effective.paddingTop != null ? { paddingTop: `${effective.paddingTop}px` } : {}),
    ...(effective.paddingBottom != null ? { paddingBottom: `${effective.paddingBottom}px` } : {}),
    ...(effective.paddingLeft != null ? { paddingLeft: `${effective.paddingLeft}px` } : {}),
    ...(effective.paddingRight != null ? { paddingRight: `${effective.paddingRight}px` } : {}),
    ...(effective.marginTop != null ? { marginTop: `${effective.marginTop}px` } : {}),
    ...(effective.marginBottom != null ? { marginBottom: `${effective.marginBottom}px` } : {}),
    ...(effective.backgroundColor ? { backgroundColor: effective.backgroundColor } : {}),
    ...(effective.backgroundImage ? { backgroundImage: `url(${effective.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: effective.backgroundPosition ?? 'center' } : {}),
    ...(effective.opacity != null && effective.opacity !== 1 ? { opacity: effective.opacity } : {}),
    ...(effective.borderRadius != null ? { borderRadius: `${effective.borderRadius}px` } : {}),
    ...(effective.borderWidth != null ? { borderWidth: `${effective.borderWidth}px`, borderStyle: 'solid', borderColor: effective.borderColor ?? '#000' } : {}),
    ...(effective.boxShadow ? { boxShadow: effective.boxShadow } : {}),
    ...(effective.textColor ? { color: effective.textColor } : {}),
    ...(effective.fontSize != null ? { fontSize: `${effective.fontSize}px` } : {}),
    ...(effective.textAlign ? { textAlign: effective.textAlign } : {}),
    ...(effective.fontWeight ? { fontWeight: fontWeightMap[effective.fontWeight] } : {}),
    ...(effective.maxWidth != null ? { maxWidth: `${effective.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
  };

  return (
    <div
      ref={ref}
      id={`block-${block.id}`}
      style={wrapperStyle}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', outline: isSelected ? '2px solid #0ea5e9' : '2px solid transparent', outlineOffset: '-2px', transition: 'outline-color 0.15s' }} />
      {isSelected && (
        <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 20, background: '#0ea5e9', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderBottomRightRadius: '6px', pointerEvents: 'none', fontFamily: 'sans-serif' }}>
          Selected · Click element to inspect · Double-click text to edit
        </div>
      )}
      {children}
    </div>
  );
}

function findNearestTextField(target: HTMLElement, root: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = target;
  while (el && el !== root) {
    if (el.dataset?.field && ['p', 'h1', 'h2', 'h3', 'h4', 'span', 'a', 'li'].includes(el.tagName.toLowerCase())) return el;
    el = el.parentElement;
  }
  return null;
}

// ─── Generic page blocks renderer (existing Pages flow) ───────────────────────

function GenericBlockWrapper({
  block,
  isSelected,
  responsiveMode,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
}) {
  const payloadShape = buildPayloadShape(block);
  const [pageBlock] = mapPayloadBlocksToPageBuilderBlocks([payloadShape] as never);

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode}>
      {pageBlock ? <PageBlocksRenderer blocks={[pageBlock]} /> : null}
    </BlockWrapper>
  );
}

// ─── Homepage section renderer ────────────────────────────────────────────────

function buildHomepagePreviewContent(sections: SectionInstance[]): HomepageContent {
  const patch = sectionsToHomepagePatch(sections);
  const globalLike = { ...homepageContent, ...patch } as Record<string, unknown>;
  return resolveHomepageContent(globalLike);
}

function HomepageSectionBlock({
  block,
  isSelected,
  responsiveMode,
  homepage,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  homepage: HomepageContent;
}) {
  let section: React.ReactNode;
  switch (block.blockType) {
    case 'hp-nav':
      section = <Navbar data={homepage.nav} />;
      break;
    case 'hp-hero':
      section = <Hero data={homepage.hero} />;
      break;
    case 'hp-brand-acronym':
      section = <BrandAcronym data={homepage.brandAcronym} />;
      break;
    case 'hp-about':
      section = <About data={homepage.about} />;
      break;
    case 'hp-features':
      section = <FeatureStrip data={homepage.features} />;
      break;
    case 'hp-case-studies':
      section = <CaseStudies data={homepage.caseStudies} />;
      break;
    case 'hp-services':
      section = <Services data={homepage.services} />;
      break;
    case 'hp-mission':
      section = <Mission data={homepage.mission} />;
      break;
    case 'hp-insights':
      section = <Insights data={homepage.insights} />;
      break;
    case 'hp-faq':
      section = <Faq data={homepage.faq} />;
      break;
    case 'hp-cta':
      section = <Cta data={homepage.cta} />;
      break;
    case 'hp-footer':
      section = <Footer data={homepage.footer} />;
      break;
    default:
      section = (
        <div style={{ padding: '24px', margin: '2px 0', fontFamily: 'sans-serif', color: '#666', fontSize: '13px', textAlign: 'center', border: '1px dashed #ddd' }}>
          {block.blockType} section
        </div>
      );
      break;
  }

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode}>
      {section}
    </BlockWrapper>
  );
}

function ConvertedSectionBlock({
  block,
  isSelected,
  responsiveMode,
  registry,
  content,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
  registry: ConvertedPageRegistry;
  content: Record<string, unknown>;
}) {
  const sectionKey = String(block.data.__sectionKey ?? '');
  const entry = registry.sections.find((s) => s.key === sectionKey);
  if (!entry) {
    return (
      <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode}>
        <div style={{ padding: '24px', margin: '2px 0', fontFamily: 'sans-serif', color: '#666', fontSize: '13px', textAlign: 'center', border: '1px dashed #ddd' }}>
          Missing renderer for {sectionKey || block.blockType}
        </div>
      </BlockWrapper>
    );
  }

  const Component = entry.Component as React.ComponentType<{ data: unknown }>;
  const sectionData = content[entry.key] as Record<string, unknown>;

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode}>
      <Component data={sectionData} />
    </BlockWrapper>
  );
}

// ─── Sections layout ──────────────────────────────────────────────────────────

function SectionsLayout({
  sections,
  selectedBlockId,
  responsiveMode,
  isHomepageMode,
  isConvertedMode,
  convertedRegistry,
}: {
  sections: SectionInstance[];
  selectedBlockId: string | null;
  responsiveMode: string;
  isHomepageMode: boolean;
  isConvertedMode: boolean;
  convertedRegistry: ConvertedPageRegistry | null;
}) {
  const homepage = isHomepageMode ? buildHomepagePreviewContent(sections) : null;
  const convertedContent = (isConvertedMode && convertedRegistry)
    ? sectionsToConvertedPageContent(convertedRegistry.defaultContent, sections)
    : null;
  const hasBlocks = sections.some((s) => s.columns.some((c) => c.blocks.length > 0));

  if (!hasBlocks) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fafafa', color: '#999', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>
          {isHomepageMode ? '🏠' : isConvertedMode ? '✦' : '📄'}
        </p>
        <p style={{ fontSize: '16px', margin: 0 }}>
          {isHomepageMode
            ? 'Homepage sections loading…'
            : isConvertedMode
              ? 'Converted page sections loading…'
              : 'Add blocks to see your page preview'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {(isHomepageMode || isConvertedMode) ? (
        <>
          <NavbarScrollState selector=".nav" solidClass="solid" offset={60} />
          <ScrollRevealController />
        </>
      ) : null}
      {sections.map((section) => {
        const sectionStyles = section.styles;
        const gridTemplate = section.columns.length === 1
          ? undefined
          : section.columns.map((c) => COL_FRACTION[c.width] ?? '1fr').join(' ');

        return (
          <div
            key={section.id}
            style={{
              ...(sectionStyles?.paddingTop != null ? { paddingTop: `${sectionStyles.paddingTop}px` } : {}),
              ...(sectionStyles?.paddingBottom != null ? { paddingBottom: `${sectionStyles.paddingBottom}px` } : {}),
              ...(sectionStyles?.paddingLeft != null ? { paddingLeft: `${sectionStyles.paddingLeft}px` } : {}),
              ...(sectionStyles?.paddingRight != null ? { paddingRight: `${sectionStyles.paddingRight}px` } : {}),
              ...(sectionStyles?.backgroundColor ? { backgroundColor: sectionStyles.backgroundColor } : {}),
              ...(sectionStyles?.backgroundImage ? { backgroundImage: `url(${sectionStyles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: sectionStyles.backgroundPosition ?? 'center' } : {}),
              ...(sectionStyles?.opacity != null && sectionStyles.opacity !== 1 ? { opacity: sectionStyles.opacity } : {}),
              ...(sectionStyles?.borderWidth != null ? { borderWidth: `${sectionStyles.borderWidth}px`, borderStyle: 'solid', borderColor: sectionStyles.borderColor ?? '#000' } : {}),
              ...(sectionStyles?.boxShadow ? { boxShadow: sectionStyles.boxShadow } : {}),
              ...(sectionStyles?.maxWidth != null ? { maxWidth: `${sectionStyles.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
            }}
          >
            <div style={section.columns.length > 1 ? { display: 'grid', gridTemplateColumns: gridTemplate, gap: '0' } : undefined}>
              {section.columns.map((col) => (
                <div key={col.id}>
                  {col.blocks.filter((block) => !block.isHidden).map((block) => {
                    const isHp = block.blockType.startsWith('hp-');
                    const isConverted = block.blockType.startsWith('cp-');
                    return isHp ? (
                      <HomepageSectionBlock
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                        homepage={homepage!}
                      />
                    ) : isConverted && convertedRegistry && convertedContent ? (
                      <ConvertedSectionBlock
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                        registry={convertedRegistry}
                        content={convertedContent}
                      />
                    ) : (
                      <GenericBlockWrapper
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function PreviewInner() {
  const searchParams = useSearchParams();
  const isHomepageMode = searchParams.get('mode') === 'homepage';
  const isConvertedMode = searchParams.get('mode') === 'converted-page';
  const convertedPage = searchParams.get('page') ?? '';

  const [sections, setSections] = useState<SectionInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [responsiveMode, setResponsiveMode] = useState('desktop');
  const [convertedRegistry, setConvertedRegistry] = useState<ConvertedPageRegistry | null>(null);

  useEffect(() => {
    if (!isConvertedMode || !convertedPage) {
      setConvertedRegistry(null);
      return;
    }
    let active = true;
    loadConvertedPageRegistry(convertedPage).then((registry) => {
      if (active) setConvertedRegistry(registry);
    });
    return () => {
      active = false;
    };
  }, [isConvertedMode, convertedPage]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data as EditorMessage;
      if (!data?.type) return;

      if (data.type === 'UPDATE_SECTIONS') {
        setSections(data.sections);
        if (data.responsiveMode) setResponsiveMode(data.responsiveMode);
      }

      if (data.type === 'SELECT_BLOCK') {
        setSelectedBlockId(data.blockId ?? null);
        if (data.blockId) {
          document.getElementById(`block-${data.blockId}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }

    window.addEventListener('message', handleMessage);
    sendToParent({ type: 'EDITOR_READY' });
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>('[data-r]').forEach((el) => {
        el.classList.add('revealed');
      });

      document.querySelectorAll<HTMLElement>('.img-reveal').forEach((el) => {
        el.classList.add('revealed');
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [sections, responsiveMode, isHomepageMode, isConvertedMode, convertedPage, convertedRegistry]);

  return (
    <SectionsLayout
      sections={sections}
      selectedBlockId={selectedBlockId}
      responsiveMode={responsiveMode}
      isHomepageMode={isHomepageMode}
      isConvertedMode={isConvertedMode}
      convertedRegistry={convertedRegistry}
    />
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PageEditorPreview() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#fafafa' }} />}>
      <PreviewInner />
    </Suspense>
  );
}
