#!/usr/bin/env node
// Checks that the horizontal spacing on a live page is on the grid: every side padding, side margin and gap is a whole or half
// baseline (the spacing scale has half steps for the fine gaps of small controls). It reports each element class, property and value that is not, grouped, so a recipe can be fixed once.
//
//   check-spacing http://localhost:5199 --grid 4 --paths / /about --widths 390 1440 [--max 0] [--browser chrome|webkit]
import { createRequire } from 'node:module';

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
    'usage: check-spacing <url> [--grid 4] [--paths / /about] [--widths 390 1440] [--max 0] [--top 30]'
  );
  process.exit(2);
}
const grid = Number(flag('grid', ['4'])[0]);
const max = Number(flag('max', ['0'])[0]);
const paths = flag('paths', ['/']);
const widths = flag('widths', ['390', '1440']).map(Number);
const top = Number(flag('top', ['30'])[0]);

// Horizontal spacing and the gaps. Vertical padding and margin are not listed: the text-snapping helpers move them by a fraction
// of a baseline on purpose, and a vertical value that was wrong would put a baseline off its line, which `check-baseline` finds.
const PROPERTIES = [
  'paddingRight',
  'paddingLeft',
  'marginRight',
  'marginLeft',
  'rowGap',
  'columnGap',
];

const engine = flag('browser', ['chrome'])[0];
const browser =
  engine === 'webkit'
    ? await playwright.webkit.launch()
    : engine === 'firefox'
      ? await playwright.firefox.launch()
      : await playwright.chromium.launch({ channel: 'chrome' });
const groups = new Map();
let checked = 0;
let bad = 0;
for (const path of paths) {
  for (const width of widths) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    await page.goto(new URL(path, base).href, { waitUntil: 'load', timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    const rows = await page.evaluate(
      ({ grid, PROPERTIES }) => {
        const out = [];
        const name = (e) =>
          (e.className || '').toString().split(' ')[0].replace(/--.*/, '') ||
          e.tagName.toLowerCase();
        for (const el of document.querySelectorAll('body *')) {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || el.closest('svg,script,style')) continue;
          const box = el.getBoundingClientRect();
          if (box.width <= 1 || box.height <= 1) continue;
          for (const property of PROPERTIES) {
            const raw = cs[property];
            if (raw === 'normal' || raw === 'auto') continue;
            const value = Number.parseFloat(raw);
            if (!value) continue;
            const half = grid / 2;
            const rest = Math.abs(value) % half;
            const on = Math.min(rest, half - rest) < 0.26;
            out.push({
              key: `${el.tagName.toLowerCase()}.${name(el)} ${property} ${value.toFixed(2)}px`,
              bad: !on,
            });
          }
        }
        return out;
      },
      { grid, PROPERTIES }
    );
    for (const row of rows) {
      checked += 1;
      const group = groups.get(row.key) ?? { n: 0, bad: row.bad };
      group.n += 1;
      groups.set(row.key, group);
      if (row.bad) bad += 1;
    }
    await page.close();
  }
}
await browser.close();
const offenders = [...groups.entries()].filter(([, g]) => g.bad).sort((a, b) => b[1].n - a[1].n);
for (const [key, g] of offenders.slice(0, top)) console.log(`${String(g.n).padStart(5)}  ${key}`);
console.log(
  `${checked} spacing values on ${paths.length} page(s) at ${widths.join(', ')}px: ${bad} not a whole or half ${grid}px baseline (allowed ${max})`
);
process.exit(bad > max ? 1 : 0);
