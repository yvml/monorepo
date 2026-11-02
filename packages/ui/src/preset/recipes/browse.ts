import { defineSlotRecipe } from '@pandacss/dev';
import {
  belowHeader,
  bleedRow,
  column,
  ruleBelow,
  ruleBelowOf,
  scrollRow,
  stickBelowHeader,
} from '../fragments';
import { currentMark, hoverAccent, hoverRow } from '../interaction';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/** A row of links that choose a group of a browse list: a letter, a decade or a view. The current one is marked. */
export const browseNav = (t: TypeSystem) => {
  const labelCapsLine = t.labelCapsLine;
  return defineSlotRecipe({
    className: 'browse-nav',
    staticCss: ['*'],
    slots: ['root', 'link'],
    base: {
      root: { display: 'flex', flexWrap: 'wrap', gap: '1', paddingBlock: '2', ...ruleBelow },
      link: {
        paddingBlock: '1',
        paddingInline: '2',
        color: 'fg.muted',
        ...labelCapsLine,
        ...hoverAccent,
      },
    },
    variants: {
      current: {
        true: { link: currentMark },
        false: {},
      },
    },
  });
};

/**
 * The columns of a browse list. Each column is a range of names under its label, such as `Ad–At`, with the number of
 * names at the end of the heading row over a foreground rule. The grid shows one column on phones, two from 640px, three
 * from 960px and five from 1200px, and wraps any further columns onto new rows. A row is a name with a small muted note
 * (a date) at the end, a hairline under it, and accent on hover.
 */
export const rangeColumns = (t: TypeSystem) => {
  const { textSize, textLine } = t;
  return defineSlotRecipe({
    className: 'range-columns',
    slots: ['root', 'column', 'heading', 'label', 'count', 'list', 'link', 'name', 'note'],
    base: {
      root: {
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(5, minmax(0, 1fr))',
        },
        columnGap: '6',
        rowGap: { base: '8', sm: '12' },
      },
      column: { ...column, minWidth: '0' },
      heading: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '2',
        paddingBlockEnd: '2',
        marginBlockEnd: '1',
        ...ruleBelowOf('fg.default'),
      },
      label: { fontFamily: 'display', fontWeight: 'medium', ...textLine('display', '2xl') },
      count: { color: 'secondary', ...textLine('body', 'sm'), fontVariantNumeric: 'tabular-nums' },
      list: { ...column },
      link: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '2',
        paddingBlock: '1',
        color: 'fg.default',
        ...textSize('body', 'md'),
        ...bleedRow,
        ...hoverRow,
      },
      name: { minWidth: '0', overflowWrap: 'anywhere', ...textLine('body', 'md') },
      note: { flexShrink: 0, color: 'fg.muted', whiteSpace: 'nowrap', ...textLine('body', 'sm') },
    },
  });
};

/**
 * The strip of letters above a letter list: 40px square keys (36px on phones) set in the display face, sticky under the
 * header bar. The current letter is inverted; a letter with no entries is dashed and dimmed and is not a link.
 */
export const letterBar = (t: TypeSystem) => {
  const { textSize, lineCentered } = t;
  return defineSlotRecipe({
    className: 'letter-bar',
    slots: ['root', 'list', 'key'],
    base: {
      root: {
        // Sticky from the small breakpoint up; on a phone the 27 keys wrap into rows too tall to keep on screen.
        ...stickBelowHeader,
        position: { base: 'static', sm: 'sticky' },
        zIndex: 'docked',
        paddingBlock: '3',
        marginBlockEnd: '6',
        background: 'canvas',
        ...ruleBelow,
      },
      list: { display: 'flex', flexWrap: 'wrap', gap: '1' },
      key: {
        display: 'grid',
        placeItems: 'center',
        width: { base: 'keyCompact', sm: 'squareControl' },
        height: { base: 'keyCompact', sm: 'squareControl' },
        color: 'fg.default',
        fontFamily: 'display',
        ...responsive(textSize('display', 'lg'), textSize('display', 'xl'), 'sm'),
        ...responsive(
          lineCentered('display', 'lg', {
            height: 'token(sizes.keyCompact)',
            top: 'token(borderWidths.hairline)',
            bottom: 'token(borderWidths.hairline)',
          }),
          lineCentered('display', 'xl', {
            height: 'token(sizes.squareControl)',
            top: 'token(borderWidths.hairline)',
            bottom: 'token(borderWidths.hairline)',
          }),
          'sm'
        ),
        borderWidth: 'hairline',
        borderStyle: 'solid',
        borderColor: 'border',
        transitionProperty: 'background-color, border-color, color',
        transitionDuration: 'fast',
        _hover: { borderColor: 'fg.default' },
        '&[aria-current="page"]': {
          background: 'fg.default',
          borderColor: 'fg.default',
          color: 'canvas',
        },
        '&[aria-disabled="true"]': {
          color: 'fg.muted',
          opacity: '0.45',
          borderStyle: 'dashed',
          pointerEvents: 'none',
        },
      },
    },
  });
};

