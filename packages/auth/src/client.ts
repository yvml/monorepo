import { createAuthClient } from 'better-auth/react';

/**
 * The browser-side auth client. It talks to `/api/auth` on the page's own origin, so it needs no base URL.
 * Use `authClient.signIn.email`, `authClient.signOut` and `authClient.getSession`.
 */
export const authClient = createAuthClient();
