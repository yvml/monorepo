import { defineSlotRecipe } from '@pandacss/dev';
import { ringed, ruleAbove, ruleBelow, ruleBelowOf, toneRing } from '../fragments';
import { hoverRow } from '../interaction';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * The article of a page of text (Rev 19 §10.1): at most 72 characters wide, the serif title at 51/56 (35/40 on phones),
 * a 24/32 lede (20/28 on phones), 24/32 section heads with 48px above, uppercase labels for minor heads and 17/28 body
 * text (14/20 on phones). It also holds what the pages use: lists, key-value list, table, code block and label tiles.
 */
export const pageText = (t: TypeSystem) => {
  const {
    textSize,
    textLine,
    textRole,
    microLabel,
    microLabelLine,
    linePadded,
    longForm,
    longFormLine,
  } = t;
  return defineSlotRecipe({
    className: 'page-text',
    staticCss: ['*'],
    slots: [
      'root',
      'title',
      'lede',
      'h2',
      'h3',
      'p',
      'list',
      'kv',
      'term',
      'detail',
      'table',
      'th',
      'td',
      'code',
      'tileGrid',
      'tile',
      'tileName',
      'tileFigure',
      'tileCount',
      'tileUnit',
    ],
    base: {
      root: {
        minWidth: '0',
        maxWidth: 'article',
        '& a:not([data-bare], [class])': { color: 'accent', textDecoration: 'underline' },
        '& p + p': { marginBlockStart: '4' },
        '& :is(ol, ul, dl, table, div) + p': { marginBlockStart: '6' },
        '& code': { fontFamily: 'mono', fontSize: '1em' },
      },
      title: {
        marginBlockEnd: '6',
        color: 'fg.default',
        fontFamily: 'display',
        fontWeight: 'medium',
        letterSpacing: 'display',
        ...responsive(textRole('display', '4xl'), textRole('display', '6xl'), 'sm'),
      },
      lede: {
        maxWidth: '52ch',
        marginBlockEnd: '8',
        color: 'fg.default',
        fontFamily: 'display',
        ...responsive(textLine('display', 'xl'), textLine('display', '2xl'), 'sm'),
      },
      h2: {
        marginBlockStart: { base: '8', sm: '12' },
        marginBlockEnd: '4',
        color: 'fg.default',
        fontFamily: 'display',
        fontWeight: 'medium',
        ...responsive(textLine('display', 'xl'), textLine('display', '2xl'), 'sm'),
      },
      h3: {
        marginBlockStart: '8',
        marginBlockEnd: '2',
        ...microLabelLine,
        fontWeight: 'semibold',
      },
      p: { ...longFormLine },
      list: {
        ...longForm,
        marginBlockStart: '4',
        paddingInlineStart: '6',
        listStyle: 'disc',
        '& li': { ...longFormLine },
      },
      kv: {
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'token(sizes.term) minmax(0, 1fr)' },
        columnGap: '6',
        marginBlockStart: '4',
        ...ruleAbove,
        '& > *': { paddingBlock: '3', ...ruleBelow },
        '& > dd': { ...linePadded('body', 'md', { block: 'token(spacing.3)' }) },
      },
      term: {
        color: 'fg.muted',
        ...textLine('body', 'md'),
        '&&': { paddingBlockEnd: { base: '0', sm: '3' } },
      },
      detail: { ...textSize('body', 'md') },
      table: {
        width: 'full',
        marginBlockStart: '4',
        borderCollapse: 'collapse',
        ...textSize('body', 'md'),
      },
      th: {
        paddingInlineEnd: '4',
        textAlign: 'start',
        ...microLabel,
        ...linePadded(t.roles.fieldLabel.face ?? 'body', t.roles.fieldLabel.step, {
          block: 'token(spacing.2)',
        }),
        fontWeight: 'semibold',
        ...ruleBelowOf('fg.default'),
        '&[data-num]': {
          textAlign: 'end',
          fontVariantNumeric: 'tabular-nums',
          paddingInlineEnd: '0',
        },
      },
      td: {
        paddingInlineEnd: '4',
        ...linePadded('body', 'md', { block: 'token(spacing.3)' }),
        verticalAlign: 'top',
        ...ruleBelow,
        '&[data-num]': {
          textAlign: 'end',
          fontVariantNumeric: 'tabular-nums',
          paddingInlineEnd: '0',
        },
      },
      code: {
        ...ringed,
        display: 'block',
        marginBlockStart: '4',
        paddingInline: '4',
        ...linePadded('mono', 'md', { block: 'token(spacing.4)' }),
        overflow: 'auto',
        background: 'gray.surface.bg.hover',
        fontFamily: 'mono',
        ...textSize('mono', 'md'),
        whiteSpace: 'pre',
      },
      tileGrid: {
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' },
        gap: '4',
        marginBlockStart: '4',
      },
      tile: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '4',
        paddingBlock: '3',
        paddingInline: '4',
        color: 'fg.default',
        ...toneRing(40),
        toneFill: '10',
        ...hoverRow,
        '&:hover .page-text__tileCount': { color: 'secondary' },
      },
      tileName: { fontFamily: 'display', fontWeight: 'medium', ...textLine('display', 'xl') },
      // The count over its unit at the end of the tile.
      tileFigure: { display: 'grid', justifyItems: 'end', flexShrink: 0 },
      tileCount: {
        color: 'var(--tone)',
        fontFamily: 'display',
        fontVariantNumeric: 'tabular-nums',
        transitionProperty: 'color',
        transitionDuration: 'normal',
        transitionTimingFunction: 'in-out',
        ...textLine('display', '2xl'),
      },
      tileUnit: { color: 'fg.muted', fontFamily: 'body', ...textLine('body', 'sm') },
    },
    variants: {
      columns: {
        true: {
          list: {
            columnCount: { base: 1, sm: 2 },
            columnGap: '12',
            marginBlockStart: '2',
            listStyle: 'none',
            '& li': { paddingBlock: '2px' },
          },
        },
      },
      board: {
        true: {
          list: {
            '& li': {
              paddingBlock: '3',
              breakInside: 'avoid',
              fontFamily: 'display',
              ...textSize('display', 'xl'),
              ...ruleBelow,
            },
          },
        },
      },
    },
  });
};

