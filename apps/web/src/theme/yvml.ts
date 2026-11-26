// apps/web/src/theme/yvml.ts
import type { ColorScale, Theme, Wash } from '@hmidmismi/ui/theme';
import { allo, instrumentSerif } from './metrics';
import { hueRamp, mix, neutralRamp } from './ramps';

/** The surfaces of DESIGN.md: paper and ink in light mode, warm black and warm white in dark. */
const LIGHT = { canvas: '#ece8e1', text: '#1b1712' } as const;
const DARK = { canvas: '#17130f', text: '#f1ebe1' } as const;

/** A hue as a scale: its light-mode solid and the lighter solid it becomes in dark mode. */
const hue = (light: string, dark: string): ColorScale => ({
  light: hueRamp(light, LIGHT.canvas, LIGHT.text),
  dark: hueRamp(dark, DARK.canvas, DARK.text),
});

/** The materials, each with its text color in light and dark mode (DESIGN.md). The names are the material slugs. */
const MATERIALS = {
  ceramics: { light: '#b83a20', dark: '#ff8a5c' },
  'earth-building': { light: '#8a5a14', dark: '#e5a63a' },
  'fiber-arts': { light: '#b02a6b', dark: '#ff7fb8' },
  glass: { light: '#087283', dark: '#3fd6ea' },
  'landscape-ecology': { light: '#36701a', dark: '#8fe05a' },
  leatherwork: { light: '#8c3a1e', dark: '#e08a5a' },
  'metal-casting': { light: '#bf2f2a', dark: '#ff7a6e' },
  metalwork: { light: '#2f55c4', dark: '#8aa8ff' },
  printmaking: { light: '#6a3fc0', dark: '#b79bff' },
  'professional-development': { light: '#2b6b5a', dark: '#5fd9b5' },
  sculpture: { light: '#9a3a8e', dark: '#e88ad8' },
  'stone-carving': { light: '#5b6470', dark: '#a9b4c2' },
} as const;

/** A material's tint: the material color mixed into the page, 22% in light mode and 26% in dark, with the text and the label on it. */
const tint = ({ light, dark }: { light: string; dark: string }): Wash => ({
  bg: { light: mix(LIGHT.canvas, light, 0.22), dark: mix(DARK.canvas, dark, 0.26) },
  fg: { light: LIGHT.text, dark: DARK.text },
  label: { light, dark },
});

/**
 * YVML's theme (DESIGN.md): paper and ink, Instrument Serif for titles and Allo for everything else, a color for every
 * material, and the block colors of the home page. There is no monospace face, so the `mono` role uses Allo.
 */
export const yvml = {
  name: 'yvml',
  faces: {
    display: {
      family: 'Instrument Serif',
      generic: 'serif',
      metrics: instrumentSerif,
      files: [
        { file: 'instrument-serif-400-latin.woff2', weight: 400 },
        { file: 'instrument-serif-400-italic-latin.woff2', weight: 400, style: 'italic' },
      ],
    },
    body: {
      family: 'Allo',
      generic: 'sans-serif',
      metrics: allo,
      files: [{ file: 'AlloVariable.woff2', weight: '100 900' }],
    },
    mono: { family: 'Allo', generic: 'sans-serif', metrics: allo, cssVar: '--font-mono' },
  },
  scales: {
    neutral: { light: neutralRamp(LIGHT.canvas, LIGHT.text), dark: neutralRamp(DARK.canvas, DARK.text) },
    accent: hue('#2f55c4', '#8aa8ff'),
    danger: hue('#bf2f2a', '#ff7a6e'),
    success: hue('#36701a', '#8fe05a'),
    warning: hue('#8a5a14', '#e5a63a'),
    info: hue('#087283', '#3fd6ea'),
    secondary: { light: '#b83a20', dark: '#ff8a5c' },
    categorical: MATERIALS,
    wash: {
      ...Object.fromEntries(Object.entries(MATERIALS).map(([name, color]) => [name, tint(color)])),
      'lazy-eye': {
        bg: { light: '#0a24d6', dark: '#0a24d6' },
        fg: { light: '#ffe45c', dark: '#ffe45c' },
        label: { light: '#ffe45c', dark: '#ffe45c' },
      },
      teal: {
        bg: { light: '#00585f', dark: '#00585f' },
        fg: { light: '#ffd1c4', dark: '#ffd1c4' },
        label: { light: '#ffd1c4', dark: '#ffd1c4' },
      },
    },
  },
} as const satisfies Theme;
