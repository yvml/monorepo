import { defineSlotRecipe } from '@pandacss/dev';
import { column, ruleBelow } from '../fragments';
import type { TypeSystem } from '../type-scale';

/**
 * The layout of the style guide page. The specimens themselves use the real recipes; this only arranges them and
 * labels them. The swatches and spacing bars are the one place a component calls `css()`, with a literal token name,
 * because showing a token is the point.
 */
export const styleguide = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
    className: 'styleguide',
    slots: ['specimen', 'note', 'list', 'row', 'label', 'bar', 'grid', 'cell', 'chip', 'roleRow'],
    base: {
      specimen: { ...column, gap: '2', paddingBlockEnd: '4', ...ruleBelow },
      note: {
        color: 'fg.muted',
        ...textSize('body', 'sm'),
        '& code': { fontFamily: 'mono', ...textSize('body', 'xs') },
      },
      list: { ...column, gap: '2' },
      row: { display: 'flex', alignItems: 'center', gap: '4', ...textSize('body', 'sm') },
      label: { width: 'avatar.sm', color: 'fg.muted' },
      bar: { height: '2', background: 'accent' },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(token(sizes.label), 1fr))',
        gap: '4',
      },
      cell: { ...column, gap: '1', ...textSize('body', 'xs') },
      chip: { height: '8', borderWidth: 'hairline', borderColor: 'border' },
      roleRow: {
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'token(sizes.avatar.lg) 1fr 1fr' },
        gap: { base: '1', md: '4' },
        alignItems: 'baseline',
        paddingBlock: '4',
        ...ruleBelow,
      },
    },
  });
};
