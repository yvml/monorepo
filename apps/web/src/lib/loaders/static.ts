// apps/web/src/lib/loaders/static.ts
import type { GetStaticPaths, GetStaticProps, GetStaticPropsContext } from 'next';

/**
 * How long a generated page is served before the next request regenerates it in the background. Editors' changes show
 * up within this time on the live site; in draft mode (Presentation) pages are never cached.
 */
export const REVALIDATE = 60;

/** What a page's own loader may return: its props, a 404, or a redirect. */
type Outcome<P> = { props: P } | { notFound: true } | { redirect: { destination: string; permanent: boolean } };

/**
 * Wraps a page's `getStaticProps`: reads whether the request is in draft mode (Next validates that cookie, and the
 * draft-mode route only sets it after Sanity's one-time secret checks out), passes it to the loader so it can read
 * drafts, hands it to the page as `draftMode`, and makes the result incremental: every outcome, a 404 and a redirect
 * included, is regenerated after `REVALIDATE` seconds. Who may see the preview site is decided in `middleware.ts`, not here.
 *
 * @param inner - the page's own loader, given whether the request is in draft mode. Without one the page has no data.
 * @returns the page's `getStaticProps`.
 */
export function withDraft<P extends Record<string, unknown> = Record<string, never>>(
  inner?: (context: GetStaticPropsContext, draft: boolean) => Promise<Outcome<P>> | Outcome<P>
): GetStaticProps<P & { draftMode: boolean }> {
  return async (context) => {
    const draft = Boolean(context.draftMode);
    const result = inner ? await inner(context, draft) : { props: {} as P };
    if ('notFound' in result || 'redirect' in result) return { ...result, revalidate: REVALIDATE };
    return { props: { ...result.props, draftMode: draft }, revalidate: REVALIDATE };
  };
}

/**
 * `getStaticPaths` for a page whose addresses come from the content. Nothing is built ahead: the first visit to an
 * address generates it and later visits get the saved page, so a build needs no access to the content and a new entry
 * is live without a deploy.
 */
export const onDemandPaths: GetStaticPaths = () => Promise.resolve({ paths: [], fallback: 'blocking' });
