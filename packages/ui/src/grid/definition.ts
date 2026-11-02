/**
 * The grid every size in the system sits on.
 *
 * - `baseline` is the vertical rhythm unit: every line height, control height and block height is a whole number of them.
 * - `unit` is the primary spacing step. It is two baselines, so a spacing step never breaks the rhythm.
 * - `root` is the root font size in px that `rem` values are computed against.
 *
 * Spacing and size tokens are named by their number of baselines, so with a 5px baseline token `4` is 20px and token `1`
 * is 5px. The project declares these numbers in its config; nothing else in the library defines a grid number.
 */
export type Grid = {
  /** The vertical rhythm unit in px. Every line height is a multiple of it. */
  baseline: number;
  /** The primary spacing step in px. Two baselines, so a spacing step never breaks the rhythm. */
  unit: number;
  /** The root font size in px that `rem` values are computed against. */
  root: number;
  /**
   * Rounds every trimmed text block up to a whole number of baselines, with space above the capitals, so the baseline of
   * the text sits on a grid line. Left out, the block is exactly cap height to baseline. Needs CSS `round()`.
   */
  snap?: boolean;
};

/** The default grid: a 5px baseline, a 10px unit, a 16px root, with trimmed text rounded to whole baselines. */
export const defaultGrid = { baseline: 5, unit: 10, root: 16, snap: true } as const satisfies Grid;

/**
 * Rounds to four decimal places, so generated rem values stay short.
 *
 * @param value - the number.
 * @returns the rounded number.
 */
export function round(value: number) {
  return Math.round(value * 10000) / 10000;
}

/**
 * The grid helpers for one design: the root size, the baseline and unit in px, and converters to rem.
 *
 * @param d - the design (only its grid is read).
 * @returns the constants and converters.
 */
export function createScale(d: { grid: Grid }) {
  const ROOT_SIZE = d.grid.root;
  const BASELINE = d.grid.baseline;
  const UNIT = d.grid.unit;
  /** Converts px to a rem string. */
  const rem = (px: number) => `${round(px / ROOT_SIZE)}rem`;
  /** Converts a number of baselines to a rem string. */
  const baselines = (count: number) => rem(count * BASELINE);
  return { ROOT_SIZE, BASELINE, UNIT, rem, baselines };
}
