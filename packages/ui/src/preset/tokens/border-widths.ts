import { defineTokens } from '@pandacss/dev';

/** Rule widths. `hairline` is the ink line between blocks; `rail` and `bar` are the heavier accents. */
export const borderWidths = defineTokens.borderWidths({
  hairline: { value: '1px' },
  rail: { value: '2px' },
  bar: { value: '3px' },
  /** The colored top edge of a tile. */
  edge: { value: '4px' },
});
