import { defineTokens } from '@pandacss/dev';
import { type ControlSize, type ControlStyle, defaultControls } from './controls';
import { createScale, type Grid } from './definition';

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
export function scaleValuesFor(d: { grid: Grid }) {
  const { baselines } = createScale(d);
  return Object.fromEntries(
    STEPS.map((count) => [String(count), { value: count === 0 ? '0px' : baselines(count) }])
  );
}

/**
 * The controls of a design: the system's defaults with the design's own sizes on top.
 *
 * @param d - the design (only its controls are read).
 * @returns every control size.
 */
export const controlsFor = (d: { controls?: Partial<Record<ControlSize, ControlStyle>> }) => ({
  ...defaultControls,
  ...d.controls,
});

/** The default rhythm, in baselines: 8px, 16px, 32px and 64px on a 4px baseline. */
export const defaultRhythm = { pair: 2, item: 4, group: 8, section: 16 } as const;

/**
 * The spacing tokens for a design.
 *
 * @param d - the design.
 * @returns the tokens.
 */
export const spacingFor = (d: {
  grid: Grid;
  controls?: Partial<Record<ControlSize, ControlStyle>>;
  rhythm?: Partial<Record<keyof typeof defaultRhythm, number>>;
}) => {
  const { baselines } = createScale(d);
  const controls = controlsFor(d);
  return defineTokens.spacing({
    ...scaleValuesFor(d),
    /** The four gaps layouts are built from (`Design.rhythm`), as a number of baselines each. */
    rhythm: Object.fromEntries(
      Object.entries({ ...defaultRhythm, ...d.rhythm }).map(([name, count]) => [
        name,
        { value: baselines(count) },
      ])
    ),
    /** The side padding of each control size. */
    controlPad: Object.fromEntries(
      Object.entries(controls).map(([size, c]) => [size, { value: baselines(c.padX) }])
    ),
  });
};
