import { useEffect, useState } from 'react';

/** Extra space below the sticky header and jump bar before a section counts as reached, in px (Rev 19 §5.5). */
const REACH = 24;

/** The CSS variables whose heights are added up for the line a section must pass: the header bar and the jump bar. */
const JUMP_OFFSETS: readonly string[] = ['--bh', '--jh'];

/**
 * Tracks which of the given sections the reader is in, for a jump bar. The current section is the last one whose top is
 * at or above the header height plus the jump bar height plus 24px; the first one when none is, and the last one at the
 * bottom of the page. The heights come from `--bh` and `--jh`, which the header and the jump bar publish. A section that is
 * not shown (display none) does not count, and when only one is shown it is the active one, so a phone that shows one
 * section at a time follows the one it shows.
 *
 * @param ids - the section element ids, in page order.
 * @param offsets - the CSS variables, published by sticky bars, whose heights sit above the sections. Defaults to the
 * header bar and the jump bar.
 * @returns the active section id.
 */
export function useActiveSection(
  ids: string[],
  offsets: readonly string[] = JUMP_OFFSETS
): string | null {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');
  const offsetKey = offsets.join('|');

  useEffect(() => {
    const sections = key.split('|');
    let frame = 0;
    const measure = () => {
      frame = 0;
      const styles = getComputedStyle(document.documentElement);
      const line =
        offsetKey
          .split('|')
          .reduce((sum, name) => sum + (Number.parseFloat(styles.getPropertyValue(name)) || 0), 0) +
        REACH;
      const shown = sections.filter((id) => document.getElementById(id)?.offsetParent != null);
      if (shown.length === 1) {
        setActive(shown[0] ?? null);
        return;
      }
      const visible = shown.length === 0 ? sections : shown;
      let current = visible[0] ?? null;
      for (const id of visible) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? (visible[visible.length - 1] ?? current) : current);
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [key, offsetKey]);

  return active;
}
