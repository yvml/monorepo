import type { Face, FaceMetrics, Palette, Theme } from './types';

/** The colors a palette may leave out. */
export const PALETTE_DEFAULTS = {
  success: '#2F7D4A',
  successSoft: '#9AD3B0',
  warning: '#9A6A12',
  warningSoft: '#EBC57A',
  info: '#2F6FA8',
  infoSoft: '#9CC4E4',
  secondary: '#8F6200',
  secondarySoft: '#E8B44A',
} as const;

/** The CSS variable names a theme sets. Components never read these directly; tokens and the type system do. */
export const themeVars = {
  ink: '--ui-ink',
  paper: '--ui-paper',
  line: '--ui-line',
  accent: '--ui-accent',
  accentSoft: '--ui-accent-soft',
  danger: '--ui-danger',
  dangerSoft: '--ui-danger-soft',
  success: '--ui-success',
  successSoft: '--ui-success-soft',
  warning: '--ui-warning',
  warningSoft: '--ui-warning-soft',
  info: '--ui-info',
  infoSoft: '--ui-info-soft',
  secondary: '--ui-secondary',
  secondarySoft: '--ui-secondary-soft',
  display: '--ui-font-display',
  body: '--ui-font-body',
  mono: '--ui-font-mono',
} as const;

/** Family names CSS reads as keywords, which must stay unquoted (`ui-monospace`, `system-ui`, `sans-serif`). */
const KEYWORD_FAMILY =
  /^(ui-[a-z-]+|system-ui|serif|sans-serif|monospace|cursive|fantasy|math|emoji|fangsong)$/;

/** A family name as CSS: quoted, unless it is a keyword. */
const cssFamily = (family: string) => (KEYWORD_FAMILY.test(family) ? family : `"${family}"`);

/**
 * A CSS font stack for a face: the app's variable if it set one, then the family name, then its fallbacks (the generic by default). The family and
 * generic sit inside the `var()` as its fallback, so the stack stays valid when the app never defines the variable (a
 * bare `var(--x), "Family"` would be invalid and the text would fall back to the browser default).
 *
 * @param face - the face.
 * @returns the `font-family` value.
 */
export function fontStack(face: Pick<Face, 'family' | 'generic' | 'fallbacks' | 'cssVar'>) {
  const stack = [cssFamily(face.family), ...(face.fallbacks ?? [face.generic])].join(', ');
  return face.cssVar ? `var(${face.cssVar}, ${stack})` : stack;
}

/**
 * How much larger a face is set so its lowercase x-height equals the reference face's at the same step.
 *
 * @param reference - the metrics of the reference (body) face.
 * @param metrics - the metrics of the face being matched.
 * @returns the multiplier, 1 for the reference face.
 */
export function xHeightAdjust(reference: FaceMetrics, metrics: FaceMetrics) {
  return reference.xHeight / reference.unitsPerEm / (metrics.xHeight / metrics.unitsPerEm);
}

/**
 * The palette as CSS variables.
 *
 * @param palette - the seven colors.
 * @returns the variables.
 */
function paletteVariables(palette: Palette) {
  return {
    [themeVars.ink]: palette.ink,
    [themeVars.paper]: palette.paper,
    [themeVars.line]: palette.line,
    [themeVars.accent]: palette.accent,
    [themeVars.accentSoft]: palette.accentSoft,
    [themeVars.danger]: palette.danger,
    [themeVars.dangerSoft]: palette.dangerSoft,
    [themeVars.success]: palette.success ?? PALETTE_DEFAULTS.success,
    [themeVars.successSoft]: palette.successSoft ?? PALETTE_DEFAULTS.successSoft,
    [themeVars.warning]: palette.warning ?? PALETTE_DEFAULTS.warning,
    [themeVars.warningSoft]: palette.warningSoft ?? PALETTE_DEFAULTS.warningSoft,
    [themeVars.info]: palette.info ?? PALETTE_DEFAULTS.info,
    [themeVars.infoSoft]: palette.infoSoft ?? PALETTE_DEFAULTS.infoSoft,
    [themeVars.secondary]: palette.secondary ?? PALETTE_DEFAULTS.secondary,
    [themeVars.secondarySoft]: palette.secondarySoft ?? PALETTE_DEFAULTS.secondarySoft,
  };
}

/**
 * A theme as a map of CSS variable to value.
 *
 * @param theme - the theme.
 * @returns the variables.
 */
export function themeVariables(theme: Theme): Record<string, string> {
  const { palette, faces } = theme;
  return {
    ...(palette ? paletteVariables(palette) : {}),
    [themeVars.display]: fontStack(faces.display),
    [themeVars.body]: fontStack(faces.body),
    [themeVars.mono]: fontStack(faces.mono),
  };
}

/**
 * A theme as CSS text. Emit it from a build script into a `theme.css`, optionally scoped to a selector so one part of
 * a site can use another theme.
 *
 * @param theme - the theme.
 * @param selector - where the variables apply. Defaults to `:root`.
 * @returns the CSS.
 */
export function toCss(theme: Theme, selector = ':root') {
  const lines = Object.entries(themeVariables(theme)).map(
    ([name, value]) => `  ${name}: ${value};`
  );
  return `${selector} {\n${lines.join('\n')}\n}\n`;
}
