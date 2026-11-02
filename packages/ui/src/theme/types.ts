/** The vertical metrics of a font file, in font units. Capsize publishes them for every Google Fonts file. */
export type FaceMetrics = {
  ascent: number;
  descent: number;
  lineGap: number;
  unitsPerEm: number;
  capHeight: number;
  xHeight: number;
};

/** One file of a face: a weight and style of its family. */
export type FontFile = {
  /** The file name, such as `univers-regular.woff2`. The app decides where it is served from (see `fontFaces`). */
  file: string;
  weight: number;
  style?: 'normal' | 'italic';
};

/** A font face in a theme: the family, its fallbacks, its metrics and optionally the app's CSS variable for it. */
export type Face = {
  family: string;
  generic: 'serif' | 'sans-serif' | 'monospace';
  /**
   * The font files of this family, for apps that serve their own (see `fontFaces`). Leave it out when the family comes
   * from elsewhere (a system font, `next/font`).
   */
  files?: readonly FontFile[];
  /**
   * What follows the family in the stack, in order, written as CSS (`ui-sans-serif`, `"Segoe UI"`). Leave it out for
   * just the generic. A project with symbols its face lacks puts the system fonts that have them here.
   */
  fallbacks?: readonly string[];
  /** The file's vertical metrics. The type system reads them when the preset is built, to put baselines on the grid and match x-heights. */
  metrics: FaceMetrics;
  /** A CSS variable the app sets with the loaded file (for example `next/font`), tried before the family name. */
  cssVar?: string;
};

/** The three roles a theme fills. Components ask for a role, never for a family. */
export type Role = 'display' | 'body' | 'mono';

/**
 * Seven colors the system builds every scale from. They become CSS variables, so a project (or a part of a site) can
 * change them at runtime without rebuilding the stylesheet.
 */
export type Palette = {
  /** Text and the darkest surface. */
  ink: string;
  /** The canvas and the lightest surface. */
  paper: string;
  /** Rules and borders. */
  line: string;
  /** The accent, as the solid in light mode. */
  accent: string;
  /** The accent's soft tint: the solid in dark mode and a light-mode tone. */
  accentSoft: string;
  /** The error hue, as the solid in light mode. */
  danger: string;
  /** The error hue's soft tint. */
  dangerSoft: string;
  /** The success hue, as the solid in light mode. Left out, the system's own green. */
  success?: string;
  /** The success hue's soft tint. */
  successSoft?: string;
  /** The warning hue, as the solid in light mode. Left out, the system's own amber. */
  warning?: string;
  /** The warning hue's soft tint. */
  warningSoft?: string;
  /** The info hue, as the solid in light mode. Left out, the system's own blue. */
  info?: string;
  /** The info hue's soft tint. */
  infoSoft?: string;
  /** The second color, for counts and small labels: the light-mode value. Left out, the system's own. */
  secondary?: string;
  /** The second color's dark-mode value. */
  secondarySoft?: string;
};

/**
 * A project's own color scales, as a tree of Panda semantic tokens (`{ value: { base, _dark } }`, with nested groups
 * such as the Park UI variants `solid`, `subtle`, `surface`, `outline` and `plain`). The roles below are what the
 * components read, so every one must be present; any other key (more scales, tints, label hues) is the project's own
 * and is passed through untouched.
 *
 * - `gray`, `accent`, `red`, `success`, `warning` and `info`: scales with steps `1` to `12`, alpha steps `a1` to `a12`
 *   and the Park UI variants. `success` also has a `DEFAULT`, the solid for a status dot.
 * - `canvas`, `fg` (`default`, `muted`, `subtle`, `disabled`), `border` (`DEFAULT`, `muted`, `emphasized`), `error`,
 *   `secondary` (the second color, for counts and small labels) and `shadow`: the semantic roles, usually references
 *   to the scales.
 * - `categorical`: any number of colors, named by the project, for things told apart by color (record labels, chart series).
 * - `wash`: soft block colors, named by the project, each with `bg`, `fg` and `label`, for filled
 *   sections of a page.
 */
export type ColorTokens = {
  canvas: unknown;
  fg: { default: unknown; muted: unknown; subtle: unknown; disabled: unknown };
  border: { DEFAULT: unknown; muted: unknown; emphasized: unknown };
  error: unknown;
  shadow: unknown;
  gray: unknown;
  accent: unknown;
  red: unknown;
  success: unknown;
  warning: unknown;
  info: unknown;
  secondary: unknown;
  categorical: unknown;
  wash: unknown;
  [name: string]: unknown;
};

/** A color in light mode and in dark mode. */
export type ModeColor = { light: string; dark: string };

/**
 * One color as twelve steps in each mode: step 1 is the lightest in light mode and the darkest in dark mode, step 9 is
 * the solid, 11 the text. The twelve alpha steps (the same colors at rising opacity) are optional; left out, they are
 * mixed from step 12.
 */
export type ColorScale = {
  light: readonly string[];
  dark: readonly string[];
  alpha?: { light: readonly string[]; dark: readonly string[] };
  /** The text color on a solid fill of this scale. Defaults to paper in light mode and ink in dark mode. */
  onSolid?: ModeColor;
};

/** A soft block color for filled sections of a page: the fill, the text on it and the small label on it. */
export type Wash = { bg: ModeColor; fg: ModeColor; label: ModeColor };

/**
 * The colors of a theme as plain data: every scale and role is declared here and the system builds all the tokens and
 * component variants from them.
 */
export type ThemeScales = {
  /** The neutral: step 1 is the page, 7 the rules, 12 the text. */
  neutral: ColorScale;
  accent: ColorScale;
  /** Errors. */
  danger: ColorScale;
  success: ColorScale;
  warning: ColorScale;
  info: ColorScale;
  /** The second color, for counts and small labels. */
  secondary: ModeColor;
  /** Colors for things told apart by color, such as record labels, by the names the project gives them. */
  categorical: Record<string, ModeColor>;
  /** Soft block colors for filled sections, by the names the project gives them (`Section tone`). */
  wash: Record<string, Wash>;
};

type ThemeBase = {
  name: string;
  faces: Record<Role, Face>;
};

/**
 * The look of a brand: colors and faces. Colors come one of three ways, and a theme gives one:
 *
 * - `scales`: plain data, twelve steps per color and a few single colors. The system builds every token and variant
 *   from it. This is the form to use.
 * - `palette`: seven colors the system generates every scale from. They become CSS variables, so the look can change
 *   at runtime with no rebuild.
 * - `colors`: the project's own scales, which replace the generated ones. They are baked into the stylesheet, so a
 *   project with a designed palette (hand-picked steps, light and dark) plugs it in as is.
 *
 * With both, `colors` supplies the scales and `palette` still sets its variables (for the parts that read them). The
 * face stacks become CSS variables in either case; the face metrics are read when the preset is built.
 */
export type Theme = ThemeBase &
  (
    | { palette: Palette; colors?: ColorTokens; scales?: undefined }
    | { palette?: Palette; colors: ColorTokens; scales?: undefined }
    | { palette?: Palette; colors?: undefined; scales: ThemeScales }
  );
