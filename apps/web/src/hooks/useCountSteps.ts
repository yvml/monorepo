// apps/web/src/hooks/useCountSteps.ts
import { type RefObject, useEffect, useState } from 'react';

const DURATION = 1600;

/**
 * Counts through a fixed list of values once the element scrolls into view, slowing toward the last one. With reduced
 * motion it shows the last value from the start.
 *
 * @param ref - the element to watch.
 * @param steps - the values to show, in order.
 * @param delay - how long to wait after the element is seen, in milliseconds, so a row of figures can go one after another.
 * @returns the value to show now, and whether the count has begun.
 */
export function useCountSteps(ref: RefObject<Element | null>, steps: number[], delay = 0) {
  const last = steps[steps.length - 1] ?? 0;
  const [value, setValue] = useState(last);
  const [started, setStarted] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    let timer = 0;
    setValue(steps[0] ?? last);
    setStarted(false);
    const run = () => {
      setStarted(true);
      const start = performance.now();
      const tick = (now: number) => {
        const k = Math.min(1, (now - start) / DURATION);
        const eased = 1 - (1 - k) ** 3;
        setValue(steps[Math.round(eased * (steps.length - 1))] ?? last);
        if (k < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        seen.disconnect();
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.6 }
    );
    seen.observe(node);
    return () => {
      seen.disconnect();
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [ref, steps, last, delay]);

  return [value, started] as const;
}
