import { defineSlotRecipe } from '@pandacss/dev';
import { column, ruleAbove } from '../fragments';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * The head of a record page: a small accent kicker, the title at the page-title size (Rev 19: display 51/56, 35/40 on
 * phones), the composer under it, then a rule and a row of facts (a small label over its value) and the tags and
 * actions. It is built from the same roles as the home page's masthead and cards, so the two read as one site.
 */
export const recordHeader = (t: TypeSystem) => {
  const { textRole, textSize, textLine, labelCapsLine, microLabelLine } = t;
  return defineSlotRecipe({
    className: 'record-header',
    staticCss: ['*'],
    slots: [
      'root',
      'kicker',
      'title',
      'byline',
      'facts',
      'fact',
      'factLabel',
      'factValue',
      'extras',
    ],
    base: {
      root: { ...column, gap: 'rhythm.item', paddingBlockStart: 'rhythm.group' },
      kicker: { ...labelCapsLine, color: 'accent' },
      title: {
        fontFamily: 'display',
        fontWeight: 'medium',
        letterSpacing: 'display',
        textWrap: 'balance',
        color: 'fg.default',
        overflowWrap: 'anywhere',
        ...responsive(textRole('display', '4xl'), textRole('display', '6xl'), 'md'),
      },
      byline: {
        fontFamily: 'display',
        color: 'fg.default',
        paddingBlockStart: 'rhythm.pair',
        ...responsive(textLine('display', 'xl'), textLine('display', '2xl'), 'md'),
        '& a': { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '0.2em' },
        '& a:hover': { color: 'accent' },
      },
      facts: {
        display: 'grid',
        gridTemplateColumns: {
          base: 'minmax(0, 1fr)',
          sm: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        columnGap: 'rhythm.item',
        rowGap: 'rhythm.item',
        paddingBlock: 'rhythm.item',
        ...ruleAbove,
      },
      fact: { ...column, gap: 'rhythm.pair', minWidth: '0' },
      factLabel: { ...microLabelLine },
      factValue: {
        ...textLine('body', 'lg'),
        color: 'fg.default',
        '& a': { color: 'inherit', textDecoration: 'underline', textUnderlineOffset: '0.2em' },
        '& a:hover': { color: 'accent' },
      },
      extras: {
        ...column,
        gap: 'rhythm.item',
        ...textSize('body', 'md'),
      },
    },
  });
};
