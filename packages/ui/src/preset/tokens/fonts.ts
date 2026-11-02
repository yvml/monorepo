import { defineTokens } from '@pandacss/dev';
import { themeVars } from '../../theme/toCss';

/**
 * Font families. Each reads the theme's variable (`--ui-font-*`), which holds the app's loaded file if it set one, then
 * the family name and a generic. `sans` and `serif` alias `body` and `display` so Panda utilities such as
 * `fontFamily: 'serif'` use the theme's faces.
 */
const DISPLAY = `var(${themeVars.display})`;
const BODY = `var(${themeVars.body})`;
const MONO = `var(${themeVars.mono})`;

export const fonts = defineTokens.fonts({
  display: { value: DISPLAY },
  body: { value: BODY },
  mono: { value: MONO },
  serif: { value: DISPLAY },
  sans: { value: BODY },
});
