import { type RefObject, useEffect } from 'react';

/**
 * Says which edges of a sideways-scrolling row have more content beyond them, as `data-edges` on the element: `start`,
 * `end`, both (`start end`) or no attribute. The row's style (`scrollRow`) fades those edges, so a cut-off item reads as
 * "more this way" instead of as a mistake. It follows the scroll, the row's own size and the window's.
 *
 * @param ref - the scrolling element.
 */
export function useScrollEdges(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const last = element.scrollWidth - element.clientWidth;
      const edges = [
        element.scrollLeft > 1 ? 'start' : '',
        element.scrollLeft < last - 1 ? 'end' : '',
      ]
        .filter(Boolean)
        .join(' ');
      if (edges) element.dataset.edges = edges;
      else delete element.dataset.edges;
    };
    update();
    element.addEventListener('scroll', update, { passive: true });
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(element);
    for (const child of Array.from(element.children)) observer?.observe(child);
    window.addEventListener('resize', update);
    return () => {
      element.removeEventListener('scroll', update);
      observer?.disconnect();
      window.removeEventListener('resize', update);
      delete element.dataset.edges;
    };
  }, [ref]);
}
