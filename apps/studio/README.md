# @yvml/studio

Sanity Studio for YVML. Schema types come from `@hmidmismi/sanity-core`; the document types live in `src/schemaTypes`.

Path: `apps/studio`. Run from the repo root with `pnpm --filter @yvml/studio <script>`.

## Setup

Copy `.env.example` to `.env` and set `SANITY_STUDIO_PROJECT_ID`.

## Scripts

- `dev`: `sanity dev`
- `build`: `sanity build`
- `deploy`: `sanity deploy`
- `typegen`: extracts the schema and writes `packages/sanity-types/src/index.ts`
- `typecheck`, `lint`, `test`
