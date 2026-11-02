import { defineRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

/**
 * A one-line status strip: green when `ok`, red when not. Its text sits on a grid line and the strip keeps its height.
 *
 * @param t - the type system.
 * @returns the recipe.
 */
export const statusBadge = (t: TypeSystem) =>
  defineRecipe({
    className: 'status-badge',
    staticCss: ['*'],
    base: {
      color: 'white',
      paddingInline: '2',
      ...t.textSize('body', 'md'),
      ...t.linePadded('body', 'md', { block: 'token(spacing.2)' }),
    },
    defaultVariants: { state: 'ok' },
    variants: {
      state: {
        ok: { background: 'success.9' },
        bad: { background: 'red.9' },
      },
    },
  });
