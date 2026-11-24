// apps/web/src/constants/sections.ts
import type { TextKey } from '@/i18n';

/**
 * The sections of the site that list dated entries, each with its own listing at `/<path>`. `docType` is the Sanity
 * document type; events and exhibitions share the `event` document and differ by its `type` field, and a workshop is
 * its own document type.
 */
export const SECTIONS = [
  { type: 'event', docType: 'event', path: 'events', title: 'navEvents', empty: 'emptyEvents', results: 'resultsOfEvents', noMatch: 'noEventsMatch' },
  { type: 'exhibition', docType: 'event', path: 'exhibitions', title: 'navExhibitions', empty: 'emptyExhibitions', results: 'resultsOfExhibitions', noMatch: 'noExhibitionsMatch' },
  { type: 'workshop', docType: 'workshop', path: 'workshops', title: 'navWorkshops', empty: 'emptyWorkshops', results: 'resultsOfWorkshops', noMatch: 'noWorkshopsMatch' },
] as const satisfies readonly {
  type: string;
  docType: string;
  path: string;
  title: TextKey;
  empty: TextKey;
  /** The count line above a filtered listing, and what to say when nothing matches. */
  results: TextKey;
  noMatch: TextKey;
}[];

export type Section = (typeof SECTIONS)[number];

export const EVENTS = SECTIONS[0];
export const EXHIBITIONS = SECTIONS[1];
export const WORKSHOPS = SECTIONS[2];
