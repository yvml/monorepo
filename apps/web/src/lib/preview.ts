/**
 * Whether this deployment is the private preview site. Only the preview deployment sets `PREVIEW_SITE=true`:
 * it reads drafts, serves the sign-in page and the draft-mode routes, and (unless `PREVIEW_REQUIRE_LOGIN=false`)
 * requires a Google sign-in. The live site answers all of those routes with 404.
 */
export const isPreviewSite = process.env.PREVIEW_SITE === 'true';

/** Whether visitors to the preview site must sign in. On by default; `false` is for local development. */
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
