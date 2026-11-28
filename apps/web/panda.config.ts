// apps/web/panda.config.ts
import { defineConfig } from '@pandacss/dev';
import { design as defaultDesign } from '@hmidmismi/ui/design';
import { createPreset } from '@hmidmismi/ui/preset';
import { fontFaces } from '@hmidmismi/ui/theme';
import { yvml } from './src/theme/yvml';

/** The grid mode: the design system's default (`scaled`), or `GRID_MODE=baseline|scaled|free` to build the site in another to compare. */
const mode = (process.env.GRID_MODE ?? defaultDesign.grid.mode) as typeof defaultDesign.grid.mode;
const design = { ...defaultDesign, grid: { ...defaultDesign.grid, mode } };

/**
 * Panda config for the site. The design system supplies the preset and the components; this app builds the stylesheet
 * from its own theme, scanning its own source and the design system's, and writes it to `styled-system/`. Every recipe
 * variant is emitted, because components choose variants at runtime (a prop, not a literal Panda could see). The theme's
 * colors and font stacks become CSS variables, which the design system's tokens read.
 */
export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', createPreset(design, yvml, { modules: ['forms'] })],
  include: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  exclude: [],
  staticCss: { recipes: '*' },
  globalFontface: fontFaces(yvml, (file) => `/fonts/${file}`),
  outdir: 'styled-system',
});
