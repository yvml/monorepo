// apps/web/src/theme/yvml.ts
import { neutral, type Theme } from '@hmidmismi/ui/theme';

/**
 * YVML's theme: the shared neutral palette for now, until the design direction is chosen. The `mono` role the design
 * system asks for uses the body face, because the site uses no monospace type.
 */
export const yvml = {
  ...neutral,
  name: 'yvml',
  faces: { ...neutral.faces, mono: { ...neutral.faces.body, cssVar: '--font-mono' } },
} as const satisfies Theme;
