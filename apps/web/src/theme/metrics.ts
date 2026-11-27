// apps/web/src/theme/metrics.ts
import type { FaceMetrics } from '@hmidmismi/ui/theme';

/**
 * The vertical metrics of the two faces, read from the font files in `public/fonts/` with `@capsizecss/unpack`
 * (`fromBuffer`). Capsize's own list has neither face. They put each baseline on the grid.
 */
export const instrumentSerif: FaceMetrics = {
  ascent: 990,
  descent: -310,
  lineGap: 0,
  unitsPerEm: 1000,
  capHeight: 720,
  xHeight: 510,
};

export const allo: FaceMetrics = {
  ascent: 1984,
  descent: -494,
  lineGap: 0,
  unitsPerEm: 2048,
  capHeight: 1490,
  xHeight: 1118,
};
