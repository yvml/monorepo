// apps/web/src/lib/sanity/queries/people.ts
import { defineQuery } from 'groq';
import { clientFor, listClient } from '../client';
import { FULL_NAME, image, SLUG, SLUG_PLAIN } from '../groq';
import type { PEOPLE_QUERY_RESULT, PERSON_QUERY_RESULT } from '../types';

const PERSON = `_id, "title": ${FULL_NAME}, location, "portrait": ${image('portrait')}, "biography": Biography, links,
  "workshops": *[_type == "workshop" && references(^._id) && defined(${SLUG})]
    | order(dateTime.entries[0].date asc){_id, "slug": ${SLUG}, title, status, price, dateTime}`;

export const PEOPLE_QUERY = defineQuery(
  `*[_type == "person" && defined(${SLUG_PLAIN})] | order(familyName asc, nameGiven asc){ _id, "slug": ${SLUG_PLAIN}, "title": ${FULL_NAME}, location, "portrait": ${image('portrait')} }`
);

export const PERSON_QUERY = defineQuery(`*[_type == "person" && ${SLUG_PLAIN} == $slug][0]{ ${PERSON} }`);

/** A person as the people listing shows them. */
export type PersonSummary = PEOPLE_QUERY_RESULT[number];

export type PersonDetail = NonNullable<PERSON_QUERY_RESULT>;

/**
 * One person by slug, with their workshops.
 *
 * @param slug - the person's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the person, or null.
 */
export const getPerson = (slug: string, draft: boolean) => clientFor(draft).fetch(PERSON_QUERY, { slug });

/**
 * Everyone who has a page, by family name.
 *
 * @param draft - whether the request is in draft mode.
 * @returns the people.
 */
export const listPeople = (draft: boolean) => listClient(draft).fetch(PEOPLE_QUERY);
