import { defineConfig } from '@pandacss/dev';
import { design } from './src/design';
import { createPreset } from './src/preset';
import { neutral } from './src/theme';

/**
 * Panda config for `@hmidmismi/ui`, the only place Panda runs. The preset is built from the default design and the
 * neutral theme; this file adds the source files to scan. `staticCss` emits every recipe variant, because components are used by apps that Panda never scans.
 * The generated `styled-system/styles.css` is what apps import.
 */
export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', createPreset(design, neutral)],
  include: ['./src/**/*.{ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  staticCss: { recipes: '*' },
});
