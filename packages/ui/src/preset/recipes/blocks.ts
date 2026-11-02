import { defineRecipe } from '@pandacss/dev';
import { column } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** A quoted passage with a bar on its left. */
export const quote = defineRecipe({
  className: 'quote',
  base: {
    paddingInlineStart: '4',
    borderInlineStartWidth: 'bar',
    borderColor: 'accent.6',
    maxWidth: 'prose',
  },
});

/** Preformatted monospace text on a tinted surface: citations. */
export const codeBlock = (t: TypeSystem) => {
  const { textSize, linePadded } = t;
  return defineRecipe({
    className: 'code-block',
    base: {
      paddingInline: '4',
      ...linePadded('mono', 'xs', { block: 'token(spacing.4)' }),
      borderRadius: 'l2',
      background: 'gray.2',
      fontFamily: 'mono',
      ...textSize('mono', 'xs'),
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
    },
  });
};

/** A vertical timeline: an ordered list with a rail on its left and a dot at each item. */
export const timeline = (t: TypeSystem) =>
  defineRecipe({
    className: 'timeline',
    base: {
      ...column,
      paddingInlineStart: '4',
      borderInlineStartWidth: 'rail',
      borderColor: 'accent.6',
      '& li': {
        position: 'relative',
        ...t.linePadded('body', 'md', { block: 'token(spacing.2)' }),
      },
      // The date in each entry is in another face; a zero line height keeps it from making the first line taller.
      '& li > strong': { lineHeight: '0' },
      '& li::before': {
        content: '""',
        position: 'absolute',
        // Centers the dot on the rail and on the first line of text.
        insetInlineStart:
          'calc(-1 * (token(spacing.4) + token(borderWidths.rail) / 2 + token(spacing.2) / 2))',
        insetBlockStart: 'calc(token(spacing.2) + 0.5lh - token(spacing.2) / 2)',
        width: '2',
        height: '2',
        borderRadius: 'full',
        background: 'accent',
      },
    },
  });

/** Content hidden behind a summary line until the reader opens it. */
export const disclosure = (t: TypeSystem) => {
  const { textSize, lineRelative } = t;
  return defineRecipe({
    className: 'disclosure',
    base: {
      '& summary': {
        cursor: 'pointer',
        color: 'accent',
        ...textSize('body', 'sm'),
        ...lineRelative('body', 'sm'),
        // The browsers lay out their own marker differently, so the line sets the height and the marker is drawn here.
        height: 'token(lineHeights.sm)',
        listStyle: 'none',
        '&::-webkit-details-marker': { display: 'none' },
        '&::before': {
          content: '""',
          display: 'inline-block',
          width: '1.5',
          height: '2',
          marginInlineEnd: '2',
          background: 'currentColor',
          clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
          transitionProperty: 'transform',
          transitionDuration: 'fast',
        },
        'details[open] > &::before': { transform: 'rotate(90deg)' },
        marginBlockEnd: '4',
        _hover: { textDecoration: 'underline' },
      },
    },
  });
};
