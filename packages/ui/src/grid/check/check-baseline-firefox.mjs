#!/usr/bin/env node
// The same check as `check-baseline`, in Firefox, which Playwright cannot drive with the installed Firefox. It speaks Firefox's own
// WebDriver BiDi protocol (`--remote-debugging-port`) and runs the shared measurement (`measure.mjs`) in the page. Each page
// is given a moment to hydrate and load its fonts before it is measured.
//
//   check-baseline-firefox http://localhost:5199 --grid 4 --paths / /about --widths 390 1440 [--max 0] [--tolerance 1]
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { measureText } from './measure.mjs';

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
    'usage: check-baseline-firefox <url> [--grid 4] [--paths / /about] [--widths 390 1440] [--max 0] [--tolerance 1] [--firefox <path>]'
  );
  process.exit(2);
}
const grid = Number(flag('grid', ['4'])[0]);
const max = Number(flag('max', ['0'])[0]);
const tolerance = Number(flag('tolerance', ['1'])[0]);
const paths = flag('paths', ['/']);
const widths = flag('widths', ['390', '1440']).map(Number);
const firefox = flag('firefox', ['/Applications/Firefox.app/Contents/MacOS/firefox'])[0];
const port = 9300 + Math.floor(Math.random() * 500);

const process_ = spawn(
  firefox,
  [
    '--headless',
    `--remote-debugging-port=${port}`,
    '--no-remote',
    '--profile',
    mkdtempSync(join(tmpdir(), 'fx-')),
  ],
  { stdio: 'ignore' }
);
const stop = () => process_.kill();
process.on('exit', stop);
await new Promise((resolve) => setTimeout(resolve, 4000));

const socket = new WebSocket(`ws://127.0.0.1:${port}/session`);
await new Promise((resolve) => (socket.onopen = resolve));
let counter = 0;
const waiting = new Map();
socket.onmessage = (message) => {
  const data = JSON.parse(message.data);
  if (data.id && waiting.has(data.id)) {
    waiting.get(data.id)(data);
    waiting.delete(data.id);
  }
};
const call = async (method, params = {}) => {
  const id = ++counter;
  const reply = await new Promise((resolve) => {
    waiting.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });
  if (reply.type === 'error') throw new Error(`${method}: ${reply.message}`);
  return reply.result;
};

await call('session.new', { capabilities: {} });
const { context } = await call('browsingContext.create', { type: 'tab' });
const groups = new Map();
let total = 0;
let off = 0;
for (const path of paths) {
  for (const width of widths) {
    await call('browsingContext.setViewport', { context, viewport: { width, height: 900 } });
    await call('browsingContext.navigate', {
      context,
      url: new URL(path, base).href,
      wait: 'complete',
    });
    await new Promise((resolve) => setTimeout(resolve, 2500));
    const expression = `(async () => { await document.fonts.ready; return (${measureText.toString()})(${JSON.stringify({ grid, tolerance })}); })()`;
    const result = await call('script.evaluate', {
      expression,
      target: { context },
      awaitPromise: true,
      resultOwnership: 'none',
      serializationOptions: { maxObjectDepth: 4 },
    });
    const rows = (result.result?.value ?? []).map((item) =>
      Object.fromEntries(item.value.map(([key, value]) => [key, value.value]))
    );
    for (const row of rows) {
      total += 1;
      const entry = groups.get(row.key) ?? { n: 0, off: 0 };
      entry.n += 1;
      if (row.bad) {
        entry.off += 1;
        off += 1;
      }
      groups.set(row.key, entry);
    }
  }
}
socket.close();
stop();
for (const [key, entry] of [...groups.entries()]
  .filter(([, g]) => g.off > 0)
  .sort((a, b) => b[1].off - a[1].off)
  .slice(0, 30)) {
  console.log(`${String(entry.off).padStart(5)} / ${String(entry.n).padEnd(5)} ${key}`);
}
console.log(
  `${total} text elements on ${paths.length} page(s) at ${widths.join(', ')}px in Firefox: ${off} more than ${tolerance}px off the ${grid}px grid (allowed ${max})`
);
process.exit(off > max ? 1 : 0);
