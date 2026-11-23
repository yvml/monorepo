// apps/web/src/lib/gate.ts
import { getSessionCookie } from 'better-auth/cookies';
import { getAuth } from './auth';

/**
 * Whether a request carries a valid sign-in session. The session is looked up in the database, never trusted from the
 * cookie alone.
 *
 * @param headers - the request's headers.
 * @returns true when the visitor is signed in.
 */
export async function mayView(headers: Headers) {
  // No session cookie: refuse without touching the database.
  if (!getSessionCookie(headers, { cookiePrefix: 'yvml' })) return false;
  const { auth, close } = getAuth();
  try {
    return Boolean(await auth.api.getSession({ headers }));
  } finally {
    await close();
  }
}
