import type { ControlSize, ControlStyle, Grid } from '../grid';

export type { ControlSize, ControlStyle };

/** The type steps, `xs` to `7xl`. */
export type TypeStep =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl';

/** The text roles a page sets, other than headings. */
export type RoleName =
  | 'eyebrow'
  | 'name'
  | 'term'
  | 'entry'
  | 'prose'
  | 'value'
  | 'caption'
  | 'count'
  | 'tagline'
  | 'fieldLabel'
  | 'notice';

/** How one text role looks. Opinionated, so it is the project's to say. */
export type RoleStyle = {
  /** The face: `display`, `body` or `mono`. Defaults to `body`. */
  face?: 'display' | 'body' | 'mono';
  /** A font family token to use instead of the face's, such as a serif for running text. */
  family?: string;
  /** The size step on phones, and from the `md` breakpoint when `wide` is not given. */
  step: TypeStep;
  /** The size step from the `md` breakpoint. */
  wide?: TypeStep;
  /** The weight. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** A tracking token (`letterSpacings`). */
  tracking?: string;
  /** Sets the text in capitals. */
  uppercase?: boolean;
  /** A color token. */
  color?: string;
  /** Always trims the space above the capitals and below the baseline (for block text that has no trim variant). */
  trim?: boolean;
  /** More style properties this role sets (padding, a measure, tabular figures). */
  extra?: Record<string, unknown>;
};

/** A shadow: one CSS value for both modes, or one for each. Token references such as `{colors.shadow}` work. */
export type ShadowValue = string | { light: string; dark: string };

/** The heading levels a title can be set at. */
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** How one heading level looks. Opinionated, so it is the project's to say. */
export type HeadingStyle = {
  /** The size step on phones, and from the `md` breakpoint when `wide` is not given. */
  step: TypeStep;
  /** The size step from the `md` breakpoint, when larger screens set the heading bigger. */
  wide?: TypeStep;
  /** The weight. Defaults to normal. */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  /** A tracking token (`letterSpacings`), such as `title`. */
  tracking?: string;
  /** Sets the heading in capitals. */
  uppercase?: boolean;
  /** A color token. Defaults to `fg.default`. */
  color?: string;
};

/**
 * The structure of the system: values that decide how big and how far apart everything is. They are computed into
 * tokens when Panda runs, so they are fixed per build. Anything that should change at runtime (colors, faces) is a
 * `Theme` instead (see `../theme`).
 */
export type Design = {
  grid: Grid;
  type: {
    /** The body size in px, at step 0. */
    base: number;
    /** The modular scale ratio. 1.2 is the minor third. */
    ratio: number;
    /**
     * The rhythm of the line heights: the leading (line height over font size) is `body` at the body size and below,
     * falls by `falloff` per step above it, and never goes under `floor`. Each result is rounded to a whole number of
     * baselines, then raised until it is at least `floor`.
     */
    leading: {
      body: number;
      falloff: number;
      floor: number;
    };
    /** How each heading level looks. Left out, the system's own (`defaultHeadings`). */
    headings?: Partial<Record<HeadingLevel, HeadingStyle>>;
    /** How each text role looks. Left out, the system's own (`defaultRoles`). */
    roles?: Partial<Record<RoleName, RoleStyle>>;
  };
  /**
   * Values for the named sizes the components read (`site`, `prose`, `plate`, `hero`, ...), as CSS lengths. Left out, the
   * system's own. A name the system does not declare is an error.
   */
  sizes?: Record<string, string>;
  /** The font weights recipes name, as CSS weights (`400`, `500`, ...). Left out, the system's own. */
  fontWeights?: Partial<Record<'normal' | 'medium' | 'semibold' | 'bold', string>>;
  /** Corner radii as CSS lengths: `xs` to `xl`. Left out, the system's own. */
  radii?: Partial<Record<'xs' | 'sm' | 'md' | 'lg' | 'xl', string>>;
  /** Elevation: shadows by name (`xs` to `2xl`). Left out, the system's own. */
  shadows?: Record<string, ShadowValue>;
  /** Tracking by name, as `em` lengths. Left out, the system's own. */
  letterSpacings?: Record<string, string>;
  /** The widths where layouts change, as CSS lengths. Left out, Panda's own. */
  breakpoints?: Partial<Record<'sm' | 'md' | 'lg' | 'xl' | '2xl', string>>;
  /** How tall, how padded and how large the icon is at each control size. Left out, the system's own. */
  controls?: Partial<Record<ControlSize, ControlStyle>>;
  /**
   * The four gaps every layout is built from, as numbers of baselines: `pair` (a label over its value, a title over its
   * byline), `item` (between the items of a list), `group` (between groups of items) and `section` (between sections).
   * Left out, the system's own. Components name a gap (`rhythm.item`) and never a number, so one change here moves every
   * page together.
   */
  rhythm?: Partial<Record<'pair' | 'item' | 'group' | 'section', number>>;
  motion: {
    /** Named durations, as CSS times. */
    durations: Record<
      'fastest' | 'faster' | 'fast' | 'normal' | 'slow' | 'slower' | 'slowest',
      string
    >;
  };
};
