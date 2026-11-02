import { defineTokens } from '@pandacss/dev';

/** The named animations recipes use. Their keyframes are in `keyframes.ts`. */
export const animations = defineTokens.animations({
  spin: { value: 'spin 1s linear infinite' },
});
