import { defineSemanticTokens } from '@pandacss/dev';
import type { Theme } from '../../theme';
import { categorical, wash } from './defaults';
import { colorTokensFromScales } from './from-scales';
import { neutralScale, ref, tonalScale, variants } from './scale';

const onSolid = { base: ref('pigment.paper'), _dark: ref('pigment.ink') };

/** The neutral palette: canvas, borders and text. `colorPalette: gray` is the page default. */
const gray = defineSemanticTokens.colors({
  ...neutralScale(),
  ...variants({
    name: 'gray',
    solid: 12,
    solidHover: 11,
    solidFg: { base: ref('pigment.paper'), _dark: ref('pigment.ink') },
    text: 12,
  }),
});

/** The accent palette: the theme's accent, with its soft tint as the dark-mode solid. */
const accent = defineSemanticTokens.colors({
  ...tonalScale('pigment.accent', 'pigment.accentSoft'),
  DEFAULT: { value: { base: '{colors.accent.9}', _dark: '{colors.accent.9}' } },
  ...variants({ name: 'accent', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** The error palette. */
const red = defineSemanticTokens.colors({
  ...tonalScale('pigment.danger', 'pigment.dangerSoft'),
  ...variants({ name: 'red', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** The success palette. */
const success = defineSemanticTokens.colors({
  ...tonalScale('pigment.success', 'pigment.successSoft'),
  DEFAULT: { value: { base: '{colors.success.9}', _dark: '{colors.success.9}' } },
  ...variants({ name: 'success', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** The warning palette. */
const warning = defineSemanticTokens.colors({
  ...tonalScale('pigment.warning', 'pigment.warningSoft'),
  ...variants({ name: 'warning', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** The info palette. */
const info = defineSemanticTokens.colors({
  ...tonalScale('pigment.info', 'pigment.infoSoft'),
  ...variants({ name: 'info', solid: 9, solidHover: 10, solidFg: onSolid, text: 11 }),
});

/** Semantic colors, plus the palettes. `brand` is the accent. */
export const semanticColors = defineSemanticTokens.colors({
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
  gray,
  accent,
  brand: accent,
  red,
  success,
  warning,
  info,
  secondary: { value: { base: ref('pigment.secondary'), _dark: ref('pigment.secondarySoft') } },
  categorical,
  wash,
});

/** The color roles components read, and for the grouped ones the keys inside. A theme's own `colors` must have them all. */
const REQUIRED = {
  canvas: [],
  fg: ['default', 'muted', 'subtle', 'disabled'],
  border: ['DEFAULT', 'muted', 'emphasized'],
  error: [],
  shadow: [],
  gray: [],
  accent: [],
  red: [],
  success: [],
  warning: [],
  info: [],
  secondary: [],
  categorical: [],
  wash: [],
} as const;

/**
 * The semantic colors for a theme: its own `colors` when it has them, otherwise the scales generated from its palette.
 *
 * @param theme - the theme.
 * @returns the semantic color tokens.
 * @throws when the theme has neither, or its `colors` lack a role the components read.
 */
export function colorTokensFor(theme: Theme): typeof semanticColors {
  if (theme.scales) return colorTokensFromScales(theme.scales) as unknown as typeof semanticColors;
  if (!theme.colors) {
    if (!theme.palette) throw new Error(`Theme "${theme.name}" needs a palette or colors.`);
    return semanticColors;
  }
  const colors = theme.colors as Record<string, unknown>;
  const missing: string[] = [];
  for (const [role, keys] of Object.entries(REQUIRED)) {
    const value = colors[role] as Record<string, unknown> | undefined;
    if (value === undefined) missing.push(role);
    else for (const key of keys) if (value[key] === undefined) missing.push(`${role}.${key}`);
  }
  if (missing.length > 0) {
    throw new Error(`Theme "${theme.name}" colors are missing: ${missing.join(', ')}.`);
  }
  return colors as unknown as typeof semanticColors;
}
