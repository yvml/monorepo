import { CONTENT, type ContentModule, type Localized } from './events';
import { clientFor } from './sanity';

/** A static page: About, Mission, Youth Programs, Support. */
export type PageDoc = { _id: string; title: Localized<string>; content?: ContentModule[] };

/**
 * One static page by slug. A nested page's slug contains a slash (`about/history`).
 *
 * @param slug - the page's English slug.
 * @param draft - whether the request is in draft mode.
 * @returns the page, or null.
 */
export function getPage(slug: string, draft: boolean) {
  return clientFor(draft).fetch<PageDoc | null>(
    `*[_type == "page" && slug[language == "en" || _key == "en"][0].value.current == $slug][0]{_id, title, ${CONTENT}}`,
    { slug }
  );
}
