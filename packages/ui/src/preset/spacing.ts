import { defineTokens } from '@pandacss/dev';
import { type Design, defaultControls, design } from '../design';
import { createScale } from './scale';

/**
 * The spacing scale: Panda's and Park UI's own ladder, so their components fit without translation. A token's name is
 * its number of baselines, so with a 5px baseline `spacing.4` is 20px and `spacing.3.5` is 17.5px. Whole names are the
 * steps for layout; the half steps (0.5 to 9.5) are the fine gaps and padding of small controls. Every value is its
 * name times the baseline, so changing the baseline rescales every step in proportion.
 */
const STEPS = [
  0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12, 14,
  16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 72, 80, 96,
] as const;

/**
 * The scale as token values for a design, shared by `spacing` and `sizes`.
 *
 * @param d - the design (only its grid is read).
 * @returns the values, keyed by baseline count.
 */
export function scaleValuesFor(d: Pick<Design, 'grid'>) {
  const { baselines } = createScale(d);
  return Object.fromEntries(
    STEPS.map((count) => [String(count), { value: count === 0 ? '0px' : baselines(count) }])
  );
}

/** The scale as tokens for the default design. */
export const scaleValues = scaleValuesFor(design);

/**
 * The spacing tokens for a design.
 *
 * @param d - the design.
 * @returns the tokens.
 */
/** The controls of a design: the system's defaults with the design's own sizes on top. */
export const controlsFor = (d: Pick<Design, 'controls'>) => ({ ...defaultControls, ...d.controls });

export const spacingFor = (d: Pick<Design, 'grid' | 'controls'>) => {
  const { baselines } = createScale(d);
  const controls = controlsFor(d);
  return defineTokens.spacing({
    ...scaleValuesFor(d),
    /** The side padding of each control size. */
    controlPad: Object.fromEntries(
      Object.entries(controls).map(([size, c]) => [size, { value: baselines(c.padX) }])
    ),
  });
};

export const spacing = spacingFor(design);
