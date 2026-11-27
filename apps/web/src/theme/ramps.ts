// apps/web/src/theme/ramps.ts

/** A color as red, green and blue, 0 to 255. */
type Rgb = [number, number, number];

const parse = (hex: string): Rgb => {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => Number.parseInt(h.slice(i, i + 2), 16)) as Rgb;
};

const toHex = (rgb: Rgb) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/**
 * A color a fraction of the way from one color to another.
 *
 * @param from - the start, as `#rrggbb`.
 * @param to - the end, as `#rrggbb`.
 * @param t - how far, 0 to 1.
 * @returns the mixed color.
 */
export function mix(from: string, to: string, t: number) {
  const a = parse(from);
  const b = parse(to);
  return toHex(a.map((v, i) => v + ((b[i] ?? 0) - v) * t) as Rgb);
}

/** How far each of the twelve steps of a neutral ramp is from the canvas to the text. */
const NEUTRAL_STEPS = [0, 0.04, 0.08, 0.12, 0.16, 0.21, 0.28, 0.4, 0.58, 0.66, 0.74, 1] as const;

/**
 * The twelve steps of the neutral: step 1 is the canvas, 7 the rules, 11 the muted text and 12 the text.
 *
 * @param canvas - the lightest color in light mode, the darkest in dark mode.
 * @param text - the opposite end.
 * @returns the twelve colors.
 */
export const neutralRamp = (canvas: string, text: string) => NEUTRAL_STEPS.map((t) => mix(canvas, text, t));

/** How far steps 1 to 8 of a hue's ramp are from the canvas to the hue. */
const TINT_STEPS = [0.04, 0.08, 0.13, 0.19, 0.27, 0.37, 0.52, 0.72] as const;

/**
 * The twelve steps of a hue: tints of it over the canvas, then the hue as step 9 (the solid), its hover, and the text steps.
 *
 * @param solid - the hue.
 * @param canvas - the page color it sits on.
 * @param toward - the color the text steps move toward: the text color, so they stay readable.
 * @returns the twelve colors.
 */
export const hueRamp = (solid: string, canvas: string, toward: string) => [
  ...TINT_STEPS.map((t) => mix(canvas, solid, t)),
  solid,
  mix(solid, toward, 0.12),
  mix(solid, toward, 0.3),
  mix(solid, toward, 0.6),
];
