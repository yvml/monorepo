import { useEffect, useState } from 'react';

/**
 * Whether the element with this id has scrolled out of view above the top of the screen. It becomes `false` again when
 * the element comes back, and stays `false` while the element is below the screen or not on the page.
 *
 * @param id - the element's id, or `undefined` for none.
 * @returns `true` once the element is entirely above the viewport.
 */
export function useScrolledPast(id: string | undefined): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    if (!id) return;
    const element = document.getElementById(id);
    if (!element || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setPast(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [id]);

  return past;
}
