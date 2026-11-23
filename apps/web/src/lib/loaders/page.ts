// apps/web/src/lib/loaders/page.ts
import { type PageDoc, getPage } from '@/lib/sanity';
import { withDraft } from './static';

/** A page written in the studio. */
export type PageProps = { page: PageDoc; draftMode?: boolean };

/**
 * The page loader for the studio's Page type. With no path it reads the address (`/about/history`); a route of its own,
 * such as Contact, passes the path of the page it shows.
 *
 * @param fixedPath - the page's English slug, when the route is for one page.
 * @returns the loader to export as the page's data function.
 */
export const pageLoader = (fixedPath?: string) =>
  withDraft<PageProps>(async (context, draft) => {
    const parts = context.params?.slug;
    const path = fixedPath ?? (Array.isArray(parts) ? parts.join('/') : parts);
    if (!path) return { notFound: true };
    const page = await getPage(path, draft);
    return page ? { props: { page } } : { notFound: true };
  });
