// apps/web/src/lib/sanity/queries/event.ts
import { defineQuery } from 'groq';
import { type Section } from '@/constants';
import { clientFor, listClient } from '../client';
import { CONTENT, image, SLUG, SUMMARY } from '../groq';
import type { EVENT_QUERY_RESULT, EVENTS_QUERY_RESULT } from '../types';

/** Events and exhibitions share the `event` document and differ by its `type` field; entries saved before it existed are events. */
const SECTION_FILTER = `$section == "" || coalesce(type, "event") == $section`;

const DETAIL = `${SUMMARY}, ${CONTENT}, "image": ${image('image')}, registrationUrl, keelaUrl`;

export const EVENTS_QUERY = defineQuery(`*[_type == "event" && defined(${SLUG}) && (${SECTION_FILTER})]{ ${SUMMARY}, "image": ${image('image')} }`);

export const EVENT_QUERY = defineQuery(`*[_type == "event" && ${SLUG} == $slug && (${SECTION_FILTER})][0]{ ${DETAIL} }`);

/** An event or exhibition as a listing row shows it. */
export type EventSummary = EVENTS_QUERY_RESULT[number];

/** An event or exhibition page. */
export type EventDetail = NonNullable<EVENT_QUERY_RESULT>;

/** The `type` field a section filters on. */
const params = (section: Section) => ({ section: section.type });

/**
 * The events or exhibitions of one section.
 *
 * @param section - which listing: events or exhibitions.
 * @param draft - whether the request is in draft mode.
 * @returns the entries, in no particular order; see `splitByDate`.
 */
export const listEvents = (section: Section, draft: boolean) => listClient(draft).fetch(EVENTS_QUERY, params(section));

/**
 * One event or exhibition by slug.
 *
 * @param section - which listing it belongs to.
 * @param slug - the entry's slug.
 * @param draft - whether the request is in draft mode.
 * @returns the entry, or null.
 */
export const getEvent = (section: Section, slug: string, draft: boolean) =>
  clientFor(draft).fetch(EVENT_QUERY, { ...params(section), slug });
