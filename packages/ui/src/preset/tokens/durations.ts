import { defineTokens } from '@pandacss/dev';
import { type Design, design } from '../../design';

/**
 * The duration tokens for a design.
 *
 * @param d - the design (only its motion is read).
 * @returns the tokens.
 */
export const durationsFor = (d: Pick<Design, 'motion'>) =>
  defineTokens.durations(
    Object.fromEntries(Object.entries(d.motion.durations).map(([name, value]) => [name, { value }]))
  );

export const durations = durationsFor(design);
