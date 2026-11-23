// apps/web/src/lib/sanity/queries/workshop.ts
import { defineQuery } from 'groq';
import { clientFor, listClient } from '../client';
import { CONTENT, image, SLUG, SLUG_PLAIN, SUMMARY } from '../groq';
import type { WORKSHOP_QUERY_RESULT, WORKSHOPS_QUERY_RESULT } from '../types';

const LISTING = `_id, _type, "slug": ${SLUG}, title, dateTime, price, status, format,
  "image": ${image('image')},
  "instructors": instructors[]->{_id, title, "slug": ${SLUG_PLAIN}, familyName, nameGiven},
  "workshopTypes": workshopTypes[]->{_id, title, "slug": ${SLUG}},
  "materials": materials[]->{_id, title, "slug": ${SLUG}}`;

const DETAIL = `${SUMMARY}, ${CONTENT}, "image": ${image('image')},
  "instructors": instructors[]->{_id, title, "slug": ${SLUG_PLAIN}},
  "workshopTypes": workshopTypes[]->title, "materials": materials[]->title,
  price, format, scholarshipAvailable, registrationUrl, keelaUrl`;

export const WORKSHOPS_QUERY = defineQuery(`*[_type == "workshop" && defined(${SLUG})]{ ${LISTING} }`);

export const WORKSHOP_QUERY = defineQuery(`*[_type == "workshop" && ${SLUG} == $slug][0]{ ${DETAIL} }`);

/** A workshop as the listing shows it. */
export type WorkshopSummary = WORKSHOPS_QUERY_RESULT[number];

/** A workshop page. */
export type WorkshopDetail = NonNullable<WORKSHOP_QUERY_RESULT>;

/**
 * Every workshop with the fields the listing filters and sorts on.
 *
 * @param draft - whether the request is in draft mode.
 * @returns the workshops, unordered.
 */
export const listWorkshops = (draft: boolean) => listClient(draft).fetch(WORKSHOPS_QUERY);

/**
 * One workshop by slug.
 *
 * @param slug - the workshop's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the workshop, or null.
 */
export const getWorkshop = (slug: string, draft: boolean) => clientFor(draft).fetch(WORKSHOP_QUERY, { slug });
