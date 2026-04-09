'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageBlocksRenderer } from '@/components/blocks/PageBlocksRenderer';
import { mapPayloadBlocksToPageBuilderBlocks } from '@/components/blocks/types';
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

function sendToParent(msg: EditorMessage) {
  window.parent.postMessage(msg, '*');
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
    if (!INLINE_TEXT_FIELDS.includes(fieldName)) return;

    el.contentEditable = 'true';
    el.focus();
    const range = document.caretRangeFromPoint?.(e.clientX, e.clientY);
    if (range) { const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(range); }

    function handleBlur() {
      if (!el) return;
      el.contentEditable = 'false';
      sendToParent({ type: 'INLINE_EDIT_END', blockId: block.id, fieldName: fieldName!, value: el.textContent ?? '' });
      el.removeEventListener('blur', handleBlur);
      el.removeEventListener('keydown', handleKeyDown);
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
  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    ...(styles?.paddingTop != null ? { paddingTop: `${styles.paddingTop}px` } : {}),
    ...(styles?.paddingBottom != null ? { paddingBottom: `${styles.paddingBottom}px` } : {}),
    ...(styles?.paddingLeft != null ? { paddingLeft: `${styles.paddingLeft}px` } : {}),
    ...(styles?.paddingRight != null ? { paddingRight: `${styles.paddingRight}px` } : {}),
    ...(styles?.marginTop != null ? { marginTop: `${styles.marginTop}px` } : {}),
    ...(styles?.marginBottom != null ? { marginBottom: `${styles.marginBottom}px` } : {}),
    ...(styles?.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}),
    ...(styles?.backgroundImage ? { backgroundImage: `url(${styles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
    ...(styles?.opacity != null && styles.opacity !== 1 ? { opacity: styles.opacity } : {}),
    ...(styles?.borderRadius != null ? { borderRadius: `${styles.borderRadius}px` } : {}),
    ...(styles?.borderWidth != null ? { borderWidth: `${styles.borderWidth}px`, borderStyle: 'solid', borderColor: styles.borderColor ?? '#000' } : {}),
    ...(styles?.boxShadow ? { boxShadow: styles.boxShadow } : {}),
    ...(styles?.textColor ? { color: styles.textColor } : {}),
    ...(styles?.fontSize != null ? { fontSize: `${styles.fontSize}px` } : {}),
    ...(styles?.textAlign ? { textAlign: styles.textAlign } : {}),
    ...(styles?.fontWeight ? { fontWeight: fontWeightMap[styles.fontWeight] } : {}),
    ...(styles?.maxWidth != null ? { maxWidth: `${styles.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
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
          Selected · Double-click to edit
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

/**
 * Dynamically renders real homepage section components in the iframe.
 * Each section's block data is passed as the `data` prop to the corresponding component.
 * We normalise {value: string}[] arrays back to string[] before passing to components.
 */
function HomepageSectionBlock({
  block,
  isSelected,
  responsiveMode,
}: {
  block: BlockInstance;
  isSelected: boolean;
  responsiveMode: string;
}) {
  const data = block.data as Record<string, unknown>;

  function renderSection() {
    switch (block.blockType) {
      case 'hp-nav':
        return (
          <div style={{ padding: '16px 24px', background: '#0a0a12', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'sans-serif' }}>
            <span data-field="logo" style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>{String(data.logo ?? 'Logo')}</span>
            <nav style={{ display: 'flex', gap: '24px' }}>
              {Array.isArray(data.links) && (data.links as Array<{ label: string; href: string }>).map((l, i) => (
                <a key={i} href={l.href} style={{ color: '#aaa', fontSize: '14px', textDecoration: 'none' }}>{l.label}</a>
              ))}
            </nav>
            <span data-field="cta" style={{ background: '#6c3ef4', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>{String(data.cta ?? 'CTA')}</span>
          </div>
        );

      case 'hp-hero':
        return (
          <div style={{ padding: '80px 48px', background: 'linear-gradient(135deg, #0a0a12 60%, #12123a)', display: 'flex', alignItems: 'center', gap: '48px', fontFamily: 'sans-serif', minHeight: '70vh' }}>
            <div style={{ flex: 1 }}>
              <div data-field="chip" style={{ display: 'inline-block', background: '#1e1040', color: '#a78bfa', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '24px' }}>{String(data.chip ?? '')}</div>
              <div style={{ marginBottom: '24px' }}>
                {Array.isArray(data.headingLines) && (data.headingLines as Array<{ text: string; colorVar?: string }>).map((line, i) => (
                  <div key={i} data-field={`headingLines.${i}.text`} style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, color: line.colorVar ? line.colorVar.replace('var(--blue)', '#4fc3f7') : '#fff' }}>{line.text}</div>
                ))}
              </div>
              <p data-field="description" style={{ color: '#aaa', fontSize: '16px', lineHeight: 1.6, maxWidth: '520px', marginBottom: '32px' }}>{String(data.description ?? '')}</p>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '48px' }}>
                <button data-field="primaryCta" style={{ background: '#6c3ef4', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{String(data.primaryCta ?? '')}</button>
                <button data-field="secondaryCta" style={{ background: 'transparent', color: '#ccc', border: '1px solid #333', padding: '14px 24px', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>{String(data.secondaryCta ?? '')}</button>
              </div>
              <div style={{ display: 'flex', gap: '32px' }}>
                {Array.isArray(data.stats) && (data.stats as Array<{ value: string; counterTarget?: number; suffix?: string; label: string }>).map((stat, i) => (
                  <div key={i}>
                    <div style={{ color: '#fff', fontSize: '28px', fontWeight: 800 }}>{stat.counterTarget ? `${stat.counterTarget}${stat.suffix ?? ''}` : stat.value}</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            {Boolean(data.image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typeof data.image === 'object' && data.image !== null && 'url' in (data.image as object) ? String((data.image as { url: string }).url) : String(data.image)} alt={String(data.imageAlt ?? '')} style={{ width: '420px', borderRadius: '16px', objectFit: 'cover' }} />
            )}
          </div>
        );

      case 'hp-brand-acronym':
        return (
          <div style={{ padding: '80px 48px', background: '#080810', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <div data-field="chip" style={{ display: 'inline-block', background: '#1a0a30', color: '#a78bfa', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '24px' }}>{String(data.chip ?? '')}</div>
            <h2 data-field="title" style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>{String(data.title ?? '')}</h2>
            <p data-field="subtitle" style={{ color: '#777', fontSize: '16px', marginBottom: '48px' }}>{String(data.subtitle ?? '')}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {Array.isArray(data.items) && (data.items as Array<{ l: string; t1: string; t2: string; color: string }>).map((item, i) => (
                <div key={i} style={{ background: item.color === 'purple' ? '#1e103c' : '#0a1a3c', border: `1px solid ${item.color === 'purple' ? '#6c3ef4' : '#1a4fc4'}`, borderRadius: '12px', padding: '16px 20px', textAlign: 'center', minWidth: '100px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: item.color === 'purple' ? '#a78bfa' : '#4fc3f7' }}>{item.l}</div>
                  <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>{item.t1}</div>
                  <div style={{ fontSize: '11px', color: '#555' }}>{item.t2}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hp-about':
        return (
          <div style={{ padding: '80px 48px', background: '#06060e', display: 'flex', gap: '64px', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ flex: 1 }}>
              <div data-field="chip" style={{ display: 'inline-block', background: '#0a1a30', color: '#4fc3f7', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '24px' }}>{String(data.chip ?? '')}</div>
              {Array.isArray(data.headingLines) && (data.headingLines as Array<{ text: string; colorVar?: string }>).map((line, i) => (
                <div key={i} data-field={`headingLines.${i}.text`} style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1.2, color: line.colorVar ? '#4fc3f7' : '#fff', marginBottom: '4px' }}>{line.text}</div>
              ))}
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Array.isArray(data.paragraphs) && (data.paragraphs as Array<{ value?: string } | string>).map((p, i) => (
                  <p key={i} data-field={`paragraphs.${i}`} style={{ color: '#aaa', fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
                    {typeof p === 'string' ? p : (p as { value?: string }).value ?? ''}
                  </p>
                ))}
              </div>
              <button data-field="cta" style={{ marginTop: '32px', background: 'transparent', color: '#4fc3f7', border: '1px solid #4fc3f7', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>{String(data.cta ?? '')}</button>
            </div>
            {Boolean(data.image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typeof data.image === 'object' && data.image !== null && 'url' in (data.image as object) ? String((data.image as { url: string }).url) : String(data.image)} alt={String(data.imageAlt ?? '')} style={{ width: '420px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} />
            )}
          </div>
        );

      case 'hp-features':
        return (
          <div style={{ padding: '60px 48px', background: '#0a0a12', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {Array.isArray(data.cards) && (data.cards as Array<{ category: string; title: string; description: string; image: string; alt: string }>).map((card, i) => (
                <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', overflow: 'hidden' }}>
                  {card.image && <div style={{ height: '180px', background: `url(${card.image}) center/cover` }} />}
                  <div style={{ padding: '20px' }}>
                    <div style={{ color: '#6c3ef4', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>{card.category}</div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>{card.title}</div>
                    <div style={{ color: '#777', fontSize: '13px', lineHeight: 1.5 }}>{card.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hp-case-studies': {
        const main = data.main as Record<string, unknown> | undefined;
        return (
          <div style={{ padding: '80px 48px', background: '#06060e', fontFamily: 'sans-serif' }}>
            <div data-field="chip" style={{ display: 'inline-block', background: '#1a0a30', color: '#a78bfa', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '16px' }}>{String(data.chip ?? '')}</div>
            <h2 data-field="title" style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '32px' }}>{String(data.title ?? '')}</h2>
            {main && (
              <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '16px', padding: '32px', display: 'flex', gap: '32px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#777', fontSize: '12px', marginBottom: '8px' }}>{String(main.tag ?? '')}</div>
                  <div style={{ color: '#fff', fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>{String(main.title ?? '')}</div>
                  <div style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>{String(main.description ?? '')}</div>
                  <div style={{ fontSize: '42px', fontWeight: 900, color: '#4fc3f7' }}>{String(main.stat ?? '')}</div>
                  <div style={{ color: '#666', fontSize: '13px' }}>{String(main.statLabel ?? '')}</div>
                </div>
                {Boolean(main.image) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={String(main.image)} alt={String(main.alt ?? '')} style={{ width: '300px', borderRadius: '12px', objectFit: 'cover' }} />
                )}
              </div>
            )}
          </div>
        );
      }

      case 'hp-services':
        return (
          <div style={{ padding: '80px 48px', background: '#0a0a12', fontFamily: 'sans-serif' }}>
            <div data-field="chip" style={{ display: 'inline-block', background: '#0a1a30', color: '#4fc3f7', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '16px' }}>{String(data.chip ?? '')}</div>
            <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '8px' }}>
              {Array.isArray(data.titleLines) && (data.titleLines as Array<{ value?: string } | string>).map((l, i) => (
                <span key={i} data-field={`titleLines.${i}`} style={{ display: 'block' }}>{typeof l === 'string' ? l : (l as { value?: string }).value ?? ''}</span>
              ))}
            </h2>
            <p data-field="description" style={{ color: '#777', fontSize: '15px', marginBottom: '48px', maxWidth: '600px' }}>{String(data.description ?? '')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {Array.isArray(data.items) && (data.items as Array<{ number: string; name: string; description: string; image: string; alt: string }>).map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px 0', borderBottom: '1px solid #1a1a1a' }}>
                  <span style={{ color: '#333', fontSize: '24px', fontWeight: 800, minWidth: '48px' }}>{item.number}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{item.name}</div>
                    <div style={{ color: '#777', fontSize: '13px' }}>{item.description}</div>
                  </div>
                  {item.image && <div style={{ width: '80px', height: '60px', background: `url(${item.image}) center/cover`, borderRadius: '8px', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          </div>
        );

      case 'hp-mission':
        return (
          <div style={{ padding: '80px 48px', background: '#06060e', display: 'flex', gap: '64px', alignItems: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ flex: 1 }}>
              <div data-field="chip" style={{ display: 'inline-block', background: '#0a1a30', color: '#4fc3f7', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '24px' }}>{String(data.chip ?? '')}</div>
              <h2 data-field="title" style={{ color: '#fff', fontSize: '34px', fontWeight: 800, marginBottom: '16px', whiteSpace: 'pre-line' }}>{String(data.title ?? '')}</h2>
              <p data-field="description" style={{ color: '#999', fontSize: '15px', lineHeight: 1.7, marginBottom: '24px' }}>{String(data.description ?? '')}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Array.isArray(data.checks) && (data.checks as Array<{ value?: string } | string>).map((c, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', color: '#ccc', fontSize: '14px' }}>
                    <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span>
                    {typeof c === 'string' ? c : (c as { value?: string }).value ?? ''}
                  </li>
                ))}
              </ul>
              <button data-field="cta" style={{ background: '#6c3ef4', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{String(data.cta ?? '')}</button>
            </div>
            {Boolean(data.image) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={typeof data.image === 'object' && data.image !== null && 'url' in (data.image as object) ? String((data.image as { url: string }).url) : String(data.image)} alt={String(data.imageAlt ?? '')} style={{ width: '400px', borderRadius: '16px', objectFit: 'cover', flexShrink: 0 }} />
            )}
          </div>
        );

      case 'hp-insights':
        return (
          <div style={{ padding: '80px 48px', background: '#0a0a12', fontFamily: 'sans-serif' }}>
            <div data-field="chip" style={{ display: 'inline-block', background: '#1a0a30', color: '#a78bfa', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '16px' }}>{String(data.chip ?? '')}</div>
            <h2 data-field="title" style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '40px', whiteSpace: 'pre-line' }}>{String(data.title ?? '')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
              {Array.isArray(data.items) && (data.items as Array<{ date: string; title: string; image: string; alt: string }>).map((item, i) => (
                <div key={i} style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', overflow: 'hidden' }}>
                  {item.image && <div style={{ height: '140px', background: `url(${item.image}) center/cover` }} />}
                  <div style={{ padding: '16px' }}>
                    <div style={{ color: '#555', fontSize: '11px', marginBottom: '8px' }}>{item.date}</div>
                    <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{item.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'hp-faq':
        return (
          <div style={{ padding: '80px 48px', background: '#06060e', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <div data-field="chip" style={{ display: 'inline-block', background: '#1a0a30', color: '#a78bfa', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '16px' }}>{String(data.chip ?? '')}</div>
            <h2 data-field="title" style={{ color: '#fff', fontSize: '36px', fontWeight: 800, marginBottom: '12px', whiteSpace: 'pre-line' }}>{String(data.title ?? '')}</h2>
            <p data-field="intro" style={{ color: '#777', fontSize: '15px', marginBottom: '40px' }}>{String(data.intro ?? '')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {Array.isArray(data.items) && (data.items as Array<{ question: string; answer: string }>).map((item, i) => (
                <details key={i} style={{ borderBottom: '1px solid #1a1a1a', paddingBottom: '16px', marginBottom: '16px' }}>
                  <summary style={{ color: '#fff', fontSize: '16px', fontWeight: 600, cursor: 'pointer', padding: '8px 0' }}>{item.question}</summary>
                  <p style={{ color: '#aaa', fontSize: '14px', lineHeight: 1.6, margin: '12px 0 0 0' }}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        );

      case 'hp-cta':
        return (
          <div style={{ padding: '80px 48px', background: 'linear-gradient(135deg, #12063a 0%, #061230 100%)', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <div data-field="chip" style={{ display: 'inline-block', background: '#1e0a50', color: '#c4b5fd', fontSize: '12px', fontWeight: 600, padding: '6px 12px', borderRadius: '20px', marginBottom: '24px' }}>{String(data.chip ?? '')}</div>
            <div style={{ marginBottom: '24px' }}>
              {Array.isArray(data.headingLines) && (data.headingLines as Array<{ text: string; color?: string }>).map((line, i) => (
                <div key={i} data-field={`headingLines.${i}.text`} style={{ fontSize: '52px', fontWeight: 900, color: line.color ?? '#fff', lineHeight: 1.1 }}>{line.text}</div>
              ))}
            </div>
            <p data-field="subtitle" style={{ color: '#aaa', fontSize: '16px', maxWidth: '580px', margin: '0 auto 32px', lineHeight: 1.6 }}>{String(data.subtitle ?? '')}</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '16px' }}>
              <input placeholder={String(data.inputPlaceholder ?? '')} style={{ padding: '14px 20px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#fff', fontSize: '15px', width: '300px' }} readOnly />
              <button data-field="button" style={{ background: '#6c3ef4', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{String(data.button ?? '')}</button>
            </div>
            <p data-field="note" style={{ color: '#555', fontSize: '12px' }}>{String(data.note ?? '')}</p>
          </div>
        );

      case 'hp-footer':
        return (
          <div style={{ padding: '60px 48px 32px', background: '#04040a', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', gap: '48px', marginBottom: '48px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <div data-field="logo" style={{ color: '#fff', fontWeight: 800, fontSize: '20px', marginBottom: '12px' }}>{String(data.logo ?? '')}</div>
                <p data-field="tagline" style={{ color: '#555', fontSize: '13px', lineHeight: 1.6, maxWidth: '240px' }}>{String(data.tagline ?? '')}</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  {Array.isArray(data.socials) && (data.socials as Array<{ label: string; href: string }>).map((s, i) => (
                    <a key={i} href={s.href} style={{ color: '#555', fontSize: '18px', textDecoration: 'none' }}>{s.label}</a>
                  ))}
                </div>
              </div>
              {Array.isArray(data.columns) && (data.columns as Array<{ title: string; links?: Array<{ label: string; href: string }>; button?: string }>).map((col, i) => (
                <div key={i} style={{ minWidth: '140px' }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', marginBottom: '12px' }}>{col.title}</div>
                  {Array.isArray(col.links) && col.links.map((link, j) => (
                    <div key={j}><a href={link.href} style={{ color: '#555', fontSize: '13px', textDecoration: 'none', display: 'block', marginBottom: '6px' }}>{link.label}</a></div>
                  ))}
                  {col.button && <button style={{ marginTop: '12px', background: '#6c3ef4', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>{col.button}</button>}
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid #111', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <span data-field="copyright" style={{ color: '#333', fontSize: '12px' }}>{String(data.copyright ?? '')}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {Array.isArray(data.badges) && (data.badges as Array<{ label: string; tone?: string }>).map((badge, i) => (
                  <span key={i} style={{ background: badge.tone === 'blue' ? '#0a1a30' : badge.tone === 'green' ? '#0a2010' : '#1a1a1a', color: badge.tone === 'blue' ? '#4fc3f7' : badge.tone === 'green' ? '#4ade80' : '#777', fontSize: '11px', padding: '4px 10px', borderRadius: '4px', border: '1px solid #222' }}>{badge.label}</span>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div style={{ padding: '24px', background: '#111', margin: '2px 0', fontFamily: 'sans-serif', color: '#555', fontSize: '13px', textAlign: 'center' }}>
            {block.blockType} section
          </div>
        );
    }
  }

  return (
    <BlockWrapper block={block} isSelected={isSelected} responsiveMode={responsiveMode}>
      {renderSection()}
    </BlockWrapper>
  );
}

// ─── Sections layout ──────────────────────────────────────────────────────────

function SectionsLayout({
  sections,
  selectedBlockId,
  responsiveMode,
  isHomepageMode,
}: {
  sections: SectionInstance[];
  selectedBlockId: string | null;
  responsiveMode: string;
  isHomepageMode: boolean;
}) {
  const hasBlocks = sections.some((s) => s.columns.some((c) => c.blocks.length > 0));

  if (!hasBlocks) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: isHomepageMode ? '#06060e' : '#fafafa', color: '#999', fontFamily: 'sans-serif' }}>
        <p style={{ fontSize: '48px', margin: '0 0 16px' }}>{isHomepageMode ? '🏠' : '📄'}</p>
        <p style={{ fontSize: '16px', margin: 0 }}>
          {isHomepageMode ? 'Homepage sections loading…' : 'Add blocks to see your page preview'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
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
              ...(sectionStyles?.backgroundImage ? { backgroundImage: `url(${sectionStyles.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
              ...(sectionStyles?.opacity != null && sectionStyles.opacity !== 1 ? { opacity: sectionStyles.opacity } : {}),
              ...(sectionStyles?.borderWidth != null ? { borderWidth: `${sectionStyles.borderWidth}px`, borderStyle: 'solid', borderColor: sectionStyles.borderColor ?? '#000' } : {}),
              ...(sectionStyles?.boxShadow ? { boxShadow: sectionStyles.boxShadow } : {}),
              ...(sectionStyles?.maxWidth != null ? { maxWidth: `${sectionStyles.maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
            }}
          >
            <div style={section.columns.length > 1 ? { display: 'grid', gridTemplateColumns: gridTemplate, gap: '0' } : undefined}>
              {section.columns.map((col) => (
                <div key={col.id}>
                  {col.blocks.map((block) => {
                    const isHp = block.blockType.startsWith('hp-');
                    return isHp ? (
                      <HomepageSectionBlock
                        key={block.id}
                        block={block}
                        isSelected={block.id === selectedBlockId}
                        responsiveMode={responsiveMode}
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

  const [sections, setSections] = useState<SectionInstance[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [responsiveMode, setResponsiveMode] = useState('desktop');

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

  return (
    <SectionsLayout
      sections={sections}
      selectedBlockId={selectedBlockId}
      responsiveMode={responsiveMode}
      isHomepageMode={isHomepageMode}
    />
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function PageEditorPreview() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#06060e' }} />}>
      <PreviewInner />
    </Suspense>
  );
}