/** The page layout: the section sidebar beside the article, or a disclosure above it below 960px. */
export const pageLayout = (t: TypeSystem) => {
  const { textLine, microLabelLine, linePadded } = t;
  return defineSlotRecipe({
    className: 'page-layout',
    slots: [
      'root',
      'side',
      'sideGroup',
      'sideLabel',
      'sideLink',
      'disclosure',
      'summary',
      'current',
      'nav',
    ],
    base: {
      root: {
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', md: 'token(sizes.sidebar) minmax(0, 1fr)' },
        columnGap: '16',
        rowGap: '6',
        alignItems: 'start',
      },
      side: {
        display: { base: 'none', md: 'block' },
        position: 'sticky',
        top: 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px) + token(spacing.6))',
        transitionProperty: 'top',
        transitionDuration: 'slower',
        transitionTimingFunction: 'ease-in-out',
      },
      sideGroup: { '& + &': { marginBlockStart: '6' } },
      sideLabel: { marginBlockEnd: '2', ...microLabelLine, fontWeight: 'semibold' },
      sideLink: {
        display: 'block',
        paddingBlock: '1',
        paddingInlineStart: '3',
        marginInlineStart: '-3',
        ...textLine('body', 'md'),
        borderInlineStartWidth: 'rail',
        borderInlineStartStyle: 'solid',
        borderInlineStartColor: 'transparent',
        color: 'fg.muted',
        transitionProperty: 'color, border-color',
        transitionDuration: 'fast',
        _hover: { color: 'fg.default' },
        '&[aria-current="page"]': { color: 'fg.default', borderInlineStartColor: 'accent' },
      },
      disclosure: { ...ringed, display: { base: 'block', md: 'none' }, paddingInline: '4' },
      summary: {
        ...linePadded('body', 'md', { block: 'token(spacing.3)' }),
        cursor: 'pointer',
        listStyle: 'none',
        '&::-webkit-details-marker': { display: 'none' },
      },
      current: { color: 'fg.muted' },
      nav: { paddingBlockEnd: '3' },
    },
  });
};
