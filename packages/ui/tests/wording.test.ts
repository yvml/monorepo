import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIR = join(__dirname, '../src/components');

/** Component source files, other than the file that holds the wording itself. */
const files = readdirSync(DIR).filter((name) => /\.tsx$/.test(name) && name !== 'ui-text.tsx');

/** Wording written straight into markup: a literal accessible name, placeholder or title, or a capitalised word as JSX text. */
const LITERALS = [
  /\b(aria-label|placeholder|title)="[^"{}]+"/g,
  /\b(aria-label|placeholder|title)=\{'[^']+'\}/g,
  /\?\s*'[A-Z][^']*'\s*:\s*'[A-Z][^']*'/g,
  /(?<![=-])>\s*[A-Z][a-z]+[^<>{}]*<\//g,
];

describe('fixed wording', () => {
  it('is read from the text map, never written into a component', () => {
    const found: string[] = [];
    for (const name of files) {
      const lines = readFileSync(join(DIR, name), 'utf8').split('\n');
      lines.forEach((line, index) => {
        if (/^\s*(\*|\/\/|\/\*)/.test(line)) return;
        for (const pattern of LITERALS) {
          const hit = line.match(pattern);
          if (hit) found.push(`${name}:${index + 1}: ${hit[0].trim()}`);
        }
      });
    }
    expect(found).toEqual([]);
  });
});
