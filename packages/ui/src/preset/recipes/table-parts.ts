import { defineRecipe } from '@pandacss/dev';
import { currentBar } from '../interaction';
import type { TypeSystem } from '../type-scale';

/** A wrapper that lets a wide table scroll sideways on narrow screens. */
export const scrollX = defineRecipe({
  className: 'scroll-x',
  base: { width: 'full', overflowX: 'auto' },
});

/** Adjusts a cell of the shared `table` recipe: wrapping text, a narrow numeric cell, or a monospace record cell. */
export const tableCell = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineRecipe({
    className: 'table-cell',
    staticCss: ['*'],
    variants: {
      kind: {
        wrap: { whiteSpace: 'normal', overflow: 'visible' },
        number: { width: '1', whiteSpace: 'nowrap', textAlign: 'end' },
        mono: { fontFamily: 'mono', ...textSize('body', 'xs'), whiteSpace: 'pre-wrap' },
      },
    },
  });
};

/** A table row whose track is loaded in the player: `currentFill` on its cells. */
export const playableRow = defineRecipe({
  className: 'playable-row',
  staticCss: ['*'],
  variants: {
    playing: {
      true: {
        '& td': { background: 'accent.3' },
        '& td:first-child': { boxShadow: currentBar },
      },
    },
  },
});
