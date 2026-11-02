import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const RECIPES = join(import.meta.dirname, '../preset/recipes');

/** A border that adds to the height of a block: a width on a block-axis edge or on every edge, or the `boxed` fragment. */
const RAW_BORDER =
  /border(?:Width|Block(?:Start|End)Width|Top(?:Width)?|Bottom(?:Width)?)\s*:\s*(?:\{|'(?:hairline|rail|bar|edge|0\.5px|1px|2px))|\.\.\.boxed/g;

/**
 * The recipes that still draw a real border, and how many. Each is a control with a fixed height (a border sits inside its
 * height), an element whose border is its width, or a mark that is not in the flow. A new border anywhere else adds a pixel
 * to a block and pushes everything below it off the grid: use `ruleAbove`, `ruleBelow`, `ringed` or `toneRing` from
 * `grid/rules.ts`, or give the box a fixed control height, and only then add it here.
 */
const ALLOWED: Record<string, number> = {
  'badge.ts': 1,
  'browse.ts': 1,
  'button.ts': 2,
  'checkbox.ts': 3,
  'chrome.ts': 2,
  'input.ts': 4,
  'lists.ts': 2,
  'player.ts': 1,
  'popover.ts': 1,
  'search.ts': 5,
  'select.ts': 2,
  'spinner.ts': 1,
  'styleguide.ts': 1,
  'toggle-group.ts': 2,
};

describe('borders in recipes', () => {
  it('are only the ones that keep their box on the grid', () => {
    const found: Record<string, number> = {};
    for (const file of readdirSync(RECIPES).filter((name) => name.endsWith('.ts'))) {
      const count = (readFileSync(join(RECIPES, file), 'utf8').match(RAW_BORDER) ?? []).length;
      if (count > 0) found[basename(file)] = count;
    }
    expect(found).toEqual(ALLOWED);
  });
});
