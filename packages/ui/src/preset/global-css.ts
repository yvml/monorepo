import { gridOverlay } from '../grid';

/**
 * Base styles for every app: global color variables, the canvas background and body text role, the focus ring, an
 * the grid overlay, and print and reduced-motion rules. Add the `dark` class to `<html>` for dark mode.
 * Element looks such as headings live in recipes, not here.
 *
 * The graph-paper overlay (`data-baseline-grid`, `data-spacing-grid` on `<html>`) is `gridOverlay` in `../grid/overlay.ts`.
 */
export const globalCss = {
  extend: {
    '*': {
      '--global-color-border': 'colors.border',
      '--global-color-placeholder': 'colors.fg.subtle',
      '--global-color-selection': 'colors.colorPalette.subtle.bg',
      '--global-color-focus-ring': 'colors.colorPalette.solid.bg',
    },
    html: {
      colorPalette: 'gray',
      colorScheme: 'light',
      fontFamily: 'body',
      fontSize: '100%',
      scrollBehavior: 'smooth',
      textSizeAdjust: '100%',
    },
    'html.dark': {
      colorScheme: 'dark',
    },
    // The header sets this while the reader scrolls up; sticky bars under it add it to their offset.
    'html[data-utility="shown"]': {
      '--ut': 'calc({sizes.utility} - {borderWidths.hairline})',
    },
    body: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100dvh',
      background: 'canvas',
      color: 'fg.default',
      fontFamily: 'body',
      fontSize: '1rem',
      lineHeight: '1.5',
      textRendering: 'optimizeLegibility',
    },
    main: {
      flex: '1 0 auto',
    },
    // Inline code is in another face, whose metrics would make its line taller than the lines around it and push everything below off
    // the baseline grid. A zero line height keeps the line box the paragraph's own.
    ':not(pre) > code': { lineHeight: '0' },
    ':focus-visible': {
      outline: '2px solid',
      outlineColor: 'accent.9',
      outlineOffset: '2px',
    },
    ...gridOverlay,
    '@media print': {
      '[data-no-print]': { display: 'none !important' },
      body: { background: 'white', color: 'black' },
      a: { color: 'inherit', textDecoration: 'underline' },
    },
    '@media (prefers-reduced-motion: reduce)': {
      html: { scrollBehavior: 'auto' },
      '*, *::before, *::after': {
        animationDuration: '0.01ms !important',
        animationIterationCount: '1 !important',
        transitionDuration: '0.01ms !important',
      },
    },
  },
};
