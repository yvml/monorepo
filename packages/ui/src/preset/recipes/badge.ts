import { defineRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

/**
 * The badge: a fixed height of five baselines with its text on a grid line.
 *
 * @param t - the type system.
 * @returns the recipe.
 */
export const badge = (t: TypeSystem) =>
  defineRecipe({
    className: 'badge',
    base: {
      alignItems: 'center',
      borderRadius: 'l1',
      display: 'inline-flex',
      fontWeight: 'medium',
      gap: '1',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      px: '2',
      h: '5',
      textStyle: 'xs',
      ...t.lineCentered('body', 'xs', { height: 'token(sizes.5)', items: true }),
    },
    defaultVariants: { variant: 'subtle' },
    variants: {
      variant: {
        solid: { bg: 'colorPalette.solid.bg', color: 'colorPalette.solid.fg' },
        subtle: { bg: 'colorPalette.subtle.bg', color: 'colorPalette.subtle.fg' },
        outline: {
          borderWidth: 'hairline',
          borderColor: 'colorPalette.outline.border',
          color: 'colorPalette.outline.fg',
        },
      },
    },
  });
