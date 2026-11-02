import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import {
  bleedRow,
  boxed,
  ruleAbove,
  ruleBelow,
  ruleBelowOf,
  ruleBoth,
  ruleNone,
} from '../fragments';
import { hoverRow } from '../interaction';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/** A list of names with their counts at the end, one hairline between rows. Used for any list of names and counts. */
export const countedList = (t: TypeSystem) => {
  const { textSize, textLine } = t;
  return defineSlotRecipe({
    className: 'counted-list',
    slots: ['root', 'item', 'link', 'name', 'count'],
    base: {
      root: { ...ruleAbove },
      item: {},
      link: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '4',
        width: 'calc(100% + 2 * token(spacing.2))',
        paddingBlock: '3',
        background: 'transparent',
        color: 'fg.default',
        cursor: 'pointer',
        textAlign: 'start',
        ...textSize('body', 'md'),
        ...bleedRow,
        ...hoverRow,
      },
      name: { ...textLine('body', 'md') },
      count: { color: 'inherit', fontVariantNumeric: 'tabular-nums', ...textLine('body', 'md') },
    },
  });
};

/** The text filter over a list: a boxed input, accent border on focus. */
export const listFilter = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineRecipe({
    className: 'list-filter',
    base: {
      ...boxed,
      width: 'full',
      marginBlockEnd: '2',
      height: 'control.md',
      paddingInline: '3',
      background: 'transparent',
      outline: 'none',
      color: 'fg.default',
      ...textSize('body', 'md'),
      '&::placeholder': { color: 'fg.muted' },
      transitionProperty: 'border-color',
      transitionDuration: 'fast',
      _focus: { borderColor: 'accent' },
    },
  });
};

/**
 * An expandable row: a full-width button (or a link, for a plain row) with a plate, the title over its meta line, the
 * aside, and a chevron that turns when the row is open. Rows are ruled, and hover and open take the
 * hover ground. `plain` has no plate or chevron.
 */
