import { defineRecipe } from '@pandacss/dev';
import { column, ruleAbove, ruleBelow, ruleNone } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** One gap variant per spacing step in common use, named by the step. */
const gaps = {
  '1': { gap: '1' },
  '2': { gap: '2' },
  '3': { gap: '3' },
  '4': { gap: '4' },
  '6': { gap: '6' },
  '8': { gap: '8' },
  '10': { gap: '10' },
  pair: { gap: 'rhythm.pair' },
  item: { gap: 'rhythm.item' },
  group: { gap: 'rhythm.group' },
  section: { gap: 'rhythm.section' },
} as const;

/** A list without markers (preflight removes them). Markers, rules between items and a row layout are opt-in. */
export const itemList = defineRecipe({
  className: 'item-list',
  staticCss: ['*'],
  base: { ...column },
  defaultVariants: { gap: '2' },
  variants: {
    gap: gaps,
    inline: { true: { flexDirection: 'row', flexWrap: 'wrap' } },
    marker: { true: { paddingInlineStart: '6', listStyle: 'decimal' } },
    ruled: {
      true: {
        gap: '0',
        '& > li': { paddingBlock: 'rhythm.item', ...ruleBelow },
        '& > li:first-child': { paddingBlockStart: '0' },
        '& > li:last-child': { ...ruleNone },
      },
    },
  },
});

/** A column of children with a gap, and the page's side and block padding when it is the page's own box. */
export const layoutStack = defineRecipe({
  className: 'layout-stack',
  staticCss: ['*'],
  base: { ...column },
  variants: {
    gap: gaps,
    padBlock: { '4': { paddingBlock: '4' }, '8': { paddingBlock: '8' } },
    padInline: { '4': { paddingInline: '4' } },
  },
});

/** A row of children that wraps, with a gap. */
export const layoutWrap = defineRecipe({
  className: 'layout-wrap',
  staticCss: ['*'],
  base: { display: 'flex', flexWrap: 'wrap' },
  variants: { gap: gaps, align: { center: { alignItems: 'center' } } },
});

/** Limits running text to a readable line length: the `prose` size, or `narrow`. */
export const measure = defineRecipe({
  className: 'measure',
  staticCss: ['*'],
  defaultVariants: { size: 'prose' },
  variants: { size: { prose: { maxWidth: 'prose' }, narrow: { maxWidth: 'narrow' } } },
});

/** A block set off by a hairline rule above it, with space under the rule. The section that holds it adds the space below. */
export const ruled = defineRecipe({
  className: 'ruled',
  base: {
    ...column,
    gap: '4',
    paddingBlockStart: '16',
    paddingBlockEnd: '8',
    ...ruleAbove,
  },
});

/** A picture with text beside it, stacked on narrow screens. */
export const mediaRow = defineRecipe({
  className: 'media-row',
  base: {
    display: 'flex',
    flexDirection: { base: 'column', sm: 'row' },
    alignItems: 'flex-start',
    gap: '8',
  },
});

/** Holds a block to the `inset` width and centers it. */
export const inset = defineRecipe({
  className: 'inset',
  base: { width: 'full', maxWidth: 'inset', marginInline: 'auto' },
});

