/**
 * The kinds of dated entry, each with its own listing at `/<path>`. `docType` is the Sanity document type; events and
 * exhibitions share the `event` document and differ by its `type` field, and a workshop is its own document type.
 */
export const SECTIONS = [
  { type: 'event', docType: 'event', path: 'events', title: 'Events', empty: 'No events are listed.' },
  { type: 'exhibition', docType: 'event', path: 'exhibitions', title: 'Exhibitions', empty: 'No exhibitions are listed.' },
  { type: 'workshop', docType: 'workshop', path: 'workshops', title: 'Workshops', empty: 'No workshops are listed.' },
] as const;

export type Section = (typeof SECTIONS)[number];

/**
 * Finds the section for a listing path.
 *
 * @param path - the first URL segment, such as `workshops`.
 * @returns the section, or undefined when the path is not a listing.
 */
export function sectionForPath(path: unknown) {
  return SECTIONS.find((section) => section.path === path);
}

export const SITE_NAME = 'YVML';
