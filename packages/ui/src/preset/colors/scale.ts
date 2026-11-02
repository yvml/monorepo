import { defineSemanticTokens } from '@pandacss/dev';

/**
 * Color scales built from the brand primitives with `color-mix`, so every shade traces back to the theme's ink, paper,
 * line or accent. Each palette has 12 solid steps (1 lightest in light mode, 1 darkest in dark mode), 12 alpha steps
 * (`a1` to `a12`) and the Park UI component variants (`solid`, `subtle`, `surface`, `outline`, `plain`) that recipes
 * read through `colorPalette`.
 */

type Mode = { base: string; _dark: string };
type Step = { value: Mode };

const STEP_NAMES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
const ALPHA_NAMES = [
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  'a7',
  'a8',
  'a9',
  'a10',
  'a11',
  'a12',
] as const;

/** Alpha percentages for `a1` to `a12`. */
const ALPHA = [2, 4, 7, 10, 13, 17, 23, 34, 52, 62, 72, 92] as const;

/**
 * A `color-mix` of two colors in a perceptual space.
 *
 * @param color - a token reference or color.
 * @param percent - how much of `color`, 0 to 100.
 * @param into - what it is mixed into.
 * @returns the CSS value.
 */
export function mix(color: string, percent: number, into = 'transparent') {
  return `color-mix(in oklab, ${color} ${percent}%, ${into})`;
}

/** A token reference. */
export const ref = (path: string) => `{colors.${path}}`;

const INK = ref('pigment.ink');
const PAPER = ref('pigment.paper');
const STONE = ref('pigment.line');

function steps(light: string[], dark: string[]) {
  return Object.fromEntries(
    STEP_NAMES.map((name, index) => [
      name,
      { value: { base: light[index], _dark: dark[index] } } as Step,
    ])
  );
}

function alphas(light: string, dark: string) {
  return Object.fromEntries(
    ALPHA_NAMES.map((name, index) => [
      name,
      {
        value: { base: mix(light, ALPHA[index] ?? 0), _dark: mix(dark, ALPHA[index] ?? 0) },
      } as Step,
    ])
  );
}

/**
 * The neutral scale: paper to line to ink in light mode, ink to paper in dark mode. Step 1 is the canvas, step 7 is
 * the line color (borders), step 12 is ink (text).
 */
export function neutralScale() {
  const light = [
    PAPER,
    mix(STONE, 18, PAPER),
    mix(STONE, 36, PAPER),
    mix(STONE, 54, PAPER),
    mix(STONE, 72, PAPER),
    mix(STONE, 88, PAPER),
    STONE,
    mix(INK, 18, STONE),
    mix(INK, 38, STONE),
    mix(INK, 52, STONE),
    mix(INK, 72, STONE),
    INK,
  ];
  const darkPercent = [0, 4, 8, 12, 16, 21, 27, 40, 50, 58, 78, 100];
  const dark = darkPercent.map((p) => (p === 0 ? INK : p === 100 ? PAPER : mix(PAPER, p, INK)));
  return { ...steps(light, dark), ...alphas(INK, PAPER) };
}

/**
 * A tonal scale around one hue: paper tinted toward `soft`, then `soft` to `solid` at step 9, then darker steps for
 * hover and text. In dark mode step 9 is `soft` so the solid stays legible on ink.
 *
 * @param solid - the light-mode solid (step 9) token path.
 * @param soft - the dark-mode solid and the light-mode step 7 token path.
 */
export function tonalScale(solid: string, soft: string) {
  const S = ref(solid);
  const L = ref(soft);
  const light = [
    mix(L, 8, PAPER),
    mix(L, 16, PAPER),
    mix(L, 28, PAPER),
    mix(L, 40, PAPER),
    mix(L, 54, PAPER),
    mix(L, 72, PAPER),
    L,
    mix(S, 45, L),
    S,
    mix(INK, 14, S),
    mix(INK, 26, S),
    mix(INK, 62, S),
  ];
  const dark = [
    mix(S, 16, INK),
    mix(S, 24, INK),
    mix(S, 34, INK),
    mix(S, 46, INK),
    mix(S, 58, INK),
    mix(S, 72, INK),
    mix(L, 28, S),
    mix(L, 60, S),
    L,
    mix(PAPER, 12, L),
    mix(PAPER, 32, L),
    mix(PAPER, 82, L),
  ];
  return { ...steps(light, dark), ...alphas(S, L) };
}

