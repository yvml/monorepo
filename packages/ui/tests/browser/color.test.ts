import type { Browser } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { neutral, type Theme, toCss } from '../../src/theme';
import { hasChrome, hasStyles, launch, open } from './page';

const run = hasChrome && hasStyles ? describe : describe.skip;

/** WCAG contrast ratio of two sRGB colors. */
function contrast(a: number[], b: number[]) {
  const lum = ([r, g, bl]: number[]) => {
    const f = (v: number) => {
      const s = (v ?? 0) / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * f(r ?? 0) + 0.7152 * f(g ?? 0) + 0.0722 * f(bl ?? 0);
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return ((hi ?? 0) + 0.05) / ((lo ?? 0) + 0.05);
}

/** Resolves CSS color variables to sRGB through a canvas, so any color space (color-mix in oklab) reads the same. */
async function colors(browser: Browser, theme: Theme | null, dark: boolean) {
  const page = await open(
    browser,
    '<div id="x"></div>',
    theme ? toCss(theme) : '',
    dark ? 'dark' : ''
  );
  const out = await page.evaluate(() => {
    const el = document.getElementById('x') as HTMLElement;
    const ctx = document
      .createElement('canvas')
      .getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    const read = (name: string) => {
      el.style.color = `var(--colors-${name})`;
      const value = getComputedStyle(el).color;
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000';
      ctx.fillStyle = value;
      ctx.fillRect(0, 0, 1, 1);
      return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
    };
    return {
      canvas: read('canvas'),
      fg: read('fg-default'),
      muted: read('fg-muted'),
      accent: read('accent-9'),
      accentText: read('accent-11'),
    };
  });
  await page.close();
  return out;
}

run('colors in a browser', () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch();
  });
  afterAll(async () => {
    await browser?.close();
  });

  /** A second palette, to load in place of the built-in one. */
  const alternate: Theme = {
    ...neutral,
    name: 'alternate',
    palette: {
      ink: '#14171C',
      paper: '#ECEDE8',
      line: '#C4C8C0',
      accent: '#2C3E72',
      accentSoft: '#9AA7D4',
      danger: '#B4432F',
      dangerSoft: '#E3A596',
    },
  };

  const themes: [string, Theme | null][] = [
    ['the built-in theme', null],
    ['another theme loaded at runtime', alternate],
  ];

  for (const [name, theme] of themes) {
    for (const dark of [false, true]) {
      it(`keeps text readable with ${name}, ${dark ? 'dark' : 'light'}`, async () => {
        const c = await colors(browser, theme, dark);
        expect(contrast(c.fg, c.canvas), 'fg.default on canvas').toBeGreaterThanOrEqual(7);
        expect(contrast(c.muted, c.canvas), 'fg.muted on canvas').toBeGreaterThanOrEqual(4.5);
        expect(contrast(c.accentText, c.canvas), 'accent text on canvas').toBeGreaterThanOrEqual(
          4.5
        );
      });
    }
  }

  it('re-themes the canvas and text with no rebuild', async () => {
    const a = await colors(browser, null, false);
    const b = await colors(browser, alternate, false);
    expect(a.canvas).not.toEqual(b.canvas);
    expect(a.canvas).toEqual([0xf7, 0xf7, 0xf4]);
    expect(b.canvas).toEqual([0xec, 0xed, 0xe8]);
    expect(alternate.palette?.paper).toBe('#ECEDE8');
  });
});
