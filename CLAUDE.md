# CLAUDE.md

pnpm + Turborepo monorepo for YVML. `apps/web` is Next 15 (pages router), `apps/studio` is Sanity Studio. UI, auth, Sanity helpers and tsconfig come from the `@hmidmismi/*` submodules in `packages/`. See `HANDOFF.md` for deployment and the preview site.

## Before writing code

1. Look for it first. Check the shared packages (`packages/ui`, `auth`, `sanity-core`, `tsconfig`), then the reference projects, then this repo's own `lib/`.
   - Sanity data layer: `~/projects/hammer/apps/web/src/lib/sanity` (client, GROQ fragments, fetch helpers, thin per-type queries).
   - Panda and the design system: `~/projects/chorusworks`.
2. Say what is being reused before writing anything new. If it exists, use it; if it is close, extend it where it lives.
3. Decide where new code lives before writing it. A file is named for what it is. No `site`, `utils`, `helpers`, `common` or `misc`.

## Principles

- **One source of truth.** A fact, path or query piece is written once and composed from. A second copy is a bug.
- **Layers.** Client, then GROQ fragments, then per-type queries, then components. A component never contains GROQ; a query never knows React.
- **Types come from the schema.** Queries are `defineQuery` constants composed from fragments, so `pnpm typegen` generates their result types and `client.fetch(QUERY)` is typed. No hand-written copies of result shapes. Run `pnpm typegen` after any schema or query change.
- **Smallest change that solves what was asked.** A question gets an answer, not an edit. A refactor happens only when asked, in its own change, never mixed into a feature.
- **Verify before saying done.** Typecheck, run the pages, and for data-layer changes compare old and new results on the real dataset. Report what was checked and what was not. Never leave a tree that does not typecheck.
- **Easy to extend.** A new document type is one query file and, at most, one fragment.

## `apps/web/src/lib`

```
sanity/
  client.ts       clients: published, preview, clientFor(draft)
  groq.ts         fragments: SLUG, FULL_NAME, image(), SUMMARY, CONTENT, ...
  queries/        one file per document type: defineQuery constants, result types, thin functions
  types.ts        generated types re-exported, plus the few shapes components accept
filters/          the filter engine: kinds, URL state, apply, counts, active chips, useFilterState
workshop-listing.ts   the workshop listing as data (a ListSpec): filters, sorts, views
text.ts           every app string in every language (t('key')), plus the design system's words in Spanish
localize.ts       Sanity localized fields       dates.ts          date helpers
navigation.ts     sections and nav groups (titles are text keys)    menu.tsx   menu items to links (target, rel, aria)
keela.ts          Keela address checks and form addresses           brand.ts, social.ts, placeholder.ts
static-props.ts   getStaticProps wrapper (withDraft), revalidate time, onDemandPaths    event-loaders.ts   events and exhibitions share their loaders
gate.ts, preview.ts, auth.ts, locale.ts, theme.ts, visual.ts   (the preview login is `src/middleware.ts`)
```

## Conventions

- Tests live in `apps/web/tests/`, one file per area under test, named for it (`dates.test.ts`, `filters.test.ts`). They import from `../src/lib/...`.
- Apps use `@hmidmismi/ui` components and variants, not their own styling: no `style`, no raw `className`, no raw `ul`/`table`/form controls (see `packages/ui/STYLES.md`). If the UI package lacks a component, add it there on a `feat/*` branch (as `EmbedFrame` was) rather than styling in the app.
- Links to other sites open in a new tab with `rel="noopener noreferrer"` and an accessible name that says so; build every menu through `menuLinks` in `lib/menu.tsx`.
- Shared packages change only on a branch in their own repo, then the pin is bumped here.
- No hardcoded wording in components or pages. Every visible string is a key in `lib/text.ts` with an English and a Spanish entry; read it with `t('key')` at render time, never at module load (menus and tabs are built per render so they follow the page's language).
- A listing is a `ListSpec` (filters, sorts, views) in its own file; `FilterBar` and `useFilterState` render and persist any spec, and the choices live in the address: facets in the path (`/workshops/material/adobe/open`, one canonical order, several values joined with `+`), the rest in the query (`?min-price=200&sort=price-low&view=list`). Values are slugs, never Sanity ids. The listing is served by one optional catch-all page (`[[...path]].tsx`) that also serves the entries' own pages, so a path facet word is reserved. A new listing is a new spec, not new filter code. Filter kinds: search, select, multi, toggle, range.
- Do not use monospace type anywhere.
- No instructional or hint copy in the UI or the schema unless asked for.
- Every page is incremental static (`getStaticProps` through `withDraft`, revalidated every `REVALIDATE` seconds; dynamic routes use `onDemandPaths`). A cached page has no query string, so choices in the query are read in the browser. Who may see the preview site is decided in `src/middleware.ts`, never in a page loader.
- English has no URL prefix and Spanish is `/es/...`; `/en/...` redirects to the plain address (`netlify.toml`). Dates and text follow the page's language (`en`, `es`), never a fixed `en-US`.
