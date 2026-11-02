import type { SystemStyleObject } from '@pandacss/dev';

/**
 * Interaction states, defined once. Hover is gated on `(hover: hover)` (see `conditions.ts`), so it never sticks on
 * touch screens. Focus uses the global `:focus-visible` ring in `global-css.ts`, so nothing here sets focus styles.
 * Row and surface hover reuse the palette's own token, `gray.surface.bg.hover`, which the table recipe also uses.
 * Build new states by adding to this file, not by writing `_hover` in a component.
 */

/** A link on running content: accent colored, underlined on hover, pressed color on active. */
export const linkStyles: SystemStyleObject = {
  color: 'accent',
  textDecoration: 'none',
  textUnderlineOffset: 'token(borderWidths.bar)',
  _hover: { textDecoration: 'underline' },
  _active: { color: 'fg.default' },
};

/** Hover for navigation links that are not underlined: the text turns accent. */
export const hoverAccent: SystemStyleObject = {
  _hover: { color: 'accent' },
};

/** Hover for quiet links: the text turns accent and is underlined. */
export const hoverAccentUnderline: SystemStyleObject = {
  _hover: { color: 'accent', textDecoration: 'underline' },
};

/**
 * Hover for a whole row, tile or pill that is a link: the accent's subtle fill under the secondary (gold) text, eased in
 * and out. The element lights up as one piece; nothing is underlined.
 */
export const hoverRow: SystemStyleObject = {
  transitionProperty: 'background-color, color',
  transitionDuration: 'normal',
  transitionTimingFunction: 'in-out',
  _hover: { background: 'accent.3', color: 'secondary' },
};

/** Hover for a row or card surface: the palette's hover background. */
export const hoverSurface: SystemStyleObject = {
  _hover: { background: 'gray.surface.bg.hover' },
};

/** Hover for a button-like surface: the accent's subtle background. */
export const hoverAccentSurface: SystemStyleObject = {
  _hover: { background: 'accent.3' },
};

/** The mark on the current item of a navigation bar: accent text over a rail-wide underline in the same color. */
export const currentMark: SystemStyleObject = {
  color: 'accent',
  boxShadow: 'inset 0 calc(-1 * token(borderWidths.rail)) 0 currentColor',
};

/** The bar at the start edge of the current item, for a cell that takes only the bar. */
export const currentBar = 'inset token(borderWidths.bar) 0 0 token(colors.accent)';

/** The mark on the current item of a list or table: the subtle accent fill and a bar at its start edge. */
export const currentFill: SystemStyleObject = {
  background: 'accent.3',
  boxShadow: currentBar,
};
