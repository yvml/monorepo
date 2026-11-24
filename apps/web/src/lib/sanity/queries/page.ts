// apps/web/src/lib/sanity/queries/page.ts
import { defineQuery } from 'groq';
import { clientFor } from '../client';
import { CONTENT, SLUG } from '../groq';
import type { PAGE_QUERY_RESULT } from '../types';

export const PAGE_QUERY = defineQuery(`*[_type == "page" && ${SLUG} == $slug][0]{ _id, title, ${CONTENT} }`);

/** A static page: About, Mission, Youth Programs, Support. */
export type PageDoc = NonNullable<PAGE_QUERY_RESULT>;

/**
 * One static page by slug. A nested page's slug contains a slash (`about/history`).
 *
 * @param slug - the page's English slug.
 * @param draft - whether the request is in draft mode.
 * @returns the page, or null.
 */
export const getPage = (slug: string, draft: boolean) => clientFor(draft).fetch(PAGE_QUERY, { slug });
