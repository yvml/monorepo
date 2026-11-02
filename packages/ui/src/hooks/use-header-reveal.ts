import { useEffect } from 'react';

/** Scroll distance in px that counts as a deliberate direction change, so a jittery trackpad does not flicker the row. */
const THRESHOLD = 8;

/**
 * Shows the utility row again when the reader scrolls up and hides it when they scroll down, as nytimes.com does with its
 * masthead. It sets `data-utility="shown"` on `<html>` while the row is revealed; the header and the sticky bars under it
 * read that through `--ut` and slide together. The row is always shown within its own height of the top, where it sits in
 * the page flow, and while focus is inside the header.
 *
 * @param ref - the header element.
 * @param measure - reads the utility row's height in px from the header.
 */
export function useHeaderReveal(
  ref: { current: HTMLElement | null },
  measure: (element: HTMLElement) => number
): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const root = document.documentElement;
    let last = window.scrollY;
    let frame = 0;

    const show = (shown: boolean) => {
      if (shown) root.setAttribute('data-utility', 'shown');
      else root.removeAttribute('data-utility');
    };
    const update = () => {
      frame = 0;
      const height = measure(element);
      const y = Math.max(0, window.scrollY);
      const delta = y - last;
      if (y <= height || element.contains(document.activeElement)) {
        show(false);
        last = y;
      } else if (Math.abs(delta) >= THRESHOLD) {
        show(delta < 0);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
      show(false);
    };
  }, [ref, measure]);
}
