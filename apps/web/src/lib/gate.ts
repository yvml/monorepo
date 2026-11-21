import { getSessionCookie } from 'better-auth/cookies';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getAuth } from './auth';
import { requireLogin } from './preview';

/** What a page's own loader may return: its props, a 404, or a redirect. */
type Outcome<P> = { props: P } | { notFound: true } | { redirect: { destination: string; permanent: boolean } };

/**
 * Wraps a page's `getServerSideProps` so the preview site is private. Editors in the studio's Presentation tool
 * arrive in draft mode (Next validates that cookie, and the draft-mode route only sets it after Sanity's one-time
 * secret checks out), so they never meet the sign-in page. Everyone else needs a session.
 *
 * @param inner - the page's own loader, given whether the request is in draft mode. It may return `notFound` or `redirect`.
 * @returns a loader that redirects to `/sign-in` when a visitor has no session.
 */
export function withPreviewGate<P extends Record<string, unknown> = Record<string, never>>(
  inner?: (context: GetServerSidePropsContext, draft: boolean) => Promise<Outcome<P>> | Outcome<P>
): GetServerSideProps<P & { draftMode: boolean }> {
  return async (context) => {
    const draft = Boolean(context.draftMode);
    if (requireLogin && !draft) {
      const toSignIn = {
        redirect: {
          destination: `/sign-in?next=${encodeURIComponent(context.resolvedUrl)}`,
          permanent: false,
        },
      };
      const headers = new Headers(context.req.headers as never);
      // No session cookie: send the visitor to sign in without touching the database.
      if (!getSessionCookie(headers, { cookiePrefix: 'yvml' })) return toSignIn;
      const { auth, close } = getAuth();
      try {
        if (!(await auth.api.getSession({ headers }))) return toSignIn;
      } finally {
        await close();
      }
    }
    const result = inner ? await inner(context, draft) : { props: {} as P };
    if ('notFound' in result || 'redirect' in result) return result;
    return { props: { ...result.props, draftMode: draft } };
  };
}
