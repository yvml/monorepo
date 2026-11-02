import { defineSlotRecipe } from '@pandacss/dev';
import { column, ringed, ruleBelowOf, toneRing } from '../fragments';
import { hoverRow } from '../interaction';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * A feature card: a bordered block with a label, a display title, a blurb, a counts line and a link at the bottom. With
 * a hue (`hue` recipe sets `--tone`) the border, the 10% tint and the label take the hue.
 */
export const featureCard = (t: TypeSystem) => {
  const { textLine, microLabelLine } = t;
  return defineSlotRecipe({
    className: 'feature-card',
    staticCss: ['*'],
    slots: ['root', 'label', 'title', 'text', 'meta', 'link'],
    base: {
      root: {
        ...ringed,
        ...column,
        gap: '2',
        minHeight: 'card',
        padding: { base: '4', sm: '6' },
      },
      label: { ...microLabelLine },
      title: {
        color: 'fg.default',
        fontFamily: 'display',
        fontWeight: 'medium',
        letterSpacing: 'card',
        ...responsive(textLine('display', '2xl'), textLine('display', '4xl'), 'sm'),
      },
      text: { color: 'fg.muted', ...textLine('body', 'md') },
      meta: { color: 'fg.muted', ...textLine('body', 'md') },
      link: {
        alignSelf: 'flex-start',
        marginBlockStart: 'auto',
        color: 'accent',
        ...ruleBelowOf('accent'),
        ...textLine('body', 'md'),
        transitionProperty: 'color',
        transitionDuration: 'normal',
        transitionTimingFunction: 'in-out',
        _hover: { color: 'fg.default' },
      },
    },
    variants: {
      tinted: {
        true: {
          root: {
            ...toneRing(100),
            toneFill: '10',
          },
          label: { color: 'var(--tone)' },
        },
      },
    },
  });
};

/**
 * A count tile: a tinted button with a hairline ring in the hue, the name at the top, and the count in the display face
 * over its unit (`626` over `releases`) at the bottom right. On hover the whole tile takes the accent fill and the text
 * the secondary color, eased in and out. It reads its hue from `hue`.
 */
export const tile = (t: TypeSystem) => {
  const textLine = t.textLine;
  return defineSlotRecipe({
    className: 'tile',
    slots: ['root', 'name', 'figure', 'count', 'unit'],
    base: {
      root: {
        ...column,
        flex: '1',
        justifyContent: 'space-between',
        width: 'full',
        minHeight: { base: 'tileCompact', sm: 'tile' },
        padding: '4',
        color: 'fg.default',
        textAlign: 'start',
        cursor: 'pointer',
        ...toneRing(40),
        toneFill: '10',
        ...hoverRow,
        '&:hover .tile__count': { color: 'secondary' },
      },
      name: {
        display: 'block',
        fontFamily: 'display',
        fontWeight: 'medium',
        ...textLine('display', 'xl'),
      },
      // The count over its unit, such as `626` over `releases`, at the bottom end of the tile.
      figure: { display: 'grid', justifyItems: 'end', alignSelf: 'flex-end' },
      count: {
        color: 'var(--tone)',
        fontFamily: 'display',
        fontVariantNumeric: 'tabular-nums',
        transitionProperty: 'color',
        transitionDuration: 'normal',
        transitionTimingFunction: 'in-out',
        ...textLine('display', '4xl'),
      },
      unit: { color: 'fg.muted', fontFamily: 'body', ...textLine('body', 'sm') },
    },
  });
};
