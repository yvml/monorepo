import {
  type CenteredBox,
  centeredLine as baselineCenteredLine,
  type Line,
  lineMargins as baselineLineMargins,
  lineRelative as baselineLineRelative,
  lineShift as baselineLineShift,
  measureLine,
  type Metrics,
  paddedLine as baselinePaddedLine,
  trim as baselineTrim,
  type Units,
} from '../grid';
import type { SystemStyleObject } from '@pandacss/dev';
import {
  type Design,
  defaultHeadings,
  defaultRoles,
  design,
  type HeadingLevel,
  type HeadingStyle,
  type RoleName,
  type RoleStyle,
} from '../design';
import { neutral, type Role, type Theme, xHeightAdjust } from '../theme';
import { createScale, round } from '../grid';

/**
 * The type system, generated from a design so every size, line height and trim comes from one model.
 *
 * Scale: sizes follow a modular scale, `base * ratio ** step`, with `md` at step 0 (the body size).
 *
 * Line height: every line height is a whole number of baselines, the same unit the spacing tokens use, so stacked
 * lines and blocks stay on one vertical rhythm. The leading ratio is the design's `leading.body` at body size and
 * below and falls by `leading.falloff` per step; it is clamped to `leading.floor`, the result is rounded to a baseline,
 * then raised if rounding left it under the floor. Those three numbers are the rhythm a design plugs in.
 *
 * Baseline: text sits on the grid (see `../grid/README.md`). A role is either trimmed to the space between the top of the
 * capitals and the baseline (`textRole`), or its first baseline is moved to the nearest grid line with the box unchanged
 * (`textLine` and its siblings). Both are worked out here from the theme's face metrics and written as plain lengths, so
 * they are fixed when the preset is built: a face is chosen by the theme, not swapped at runtime. Sizes are adjusted the
 * same way so the lowercase x-height matches the body face's at the same step.
 */

/** The named steps. `md` is the body size; negative steps are smaller. */
export const STEPS = {
  xs: -2,
  sm: -1,
  md: 0,
  lg: 1,
  xl: 2,
  '2xl': 3,
  '3xl': 4,
  '4xl': 5,
  '5xl': 6,
  '6xl': 7,
  '7xl': 8,
} as const;

/** A step name: `xs` to `7xl`. */
export type StepName = keyof typeof STEPS;

/** The text roles that have a face: `display`, `body` and `mono`. */
export type Face = Role;

type Styles = SystemStyleObject;
type Loose = Record<string, unknown>;

const NAMES = Object.keys(STEPS) as StepName[];

/**
 * The type system of a design: step sizes and line heights, tokens, and the text styles roles use.
 *
 * @param d - the design (its grid and type are read).
 * @param faces - the theme's faces; their metrics put each baseline on the grid. Defaults to the neutral theme's.
 * @returns the functions, tokens and fragments.
 */
