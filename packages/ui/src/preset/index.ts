import {
  definePreset,
  type RecipeConfig,
  type SlotRecipeConfig,
  type SystemStyleObject,
} from '@pandacss/dev';
import { type Design, design as defaultDesign } from '../design';
import { neutral, type Theme, themeVariables } from '../theme';
import { animationStyles } from './animation-styles';
import { colorTokensFor } from './colors';
import { conditions } from './conditions';
import { globalCss } from './global-css';
import { keyframes } from './keyframes';
import { layerStyles } from './layer-styles';
import { createRecipes } from './recipes';
import { spacingFor } from '../grid';
import { textStylesFor } from './text-styles';
import {
  animations,
  borderWidths,
  colors,
  durationsFor,
  easings,
  fonts,
  fontWeightsFor,
  letterSpacingsFor,
  radiiFor,
  shadowsFor,
  sizesFor,
  zIndex,
} from './tokens';
import { createTypeSystem, type TypeSystem } from './type-scale';
import { utilities } from './utilities';

/** The widths where layouts change: Panda's own, unless the design sets them. */
const breakpointsFor = (d: Pick<Design, 'breakpoints'>) => ({
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
  xl: '80rem',
  '2xl': '96rem',
  ...d.breakpoints,
});

/** What a project may bring of its own, in place of the system's. */
export type PresetOptions = {
  /**
   * Recipes of the project's own, built from the design's type system. One named like a recipe of the system replaces
   * it; the others are added. This is the place for a look the tokens cannot express.
   */
  recipes?: (type: TypeSystem) => {
    recipes?: Record<string, RecipeConfig>;
    slotRecipes?: Record<string, SlotRecipeConfig>;
  };
  /** The global styles to use instead of the system's own. The theme's variables on `:root` are always added. */
  globalCss?: Record<string, SystemStyleObject>;
};

/**
 * Builds the design system's Panda preset: tokens, palettes, type scale, recipes and global styles. It sits on top of
 * Panda's base and default presets and replaces their scales (spacing, sizes, font sizes, line heights, colors)
 * outright, so the only values in the system are the ones defined here.
 *
 * - `design` is the structure (grid, type scale, motion). It is computed into the tokens and into the text roles inside
 *   recipes, so it is fixed per build.
 * - `theme` is the look (palette, faces and their metrics). It is emitted as CSS variables on `:root`, and tokens and
 *   text roles only reference the variables, so a theme can be swapped at runtime with a stylesheet of its own (see
 *   `toCss`). Trim and x-height matching follow the swapped faces.
 *
 * @param design - the structure. Defaults to the default design.
 * @param theme - the look. Defaults to the neutral theme.
 * @param options - recipes or global styles of the project's own, which replace the system's (Panda would merge a
 * second preset's recipes of the same name into these, so a project that restyles a recipe passes it here).
 * @returns the preset.
 */
export function createPreset(
  design: Design = defaultDesign,
  theme: Theme = neutral,
  options: PresetOptions = {}
) {
  const type = createTypeSystem(design, theme.faces);
  const colorTokens = colorTokensFor(theme) as Record<string, Record<string, unknown>>;
  const system = createRecipes(type, {
    hues: Object.keys(colorTokens.categorical ?? {}),
    tones: Object.keys(colorTokens.wash ?? {}),
  });
  const own = options.recipes?.(type);
  const recipes = { ...system.recipes, ...own?.recipes };
  const slotRecipes = { ...system.slotRecipes, ...own?.slotRecipes };
  return definePreset({
    name: '@hmidmismi/ui',
    conditions,
    utilities,
    globalCss: {
      extend: {
        ...(options.globalCss ?? globalCss.extend),
        // Text with no style of its own is the body step, so it is on the type scale and its baseline is measured like any other.
        body: {
          ...((options.globalCss ?? globalCss.extend).body as SystemStyleObject),
          ...type.textSize('body', 'md'),
        } as SystemStyleObject,
        ':root': themeVariables(theme) as SystemStyleObject,
      },
    },
    theme: {
      // Outside `extend`: these replace the default preset's scales instead of adding to them.
      tokens: {
        borderWidths,
        colors,
        fontSizes: type.fontSizeTokens,
        fontWeights: fontWeightsFor(design),
        fonts,
        letterSpacings: letterSpacingsFor(design),
        lineHeights: type.lineHeightTokens,
        radii: radiiFor(design),
        sizes: sizesFor(design),
        spacing: spacingFor(design),
      },
      semanticTokens: { colors: colorTokensFor(theme), shadows: shadowsFor(design).semanticTokens },
      extend: {
        breakpoints: breakpointsFor(design),
        tokens: {
          animations,
          durations: durationsFor(design),
          easings,
          shadows: shadowsFor(design).tokens,
          zIndex,
        },
        keyframes,
        textStyles: textStylesFor(type.scaleTextStyles),
        layerStyles,
        animationStyles,
        recipes,
        slotRecipes,
      },
    },
  });
}

export { type ExplicitScale, explicitScale, mix, ref } from './colors/scale';
export * from './fragments';
export * from './interaction';
export { createRecipes } from './recipes';
export { input } from './recipes/input';
export { createTypeSystem, responsive, STEPS, type StepName, type TypeSystem } from './type-scale';
export { TONE_STEPS, type ToneStep } from './utilities';

/** The preset for the default design and the neutral theme. */
export const preset = createPreset();
