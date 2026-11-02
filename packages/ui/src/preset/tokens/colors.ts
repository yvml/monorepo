import { defineTokens } from '@pandacss/dev';
import { themeVars } from '../../theme/toCss';
import { black, white } from './black-white';

/**
 * The raw inputs of the palette, as references to the theme's CSS variables. Every other shade is a mix of these (see
 * `../colors/`), so changing a theme variable re-themes the whole system with no rebuild. `ink` and `paper` are the
 * text and canvas, `line` the rule color, `accent` the accent with `accentSoft` as its dark-mode solid, `danger` the
 * error hue, `success`, `warning` and `info` the status hues, `secondary` the second color.
 */
export const colors = defineTokens.colors({
  pigment: {
    ink: { value: `var(${themeVars.ink})` },
    paper: { value: `var(${themeVars.paper})` },
    line: { value: `var(${themeVars.line})` },
    accent: { value: `var(${themeVars.accent})` },
    accentSoft: { value: `var(${themeVars.accentSoft})` },
    danger: { value: `var(${themeVars.danger})` },
    dangerSoft: { value: `var(${themeVars.dangerSoft})` },
    success: { value: `var(${themeVars.success})` },
    successSoft: { value: `var(${themeVars.successSoft})` },
    warning: { value: `var(${themeVars.warning})` },
    warningSoft: { value: `var(${themeVars.warningSoft})` },
    info: { value: `var(${themeVars.info})` },
    infoSoft: { value: `var(${themeVars.infoSoft})` },
    secondary: { value: `var(${themeVars.secondary})` },
    secondarySoft: { value: `var(${themeVars.secondarySoft})` },
  },
  black,
  white,
});
