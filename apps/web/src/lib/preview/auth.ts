// apps/web/src/lib/preview/auth.ts
import { createAuth } from '@hmidmismi/auth/server';
import { isPreviewSite } from './flags';

const list = (value: string | undefined) =>
  value
    ?.split(',')
    .map((item) => item.trim())
    .filter(Boolean);

/**
 * Builds the auth instance for one request. Call `close()` when the request is done.
 * Google sign-in is limited to `GOOGLE_ALLOWED_DOMAINS` and `GOOGLE_ALLOWED_EMAILS` (comma separated).
 *
 * @returns the Better Auth instance and a function that closes its database pool.
 */
export function getAuth() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
  return createAuth({
    databaseUrl: process.env.DATABASE_URL!,
    secret: process.env.BETTER_AUTH_SECRET!,
    baseUrl: process.env.SITE_URL ?? 'http://localhost:3000',
    cookiePrefix: 'yvml',
    ipAddressHeaders: ['x-forwarded-for'],
    /** The studio shows this site in an iframe; cookies need `SameSite=None`, which requires HTTPS. */
    crossSiteCookies: isPreviewSite && process.env.NODE_ENV === 'production',
    ...(GOOGLE_CLIENT_ID &&
      GOOGLE_CLIENT_SECRET && {
        google: {
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          allowedDomains: list(process.env.GOOGLE_ALLOWED_DOMAINS) ?? [],
          allowedEmails: list(process.env.GOOGLE_ALLOWED_EMAILS) ?? [],
        },
      }),
  });
}
