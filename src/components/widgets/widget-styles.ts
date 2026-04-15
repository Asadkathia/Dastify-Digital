import type { WidgetStyles } from '@/payload/views/PageEditor/types';

const FONT_WEIGHT_MAP: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

/**
 * Converts a WidgetStyles object into a React.CSSProperties object.
 * Pass `pick` to include only specific keys (e.g. spacing-only or typography-only).
 */
export function applyWidgetStyles(
  styles: WidgetStyles | undefined,
  pick?: (keyof WidgetStyles)[],
): React.CSSProperties {
  if (!styles) return {};

  const s = pick
    ? Object.fromEntries(pick.map((k) => [k, styles[k]])) as Partial<WidgetStyles>
    : styles;

  const css: React.CSSProperties = {};

  if (s.paddingTop != null)    css.paddingTop    = `${s.paddingTop}px`;
  if (s.paddingBottom != null) css.paddingBottom = `${s.paddingBottom}px`;
  if (s.paddingLeft != null)   css.paddingLeft   = `${s.paddingLeft}px`;
  if (s.paddingRight != null)  css.paddingRight  = `${s.paddingRight}px`;
  if (s.marginTop != null)     css.marginTop     = `${s.marginTop}px`;
  if (s.marginBottom != null)  css.marginBottom  = `${s.marginBottom}px`;

  if (s.backgroundColor)  css.backgroundColor = s.backgroundColor;
  if (s.textColor)         css.color           = s.textColor;
  if (s.fontSize != null)  css.fontSize         = `${s.fontSize}px`;
  if (s.fontWeight)        css.fontWeight       = FONT_WEIGHT_MAP[s.fontWeight] ?? s.fontWeight;
  if (s.textAlign)         css.textAlign        = s.textAlign;

  if (s.borderRadius != null) css.borderRadius = `${s.borderRadius}px`;
  if (s.borderWidth != null)  {
    css.borderWidth = `${s.borderWidth}px`;
    css.borderStyle = 'solid';
    css.borderColor = s.borderColor ?? '#000';
  }

  if (s.maxWidth != null) {
    css.maxWidth   = `${s.maxWidth}px`;
    css.marginLeft  = css.marginLeft  ?? 'auto';
    css.marginRight = css.marginRight ?? 'auto';
  }

  if (s.width) css.width = s.width;

  return css;
}
