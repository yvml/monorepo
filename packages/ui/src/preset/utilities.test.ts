import { describe, expect, it } from 'vitest';
import { TONE_STEPS, utilities } from './utilities';

describe('tone utilities', () => {
  it('step from 10 to 90 in tens', () => {
    expect([...TONE_STEPS]).toEqual(['10', '20', '30', '40', '50', '60', '70', '80', '90']);
  });

  it('mix the tone into the canvas for a fill and into the border for an edge', () => {
    const { toneFill, toneEdge } = utilities.extend as unknown as Record<
      string,
      { transform: (value: string, args: unknown) => Record<string, string> }
    >;
    expect(toneFill?.transform('20', {})).toEqual({
      background: 'color-mix(in srgb, var(--tone) 20%, var(--colors-canvas))',
    });
    expect(toneEdge?.transform('40', {})).toEqual({
      borderColor: 'color-mix(in srgb, var(--tone) 40%, var(--colors-border))',
    });
  });
});
