# Styles

`@hmidmismi/ui` is machinery: a Panda preset, recipes and React components. It has no look of its own. A project declares every value (fonts, scale, colors, sizes, wording) as plain data and hands it to `createPreset`; apps import components and apply their variants.

Paths are from `packages/ui`.

## Rules

- **No look in the library.** Recipes read tokens and nothing else. A size, a weight, a color step or a word is a project value, not a number in a recipe.
- **No literal lengths in recipes.** `src/preset/rhythm.test.ts` fails on a literal `px` or `rem`. Use a token (`spacing.4`, `sizes.plate`, `borderWidths.hairline`).
- **No ad hoc styles in apps.** No `css()`, `style` or raw `className`. Import a component and pick a variant.
- **No fixed wording in components.** Accessible names, placeholders and visible words come from the text map (`tests/wording.test.ts` fails otherwise).
- **No domain names.** A component is named for what it does (`TermList`, `Plate`, `CountTile`), never for what it holds. Domain meaning enters through props and config.
- **Never reset browser defaults in a recipe.** Preflight already zeroes margin, padding, list markers and heading size.
- **State comes from one place.** Hover, active and current states are in `src/preset/interaction.ts` and `conditions.ts`. Hover is gated on `(hover: hover)`. Focus is the global `:focus-visible` ring in `global-css.ts`.

## What a project declares

`createPreset(design, theme, options)` takes:

| Input | Says |
|---|---|
| `design.grid` | `baseline`, `unit` (two baselines) and `root` in px; `snap` to put text baselines on the grid. Every spacing step is its Park UI name times the baseline. |
| `design.type` | `base` px, `ratio`, `leading` (`body`, `falloff`, `floor`), `headings` (h1 to h6) and `roles` (eyebrow, name, term, entry, prose, value, caption, count, tagline, fieldLabel, notice). Line heights are whole baselines. |
| `design.controls` | Height, side padding and icon size per control size (`2xs` to `2xl`), in baselines. |
| `design.sizes`, `radii`, `shadows`, `letterSpacings`, `fontWeights`, `breakpoints`, `motion` | Named values. A size name the library does not declare is an error. |
| `theme.faces` | `display`, `body`, `mono`: family, fallbacks, files and the font's vertical metrics (for Capsize trim). |
| `theme.scales` | `neutral`, `accent`, `danger`, `success`, `warning`, `info` as 12 steps per mode; `secondary`; `categorical` and `wash` as named maps (the project names its hues and section tones). |
| `options.recipes` | Replace a recipe by name, or add one. Use only when a look cannot be expressed as values. |

Defaults for each input are in `src/design/default.ts` and `src/theme/`. The library validates names and scale lengths and throws on a mistake.

## Fixed wording

`UiText` (`src/components/ui-text.tsx`) lists every word a component shows by itself: `close`, `clear`, `saved`, `noMatches`, the nav labels, the player's buttons. Holes such as `Remove {name}` are filled with `fill()`.

- Components call `useUiText()`.
- An app wraps its root in `<UiTextProvider text={…}>` with the entries it wants to change; the rest keep the English defaults.
- To add a word: add a key to `defaultText`, read it with `useUiText()`.

## Where things live

| What | Where |
|---|---|
| The grid: numbers, spacing scale, control sizes, baseline math, no-height rules, overlay, check script | `src/grid/` (README there) |
| Panda preset: tokens, type system, text styles, global CSS, utilities | `src/preset/` |
| Recipes (one file per component family) | `src/preset/recipes/`, registered in `recipes/index.ts` |
| Shared fragments and states | `src/preset/fragments.ts`, `interaction.ts`, `conditions.ts` |
| Components, the only code that imports the generated `styled-system` | `src/components/` |
| Hooks and text helpers (`@hmidmismi/ui/text`) | `src/hooks/`, `src/text/` |
| What a project may say (types and defaults) | `src/design/`, `src/theme/` |
| Playground: every component, a theme switch, dark mode, grid overlays | `playground/` |

## Type and trim

Every size is `base * ratio^step`. A text role asks the type system for a size at a step and, for block text, the trim, which removes the space above the capitals and below the baseline. The trim and the baseline shifts are worked out from the theme's face metrics when the preset is built (`createTypeSystem(design, theme.faces)`) and written as plain lengths, so a different face needs a rebuild. It uses the arithmetic a browser uses to place a baseline (half the leftover line height below the top of the line), without each engine's rounding, so the glyph baseline sits at the bottom of the trimmed box to within a pixel (checked from rendered pixels, not from box edges). Do not put margin on a trimmed element.

## Baseline grid

