/**
 * The grid every size in the system sits on.
 *
 * - `BASELINE` is the vertical rhythm unit: every line height is a multiple of it.
 * - `UNIT` is the spacing step. It is two baselines, so a spacing step never breaks the rhythm.
 * - `HALF` (= `BASELINE`) is the half step, for utility gaps such as an icon beside its label.
 *
 * Spacing and size tokens are named by their number of baselines, so token `4` is 20px and token `1` is 5px. Even
 * tokens are on the 10px scale; odd tokens are the 5px utility steps.
 */

import { type Design, design } from '../design';

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
export function createScale(d: Pick<Design, 'grid'>) {
  const ROOT_SIZE = d.grid.root;
  const BASELINE = d.grid.baseline;
  const UNIT = d.grid.unit;
  /** Converts px to a rem string. */
  const rem = (px: number) => `${round(px / ROOT_SIZE)}rem`;
  /** Converts a number of baselines to a rem string. */
  const baselines = (count: number) => rem(count * BASELINE);
  return { ROOT_SIZE, BASELINE, UNIT, rem, baselines };
}

const base = createScale(design);

/** The root font size in px that `rem` values are computed against. */
export const ROOT_SIZE: number = base.ROOT_SIZE;

/** The vertical rhythm unit in px. */
export const BASELINE: number = base.BASELINE;

/** The primary spacing step in px. */
export const UNIT: number = base.UNIT;

/**
 * Converts px to a rem string against the default design.
 *
 * @param px - the length in px.
 * @returns the length in rem.
 */
export const rem = base.rem;

/**
 * Converts a number of baselines to a rem string against the default design.
 *
 * @param count - the number of baselines.
 * @returns the length in rem.
 */
export const baselines = base.baselines;
