import { defineTokens } from '@pandacss/dev';

/**
 * The curves transitions use. They extend Panda's own set (`default`, `linear`, `in`) and set `out` and `in-out` to the
 * CSS keywords, so a recipe says `transitionTimingFunction: 'out'` and the curve is changed here, once.
 */
export const easings = defineTokens.easings({
  out: { value: 'ease-out' },
  'in-out': { value: 'ease-in-out' },
});
