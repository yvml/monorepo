// apps/web/src/lib/preview/gate.ts
import { getSessionCookie } from 'better-auth/cookies';
import { getAuth } from './auth';

/** The cookie Next sets when the studio's Presentation tool turns draft mode on. */
export const DRAFT_COOKIE = '__prerender_bypass';

/**
 * Whether a request may see the private preview site. Editors in Presentation carry the draft-mode cookie and never meet
 * the sign-in page. The cookie is not checked here, only for being present: Next validates it itself before serving
 * drafts, so a forged one can show nothing the live site does not already show. Everyone else needs a session.
 *
 * @param headers - the request's headers.
 * @param hasDraftCookie - whether the request carries the draft-mode cookie.
 * @returns true when the visitor may continue.
 */
export async function mayView(headers: Headers, hasDraftCookie: boolean) {
  if (hasDraftCookie) return true;
  // No session cookie: refuse without touching the database.
  if (!getSessionCookie(headers, { cookiePrefix: 'yvml' })) return false;
  const { auth, close } = getAuth();
  try {
    return Boolean(await auth.api.getSession({ headers }));
  } finally {
    await close();
  }
}