export const expandableRow = (t: TypeSystem) => {
  const textLine = t.textLine;
  return defineSlotRecipe({
    className: 'expandable-row',
    staticCss: ['*'],
    slots: ['root', 'text', 'title', 'meta', 'aside', 'chevron'],
    base: {
      root: {
        display: 'grid',
        alignItems: 'center',
        columnGap: '4',
        width: 'calc(100% + token(spacing.4) * 2)',
        marginInline: '-4',
        paddingBlock: '3',
        paddingInline: '4',
        background: 'transparent',
        ...ruleAbove,
        color: 'fg.default',
        cursor: 'pointer',
        textAlign: 'start',
        transitionProperty: 'background-color',
        transitionDuration: 'fast',
        _hover: { background: 'gray.surface.bg.hover' },
        '&[aria-expanded="true"]': { background: 'gray.surface.bg.hover' },
      },
      // The title and meta start at the top of the row, a whole row from the plate's top, instead of being centered by a
      // half row that may not be a whole number of baselines.
      text: { alignSelf: 'baseline', minWidth: '0' },
      title: {
        display: 'block',
        minWidth: '0',
        fontFamily: 'display',
        fontWeight: 'medium',
        ...responsive(textLine('display', 'lg'), textLine('display', 'xl'), 'sm'),
        '& mark': { background: 'transparent', color: 'accent' },
      },
      meta: {
        display: 'block',
        color: 'fg.muted',
        fontFamily: 'body',
        fontWeight: 'normal',
        ...textLine('body', 'md'),
        '& mark': { background: 'transparent', color: 'accent' },
      },
      aside: {
        ...textLine('body', 'md'),
        alignSelf: 'baseline',
        display: { base: 'none', sm: 'block' },
        color: 'fg.muted',
        textAlign: 'end',
        whiteSpace: 'nowrap',
      },
      chevron: {
        justifySelf: 'center',
        width: 'chevron',
        height: 'chevron',
        marginBlockStart: '-1',
        borderInlineEndWidth: 'rail',
        borderBlockEndWidth: 'rail',
        borderInlineEndStyle: 'solid',
        borderBlockEndStyle: 'solid',
        borderColor: 'fg.muted',
        transform: 'rotate(45deg)',
        transitionProperty: 'transform, margin',
        transitionDuration: 'fast',
        '[aria-expanded="true"] > &': { transform: 'rotate(-135deg)', marginBlockStart: '1' },
      },
    },
    variants: {
      layout: {
        plated: {
          root: {
            gridTemplateColumns: {
              base: 'token(sizes.plateCompact) minmax(0, 1fr) token(sizes.glyph)',
              sm: 'token(sizes.plate) minmax(0, 1fr) auto token(sizes.glyph)',
            },
          },
        },
        plain: {
          root: { gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' } },
          chevron: { display: 'none' },
        },
        numbered: {
          root: {
            gridTemplateColumns: {
              base: 'token(spacing.6) minmax(0, 1fr) token(sizes.glyph)',
              sm: 'token(spacing.8) minmax(0, 1fr) auto token(sizes.glyph)',
            },
          },
        },
      },
    },
    defaultVariants: { layout: 'plated' },
  });
};

/**
 * The drawer under an open expandable row: the hover ground, a header line with the item count and the link to the
 * row's page, and an item list at most 224px tall that scrolls. The list is indented to line up under the title.
 */
export const rowDrawer = defineSlotRecipe({
  className: 'row-drawer',
  slots: ['root', 'head', 'link', 'list', 'row', 'number', 'title', 'time'],
  variants: {
    indent: {
      plate: {},
      number: { root: { paddingInlineStart: { base: '4', sm: '12' } } },
    },
  },
  defaultVariants: { indent: 'plate' },
  base: {
    root: {
      marginInline: '-4',
      paddingBlockStart: '0',
      paddingBlockEnd: { base: '4', sm: '6' },
      paddingInlineEnd: '4',
      paddingInlineStart: { base: '4', sm: '24' },
      background: 'gray.surface.bg.hover',
      ...ruleAbove,
    },
    head: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '4',
      paddingBlockStart: '4',
      paddingBlockEnd: '2',
      color: 'fg.muted',
    },
    link: {
      color: 'accent',
      ...ruleBelowOf('accent'),
    },
    list: {
      ...ruleBoth,
      maxHeight: 'scrollList',
      overflowY: 'auto',
      scrollbarWidth: 'thin',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '3ch minmax(0, 1fr) auto',
      alignItems: 'baseline',
      columnGap: '3',
      paddingBlock: '2',
      ...ruleAbove,
      '&:first-child': { ...ruleNone },
      '&:hover [data-part="title"]': { color: 'accent' },
    },
    number: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
    title: { transitionProperty: 'color', transitionDuration: 'fast' },
    time: { color: 'fg.muted', fontVariantNumeric: 'tabular-nums' },
  },
});

/** The upcoming events: a ruled list, each row a date block, the title with a subtitle, and an aside. */
export const datedList = (t: TypeSystem) => {
  const { textSize, textLine, microLabelLine } = t;
  return defineSlotRecipe({
    className: 'dated-list',
    slots: ['root', 'row', 'date', 'month', 'day', 'title', 'with', 'where'],
    base: {
      root: { ...ruleAbove },
      row: {
        display: 'grid',
        gridTemplateColumns: {
          base: 'token(sizes.dateColumnCompact) minmax(0, 1fr)',
          sm: 'token(sizes.dateColumn) minmax(0, 1fr) auto',
        },
        alignItems: 'baseline',
        columnGap: '6',
        paddingBlock: '4',
        ...ruleBelow,
      },
      date: {
        fontFamily: 'display',
        ...textSize('display', '2xl'),
        fontVariantNumeric: 'tabular-nums',
      },
      day: { display: 'block', ...textLine('display', '2xl') },
      month: { display: 'block', ...microLabelLine, color: 'secondary', fontWeight: 'normal' },
      title: {
        display: 'block',
        fontFamily: 'display',
        fontWeight: 'medium',
        ...textLine('display', 'xl'),
      },
      with: {
        display: 'block',
        color: 'fg.muted',
        ...textLine('body', 'md'),
        '& a': { color: 'accent' },
      },
      where: {
        ...textLine('body', 'md'),
        gridColumn: { base: '2', sm: 'auto' },
        color: 'fg.muted',
        textAlign: { base: 'start', sm: 'end' },
      },
    },
  });
};
