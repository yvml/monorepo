// apps/web/src/lib/loaders/list.ts
import { withDraft } from './static';

/**
 * The loader for a page that lists documents.
 *
 * @param key - the prop the documents are passed to the page as.
 * @param list - how to read the documents.
 * @returns the loader to export as the page's data function.
 */
export function listLoader<K extends string, D>(key: K, list: (draft: boolean) => Promise<D[]>) {
  return withDraft<Record<K, D[]>>(async (_context, draft) => ({
    props: { [key]: await list(draft) } as Record<K, D[]>,
  }));
}
