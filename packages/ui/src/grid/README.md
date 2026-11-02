# The grid

The one place that defines how things line up, vertically and horizontally. A project declares the numbers in its config (`design.grid`); everything else in the library imports from here and defines no grid number of its own.

## What is here

| File | Holds |
|---|---|
| `definition.ts` | The `Grid` type (`baseline`, `unit`, `root`, `snap`), the default, and the px to rem converters. |
| `controls.ts` | Control sizes (`2xs` to `2xl`), each a height, side padding and icon size in baselines. |
| `spacing.ts` | The spacing scale: Park UI's ladder, every step its name times the baseline. |
| `lines.ts` | Putting the baseline of text on a grid line: `lineShift`, `lineMargins`, `centeredLine`, `paddedLine`, `trim`. |
| `rules.ts` | Rules and outlines that take no space: `createRules`. |
| `overlay.ts` | The graph-paper overlay, red baselines and blue verticals one baseline apart. |
| `check/check-baseline.mjs` | The script that measures a live page. |

The tests are `lines.test.ts` and `guard.test.ts` here, and `tests/browser/grid.test.ts`, which renders real text with a bundled font (Inter, SIL OFL) and asserts every function: box heights exactly, glyph baselines within one pixel.

## The invariant

If these hold, everything composes and every baseline lands on a grid line (within a pixel, see below), however the layout is built:

1. Every block of text has its first baseline a whole number of rows below the top of its box, and its box is a whole number of rows tall.
2. Every other box is a whole number of rows tall: heights are rows, padding is rows, gaps are rows.
3. Rules and outlines take no space (they are shadows, not borders).
4. Text that a flex or grid box centers is moved by padding or margin so its baseline still lands on a line.

## Why it is needed

A browser draws the first baseline of a line at a fixed distance below the top of its line box. The distance depends on the font and the size, so it is almost never a whole number of rows. `lines.ts` computes that distance in JavaScript, when the preset is built, from the font's own metrics (the theme's `faces`) and writes the move as plain lengths: the line is shifted, or the box trimmed, to the nearest grid line. There is no `calc()` over font variables in the CSS, and a different face needs a rebuild. (The playground's second theme swaps fonts at runtime, so its baselines are only right for the theme the preset was built with.)

**The tolerance.** The calculation is the plain arithmetic of the metrics: the baseline sits half the leftover line height below the top. Engines round ascent and descent in their own ways (Chrome to whole pixels, WebKit not at all, Firefox its own), so a glyph baseline lands within 1px of its line in Chrome, within 0.5px in WebKit and within 1.5px in Firefox. Copying Chrome's rounding would make Chrome exact but leave WebKit up to 2px off, which matters because every iOS browser is WebKit. That is the rule: box heights and spacing are exact, glyph baselines are within 1px (`check-baseline --tolerance`, default 1; the Firefox runner is run with 1.5). There is no per-browser correction and no runtime JavaScript; an earlier version measured each engine in the browser and was exact in all three, at the cost of a long formula in every text slot and a calibrator.

## Which function for which text

| Text | Use |
|---|---|
| A block that is its own box (a paragraph, a title, a label) | `lineShift`, or `trim` to cut it to the capitals |
| An item of a flex or grid container, or text that clips with an ellipsis | `lineMargins` |
| One line centered in a fixed-height box (a control, a tab, a badge) | `centeredLine` |
| A box whose height is its own padding | `paddedLine` |
| A block that can use neither pseudo-elements nor margins (a disclosure summary) | `lineRelative` |
| A container that only sets the inherited font | none; its children carry the text |

In recipes these are `textLine`, `lineMargins`, `lineCentered`, `linePadded`, `lineRelative` and `textRole` on the type system (`preset/type-scale.ts`). Text that sits next to other items needs its own slot; bare text in a flex row cannot be moved. Text with no style of its own is the `md` body step (the body's default), so it is on the type scale and `check-baseline` measures it; a slot that holds text but sets no helper is what the check finds first.

A role that is used both as a block and as a span has two variants, `body` and `bodyInline` (the same for `prose`): a block is trimmed, a span has its baseline moved by margins. They are separate variants rather than a flag because Panda does not generate the style of a compound variant that is never used literally.

When a page is off, `check-baseline --why` prints where the offset enters: the highest element that is off the grid under a parent that is on it, and what sits above it.

## Seeing it

Press `Shift+G` on a running app in development (`useGridOverlay`) to cycle none, red baseline lines, then red lines with blue verticals. The playground has buttons for both (`?grid&spacing`). The lines read the spacing tokens, so they follow the design's grid.

## Checking it

`pnpm check:baseline <url> --grid 4 --paths / /about --widths 390 1440` (from the repo root, with the page running) loads the page in Chrome with its real fonts, reads the baseline of every element that holds text, groups the ones more than 1px off a line (`--tolerance`) by element and parent class, and exits 1 when more than `--max` are off. Run it in CI against a page that uses every component.

`check-spacing` does the same for horizontal spacing: every side padding, side margin and gap on a live page is a whole or half baseline (vertical values are left to the baseline check, because the helpers move them by a fraction of a row on purpose). `guard.test.ts` keeps raw borders out of recipes: a border adds to a block's height, so only the listed controls may have one. `pnpm check:baseline:dram` starts DRAM, runs the check over its pages at phone and desktop widths with a budget, and stops it; it is the command for CI or a pre-push hook (it needs the local database).

## Other browsers

The same measurement (`check/measure.mjs`) runs in Chrome, in WebKit (the Safari engine, through Playwright: `--browser webkit`, also on `check-spacing`) and in Firefox (`check-baseline-firefox.mjs`, `pnpm check:baseline:firefox`, over Firefox's own BiDi protocol). `pnpm check:baseline:dram` runs all three (`ENGINES=` skips the last two). Safari.app itself is not driven (its scripting needs a setting turned on).
