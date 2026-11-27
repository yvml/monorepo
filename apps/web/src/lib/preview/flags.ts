// apps/web/src/lib/preview/flags.ts
/**
 * Whether this deployment is the private preview site. Only the preview deployment sets `PREVIEW_SITE=true`:
 * it reads drafts and serves the draft-mode routes, and (unless `PREVIEW_REQUIRE_LOGIN=false`) is behind a Clerk
 * login. The live site answers the draft-mode routes with 404.
 */
export const isPreviewSite = process.env.PREVIEW_SITE === 'true';

/** Whether visitors to the preview site must sign in. On by default; `false` is for local development. Decides at build time whether the login middleware exists. */
export const requireLogin = isPreviewSite && process.env.PREVIEW_REQUIRE_LOGIN !== 'false';

/**
 * Keeps a post-sign-in redirect on this site.
 *
 * @param value - the `next` query value.
 * @returns the path when it is a same-site absolute path, otherwise `/`.
 */
export function safeNext(value: unknown) {
  return typeof value === 'string' && /^\/(?![/\\])/.test(value) ? value : '/';
}

/** Whether this deployment serves the style book (`/style`): the private preview site and local development, never the live site. */
export const showStyleBook = isPreviewSite || process.env.NODE_ENV !== 'production';
