// apps/web/src/middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
import { DRAFT_COOKIE, mayView } from '@/lib/gate';
import { requireLogin } from '@/lib/preview';

/**
 * Keeps the preview site private. Pages are generated ahead and cached (see `lib/static-props.ts`), so the check cannot
 * live in a page's loader as it did when every request ran one; it runs in front of the cache instead. On the live site
 * `requireLogin` is false and this passes everything through. It needs the Node.js runtime because the session is in a database.
 *
 * @param request - the incoming request.
 * @returns the page, or a redirect to sign in.
 */
export async function middleware(request: NextRequest) {
  if (!requireLogin) return NextResponse.next();
  if (await mayView(request.headers, request.cookies.has(DRAFT_COOKIE))) return NextResponse.next();
  const { pathname, search, locale, defaultLocale } = request.nextUrl;
  // Come back to the page in the language it was asked for.
  const back = `${locale && locale !== defaultLocale ? `/${locale}` : ''}${pathname}${search}`;
  return NextResponse.redirect(new URL(`/sign-in?next=${encodeURIComponent(back)}`, request.url));
}

export const config = {
  runtime: 'nodejs',
  /**
   * Everything but Next's own files, the auth and draft-mode routes, the sign-in page, and the static files in `public`.
   * The home page is listed on its own: with `i18n`, the pattern below needs something after the language, so it misses `/` and `/es`.
   */
  matcher: ['/', '/((?!_next/|api/|sign-in|favicon.ico|placeholder.svg).*)'],
};
