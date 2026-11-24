# Handoff

Snapshot for starting a new session, 2026-11-23. Read `CLAUDE.md` first: it has the folder layout and the conventions.

## What this is

`hmidmismi/yvml`: pnpm + Turborepo monorepo. `@yvml/web` (Next 15, pages router) and `@yvml/studio` (Sanity Studio 6) consume shared `@hmidmismi/*` packages. `chorusworks/monorepo` (DRAM) consumes the same shared repos. The site is bilingual (`/` English, `/es` Spanish).

Commands from the root: `pnpm typecheck`, `pnpm typegen` (rerun after any schema or query change), `pnpm --filter @yvml/web dev` (builds the stylesheet, then runs Panda in watch mode beside Next), `pnpm --filter @yvml/web test` (vitest), `pnpm --filter @yvml/web lint`. `styled-system/` and `packages/sanity-types` are generated and gitignored, so a fresh clone needs `pnpm install` (the UI package generates its own on install), `pnpm typegen`, and `pnpm --filter @yvml/web panda:build` (`dev` and `build` run it).

## Where the work is

`feat/web-data-layer` is merged to `main`. The rest of the web work is on stacked branches, all pushed; each has a pull request into the one below it, in this order:

1. `feat/web-data-layer` (off `main`): dark mode init, newsletter signup, menus and social links, the Sanity data layer, the English/Spanish text map, the filter engine and path-based workshop URLs, `CLAUDE.md`.
2. `refactor/filters-and-listing`: first review pass, ISR for every page, the preview login moved to `src/middleware.ts`, dates by language, tests in `apps/web/tests/`.
3. `refactor/components-structure`: components in domain folders with barrels, navigation apart from layout, `hooks/`, the people list and page, the Contact route, listings without click-to-edit markers, the instructors input takes focus in Presentation (studio).
4. `feat/web-panda`: the app owns `panda.config.ts`, `styled-system/` and its theme (`src/theme/`).
5. `refactor/constants-and-i18n`: `i18n/` and `constants/` out of `lib/`, the workshop listing split into `lib/workshops/`.
6. `refactor/rules-and-names`: theme variables from Panda, sign-in and Lazy Eye on shared components and text keys, names that say what a file is.
7. `refactor/filter-components`: the filter bar and URL code split by filter kind, strings per language, filters for events and exhibitions, a People tab.
8. `refactor/lib-structure`: `lib/` organised by concern with singular domain files: listings in `lib/filters/` (workshop, event) with `lib/sorts/` and a shared `personFilter`, one loader file per domain in `lib/loaders/`, query files renamed to singular.

The `mocks` branch is local only: `main` plus the static design mocks in `mocks/` (`70bf03f`, `efe8cf3`). Uncommitted: the `packages/sanity-core` submodule is marked modified (edits to `documentFields.ts` and `seo.ts` that predate this work), and `mocks/` shows as untracked on the other branches.

## Shared packages

`ui`, `auth`, `sanity-core` and `tsconfig` are git submodules of the `hmidmismi` repos:

| Path | Repo | Pin |
| --- | --- | --- |
| `packages/ui` | `hmidmismi/ui` | `d486f70`, tip of `feat/select-compact`, which sits on `feat/embed-frame` (`d5fff15`); `main` is `23a8db7`. Both branches are pushed and not merged. |
| `packages/auth` | `hmidmismi/auth` | `0fce77c` |
| `packages/sanity-core` | `hmidmismi/sanity-core` | `7e6cf57` |
| `packages/tsconfig` | `hmidmismi/tsconfig` | `4f0e87c` |

`feat/embed-frame` adds `EmbedFrame` (the Keela registration frame). `feat/select-compact` adds `hideLabel` and `size` to `EditableSelect` (the language select in the header). To finish: merge both to `main` in `hmidmismi/ui`, bump the pin here and in `chorusworks/monorepo`. The web app cannot build from a fresh clone until they are merged or the pin stays on the branch.

Rules: a change to a shared repo goes on a `feat/*` or `fix/*` branch with a conventional commit, then merges to that repo's `main`, then the pins are bumped. Never edit a submodule's files without committing inside it.

## What the web app does now

