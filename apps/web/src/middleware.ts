// apps/web/src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { mayView } from '@/lib/preview/gate';
import { requireLogin } from '@/lib/preview/flags';
import { isPublicPath, PREVIEW_COOKIE, verifyPreviewCredential } from '@/lib/preview/access';

/**
 * Keeps the preview site private. Pages are generated ahead and cached (see `lib/loaders/static.ts`), so the check cannot
 * live in a page's loader as it did when every request ran one; it runs in front of the cache instead. On the live site
 * `requireLogin` is false and this passes everything through.
 *
 * Two things let a request in: the signed credential `/api/draft-mode/enable` sets once the studio's one-time secret has
 * checked out (this is how editors in Presentation get in without a session), or a valid sign-in session. A cookie that
 * is merely present proves nothing, so neither is accepted unchecked. It needs the Node.js runtime because the session is in a database.
 *
 * @param request - the incoming request.
 * @returns the page, or a redirect to sign in.
 */
export async function middleware(request: NextRequest) {
  if (!requireLogin || isPublicPath(request.nextUrl.pathname)) return NextResponse.next();
  if (await verifyPreviewCredential(request.cookies.get(PREVIEW_COOKIE)?.value, process.env.BETTER_AUTH_SECRET)) return NextResponse.next();
  if (await mayView(request.headers)) return NextResponse.next();
  const { pathname, search, locale, defaultLocale } = request.nextUrl;
  // Come back to the page in the language it was asked for.
  const back = `${locale && locale !== defaultLocale ? `/${locale}` : ''}${pathname}${search}`;
  return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(back)}`, request.url));
}

export const config = {
  runtime: 'nodejs',
  /**
   * Every page and route except Next's own build output. Which of them are open to everyone is decided in the function,
   * by exact path (`isPublicPath`): a pattern here would match any path that merely starts the same way.
   * The home page is listed on its own: with `i18n`, the pattern below needs something after the language, so it misses `/` and `/es`.
   */
  matcher: ['/', '/((?!_next/static/|_next/image).*)'],
};
