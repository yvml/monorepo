import { type RefObject, useEffect } from 'react';

/**
 * Publishes an element's height as a CSS variable on `<html>`, kept current as the element resizes, so sticky offsets
 * and scroll margins can use it (`--bh` for the header bar, `--jh` for the jump bar).
 *
 * @param ref - the element to measure.
 * @param name - the CSS variable, such as `--jh`.
 * @param subtract - px to take off the measured height, such as the part of the header that scrolls away.
 */
export function useMeasuredHeight(
  ref: RefObject<HTMLElement | null>,
  name: string,
  subtract: (element: HTMLElement) => number = () => 0
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const root = document.documentElement;
    const write = () =>
      root.style.setProperty(name, `${element.offsetHeight - subtract(element)}px`);
    write();
    const observer = new ResizeObserver(write);
    observer.observe(element);
    return () => {
      observer.disconnect();
      root.style.removeProperty(name);
    };
  }, [ref, name, subtract]);
}
