/**
 * The sections of the site that list dated entries, each with its own listing at `/<path>`. `docType` is the Sanity
 * document type; events and exhibitions share the `event` document and differ by its `type` field, and a workshop is
 * its own document type.
 */
export const SECTIONS = [
  { type: 'event', docType: 'event', path: 'events', title: 'Events', empty: 'No events are listed.' },
  { type: 'exhibition', docType: 'event', path: 'exhibitions', title: 'Exhibitions', empty: 'No exhibitions are listed.' },
  { type: 'workshop', docType: 'workshop', path: 'workshops', title: 'Workshops', empty: 'No workshops are listed.' },
] as const;

export type Section = (typeof SECTIONS)[number];

export const EVENTS = SECTIONS[0];
export const EXHIBITIONS = SECTIONS[1];
export const WORKSHOPS = SECTIONS[2];

export const SITE_NAME = 'YVML';
