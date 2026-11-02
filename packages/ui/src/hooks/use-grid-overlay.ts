import { useEffect } from 'react';

/** The overlay states a press of the key cycles through: none, baselines, then baselines and spacing. */
const STATES = [[], ['data-baseline-grid'], ['data-baseline-grid', 'data-spacing-grid']] as const;

/** Whether the key press is meant for a text field. */
const typing = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));

/**
 * Lets a developer turn the graph-paper overlay on over the real page: press `Shift+G` to cycle none, red baseline lines,
 * then red lines with blue spacing lines (see `gridOverlay` in `grid/overlay.ts`). Do nothing in production by passing
 * `enabled` from the build mode.
 *
 * @param enabled - whether the shortcut is active.
 */
export function useGridOverlay(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;
    let state = 0;
    const onKey = (event: KeyboardEvent) => {
      if (
        !event.shiftKey ||
        event.key !== 'G' ||
        event.ctrlKey ||
        event.metaKey ||
        typing(event.target)
      )
        return;
      state = (state + 1) % STATES.length;
      const html = document.documentElement;
      for (const attribute of STATES[2]) html.removeAttribute(attribute);
      for (const attribute of STATES[state] ?? []) html.setAttribute(attribute, '');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}
