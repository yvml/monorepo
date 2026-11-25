// apps/web/src/hooks/useHeadroom.ts
import { type RefObject, useEffect } from 'react';

/** How far the visitor must scroll up before the bar comes back, and down before it goes, in px. Small movements and the jitter of a trackpad's glide change nothing. */
const SHOW_AFTER = 18;
const HIDE_AFTER = 36;

/**
 * A bar that leaves as you scroll down and comes back as you scroll up (the Headroom pattern). It sets `data-state` on the
 * bar: `top` (or `hidden`) while the page is near the top, then `unpinned` while scrolling down and `pinned` while
 * scrolling up. The styles do the moving. The direction is judged over a distance, not a single scroll event, so a
 * trackpad's inertia cannot make the bar flicker.
 *
 * A bar that sits under a notice at the top of the page follows the notice's bottom edge until it has scrolled away.
 *
 * @param ref - the bar.
 * @param options - `threshold`: how far down the page counts as the top, in px or as a function of the window's height; `atTop`: the state at the top, `top` (the bar shows) or `hidden` (it waits).
 */
export function useHeadroom(
  ref: RefObject<HTMLElement | null>,
  { threshold = 80, atTop = 'top' }: { threshold?: number | (() => number); atTop?: 'top' | 'hidden' } = {}
) {
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let last = scrollY;
    let run = 0; // the distance scrolled in the current direction; a reversal starts it again
    let state: 'top' | 'hidden' | 'pinned' | 'unpinned' = atTop;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const y = scrollY;
      const limit = typeof threshold === 'function' ? threshold() : threshold;
      const delta = y - last;
      last = y;
      if (delta !== 0) run = Math.sign(delta) === Math.sign(run) ? run + delta : delta;
      let next = state;
      if (y <= limit) {
        next = atTop;
        run = 0;
      } else if (run >= HIDE_AFTER) next = 'unpinned';
      else if (run <= -SHOW_AFTER) next = 'pinned';
      else if (state === 'top' || state === 'hidden') next = 'unpinned';
      if (next !== state) {
        state = next;
        bar.dataset.state = next;
      }
      const notice = document.querySelector('[data-notice]');
      bar.style.top = atTop === 'top' && notice ? `${Math.max(0, notice.getBoundingClientRect().bottom)}px` : '0px';
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    bar.dataset.state = atTop;
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    apply();
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      observer.disconnect();
    };
  }, [ref, threshold, atTop]);
}
