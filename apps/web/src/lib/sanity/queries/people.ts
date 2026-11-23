import { defineQuery } from 'groq';
import { clientFor } from '../client';
import { FULL_NAME, image, SLUG, SLUG_PLAIN } from '../groq';
import type { PERSON_QUERY_RESULT } from '../types';

const PERSON = `_id, "title": ${FULL_NAME}, location, "portrait": ${image('portrait')}, "biography": Biography, links,
  "workshops": *[_type == "workshop" && references(^._id) && defined(${SLUG})]
    | order(dateTime.entries[0].date asc){_id, "slug": ${SLUG}, title, status, price, dateTime}`;

export const PERSON_QUERY = defineQuery(`*[_type == "person" && ${SLUG_PLAIN} == $slug][0]{ ${PERSON} }`);

export type PersonDetail = NonNullable<PERSON_QUERY_RESULT>;

/**
 * One person by slug, with their workshops.
 *
 * @param slug - the person's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the person, or null.
 */
export const getPerson = (slug: string, draft: boolean) => clientFor(draft).fetch(PERSON_QUERY, { slug });
