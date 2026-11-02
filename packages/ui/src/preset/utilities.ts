import type { Config } from '@pandacss/dev';

/** The steps of the tone ladder, in percent of the tone mixed in. */
export const TONE_STEPS = ['10', '20', '30', '40', '50', '60', '70', '80', '90'] as const;

/** One step of the tone ladder. */
export type ToneStep = (typeof TONE_STEPS)[number];

const steps = Object.fromEntries(TONE_STEPS.map((step) => [step, step]));

/**
 * The tint of a color that a part of the page takes from its parent: a card, a tile or a section sets `--tone` to a
 * color, and its children ask for a step of the ladder instead of writing the mix out. `toneFill` mixes the tone into
 * the canvas for a background; `toneEdge` mixes it into the border color for an edge.
 */
export const utilities: NonNullable<Config['utilities']> = {
  extend: {
    toneFill: {
      className: 'tone-fill',
      values: steps,
      transform: (value: string) => ({
        background: `color-mix(in srgb, var(--tone) ${value}%, var(--colors-canvas))`,
      }),
    },
    toneEdge: {
      className: 'tone-edge',
      values: steps,
      transform: (value: string) => ({
        borderColor: `color-mix(in srgb, var(--tone) ${value}%, var(--colors-border))`,
      }),
    },
  },
};
