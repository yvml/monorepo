import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** The stylesheet the design system generates from its own recipes and default design (`pnpm codegen`). */
const FILE = join(__dirname, '../styled-system/styles.css');
const css = existsSync(FILE) ? readFileSync(FILE, 'utf8') : '';

/** Variables a recipe, Ark UI or the app sets itself at runtime, so they are never declared as tokens. */
const RUNTIME =
  /^--(ui-|tone|inset|bh|jh|lh|rh|ut|shadow-color|input-height|spinner-size|transition|global-|animate-|available-|focus-ring-|font-(body|display|mono)$|height$|layer-index|opacity$|reference-|scale$|table-sticky-offset|transform-origin|width$|x$|y$|z-index$)/;

describe.skipIf(css === '')('generated css', () => {
  it('holds no token reference Panda left unresolved', () => {
    const left =
      css.match(/token\([^)]*\)|\{(?:colors|sizes|spacing|radii|borderWidths)\.[^}]*\}/g) ?? [];
    expect([...new Set(left)]).toEqual([]);
  });

  it('holds no token name written as a plain value', () => {
    // A name such as `avatar.lg` that no token defines is left in the stylesheet as it was written, and the browser ignores it.
    const bare = [...css.matchAll(/[a-z-]+:\s*([a-z][a-zA-Z]*\.[a-zA-Z0-9]+)\s*[;}]/g)].map((match) => match[1]);
    expect([...new Set(bare)].filter((name) => name !== 'colorPalette.solid')).toEqual([]);
  });

  it('declares every token variable it reads', () => {
    const declared = new Set([...css.matchAll(/(--[\w-]+):/g)].map((match) => match[1]));
    const missing = new Set<string>();
    for (const [, name] of css.matchAll(/var\((--[\w-]+)/g)) {
      if (name && !declared.has(name) && !RUNTIME.test(name)) missing.add(name);
    }
    expect([...missing].sort()).toEqual([]);
  });

  it('uses no keyword where a token should be', () => {
    const keywords = [
      ...css.matchAll(
        /(?:font-weight|border-radius): ((?:thin|medium|semibold|l1|l2|l3|xs|sm|md|lg|xl));/g
      ),
    ];
    expect(keywords.map((match) => match[0])).toEqual([]);
  });
});
