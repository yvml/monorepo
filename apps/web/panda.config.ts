// apps/web/panda.config.ts
import { defineConfig } from '@pandacss/dev';
import { design } from '@hmidmismi/ui/design';
import { createPreset } from '@hmidmismi/ui/preset';
import { themeVariables } from '@hmidmismi/ui/theme';
import { yvml } from './src/theme/yvml';

/**
 * Panda config for the site. The design system supplies the preset and the components; this app builds the stylesheet
 * from its own theme, scanning its own source and the design system's, and writes it to `styled-system/`. Every recipe
 * variant is emitted, because components choose variants at runtime (a prop, not a literal Panda could see). The theme's
 * colors and font stacks become CSS variables, which the design system's tokens read.
 */
export default defineConfig({
  preflight: true,
  jsxFramework: 'react',
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda', createPreset(design, yvml)],
  include: ['./src/**/*.{ts,tsx}', '../../packages/ui/src/**/*.{ts,tsx}'],
  exclude: [],
  staticCss: { recipes: '*' },
  globalCss: { ':root': themeVariables(yvml) },
  outdir: 'styled-system',
});