export function createTypeSystem(
  d: Pick<Design, 'grid' | 'type'>,
  faces: Theme['faces'] = neutral.faces
) {
  const scale = createScale(d);

  /** The nominal size of a step in px, before any per-face x-height adjustment. */
  const stepSize = (step: StepName) => d.type.base * d.type.ratio ** STEPS[step];

  /** The line height of a step in px: a multiple of the baseline. */
  const stepLineHeight = (step: StepName) => {
    const index = STEPS[step];
    const size = stepSize(step);
    const { body, falloff, floor } = d.type.leading;
    const leading = index <= 0 ? body : Math.max(floor, body - falloff * index);
    let lines = Math.round((size * leading) / scale.BASELINE);
    while ((lines * scale.BASELINE) / size < floor) lines += 1;
    return lines * scale.BASELINE;
  };

  /** The `fontSizes` tokens: every step in rem, in the reference face's size. */
  const fontSizeTokens = Object.fromEntries(
    NAMES.map((name) => [name, { value: scale.rem(round(stepSize(name))) }])
  );

  /** The `lineHeights` tokens: every step's line height in rem, a whole number of baselines. */
  const lineHeightTokens = Object.fromEntries(
    NAMES.map((name) => [name, { value: scale.rem(stepLineHeight(name)) }])
  );

  /** The shared text styles, one per step: size and line height, with tighter tracking from `4xl` up. */
  const scaleTextStyles = Object.fromEntries(
    NAMES.map((name) => [
      name,
      {
        value: {
          fontSize: name,
          lineHeight: name,
          ...(STEPS[name] >= STEPS['4xl'] ? { letterSpacing: 'display' } : {}),
        },
      },
    ])
  );

  /** A face's metrics in em, and how much larger it is set so its x-height equals the body face's. */
  const faceOf = (role: Role): Metrics & { adjust: number } => {
    const m = faces[role].metrics;
    return {
      ascent: m.ascent / m.unitsPerEm,
      descent: Math.abs(m.descent) / m.unitsPerEm,
      capHeight: m.capHeight / m.unitsPerEm,
      adjust: xHeightAdjust(faces.body.metrics, m),
    };
  };

  /** The size of a step in a role in px: the step's, scaled by the role's x-height adjustment. */
  const sizeOf = (role: Role, step: StepName) => round(stepSize(step) * faceOf(role).adjust);

  /**
   * The size and line height of a step in a role. The size is the step's, scaled by the role's x-height adjustment; the
   * line height is the step's, so every role has the same rhythm at the same step.
   */
  const textSize = (role: Role, step: StepName): Styles => ({
    fontSize: scale.rem(sizeOf(role, step)),
    lineHeight: scale.rem(stepLineHeight(step)),
  });

  /** The grid row and how to write a length, for the baseline functions. */
  const units: Units = { row: scale.BASELINE, length: scale.rem };

  /** The line of a step in a role: where its first baseline falls. `height` is a line height in px that replaces the step's. */
  const lineAt = (role: Role, step: StepName, height = stepLineHeight(step)): Line =>
    measureLine(sizeOf(role, step), height, faceOf(role));

  /** The line height of a step as CSS. */
  const lineOf = (step: StepName) => scale.rem(stepLineHeight(step));

  /**
   * Puts the first baseline of a block of text on a grid line without changing its height or its box (see
   * `../grid/README.md`). For a block whose text is its own, not a flex or grid container. `height` is a line height in px
   * that replaces the step's.
   */
  const lineShift = (role: Role, step: StepName, height?: number): Styles =>
    baselineLineShift(lineAt(role, step, height), units) as Styles;

  /**
   * Puts the first baseline of one line of text on a grid line when a flex or grid box of fixed height centers it, by
   * unequal padding. The box keeps its height; pass that height and any border or padding inside it.
   */
  const lineCentered = (role: Role, step: StepName, box: CenteredBox): Styles =>
    baselineCenteredLine(lineAt(role, step), units, box) as Styles;

  /**
   * Puts the first baseline of text on a grid line in an auto-height box by moving padding from one side to the other.
   * Pass the padding the box has (at least half a row on each side) and any border above the text.
   */
  const linePadded = (
    role: Role,
    step: StepName,
    padding: { block: string; border?: string }
  ): Styles => baselinePaddedLine(lineAt(role, step), units, padding) as Styles;

  /** The same shift by moving the element, for a block that can use neither pseudo-elements nor margins (a disclosure summary). */
  const lineRelative = (role: Role, step: StepName): Styles =>
    baselineLineRelative(lineAt(role, step), units) as Styles;

  /** The same shift as margins, for flex or grid items and for text that clips with an ellipsis. */
  const lineMargins = (role: Role, step: StepName, height?: number): Styles =>
    baselineLineMargins(lineAt(role, step, height), units) as Styles;

  /** Size and line height, with the first baseline on the grid. For a block whose text is its own. */
  const textLine = (role: Role, step: StepName): Styles =>
    ({ ...(textSize(role, step) as Loose), ...(lineShift(role, step) as Loose) }) as Styles;

  /**
   * The trim of a step in a role: negative margins on `::before` and `::after` that cut the block to the space between the
   * top of the capitals and the baseline. With `grid.snap` it is rounded up to whole baselines, with the baseline on a grid
   * line. It needs a block box, so roles turn it off for inline elements (and use margins instead). Do not put margin on a
   * trimmed element; padding is measured from the cap and baseline edges.
   */
  const textTrim = (role: Role, step: StepName): Styles =>
    baselineTrim(lineAt(role, step), units, Boolean(d.grid.snap)) as Styles;

  /** Size, line height and trim together, for text that is always a block. */
  const textRole = (role: Role, step: StepName): Styles =>
    ({ ...(textSize(role, step) as Loose), ...(textTrim(role, step) as Loose) }) as Styles;

  /** The design's text roles: the system's own, with the design's on top. */
  const roles = { ...defaultRoles, ...d.type.roles } as Record<RoleName, RoleStyle>;

  /** A role's face, weight, tracking, case and size as styles; its color only when asked. */
  const roleStyle = (role: RoleStyle, color: boolean): Styles => ({
    fontFamily: role.family ?? role.face ?? 'body',
    ...(role.weight ? { fontWeight: role.weight } : {}),
    ...(role.tracking ? { letterSpacing: role.tracking } : {}),
    ...(role.uppercase ? { textTransform: 'uppercase' } : {}),
    ...(color && role.color ? { color: role.color } : {}),
    ...textSize(role.face ?? 'body', role.step),
  });

  /** The uppercase, tracked label of the nav, the jump bar and footer headings: the `eyebrow` role, without its color. */
  const labelCaps: Styles = roleStyle(roles.eyebrow, false);

  /** The small label that opens a field, a filter group or a section: the `fieldLabel` role. */
  const microLabel: Styles = roleStyle(roles.fieldLabel, true);

  /** The `eyebrow` and `fieldLabel` roles with their first baseline on the grid, for blocks whose text is their own. */
  const labelCapsLine: Styles = {
    ...(labelCaps as Loose),
    ...(lineShift(roles.eyebrow.face ?? 'body', roles.eyebrow.step) as Loose),
  } as Styles;
  const microLabelLine: Styles = {
    ...(microLabel as Loose),
    ...(lineShift(roles.fieldLabel.face ?? 'body', roles.fieldLabel.step) as Loose),
  } as Styles;

  /**
   * Long-form body text: the body face at the `lg` step with a roomier line than the step has elsewhere. Phones set it
   * at the body size. For running text on article pages; not trimmed.
   */
  const longFormShift = responsive(
    lineShift('body', 'md'),
    lineShift('body', 'lg', 7 * scale.BASELINE),
    'sm'
  );
  const longForm: Styles = {
    fontFamily: 'body',
    fontSize: { base: 'md', sm: 'lg' },
    lineHeight: { base: scale.rem(stepLineHeight('md')), sm: 'token(spacing.7)' },
  };

  return {
    stepSize,
    stepLineHeight,
    fontSizeTokens,
    lineHeightTokens,
    scaleTextStyles,
    textSize,
    textTrim,
    textRole,
    lineOf,
    lineShift,
    lineRelative,
    lineCentered,
    linePadded,
    lineMargins,
    textLine,
    labelCaps,
    labelCapsLine,
    microLabel,
    microLabelLine,
    longForm,
    longFormLine: { ...(longForm as Loose), ...(longFormShift as Loose) } as Styles,
    headings: { ...defaultHeadings, ...d.type.headings } as Record<HeadingLevel, HeadingStyle>,
    roles,
  };
}

