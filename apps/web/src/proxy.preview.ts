// apps/web/src/proxy.preview.ts
// The login for the private preview site. Next (16 renamed middleware to proxy) only picks this file up as the proxy when
// `pageExtensions` includes `preview.ts`, which next.config.ts sets for the gated preview site alone, so every other build has
// no proxy at all.
// The sign-in itself is Clerk's hosted page with its Google connector; nothing here touches a database.
import { clerkClient, clerkMiddleware } from '@clerk/nextjs/server';
import { type NextFetchEvent, type NextRequest, NextResponse } from 'next/server';
import { setActiveLocale, t } from '@/i18n';
import { isAllowedEmail, isPublicPath, PREVIEW_COOKIE, previewSecret, verifyPreviewCredential } from '@/lib/preview/access';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);

const clerk = clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn({ returnBackUrl: request.url });

  // Fast path: add `"email": "{{user.primary_email_address}}"` to the Clerk session token (Dashboard > Sessions >
  // Customize session token). Without it the address is looked up on each request.
  let email = typeof sessionClaims?.email === 'string' ? sessionClaims.email : undefined;
  if (!email) email = (await (await clerkClient()).users.getUser(userId)).primaryEmailAddress?.emailAddress;
  if (isAllowedEmail(email)) return NextResponse.next();

  setActiveLocale(request.nextUrl.locale);
  return new NextResponse(
    `<!doctype html><meta name="robots" content="noindex"><title>${escapeHtml(t('previewNoAccessTitle'))}</title><p>${escapeHtml(t('previewNoAccess', { email: email ?? '' }))}</p>`,
    { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  );
});

/**
 * Lets in the public routes, an editor carrying a valid studio credential, or a person signed in with Clerk whose email is
 * on the allow-list. Anyone else is sent to sign in, or told they have no access.
 *
 * @param request - the incoming request.
 * @param event - Next's fetch event, which Clerk needs.
 * @returns the page, a redirect to sign in, or a 403.
 */
export default async function proxy(request: NextRequest, event: NextFetchEvent) {
  if (isPublicPath(request.nextUrl.pathname)) return NextResponse.next();
  if (await verifyPreviewCredential(request.cookies.get(PREVIEW_COOKIE)?.value, previewSecret())) return NextResponse.next();
  return clerk(request, event);
}

export const config = {
  /**
   * Every page and route except Next's build output. Which are open to everyone is decided in the function, by exact path:
   * a pattern here would match any path that merely starts the same way. The home page is listed on its own: with `i18n`,
   * the pattern below needs something after the language, so it misses `/` and `/es`.
   */
  matcher: ['/', '/((?!_next/static/|_next/image).*)'],
};