- **Pages** are incremental static (`withDraft` in `lib/loaders/static.ts`, revalidated every 60 s; dynamic routes generate on first visit). Draft mode (Presentation) bypasses the cache. Listings carry no click-to-edit markers: entries are edited on their own pages. A cached page has no query string, so `?sort=`, `?q=` and the like are read in the browser after hydration, and a non-canonical order of path facets redirects without the query.
- **Preview login** is Clerk with its Google connector: `src/middleware.preview.ts` is middleware only in builds with `PREVIEW_SITE=true` and login on (`next.config.ts` adds `preview.ts` to `pageExtensions`), so the live site and the pull request previews have no middleware. Signed-in people must be on `PREVIEW_ALLOWED_EMAILS`; the studio's Presentation iframe carries a signed credential set by `/api/draft-mode/enable` (`PREVIEW_COOKIE_SECRET`). No database. Local development uses `PREVIEW_SITE=true` and `PREVIEW_REQUIRE_LOGIN=false`.
- **Language in the address**: English has no prefix, Spanish is `/es/...`. `/en/...` redirects to the plain address in `netlify.toml` (Next's own redirects loop under `i18n`).
- **Filtering** (`lib/filters/`, `components/filters/`): a listing is a `ListSpec` (kinds: search, select, multi, toggle, range; sorts; views). Listings: workshops (`lib/filters/workshop.ts`) and events and exhibitions (`lib/filters/event.ts`), each with its sorts from `lib/sorts/`; `personFilter` is shared by anything that has people. State lives in the address: facets in the path (`/workshops/material/adobe/open`), the rest in the query. One catch-all page serves the workshop listing and a workshop's own page, so `open`, `closed`, `material`, `type`, `instructor` are reserved.
- **Styling**: the app builds its own stylesheet from the design system's preset and `src/theme/` (neutral palette, no monospace face).
- **Text**: every app string is a key in `i18n/strings/`, read with `t('key')` at render time.
- **Keela**: registration forms use `KeelaEmbed` (iframe via `EmbedFrame`); the newsletter signup on `/about/contact` uses `KeelaSignup` (Keela's own script), placed by the Contact route.

## Verified

Typecheck (web and studio), lint (0 errors), 34 tests (filters, dates, workshop and event listings), `next build`, and in Chrome every page type, the filter bar (search, toggle, path facet, list view, clear, back), the Spanish pages and the language select, dark mode applied before first paint, and the draft-mode route. The data layer matched the old queries on the live dataset (84 combinations).

Not verified: events and exhibitions with real data (the dataset has none; fixtures only), anything on the deployed staging or preview sites, the Clerk sign-in with the Google connector and the allow-list (needs the Clerk keys; the credential, public-path and redirect branches were run against a gated build with dummy keys), the `/en` redirect (Netlify only), and in the studio whether clicking an instructor now scrolls to the field.

## Deployments

- **Mocks**: https://yvml-mocks.netlify.app (Netlify site `9926452c-9063-4cf9-90ba-7e97de575fce`). Deploy: `cd mocks && python3 make.py && netlify deploy --prod --dir dist --site 9926452c-9063-4cf9-90ba-7e97de575fce`. Behind Netlify Visitor access until turned off. Every deploy URL is listed in `mocks/DEPLOYS.md` (on the `mocks` branch).
- **Staging** https://yvml.netlify.app and **preview** https://preview--yvml.netlify.app (the studio's Presentation target): built from earlier `main`/`preview`; none of this session's web work is deployed. `staging.yvml.org` waits on a certificate for the Hover DNS; `preview.yvml.org` is not mapped to the `preview` branch.
- Live: none of the preview variables set, and `/sign-in`, `/api/auth/*` and `/api/draft-mode/*` answer 404. Preview: `PREVIEW_SITE=true`, `PREVIEW_REQUIRE_LOGIN=false` (the Google login gate is not set up: no OAuth client or `auth_*` tables yet).

## The mocks (`mocks/`, branch `mocks`)

Static HTML from `mocks/make.py` (Python stdlib; the Lazy Eye generators `lazy.py`, `lazy_site*.py`, `lazy_grids.py`, `lazy_ideas.py`, `lazy_more.py`, `lazy_four.py`, and `main3.py` for the newest main-site directions). Halftone assets: `python3 lazy.py --assets` (needs ImageMagick and network; cached in `mocks/src/lazy/`).

- **Main site**: `/plaster/`, `/steel/`, `/adobe/`, `/glass/` (elegant), `/table/`, `/boxes/`, `/inventory/` (from the Klikkentheke round).
- **Lazy Eye**: `/lazy/` (draft 1), `/lazy/v2/` (halftone that resolves into the photograph: sixty-four, scan, belt, loupe, deck, list, pile, frame, type, word, cloud, orbit, wander, tower).
- The user iterated most on **Scan** (3 across, bleeding and staggered, random halftone, hover to clear, pink on black bars, Day/Night, edge panning). Conceptual pitches were rejected; they want clickable mocks. Lazy Eye is meant to look completely different from the main site. Do not invent the gallery's hours or address; the "64 sq. ft. micro gallery in a former water tower" line is unwanted on the mocks.

## Standing feedback from the user

Saved in `~/.claude/projects/-Users-jasloe-projects-yvml/memory/`: a question gets an answer, not an edit; keep answers short; never use monospace type; no instructional or hint copy unless asked; reuse the reference projects (`~/projects/hammer` for Sanity, `~/projects/chorusworks` for Panda) and the shared packages before writing anything new.

## Next

1. Merge the pull requests in order, merge the UI branches, bump the pins here and in `chorusworks/monorepo`.
2. Redeploy staging and preview and check the workshop listing and Presentation there.
3. Decide the Lazy Eye and main-site design direction from the mocks, then build it for real (the theme in `src/theme/` and the home page are placeholders).
4. Open items: AI alt text (`@sanity/assist` is installed, not configured); the Clerk application (enable the Google connector, copy the two keys, set the preview branch's environment: the keys, `PREVIEW_ALLOWED_EMAILS`, `PREVIEW_COOKIE_SECRET`) and checking the login on the `preview` deploy; map `preview.yvml.org` and finish the `staging.yvml.org` certificate; chips as real links for crawlers (needs a link version of `Chip` in the UI package); a Sanity webhook for on-demand revalidation; component tests; the instructor and material comboboxes show no counts because the UI package's combobox ignores option updates.
5. Archive `chorusworks/clients`, `chorusworks/sanity-core` and `chorusworks/sanity-types` once nothing points at them.

## Gotchas

- A shell hook rewrites commands through `rtk`; piping `rtk grep` misbehaves (use plain tools in pipes), and a hook-modified command must be re-issued unchanged.
- Headless Chrome does not run animation frames reliably. The mock `lazy/v2/pile/` has a `#settle` URL hash that pre-simulates the physics for screenshots. Playwright runs from `packages/ui` with `executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'`.
- The Keela registration forms are hosted pages, not embeddable with Keela's script (it never reveals them); only the signup form works with the script.