With `design.grid.snap`, every trimmed text block is rounded up to whole baselines, with the space added above the capitals, so the baseline of the text sits on a grid line and the next block starts on one. It uses CSS `round()` (Chrome 125, Safari 15.4, Firefox 118). Hairline rules are drawn as inset shadows (`ruleAbove`, `ruleBelow`, `ruleBoth` in `fragments.ts`) so they add no height; a border would push everything under it a pixel off. Control heights are whole baselines. Check it in the playground with the baseline grid on: library text baselines are on a line, to within a pixel. Anything above a block that is not a whole number of baselines tall (a raw border, a fixed height) shifts it.

## Text in recipes

A slot that holds text is one of: a block that is its own box (`textLine`, `labelCapsLine`, `microLabelLine`, `longFormLine`), a flex or grid item or text that clips (`lineMargins`), centered in a fixed-height box (`lineCentered`), in a box whose height is its padding (`linePadded`), or trimmed to the capitals (`textRole`). A container that only sets the inherited font uses `textSize`. Bare text next to other items needs its own slot. Do not write a font size without one of these on a slot that holds text.

## Tints

`toneFill` and `toneEdge` take a step from 10 to 90 and mix the current `--tone` into the canvas or the border color. The `hue` recipe sets `--tone` from `colors.categorical.<name>`, so a tile, a plate and a card take the color of their hue.

## Add a recipe

1. Create it in `src/preset/recipes/` with `defineRecipe` or `defineSlotRecipe`, using tokens and fragments only.
2. If a variant value comes from a prop or a variable, set `staticCss: ['*']`.
3. Register it in `recipes/index.ts`.
4. Run `pnpm codegen`, then wrap it in a component. Type the variant prop with `VariantOf<typeof recipe, 'variant'>`. A variant whose names come from the project (hues, tones) is built from the theme in `createRecipes` and typed `string`; pass it through `declared()`.

```tsx
// src/components/layout.tsx
import { measure } from '../../styled-system/recipes';
import type { VariantOf } from './variants';

type MeasureProps = { size?: VariantOf<typeof measure, 'size'>; children: ReactNode };

export function Measure({ size = 'prose', children }: MeasureProps) {
  return <div className={measure({ size })}>{children}</div>;
}
```

## Extraction

Panda emits a recipe variant only when it sees a literal use or `staticCss` lists it. A missing variant in the browser almost always means a prop-driven variant without `staticCss: ['*']`.

## Checking it

The grid is `src/grid/` (see its README for the invariant and which helper to use for which text). `check-baseline <url> --grid <baseline> --paths … --widths …` loads a page in Chrome with its real fonts, reads the baseline of every element that holds text, and exits 1 when more than `--max` are over 1px (`--tolerance`) from a line, in Chrome, WebKit (`--browser webkit`) or Firefox (`check:baseline:firefox`); it groups the offenders by element and parent class. Run it against the playground (`--grid 5`) and an app at several widths. The package's own tests use a bundled font.

## Seeing it

```sh
pnpm playground     # http://localhost:5190
```

Every component and variant on one page, with the neutral theme and a second theme, light and dark. Buttons toggle two overlays on `<html>`:

- **Baseline grid** (`data-baseline-grid`, `?grid`): horizontal red lines, one every baseline. Text baselines and block edges should sit on them.
- **Spacing grid** (`data-spacing-grid`, `?spacing`): vertical blue lines every baseline, so with both overlays on the page is graph paper in squares of one baseline, to check that gaps and insets line up.

Both read the spacing tokens, so they follow whatever grid the design declares.

## Commands

```sh
pnpm codegen        # Panda codegen and styles.css; after editing the library
pnpm test           # tokens, recipes, rhythm, design inputs, CSS validity, wording, render, browser type and color
pnpm typecheck      # two projects, about 18s cold and 2s warm (see "Typecheck: two projects")
pnpm playground
pnpm check:baseline <url> --grid 5   # at the repo root, with a page running: fails when text is off a grid line
```

The generated `styled-system/` is gitignored. A project builds its own stylesheet from the preset it declares; see its config package.

## Typecheck: two projects

`pnpm typecheck` runs `tsconfig.json` (`src/preset`, `theme`, `grid`, `design`, `text`; the build-time code) and then `tsconfig.components.json` (`components`, `hooks`, `rich-text`, `index.ts`). They are separate because Panda's generated `styled-system/types/global.d.ts` redefines `defineRecipe` and `defineSlotRecipe` against the token-aware style type, and Panda gives no option to turn that off. In one program every recipe was checked against it (272s cold); split, it takes about 18s cold and 2s warm. Rule: nothing in `src/preset`, `theme`, `grid`, `design` or `text` imports `styled-system`, and nothing in `src/components` imports `preset`. `incremental` is on for every package through `@hmidmismi/tsconfig`.
