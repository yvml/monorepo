/**
 * The graph-paper overlay, for checking by eye that blocks sit on the grid. Set `data-baseline-grid` on `<html>` for
 * horizontal red lines, one per baseline, and `data-spacing-grid` for vertical blue lines at the same pitch; with both on
 * the page is graph paper in squares of one baseline. Both are anchored to the top of the page and scroll with it, and both
 * read the spacing tokens, so they follow whatever grid the design declares.
 */
const line = (direction: 'bottom' | 'right', color: string) =>
  `repeating-linear-gradient(to ${direction}, color-mix(in srgb, ${color} 38%, transparent) 0 token(borderWidths.hairline), transparent token(borderWidths.hairline) token(spacing.1))`;

const layer = (zIndex: string, backgroundImage: string) => ({
  content: '""',
  position: 'absolute',
  inset: '0',
  pointerEvents: 'none',
  zIndex,
  backgroundImage,
});

/** The overlay as global CSS rules for Panda. */
export const gridOverlay = {
  'html[data-baseline-grid], html[data-spacing-grid]': { position: 'relative' },
  'html[data-baseline-grid]::after': layer('9999', line('bottom', 'red')),
  'html[data-spacing-grid]::before': layer('9998', line('right', 'blue')),
} as const;
