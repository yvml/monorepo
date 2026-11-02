import { defineTokens } from '@pandacss/dev';
import type { Design } from '../../design';
import { withOverrides } from './overrides';

/** The font weights recipes name. The design may set them. */
export const fontWeightsFor = (d: Pick<Design, 'fontWeights'>) =>
  defineTokens.fontWeights(
    withOverrides(
      'fontWeights',
      {
        normal: { value: '400' },
        medium: { value: '500' },
        semibold: { value: '600' },
        bold: { value: '700' },
      },
      d.fontWeights
    )
  );

export const fontWeights = fontWeightsFor({});
