#!/usr/bin/env node
// Checks that the baseline of every line of text sits on a baseline grid line, in a real browser with the page's real
// fonts. Start the page first (an app, or a playground), then:
//
//   check-baseline http://localhost:5199 --grid 4 --paths / /about --widths 390 1440
//   check-baseline http://localhost:5199 --grid 4 --paths / --max 50      # allow up to 50 off, for a page still being fixed
//
// It looks at every element that holds text itself, in block, flex, grid or table layout. The baseline is read with a
// zero-size inline-block probe, which sits exactly on it. Offenders are grouped by element and parent class so a fix can
// be made once in the recipe. Exits 1 when more than `--max` (default 0) are more than `--tolerance` px (default 0.25)
// from a line.
import { createRequire } from 'node:module';
import { measureText } from './measure.mjs';

const require = createRequire(import.meta.url);
const playwright = require('playwright-core');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  if (at === -1) return fallback;
  const values = [];
  for (const value of args.slice(at + 1)) {
    if (value.startsWith('--')) break;
    values.push(value);
  }
  return values;
};
const base = args.find((a) => a.startsWith('http'));
if (!base) {
  console.error(
    'usage: check-baseline <url> [--grid 5] [--paths / /about] [--widths 390 1440] [--tolerance 1] [--max 0] [--browser chrome|webkit] [--top 40] [--why]'
  );
  process.exit(2);
}
const grid = Number(flag('grid', ['5'])[0]);
const tolerance = Number(flag('tolerance', ['1'])[0]);
const max = Number(flag('max', ['0'])[0]);
const paths = flag('paths', ['/']);
const widths = flag('widths', ['390', '1440']).map(Number);

const engine = flag('browser', ['chrome'])[0];
const browser =
  engine === 'webkit'
    ? await playwright.webkit.launch()
    : engine === 'firefox'
      ? await playwright.firefox.launch()
      : await playwright.chromium.launch({ channel: 'chrome' });
const groups = new Map();
const culprits = new Map();
let total = 0;
let off = 0;
for (const path of paths) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    await page.goto(new URL(path, base).href, { waitUntil: 'load', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const rows = await page.evaluate(measureText, { grid, tolerance });
    for (const row of rows) {
      total += 1;
      if (row.bad && row.entry) culprits.set(row.entry, (culprits.get(row.entry) ?? 0) + 1);
      const group = groups.get(row.key) ?? { n: 0, off: 0 };
      group.n += 1;
      if (row.bad) {
        group.off += 1;
        off += 1;
      }
      groups.set(row.key, group);
    }
    await page.close();
  }
}
await browser.close();

const offenders = [...groups.entries()]
  .filter(([, g]) => g.off > 0)
  .sort((a, b) => b[1].off - a[1].off);
for (const [key, g] of offenders.slice(0, Number(flag('top', ['40'])[0])))
  console.log(`${String(g.off).padStart(5)} / ${String(g.n).padEnd(5)} ${key}`);
if (args.includes('--why')) {
  console.log('\nwhere the offset enters (an element off the grid under a parent that is on it):');
  for (const [entry, n] of [...culprits.entries()].sort((x, y) => y[1] - x[1]).slice(0, 18))
    console.log(`${String(n).padStart(5)}  ${entry}`);
}
console.log(
  `${total} text elements on ${paths.length} page(s) at ${widths.join(', ')}px: ${off} more than ${tolerance}px off the ${grid}px grid (allowed ${max})`
);
process.exit(off > max ? 1 : 0);
