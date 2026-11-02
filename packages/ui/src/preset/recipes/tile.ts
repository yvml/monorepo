import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { toneRing } from '../fragments';
import type { TypeSystem } from '../type-scale';

/**
 * Sets a hue for everything inside the element: it defines `--tone`, which `tile`, `plate` and
 * `card` read. Apply it to the element itself or to a wrapper. The hues are the names of the theme's
 * `categorical` colors, so a project says how many there are and what they are called.
 */
export const hue = (hues: readonly string[]) =>
  defineRecipe({
    className: 'hue',
    staticCss: ['*'],
    variants: {
      hue: Object.fromEntries(
        hues.map((hue) => [hue, { '--tone': `token(colors.categorical.${hue})` }])
      ),
    },
  });

/**
 * A plate: a square in the hue, tinted, with a short name at the upper left and a code at the
 * lower right, both small and in the body face in the hue's color. It is 64px square, 56px on phones.
 */
export const plate = (t: TypeSystem) => {
  const { textSize, lineMargins } = t;
  return defineSlotRecipe({
    className: 'plate',
    slots: ['root', 'name', 'number'],
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // In a row of varying height the plate stays at the top, on a grid line, instead of being centered between them.
        alignSelf: 'start',
        flexShrink: 0,
        width: { base: 'plateCompact', sm: 'plate' },
        height: { base: 'plateCompact', sm: 'plate' },
        padding: '1',
        ...toneRing(40),
        toneFill: '10',
        color: 'var(--tone)',
        fontFamily: 'body',
        fontVariantNumeric: 'tabular-nums',
        ...textSize('body', 'sm'),
      },
      name: {
        alignSelf: 'flex-start',
        maxWidth: 'full',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontWeight: 'semibold',
        ...lineMargins('body', 'sm'),
      },
      number: {
        alignSelf: 'flex-end',
        ...lineMargins('body', 'sm'),
        maxWidth: 'full',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    },
  });
};

/** A scrolling list with a fixed maximum height: a drawer's items or a list of names. */
export const scrollList = defineRecipe({
  className: 'scroll-list',
  base: {
    maxHeight: 'scrollList',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarWidth: 'thin',
  },
});