/** A grid with one of the named responsive layouts. */
export const layout = defineRecipe({
  className: 'layout',
  staticCss: ['*'],
  base: { display: 'grid' },
  variants: {
    kind: {
      overview: {
        gridTemplateColumns: { base: '1fr', lg: 'minmax(token(sizes.aside), 1fr) 2fr' },
        gap: { base: '4', lg: '8' },
        alignItems: 'start',
      },
      credits: { gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' }, gap: '6' },
      beside: {
        gridTemplateColumns: { base: 'minmax(0, 1fr)', xl: 'minmax(0, 3fr) minmax(0, 2fr)' },
        columnGap: '12',
        alignItems: 'start',
      },
      cards: {
        gridTemplateColumns: { base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: '4',
      },
      gallery: {
        gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
        gap: '4',
      },
      pair: { gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' }, gap: '4' },
    },
  },
});

/**
 * A list of names, one per line, in a single column. With `flow` a long list runs into columns of the `name` width, so a
 * large ensemble stays compact.
 */
export const nameList = (t: TypeSystem) =>
  defineRecipe({
    className: 'name-list',
    staticCss: ['*'],
    base: {
      '& > li': {
        breakInside: 'avoid',
        paddingBlockEnd: 'rhythm.pair',
        ...t.textSize('body', 'lg'),
        ...t.lineShift('body', 'lg'),
      },
      '& > li:last-child': { paddingBlockEnd: '0' },
    },
    variants: {
      flow: {
        true: { columnWidth: 'token(sizes.name)', columnGap: 'rhythm.item' },
        false: {},
      },
    },
    defaultVariants: { flow: false },
  });

/** The columns of the page grid. A column grid in the Swiss manner: twelve equal columns, a gutter between them. */
export const COLUMNS = 12;

/**
 * The page's column grid: twelve equal columns with the `item` gap between them and between rows, so every gutter and row
 * gap is a whole number of baselines. Content is placed with {@link columnCell}; a cell is the full width below `md` and
 * takes its span from `md` up.
 */
export const columnGrid = defineRecipe({
  className: 'column-grid',
  staticCss: ['*'],
  base: {
    display: 'grid',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: `repeat(${COLUMNS}, minmax(0, 1fr))` },
    columnGap: 'rhythm.item',
    rowGap: 'rhythm.group',
    alignItems: 'start',
  },
});

/** One cell of the column grid: how many columns it spans from `md` up (it is the full width below). */
export const columnCell = defineRecipe({
  className: 'column-cell',
  staticCss: ['*'],
  base: { minWidth: '0' },
  variants: {
    span: Object.fromEntries(
      Array.from({ length: COLUMNS }, (_, i) => [
        String(i + 1),
        { gridColumn: { base: 'auto', md: `span ${i + 1}` } },
      ])
    ),
  },
  defaultVariants: { span: String(COLUMNS) },
});

/** A layout item that spans the full width from the `md` breakpoint up. */
export const fullRow = defineRecipe({
  className: 'full-row',
  base: { ...column, gap: '2', gridColumn: { md: '1 / -1' } },
});

/** A two-column list of labels and values that collapses to one column on narrow screens. */
export const termList = (t: TypeSystem) => {
  const { textSize, lineShift } = t;
  return defineRecipe({
    className: 'term-list',
    base: {
      display: 'grid',
      gridTemplateColumns: { base: '1fr', sm: 'minmax(token(sizes.label), max-content) 1fr' },
      columnGap: '6',
      rowGap: { base: '0', sm: '2' },
      ...textSize('body', 'md'),
      '& dd': { marginBlockEnd: { base: '2', sm: '0' }, ...lineShift('body', 'md') },
      '& dt': { paddingBlockStart: { base: '0', sm: '1' } },
    },
    variants: {
      /** A hairline under every row and the row's own padding, as in the home page's lists of names and counts. */
      ruled: {
        true: {
          rowGap: '0',
          columnGap: '0',
          ...ruleAbove,
          '& dt, & dd': {
            ...ruleBelow,
            paddingBlock: 'rhythm.pair',
            marginBlockEnd: '0',
          },
          '& dd': { paddingInlineStart: 'rhythm.item' },
        },
      },
    },
  });
};

/** Lets a term row's `dt` and `dd` take part in the list's grid. */
export const termRow = defineRecipe({
  className: 'term-row',
  base: { display: 'contents' },
});

/** A list of terms that flows into columns, so long lists stay compact. */
export const columnList = (t: TypeSystem) => {
  const { textSize, lineShift } = t;
  return defineRecipe({
    className: 'column-list',
    staticCss: ['*'],
    base: {
      ...textSize('body', 'md'),
      columnGap: '8',
      '& > div': { breakInside: 'avoid', marginBlockEnd: 'rhythm.item' },
      '& dt': { marginBlockEnd: 'rhythm.pair' },
      '& dd': { ...lineShift('body', 'md') },
    },
    variants: { width: { wide: { columnWidth: 'token(sizes.column)' }, single: {} } },
  });
};

/**
 * Two equal columns from 960px, one below: two cards or two lists side by side. `gap`
 * is 32px (`md`) or 48px (`lg`).
 */
export const splitGrid = defineRecipe({
  className: 'split-grid',
  staticCss: ['*'],
  base: {
    display: 'grid',
    gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
  },
  defaultVariants: { gap: 'md' },
  variants: {
    gap: {
      md: { gap: '8' },
      lg: { gap: { base: '8', md: '12' } },
    },
  },
});

/**
 * The label tiles: two across below 960px, four from 960px.
 */
export const tileGrid = defineRecipe({
  className: 'label-grid',
  base: {
    display: 'grid',
    gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
    gap: '4',
    '& > li': { display: 'flex' },
  },
});
