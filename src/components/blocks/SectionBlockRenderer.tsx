import type { PageBuilderBlock } from './types';
import { PageBlocksRenderer } from './PageBlocksRenderer';

type SectionBlockProps = Extract<PageBuilderBlock, { type: 'section' }>;

const COL_GRID: Record<string, string> = {
  '1/1': '1fr',
  '1/2': '1fr 1fr',
  '1/3': '1fr 1fr 1fr',
  '2/3': '2fr 1fr',
  '1/4': '1fr 1fr 1fr 1fr',
  '3/4': '3fr 1fr',
};

/**
 * Per-section spacing works by emitting a scoped `<style>` block with
 * `!important` declarations keyed by the section's Payload id. This lets the
 * editor override the child block's baked-in `.sp` / class-level padding —
 * which is the only way to *reduce* a section's height below what its
 * component CSS sets. Inline styles on the wrapper can only ADD, because
 * they don't touch the child's own padding.
 *
 * Fallback: if there's no id (e.g. freshly-dragged block that hasn't been
 * saved yet), overrides degrade to an inline style on the wrapper — still
 * visible in the editor preview, just not as aggressive on the live page.
 */
type SpacingSource = {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  maxWidth?: number;
  minHeight?: number;
};

function collectDecls(src: SpacingSource): { target: string[]; wrapper: string[] } {
  const target: string[] = [];
  const wrapper: string[] = [];
  if (src.paddingTop != null) target.push(`padding-top: ${src.paddingTop}px !important`);
  if (src.paddingBottom != null) target.push(`padding-bottom: ${src.paddingBottom}px !important`);
  if (src.paddingLeft != null) target.push(`padding-left: ${src.paddingLeft}px !important`);
  if (src.paddingRight != null) target.push(`padding-right: ${src.paddingRight}px !important`);
  if (src.maxWidth != null) {
    target.push(`max-width: ${src.maxWidth}px !important`);
    target.push('margin-left: auto !important');
    target.push('margin-right: auto !important');
  }
  if (src.minHeight != null) {
    target.push(`min-height: ${src.minHeight}px !important`);
    target.push('display: flex !important');
    target.push('flex-direction: column !important');
    target.push('justify-content: center !important');
  }
  if (src.marginTop != null) wrapper.push(`margin-top: ${src.marginTop}px !important`);
  if (src.marginBottom != null) wrapper.push(`margin-bottom: ${src.marginBottom}px !important`);
  return { target, wrapper };
}

/** Selectors that reach into the section to override block-level padding. */
function targetSelector(sectionId: string): string {
  return (
    `[data-section-id="${sectionId}"] .sp, ` +
    `[data-section-id="${sectionId}"] > div > div > :is(section, div, article, main)`
  );
}

/** Baseline (desktop) CSS plus optional @media blocks for tablet/mobile. */
function buildScopedCss(sectionId: string, props: SectionBlockProps): string {
  const desktop = collectDecls(props);
  const tablet = collectDecls(props.breakpointStyles?.tablet ?? {});
  const mobile = collectDecls(props.breakpointStyles?.mobile ?? {});

  const parts: string[] = [];

  if (desktop.target.length > 0) {
    parts.push(`${targetSelector(sectionId)} { ${desktop.target.join('; ')}; }`);
  }
  if (desktop.wrapper.length > 0) {
    parts.push(`[data-section-id="${sectionId}"] { ${desktop.wrapper.join('; ')}; }`);
  }

  if (tablet.target.length > 0 || tablet.wrapper.length > 0) {
    const mediaParts: string[] = [];
    if (tablet.target.length > 0) mediaParts.push(`${targetSelector(sectionId)} { ${tablet.target.join('; ')}; }`);
    if (tablet.wrapper.length > 0) mediaParts.push(`[data-section-id="${sectionId}"] { ${tablet.wrapper.join('; ')}; }`);
    parts.push(`@media (max-width: 1100px) { ${mediaParts.join(' ')} }`);
  }

  if (mobile.target.length > 0 || mobile.wrapper.length > 0) {
    const mediaParts: string[] = [];
    if (mobile.target.length > 0) mediaParts.push(`${targetSelector(sectionId)} { ${mobile.target.join('; ')}; }`);
    if (mobile.wrapper.length > 0) mediaParts.push(`[data-section-id="${sectionId}"] { ${mobile.wrapper.join('; ')}; }`);
    parts.push(`@media (max-width: 768px) { ${mediaParts.join(' ')} }`);
  }

  return parts.join('\n');
}

export function SectionBlockRenderer(props: SectionBlockProps) {
  const sectionId = props.id;
  const hasBreakpointOverride =
    (props.breakpointStyles?.tablet && Object.values(props.breakpointStyles.tablet).some((v) => v != null)) ||
    (props.breakpointStyles?.mobile && Object.values(props.breakpointStyles.mobile).some((v) => v != null));
  const hasAnySpacing =
    props.paddingTop != null ||
    props.paddingBottom != null ||
    props.paddingLeft != null ||
    props.paddingRight != null ||
    props.marginTop != null ||
    props.marginBottom != null ||
    props.maxWidth != null ||
    props.minHeight != null ||
    hasBreakpointOverride;

  const inner = (
    <div
      style={
        props.columns.length > 1
          ? {
              display: 'grid',
              gridTemplateColumns:
                COL_GRID[props.columns.map((c) => c.width).join('/')] ??
                `repeat(${props.columns.length}, 1fr)`,
              alignItems: 'start',
            }
          : undefined
      }
    >
      {props.columns.map((col, i) => (
        <div key={i}>
          <PageBlocksRenderer blocks={col.blocks} />
        </div>
      ))}
    </div>
  );

  // No styling at all → render children directly, no wrapper.
  if (!hasAnySpacing && !props.backgroundColor) {
    return inner;
  }

  // Have an id → scoped CSS path (can actually reduce section size).
  if (sectionId && hasAnySpacing) {
    const css = buildScopedCss(sectionId, props);
    return (
      <>
        {css && <style dangerouslySetInnerHTML={{ __html: css }} />}
        <div
          data-section-id={sectionId}
          style={props.backgroundColor ? { backgroundColor: props.backgroundColor } : undefined}
        >
          {inner}
        </div>
      </>
    );
  }

  // Fallback: no id or only background → inline wrapper style (adds, can't reduce).
  return (
    <div
      style={{
        ...(props.paddingTop != null ? { paddingTop: props.paddingTop } : {}),
        ...(props.paddingBottom != null ? { paddingBottom: props.paddingBottom } : {}),
        ...(props.paddingLeft != null ? { paddingLeft: props.paddingLeft } : {}),
        ...(props.paddingRight != null ? { paddingRight: props.paddingRight } : {}),
        ...(props.marginTop != null ? { marginTop: props.marginTop } : {}),
        ...(props.marginBottom != null ? { marginBottom: props.marginBottom } : {}),
        ...(props.maxWidth != null ? { maxWidth: props.maxWidth, marginLeft: 'auto', marginRight: 'auto' } : {}),
        ...(props.minHeight != null ? { minHeight: props.minHeight, display: 'flex', flexDirection: 'column' as const, justifyContent: 'center' } : {}),
        ...(props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}),
      }}
    >
      {inner}
    </div>
  );
}
