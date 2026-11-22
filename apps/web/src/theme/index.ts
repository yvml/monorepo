// apps/web/src/theme/index.ts
import { toCss } from '@hmidmismi/ui/theme';
import { yvml } from './yvml';

export { yvml };

/** The CSS variables for the site's theme, which the design system's styles read. */
export const themeCss = toCss(yvml);
