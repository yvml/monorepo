import type { Style } from './lines';

/** The lengths and colors the rules are drawn with, as CSS expressions (for example `token(colors.border)`). */
export type RuleTokens = {
  /** The width of a hairline. */
  hairline: string;
  /** The default rule color. */
  border: string;
  /** The width of the solid bar on one side of a toned box. */
  edge: string;
};

/**
 * Rules and outlines that take no space.
 *
 * A border adds its width to the height of a block, which moves everything under it off the grid. These are inset shadows
 * drawn over the block's own padding instead, so a ruled block is exactly as tall as it was without the rule.
 *
 * @param t - the lengths and colors.
 * @returns the fragments.
 */
export function createRules(t: RuleTokens) {
  const up = `inset 0 ${t.hairline} 0 0`;
  const down = `inset 0 calc(-1 * ${t.hairline}) 0 0`;
  return {
    /** A hairline rule above the block, over the first pixel of its top padding. */
    ruleAbove: { boxShadow: `${up} ${t.border}` } as Style,
    /** A hairline rule below the block, over the last pixel of its bottom padding. */
    ruleBelow: { boxShadow: `${down} ${t.border}` } as Style,
    /** A hairline rule below the block in a given color. */
    ruleBelowOf: (color: string): Style => ({ boxShadow: `${down} ${color}` }),
    /** Hairline rules above and below the block. */
    ruleBoth: { boxShadow: `${up} ${t.border}, ${down} ${t.border}` } as Style,
    /** A hairline box inside the block, for boxes whose height is their content. */
    ringed: { boxShadow: `inset 0 0 0 ${t.hairline} ${t.border}` } as Style,
    /**
     * A hairline box in the current tone (`--tone`) mixed into the border color by `percent`. With `edge`, one side also
     * gets a solid bar of the full tone.
     */
    toneRing: (percent: number, edge?: 'top' | 'left'): Style => {
      const ring = `inset 0 0 0 ${t.hairline} color-mix(in srgb, var(--tone) ${percent}%, ${t.border})`;
      const bar =
        edge === 'top'
          ? `, inset 0 ${t.edge} 0 0 var(--tone)`
          : edge === 'left'
            ? `, inset ${t.edge} 0 0 0 var(--tone)`
            : '';
      return { boxShadow: `${ring}${bar}` };
    },
    /** Takes a rule away again, for a variant of a ruled block. */
    ruleNone: { boxShadow: 'none' } as Style,
  };
}
