import { defineSemanticTokens, defineTokens } from '@pandacss/dev';
import type { Design, ShadowValue } from '../../design';

/** Elevation: one ink shadow color (the `shadow` semantic color) at six distances. */
const DEFAULTS: Record<string, ShadowValue> = {
  xs: '0px 1px 2px {colors.shadow}',
  sm: '0px 2px 5px {colors.shadow}',
  md: '0px 5px 10px {colors.shadow}',
  lg: '0px 10px 20px {colors.shadow}',
  xl: '0px 20px 30px {colors.shadow}',
  '2xl': '0px 30px 50px {colors.shadow}',
};

/**
 * The shadows of a design: its own, or the defaults. A shadow with one value is a plain token; one with a value for
 * each mode is a semantic token.
 *
 * @param d - the design.
 * @returns the plain tokens and the per-mode tokens.
 */
export function shadowsFor(d: Pick<Design, 'shadows'>) {
  const all = d.shadows ?? DEFAULTS;
  const plain: Record<string, { value: string }> = {};
  const byMode: Record<string, { value: { _light: string; _dark: string } }> = {};
  for (const [name, shadow] of Object.entries(all)) {
    if (typeof shadow === 'string') plain[name] = { value: shadow };
    else byMode[name] = { value: { _light: shadow.light, _dark: shadow.dark } };
  }
  return {
    tokens: defineTokens.shadows(plain),
    semanticTokens: defineSemanticTokens.shadows(byMode),
  };
}

export const shadows = shadowsFor({}).tokens;
