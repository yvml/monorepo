# Handoff

Snapshot for starting a new session, 2026-11-02.

## What this is

`hmidmismi/yvml`: pnpm + Turborepo monorepo. `@yvml/web` (Next 15, pages router) and `@yvml/studio` (Sanity Studio) consume shared `@hmidmismi/*` packages. `chorusworks/monorepo` (DRAM) consumes the same shared repos.

## Shared packages

`ui`, `auth`, `sanity-core` and `tsconfig` are git submodules of the `hmidmismi` repos, pinned to `main`:

| Path | Repo | Pin |
| --- | --- | --- |
| `packages/ui` | `hmidmismi/ui` | `23a8db7` |
| `packages/auth` | `hmidmismi/auth` | `0fce77c` |
| `packages/sanity-core` | `hmidmismi/sanity-core` | `7e6cf57` |
| `packages/tsconfig` | `hmidmismi/tsconfig` | `4f0e87c` |

`packages/sanity-types` is a plain folder: Sanity TypeGen output from this studio (`pnpm typegen`). It is not shared because DRAM generates different types into its own copy; a shared committed file would be overwritten by each project.

Rules:
- A change to a shared repo goes on a `feat/*` or `fix/*` branch with a conventional commit, then merges to that repo's `main`. Then bump the pin here and in `chorusworks/monorepo`.
- Never edit a submodule's files in place without committing inside it. `pnpm sync` pulls the monorepo and updates submodules.

## Preview site

One codebase, two deployments. Live: none of the preview variables set, and `/sign-in`, `/api/auth/*` and `/api/draft-mode/*` answer 404. Preview: `PREVIEW_SITE=true`.
- Drafts with click-to-edit markers when Next draft mode is on (`SANITY_API_READ_TOKEN`, a Viewer token).
- The studio's Presentation tool enters through `/api/draft-mode/enable`, checked by Sanity's one-time secret, so editors never see the sign-in page.
- Everyone else signs in with Google (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, callback `<SITE_URL>/api/auth/callback/google`). Only `GOOGLE_ALLOWED_DOMAINS` / `GOOGLE_ALLOWED_EMAILS` get in.
- `PREVIEW_REQUIRE_LOGIN=false` for local work. Presentation needs Chrome or Firefox (Safari blocks the cookies).
- Code: `apps/web/src/lib/{preview,gate,auth,sanity}.ts`, `pages/sign-in.tsx`, `pages/api/draft-mode/*`.

## Verified

Typecheck passes in all 6 workspace packages; `next build` passes; the live site returns 404 on the preview routes; the gated preview redirects anonymous visitors to `/sign-in`; the auth tests pass. Not verified: the real Google round trip, Presentation in a live studio, the auth route against a real database (the four `auth_*` tables must exist).

## Next

1. Set `SANITY_STUDIO_PROJECT_ID` and `NEXT_PUBLIC_SANITY_PROJECT_ID` (`apps/studio/.env`, `apps/web/.env`; examples are committed).
2. Create the Google OAuth client and the `auth_*` tables; deploy the preview site and set the studio's `SANITY_STUDIO_PREVIEW_URL`.
3. Decide whether `sanity-types` should stop being committed output.
4. Archive `chorusworks/clients`, `chorusworks/sanity-core` and `chorusworks/sanity-types` once nothing points at them.
