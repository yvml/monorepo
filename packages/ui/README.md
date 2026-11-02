# @hmidmismi/ui

Design system: Panda preset, Park UI/Ark UI components and variants

Path: `packages/ui`. Run from the repo root with `pnpm --filter @hmidmismi/ui <script>`.

## Scripts

- `dev`: `concurrently -k "panda codegen --watch" "panda cssgen --watch"`
- `typecheck`: `tsc --noEmit && tsc --noEmit -p tsconfig.components.json`
- `lint`: `oxlint -c ../../.oxlintrc.json -A no-console .`
- `test`: `vitest run`
- `codegen`: `panda codegen && panda cssgen`
- `playground`: `vite --config playground/vite.config.ts`
- `playground:build`: `vite build --config playground/vite.config.ts`
- `test:browser`: `pnpm codegen && vitest run --config vitest.browser.config.ts`
- `check:baseline`: `node src/grid/check/check-baseline.mjs`
- `check:spacing`: `node src/grid/check/check-spacing.mjs`
- `check:baseline:firefox`: `node src/grid/check/check-baseline-firefox.mjs`

## Used by

`@yvml/web`

