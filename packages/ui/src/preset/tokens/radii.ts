import { defineTokens } from '@pandacss/dev';
import type { Design } from '../../design';
import { withOverrides } from './overrides';

/**
 * Corner radii: `xs` to `xl`, and `l1` to `l3`, the names Park UI recipes use. The design may set the five lengths.
 */
export const radiiFor = (d: Pick<Design, 'radii'>) =>
  defineTokens.radii({
    none: { value: '0' },
    ...withOverrides(
      'radii',
      {
        xs: { value: '1px' },
        sm: { value: '2px' },
        md: { value: '3px' },
        lg: { value: '5px' },
        xl: { value: '8px' },
      },
      d.radii
    ),
    full: { value: '9999px' },
    l1: { value: '{radii.xs}' },
    l2: { value: '{radii.sm}' },
    l3: { value: '{radii.md}' },
  });

export const radii = radiiFor({});
