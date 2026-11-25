// apps/web/src/components/home-e1/timeline.ts

/**
 * The one scroll timeline of Home E.1. Time is measured in screens of scroll. Every scene is a full-screen card on a
 * single pinned stage; a scene slides up over the one before it during its `enter` window, and everything that happens
 * on it is chained to that moment: the photograph is in place, then the title, then the button, then the label.
 */

/** How long a card takes to slide up over the one before, in screens. */
export const ENTER = 0.5;
/** How long a card rests once it has settled, in screens: long enough for its title, button and label to arrive and then be read. */
export const HOLD = 0.9;
/** How long the Lazy Eye story takes, in screens. */
export const LAZY_EYE_STORY = 3;

/** The five palettes: shadow (the solid colour) and highlight (type, the photograph's light). */
export const PALETTES = {
  p1: { shadow: '#0a24d6', highlight: '#ffe45c' },
  p2: { shadow: '#a30f2d', highlight: '#ffb3c7' },
  p3: { shadow: '#00563a', highlight: '#d9ff66' },
  p4: { shadow: '#4a0fc2', highlight: '#ffc08a' },
  p5: { shadow: '#00585f', highlight: '#ffd1c4' },
} as const;
export type Palette = keyof typeof PALETTES;

export type SceneKind = 'hero' | 'photo' | 'band' | 'lazy-eye';

/** What a scene needs to be placed on the timeline. */
export type SceneSpec = {
  id: string;
  kind: SceneKind;
  palette: Palette;
  /** The label that waits for the scene to settle; empty for a scene without one. */
  label: string;
  /** How long the scene rests after it has settled, in screens. */
  hold?: number;
};

/** A scene with its place on the timeline. */
export type Placed<T extends SceneSpec> = T & {
  index: number;
  /** When the scene starts to slide in. */
  start: number;
  /** When it has settled. */
  settled: number;
  /** When the next scene starts to slide over it (the end of the timeline for the last one). */
  end: number;
};

/**
 * Places the scenes one after the other. The first scene is already there; the rest each start where the one before
 * ends.
 *
 * @param specs - the scenes in order.
 * @returns the scenes with their times, and the length of the whole timeline in screens.
 */
export function place<T extends SceneSpec>(specs: T[]) {
  let at = 0;
  const scenes = specs.map((spec, index): Placed<T> => {
    const enter = index === 0 ? 0 : ENTER;
    // The hero is simply there, so it takes no time; the story takes as long as it takes.
    const hold = spec.kind === 'hero' ? 0 : spec.kind === 'lazy-eye' ? LAZY_EYE_STORY + 0.3 : (spec.hold ?? HOLD);
    const start = at;
    const settled = start + enter;
    at = settled + hold;
    return { ...spec, index, start, settled, end: at };
  });
  return { scenes, length: at };
}

/** The windows, in screens after a scene has settled, in which its parts arrive one after the other. */
export const CHAIN = {
  /** The title starts a little before the card has settled, so it is arriving as the card lands. */
  title: [-0.15, 0.2],
  button: [0.1, 0.3],
  label: [0.25, 0.45],
} as const;

/** Linear interpolation clamped to 0..1. */
export const ramp = (from: number, to: number, x: number) => Math.min(1, Math.max(0, (x - from) / (to - from)));
/** Smooth interpolation clamped to 0..1. */
export const ease = (from: number, to: number, x: number) => {
  const k = ramp(from, to, x);
  return k * k * (3 - 2 * k);
};
