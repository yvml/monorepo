import { defineSemanticTokens } from '@pandacss/dev';
import type { ColorScale, ModeColor, ThemeScales } from '../../theme';
import { explicitScale } from './scale';

/** A semantic token with a value in each mode. */
const mode = ({ light, dark }: ModeColor) => ({ value: { base: light, _dark: dark } });

/** The text on a solid fill, unless the scale says otherwise: paper on the light solid, ink on the dark one. */
const DEFAULT_ON_SOLID = { base: '{colors.white}', _dark: '{colors.black}' };

/**
 * A scale as semantic tokens: its twelve steps, its alpha steps and the component variants (`solid`, `subtle`,
 * `surface`, `outline`, `plain`) that recipes read through `colorPalette`.
 *
 * @param name - the token name.
 * @param scale - the declared scale.
 * @param steps - which steps play the solid, its hover and the text.
 */
function scale(name: string, scale: ColorScale, steps = { solid: 9, solidHover: 10, text: 11 }) {
  return explicitScale(name, {
    light: scale.light,
    dark: scale.dark,
    ...(scale.alpha ? { alpha: scale.alpha } : {}),
    ...steps,
    solidFg: scale.onSolid ? mode(scale.onSolid).value : DEFAULT_ON_SOLID,
  });
}

/**
 * Every color token of a theme, built from its declared scales.
 *
 * @param scales - the theme's scales.
 * @returns the semantic color tokens, in the shape the components read.
 */
export function colorTokensFromScales(scales: ThemeScales) {
  return defineSemanticTokens.colors({
    canvas: { value: '{colors.gray.1}' },
    fg: {
      default: { value: '{colors.gray.12}' },
      muted: { value: '{colors.gray.11}' },
      subtle: { value: '{colors.gray.10}' },
      disabled: { value: '{colors.gray.8}' },
    },
    border: {
      DEFAULT: { value: '{colors.gray.7}' },
      muted: { value: '{colors.gray.5}' },
      emphasized: { value: '{colors.gray.9}' },
    },
    error: { value: '{colors.red.9}' },
    shadow: { value: { base: '{colors.gray.a6}', _dark: '{colors.black.a8}' } },
    gray: scale('gray', scales.neutral, { solid: 12, solidHover: 11, text: 12 }),
    accent: {
      ...scale('accent', scales.accent),
      DEFAULT: { value: { base: '{colors.accent.9}', _dark: '{colors.accent.9}' } },
    },
    red: scale('red', scales.danger),
    success: {
      ...scale('success', scales.success),
      DEFAULT: { value: { base: '{colors.success.9}', _dark: '{colors.success.9}' } },
    },
    warning: scale('warning', scales.warning),
    info: scale('info', scales.info),
    secondary: mode(scales.secondary),
    categorical: Object.fromEntries(
      Object.entries(scales.categorical).map(([name, color]) => [name, mode(color)])
    ),
    wash: Object.fromEntries(
      Object.entries(scales.wash).map(([name, { bg, fg, label }]) => [
        name,
        { bg: mode(bg), fg: mode(fg), label: mode(label) },
      ])
    ),
  });
}
