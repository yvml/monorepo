# YVML

pnpm + Turborepo monorepo.

## Layout

| Path | Package | Role |
| --- | --- | --- |
| `apps/web` | `@yvml/web` | Next.js (pages router) site |
| `apps/studio` | `@yvml/studio` | Sanity Studio |
| `packages/ui` | `@hmidmismi/ui` | Design system (Panda preset, Ark UI components) |
| `packages/auth` | `@hmidmismi/auth` | Better Auth on Postgres, plus a `create-user` script |
| `packages/sanity-core` | `@hmidmismi/sanity-core` | Shared Sanity schemas, fields, inputs and i18n helpers |
| `packages/sanity-types` | `@hmidmismi/sanity-types` | Types generated from the studio schema |
| `packages/tsconfig` | `@hmidmismi/tsconfig` | Shared TypeScript configs |

The `@hmidmismi/*` packages are shared across projects; `@yvml/*` apps consume them.

## Setup

```sh
pnpm install            # postinstall builds ui's Panda output
cp apps/web/.env.example apps/web/.env
cp apps/studio/.env.example apps/studio/.env
pnpm dev                # web on :3000, studio on :3333
pnpm typegen            # after schema changes: writes packages/sanity-types
```

Set `SANITY_STUDIO_PROJECT_ID` and `NEXT_PUBLIC_SANITY_PROJECT_ID` to your Sanity project.

## Preview site

`@yvml/web` is one codebase with two deployments. The live site sets none of the preview variables: drafts, `/sign-in`, `/api/auth/*` and `/api/draft-mode/*` all answer 404. The preview deployment sets `PREVIEW_SITE=true`, a Sanity Viewer token (`SANITY_API_READ_TOKEN`) and the studio address, and then:

- Pages read drafts with click-to-edit markers while Next draft mode is on.
- The studio's Presentation tool turns draft mode on through `/api/draft-mode/enable` (checked with Sanity's one-time secret), so editors in the studio never see a sign-in page.
- Everyone else must sign in with Google (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`; callback `<SITE_URL>/api/auth/callback/google`). Only `GOOGLE_ALLOWED_DOMAINS` and `GOOGLE_ALLOWED_EMAILS` get in; anyone else is refused.
- `PREVIEW_REQUIRE_LOGIN=false` turns the sign-in off for local work.

Point the studio at the preview site with `SANITY_STUDIO_PREVIEW_URL` (`.env.development`, and `.env.production` for `sanity deploy`). Safari blocks the third-party cookies Presentation needs, so use Chrome or Firefox.

## Auth

`@hmidmismi/auth` (Better Auth) expects tables `auth_users`, `auth_sessions`, `auth_accounts`, `auth_verifications` (snake_case columns) in the database `DATABASE_URL` points to. Accounts are created with `pnpm auth:create-user`; there is no public sign-up.
