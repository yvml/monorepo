// apps/web/src/lib/loaders/slug.ts
import { withDraft } from './static';

/**
 * The loader for a page about one document, found by the `slug` in the address. A slug that is not a single word, or
 * that no document has, is a 404.
 *
 * @param key - the prop the document is passed to the page as.
 * @param get - how to read the document by slug.
 * @returns the loader to export as the page's data function.
 */
export function slugLoader<K extends string, D>(key: K, get: (slug: string, draft: boolean) => Promise<D | null>) {
  return withDraft<Record<K, D>>(async (context, draft) => {
    const slug = context.params?.slug;
    if (typeof slug !== 'string') return { notFound: true };
    const found = await get(slug, draft);
    return found ? { props: { [key]: found } as Record<K, D> } : { notFound: true };
  });
}