/** The title row of a list page: the page title at the start and the number of entries, muted, at the end. */
export const listHeader = (t: TypeSystem) => {
  const textRole = t.textRole;
  return defineSlotRecipe({
    className: 'list-header',
    slots: ['root', 'title', 'count'],
    base: {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        columnGap: '6',
        rowGap: '2',
        marginBlockEnd: '6',
      },
      title: {
        color: 'fg.default',
        fontFamily: 'display',
        fontWeight: 'medium',
        letterSpacing: 'display',
        ...responsive(textRole('display', '4xl'), textRole('display', '6xl'), 'sm'),
      },
      count: { color: 'fg.muted', ...textRole('body', 'md') },
    },
  });
};

/**
 * The sticky row of at most five ranges of a letter, laid out like the site header's tabs: the label in the body face,
 * muted until it is the current range, with its count right after it. It sticks under the header and, from the small
 * breakpoint up, under the letter strip (`--lh`, published by the strip). The row scrolls sideways when it is wider than
 * the screen.
 */
export const rangeNav = (t: TypeSystem) => {
  const { textSize, linePadded } = t;
  return defineSlotRecipe({
    className: 'range-nav',
    staticCss: ['*'],
    slots: ['root', 'scroll', 'tab'],
    base: {
      // The bar is opaque and sticky; the row inside it scrolls and fades at its clipped edges.
      root: {
        ...stickBelowHeader,
        top: { base: belowHeader, sm: `calc(${belowHeader} + var(--lh, 0px))` },
        zIndex: 'docked',
        minWidth: '0',
        background: 'canvas',
        ...ruleBelow,
      },
      scroll: {
        ...scrollRow,
        alignItems: 'stretch',
        gap: { base: '6', sm: '8' },
      },
      tab: {
        display: 'block',
        flexShrink: 0,
        color: 'fg.muted',
        fontFamily: 'body',
        ...responsive(textSize('body', 'md'), textSize('body', 'lg'), 'sm'),
        ...responsive(
          linePadded('body', 'md', { block: 'token(spacing.2)' }),
          linePadded('body', 'lg', { block: 'token(spacing.3)' }),
          'sm'
        ),
        '& > *': { marginInlineStart: '2' },
        whiteSpace: 'nowrap',
        position: 'relative',
        transitionProperty: 'color',
        transitionDuration: 'fast',
        _hover: { color: 'fg.default' },
        '&::after': {
          content: '""',
          position: 'absolute',
          insetInline: '0',
          insetBlockEnd: '0',
          height: 'rail',
          background: 'accent',
          transform: 'scaleX(0)',
          transformOrigin: 'center',
          transitionProperty: 'transform',
          transitionDuration: 'normal',
          transitionTimingFunction: 'ease-out',
        },
        '&[data-current="true"]': { color: 'fg.default' },
        '&[data-current="true"]::after': { transform: 'scaleX(1)' },
      },
    },
  });
};

/**
 * The ranges of a letter as sections: a heading with the range label and its count beside it over a foreground rule, then the
 * names in as many columns as fit. From the medium breakpoint up every section is shown; below it only the active one,
 * so a phone scrolls one range at a time. A section clears the sticky bars when it is scrolled to.
 */
export const rangeSections = (t: TypeSystem) => {
  const { textLine } = t;
  return defineSlotRecipe({
    className: 'range-sections',
    slots: ['root', 'section', 'heading', 'list'],
    base: {
      root: { display: 'grid', rowGap: { base: '8', md: '12' } },
      section: {
        display: { base: 'none', md: 'grid' },
        '&[data-active="true"]': { display: 'grid' },
        rowGap: '3',
        minWidth: '0',
        // The letter strip sticks from the small breakpoint up, so only there does its height sit above a section.
        scrollMarginBlockStart: {
          base: 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px) + var(--rh, 0px) + token(spacing.2))',
          sm: 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px) + var(--lh, 0px) + var(--rh, 0px) + token(spacing.2))',
        },
      },
      // The label and its count share one line, the count small beside the large label, as in the site header's tabs.
      heading: {
        fontFamily: 'display',
        fontWeight: 'medium',
        ...textLine('display', '2xl'),
        paddingBlockEnd: '2',
        '& > *': { marginInlineStart: '3' },
        ...ruleBelowOf('fg.default'),
      },
      list: {
        columnWidth: 'token(sizes.column)',
        columnGap: '6',
        '& > li': { breakInside: 'avoid' },
      },
    },
  });
};
