// apps/web/src/components/home-e1/TimelineContext.ts
import type { MotionValue } from 'motion/react';
import { createContext, useContext } from 'react';

/** What every part of Home E.1 reads: where the scroll is on the timeline, and a way to say a scene's photographs are in. */
export type Timeline = {
  /** The scroll position in screens, from 0 to the length of the timeline. */
  t: MotionValue<number>;
  /** Called when a scene's photographs are ready, so the label can come in. */
  markReady: (index: number) => void;
};

export const TimelineContext = createContext<Timeline | null>(null);

/** The timeline of the page this is inside. */
export function useTimeline() {
  const timeline = useContext(TimelineContext);
  if (!timeline) throw new Error('useTimeline is used outside Home E.1');
  return timeline;
}
