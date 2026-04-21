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
function buildScopedCss(sectionId: string, props: SectionBlockProps): string {
  const targetDecls: string[] = [];
  const wrapperDecls: string[] = [];

  // Padding/max-width apply to the INNER block (targeting its own element).
  // That's what makes "reduce" work — we override the child's class CSS.
  if (props.paddingTop != null) targetDecls.push(`padding-top: ${props.paddingTop}px !important`);
  if (props.paddingBottom != null) targetDecls.push(`padding-bottom: ${props.paddingBottom}px !important`);
  if (props.paddingLeft != null) targetDecls.push(`padding-left: ${props.paddingLeft}px !important`);
  if (props.paddingRight != null) targetDecls.push(`padding-right: ${props.paddingRight}px !important`);
  if (props.maxWidth != null) {
    targetDecls.push(`max-width: ${props.maxWidth}px !important`);
    targetDecls.push('margin-left: auto !important');
    targetDecls.push('margin-right: auto !important');
  }

  // Margin goes on the outer wrapper — you need negative values to visually
  // pull up adjacent sections, and the wrapper is the right place for that.
  if (props.marginTop != null) wrapperDecls.push(`margin-top: ${props.marginTop}px !important`);
  if (props.marginBottom != null) wrapperDecls.push(`margin-bottom: ${props.marginBottom}px !important`);

  const parts: string[] = [];
  if (targetDecls.length > 0) {
    // Target direct child that's likely a block root (section/div/article/main).
    parts.push(`[data-section-id="${sectionId}"] > :is(section, div, article, main) { ${targetDecls.join('; ')}; }`);
  }
  if (wrapperDecls.length > 0) {
    parts.push(`[data-section-id="${sectionId}"] { ${wrapperDecls.join('; ')}; }`);
  }
  return parts.join('\n');
}

export function SectionBlockRenderer(props: SectionBlockProps) {
  const sectionId = props.id;
  const hasAnySpacing =
    props.paddingTop != null ||
    props.paddingBottom != null ||
    props.paddingLeft != null ||
    props.paddingRight != null ||
    props.marginTop != null ||
    props.marginBottom != null ||
    props.maxWidth != null;

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
        ...(props.backgroundColor ? { backgroundColor: props.backgroundColor } : {}),
      }}
    >
      {inner}
    </div>
  );
}
