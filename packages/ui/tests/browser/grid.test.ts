import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import inter from '@capsizecss/metrics/inter';
import { chromium } from 'playwright-core';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  centeredLine,
  type Line,
  lineMargins,
  lineShift,
  measureLine,
  paddedLine,
  type Style,
  trim,
  type Units,
} from '../../src/grid';

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const run = existsSync(CHROME) ? describe : describe.skip;

/** A five pixel grid, the line height of each size a whole number of rows, and a bundled font so the result never depends on what the machine has. */
const GRID = 5;
/** How far a glyph baseline may sit from its line: engines round ascent and descent differently (see `grid/README.md`). Box heights stay exact. */
const TOLERANCE = 1;
const SIZES = [11.11, 13.33, 16, 19.2, 23.04, 27.65, 33.18, 39.81, 47.78, 57.34];
const font = readFileSync(
  resolve(import.meta.dirname, '../fixtures/inter-latin-400.woff2')
).toString('base64');
const face = {
  ascent: inter.ascent / inter.unitsPerEm,
  descent: Math.abs(inter.descent) / inter.unitsPerEm,
  capHeight: inter.capHeight / inter.unitsPerEm,
};
const units: Units = { row: GRID, length: (px) => `${px}px` };
const lineOf = (size: number) => Math.ceil((size * 1.4) / GRID) * GRID;
const lineFor = (size: number): Line => measureLine(size, lineOf(size), face);

/** Turns a style object into CSS rules for a selector. */
function css(selector: string, style: Style): string {
  let own = '';
  let nested = '';
  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'object' && value !== null)
      nested += css(key.replace('&', selector), value as Style);
    else own += `${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}:${value};`;
  }
  return `${own ? `${selector}{${own}}` : ''}${nested}`;
}

run('baseline grid with a bundled font', () => {
  let browser: Awaited<ReturnType<typeof chromium.launch>>;
  beforeAll(async () => {
    browser = await chromium.launch({ executablePath: CHROME, headless: true });
  });
  afterAll(async () => {
    await browser?.close();
  });

  /** Renders one block per size with a style, stacked with a row-sized gap, and reads where each baseline falls. */
  async function measure(build: (line: Line) => Style) {
    const page = await browser.newPage({ viewport: { width: 800, height: 800 } });
    const rows = SIZES.map(
      (size, i) =>
        `<div class="t${i}" style="font-size:${size}px;line-height:${lineOf(size)}px"><span><b id="p${i}" style="display:inline-block;width:0;height:0"></b>Hamburgefonstiv</span></div>`
    ).join('<div style="height:20px"></div>');
    // A flex column, so no margin collapses with a neighbor's.
    await page.setContent(`<!doctype html><style>
      @font-face{font-family:T;src:url(data:font/woff2;base64,${font}) format("woff2")}
      body{margin:0;font-family:T}.stack{display:flex;flex-direction:column}${SIZES.map((size, i) => css(`.t${i}`, build(lineFor(size)))).join('')}</style><body><div class="stack">${rows}</div></body>`);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => document.fonts.load('16px T'));
    const out = await page.evaluate(
      (n) =>
        Array.from({ length: n }, (_, i) => {
          const probe = document.getElementById(`p${i}`) as HTMLElement;
          const block = (probe.parentElement as HTMLElement).parentElement as HTMLElement;
          return {
            baseline: probe.getBoundingClientRect().bottom + scrollY,
            top: block.getBoundingClientRect().top + scrollY,
            height: block.getBoundingClientRect().height,
          };
        }),
      SIZES.length
    );
    await page.close();
    return out;
  }

  const offGrid = (y: number) => {
    const rest = ((y % GRID) + GRID) % GRID;
    return Math.min(rest, GRID - rest);
  };

  it('puts the first baseline on a grid line at every size, with the box unchanged', async () => {
    const rows = await measure((line) => lineShift(line, units));
    for (const [i, row] of rows.entries()) {
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThanOrEqual(TOLERANCE);
      expect(row.height, `${SIZES[i]}px`).toBeCloseTo(lineOf(SIZES[i] as number), 1);
    }
  });

  it('does the same with margins, for flex items and text that clips', async () => {
    const rows = await measure((line) => lineMargins(line, units));
    for (const [i, row] of rows.entries())
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThanOrEqual(TOLERANCE);
  });

  it('trims to the capitals and rounds up to whole rows, with the baseline at the bottom edge', async () => {
    const rows = await measure((line) => trim(line, units, true));
    for (const [i, row] of rows.entries()) {
      expect(offGrid(row.height), `${SIZES[i]}px height`).toBeLessThan(0.1);
      expect(
        Math.abs(row.baseline - (row.top + row.height)),
        `${SIZES[i]}px baseline`
      ).toBeLessThanOrEqual(TOLERANCE);
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it('puts the baseline of centered text in a fixed-height box on a grid line, with the box unchanged', async () => {
    const height = 24 * GRID;
    const rows = await measure((line) => ({
      display: 'flex',
      alignItems: 'center',
      height: `${height}px`,
      boxSizing: 'border-box',
      ...centeredLine(line, units, { height: `${height}px` }),
    }));
    for (const [i, row] of rows.entries()) {
      expect(row.height, `${SIZES[i]}px height`).toBeCloseTo(height, 1);
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThanOrEqual(TOLERANCE);
    }
  });

  it('puts the baseline on a grid line in a box whose height is its padding, with the box unchanged', async () => {
    const pad = 2 * GRID;
    const rows = await measure((line) => ({
      boxSizing: 'border-box',
      ...paddedLine(line, units, { block: `${pad}px` }),
    }));
    for (const [i, row] of rows.entries()) {
      expect(row.height, `${SIZES[i]}px height`).toBeCloseTo(
        lineOf(SIZES[i] as number) + 2 * pad,
        1
      );
      expect(offGrid(row.baseline), `${SIZES[i]}px`).toBeLessThanOrEqual(TOLERANCE);
    }
  });

});