/** The type system's functions, bound to one design. Recipes are built from this. */
export type TypeSystem = ReturnType<typeof createTypeSystem>;

/** The body size in px, at step 0, in the default design. */
export const BASE_SIZE: number = design.type.base;

/** The modular scale ratio in the default design. 1.2 is the minor third. */
export const RATIO: number = design.type.ratio;

/** The tightest line height as a multiple of the font size, in the default design. */
export const MIN_LEADING: number = design.type.leading.floor;

const defaults = createTypeSystem(design);

export const {
  stepSize,
  stepLineHeight,
  fontSizeTokens,
  lineHeightTokens,
  scaleTextStyles,
  textSize,
  textTrim,
  textRole,
  labelCaps,
} = defaults;

/**
 * Merges two style fragments into one whose differing values switch at a breakpoint.
 *
 * @param base - the styles for small screens.
 * @param wide - the styles from the breakpoint up.
 * @param breakpoint - the Panda breakpoint name. Defaults to `md`.
 * @returns the responsive style object.
 */
export function responsive(base: Styles, wide: Styles, breakpoint = 'md'): Styles {
  return mergeResponsive(base as Loose, wide as Loose, breakpoint) as Styles;
}

function mergeResponsive(base: Loose, wide: Loose, breakpoint: string): Loose {
  const merged: Loose = {};
  for (const key of Object.keys(base)) {
    const a = base[key];
    const b = wide[key];
    if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
      merged[key] = mergeResponsive(a as Loose, b as Loose, breakpoint);
    } else if (a === b) {
      merged[key] = a;
    } else {
      merged[key] = { base: a, [breakpoint]: b };
    }
  }
  return merged;
}
