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

## `apps/web/src`

```
components/<domain>/   one folder per domain, each with a barrel `index.ts`; import from the folder (`@/components/workshop`)
  article/ event/ workshop/ person/   List and Page components for each document type
  layout/        Site (the frame) and Page (a page written in the studio)
  navigation/    everything that moves a visitor around: SubNav, Breadcrumbs, LanguageSwitcher, the menus, nextLink
  content/       Blocks, ContentModules, Kicker      media/   Image      date/   Dates, Day
  filters/       FilterBar (generic, takes any ListSpec)      keela/   KeelaEmbed, KeelaSignup
hooks/           custom React hooks (useFilterState)
lib/             code with no React: queries, the filter engine, dates, loaders
pages/           routes only: a loader, and one component. A route owns what is specific to it (Contact adds the signup)
tests/           every test file
```

The canonical styling rules are `packages/ui/STYLES.md`; read it before touching any styling.
In short: ui primitives are named by function and content picks the primitive and variant at the call site. The route
file owns the content by default: it fetches, maps the data onto primitives and picks the variants. Extract a component only
for state, reuse in two or more routes, or length. An app
component may be named for its content only when it just maps a document's data onto ui primitives and variants (DRAM's
`ReleaseCredits` and `ReleaseRows` are the model): it has no styling, no `className`, `style` or `css()`, and no look of its
own. A look it needs twice is a variant in the ui. A name that describes a look (`PersonName`, `eyebrow`, `CreditsList`) is
never allowed, in the app or the ui; use the `ROLE` mapping. Pure mapping with no state is a function in `lib/` that
returns props.

A page-specific addition goes in the route, never behind a path check inside a shared component. Name a component for what it
is structurally (`List`, `Card`, `Link`, `Stack`, `Measure`), never for the content it shows (`WorkshopList`, `PersonCard`,
`eyebrow`): a list is a list, a card is a card, a link is a link, and what a list holds is data the consumer passes in. A
second look is a variant, not a second component. New styling goes in this order: a Panda pattern, a variant on an existing
recipe, a new recipe. Semantic names exist only as a call-site mapping (`lib/roles.ts`), never as a component or a recipe.
Vague catch-alls (`Entry`, `Item`, `Helper`) are still out.

## `apps/web/src/lib`, `i18n`, `constants`, `theme`

```
i18n/             strings.ts (every app string in English and Spanish, and the design system's words in Spanish), translate.ts (t('key')),
                  locale.ts (the languages, the active one), localize.ts (Sanity localized fields). Import from '@/i18n'.
constants/        data that never changes at runtime: brand (SITE_SHORT_NAME), placeholder, sections (events, exhibitions, workshops),
                  menus (navigation groups, social links). Import from '@/constants'.
theme/            the site's theme (colors, faces), which panda.config.ts and _document read
lib/              code that does something. The folder is the concern, the file is the domain (singular: article, event, page, person, workshop):
  sanity/         client.ts (published, preview, listing clients), groq.ts (fragments), types.ts, dataAttribute.ts (click-to-edit), queries/<domain>.ts
  filters/        the filter engine at the root (types, state, path, query, url, apply, active); reference.ts and person.ts build filters from the documents an item refers to;
                  workshop.ts and event.ts each define one listing: its filters, sorts and views in one object
  sorts/          comparators shared by listings: date, price, person (last name)
  loaders/        page data, one file per domain (page, event, workshop, article, person), slug.ts for a page about one document, static.ts (withDraft, revalidate)
  preview/        the private preview site: flags, access (the signed credential the studio iframe carries, the email allow-list, the exact public paths)
  dates.ts        date helpers      keela.ts   Keela address checks
```

## Conventions

- Tests live in `apps/web/tests/`, one file per area under test, named for it (`dates.test.ts`, `filters.test.ts`). They import from `../src/lib/...`.
- The app owns its Panda setup: `apps/web/panda.config.ts` builds `styled-system/` (gitignored, generated by `pnpm panda:build`, which `dev` and `build` run first) from the design system's preset and the site's theme in `src/theme/`. The stylesheet comes from there, not from `@hmidmismi/ui/styles.css`. The theme has no monospace face.
- Apps use `@hmidmismi/ui` components and variants, not their own styling: no `style`, no raw `className`, no raw `ul`/`table`/form controls (see `packages/ui/STYLES.md`). If the UI package lacks a component, add it there on a `feat/*` branch (as `EmbedFrame` was) rather than styling in the app.
- Links to other sites open in a new tab with `rel="noopener noreferrer"` and an accessible name that says so; build every menu through `menuLinks` in `lib/menu.tsx`.
- Shared packages change only on a branch in their own repo, then the pin is bumped here.
- No hardcoded wording in components or pages. Every visible string is a key in `i18n/strings.ts` with an English and a Spanish entry; read it with `t('key')` at render time, never at module load (menus and tabs are built per render so they follow the page's language).
- A listing is a `ListSpec` (filters, sorts, views) in its own file; `FilterBar` and `useFilterState` render and persist any spec, and the choices live in the address: facets in the path (`/workshops/material/adobe/open`, one canonical order, several values joined with `+`), the rest in the query (`?min-price=200&sort=price-low&view=list`). Values are slugs, never Sanity ids. The listing is served by one optional catch-all page (`[[...path]].tsx`) that also serves the entries' own pages, so a path facet word is reserved. A new listing is a new spec, not new filter code. Filter kinds: search, select, multi, toggle, range.
- Do not use monospace type anywhere.
- No instructional or hint copy in the UI or the schema unless asked for.
- Every page is incremental static (`getStaticProps` through `withDraft`, revalidated every `REVALIDATE` seconds; dynamic routes use `onDemandPaths`). A cached page has no query string, so choices in the query are read in the browser. Who may see the preview site is decided in `src/proxy.preview.ts`, never in a page loader.
- English has no URL prefix and Spanish is `/es/...`; `/en/...` redirects to the plain address (`netlify.toml`). Dates and text follow the page's language (`en`, `es`), never a fixed `en-US`.