/** What {@link explicitScale} needs: the steps, and which of them play which part in the Park UI variants. */
export type ExplicitScale = Omit<VariantOptions, 'name'> & {
  /** The 12 steps in light mode: 1 is the lightest, 12 the darkest. */
  light: readonly string[];
  /** The 12 steps in dark mode: 1 is the darkest, 12 the lightest. */
  dark: readonly string[];
  /** The 12 alpha steps (`a1` to `a12`) in light mode and dark mode. Left out, they are mixed from step 12. */
  alpha?: { light: readonly string[]; dark: readonly string[] };
};

type VariantOptions = {
  /** The palette's token name, such as `gray` or `accent`. */
  name: string;
  /** The step used for the solid background. */
  solid: number;
  /** The step used for solid hover. */
  solidHover: number;
  /** The solid foreground. */
  solidFg: Mode;
  /** The step used for text on tinted backgrounds. */
  text: number;
};

/**
 * The Park UI component variants for a palette, as semantic tokens that point at its steps.
 *
 * @param options - which steps play which role.
 * @returns the `solid`, `subtle`, `surface`, `outline` and `plain` groups.
 */
export function variants({ name, solid, solidHover, solidFg, text }: VariantOptions) {
  const c = (key: string | number) => ref(`${name}.${key}`);
  const both = (value: string): { value: Mode } => ({ value: { base: value, _dark: value } });
  const fg = both(c(text));
  return defineSemanticTokens.colors({
    solid: {
      bg: { DEFAULT: both(c(solid)), hover: both(c(solidHover)) },
      fg: { DEFAULT: { value: solidFg } },
    },
    subtle: {
      bg: { DEFAULT: both(c('a3')), hover: both(c('a4')), active: both(c('a5')) },
      fg: { DEFAULT: fg },
    },
    surface: {
      bg: { DEFAULT: both(c(1)), hover: both(c(2)), active: both(c(3)) },
      border: { DEFAULT: both(c(6)), hover: both(c(7)) },
      fg: { DEFAULT: fg },
    },
    outline: {
      bg: { hover: both(c('a2')), active: both(c('a3')) },
      border: { DEFAULT: both(c(7)) },
      fg: { DEFAULT: fg },
    },
    plain: {
      bg: { hover: both(c('a3')), active: both(c('a4')) },
      fg: { DEFAULT: fg },
    },
  });
}

/**
 * A palette from steps a project chose by hand: the 12 steps, the 12 alpha steps and the Park UI variants, in the same
 * shape as the generated palettes, so a project's own scale plugs into a theme's `colors` like any other.
 *
 * @param name - the palette's token name, such as `gray` or `accent`.
 * @param spec - the steps and which of them the variants use.
 * @returns the palette's semantic tokens.
 * @throws when `light`, `dark` or `alpha` do not have 12 entries.
 */
export function explicitScale(name: string, spec: ExplicitScale) {
  const { light, dark, alpha, ...roles } = spec;
  for (const [label, list] of Object.entries({ light, dark, ...alpha })) {
    if (list.length !== STEP_NAMES.length) {
      throw new Error(
        `Scale "${name}" ${label} has ${list.length} entries, not ${STEP_NAMES.length}.`
      );
    }
  }
  const last = STEP_NAMES.length - 1;
  return {
    ...steps([...light], [...dark]),
    ...(alpha
      ? Object.fromEntries(
          ALPHA_NAMES.map((alphaName, index) => [
            alphaName,
            {
              value: { base: alpha.light[index] as string, _dark: alpha.dark[index] as string },
            } as Step,
          ])
        )
      : alphas(light[last] as string, dark[last] as string)),
    ...variants({ name, ...roles }),
  };
}
