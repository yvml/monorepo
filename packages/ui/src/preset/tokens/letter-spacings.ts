import { defineTokens } from '@pandacss/dev';
import type { Design } from '../../design';
import { withOverrides } from './overrides';

/** Tracking for the roles that need it. Components use these names, never raw `em` values. The design may set them. */
export const letterSpacingsFor = (d: Pick<Design, 'letterSpacings'>) =>
  defineTokens.letterSpacings(
    withOverrides(
      'letterSpacings',
      {
        display: { value: '-0.02em' },
        normal: { value: '0em' },
        wide: { value: '0.04em' },
        caps: { value: '0.14em' },
        numeral: { value: '0.08em' },
        name: { value: '0.02em' },
        title: { value: '0.08em' },
        card: { value: '-0.01em' },
        tagline: { value: '-0.005em' },
        wordmark: { value: '0.14em' },
      },
      d.letterSpacings
    )
  );

export const letterSpacings = letterSpacingsFor({});
