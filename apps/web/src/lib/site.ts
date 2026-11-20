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

export type NavGroup = { title: string; path: string; children: { title: string; path: string }[] };

/** The two sections made of pages: each has a landing page at `path` and child pages beneath it. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'About YVML',
    path: 'about',
    children: [
      { title: 'History', path: 'about/history' },
      { title: 'News & Articles', path: 'about/news' },
      { title: 'Press', path: 'about/press' },
      { title: 'Staff', path: 'about/staff' },
      { title: 'Governance', path: 'about/governance' },
      { title: 'Contact Us', path: 'about/contact' },
    ],
  },
  {
    title: 'Support Us',
    path: 'support',
    children: [
      { title: 'Donate', path: 'support/donate' },
      { title: 'Planned Giving', path: 'support/planned-giving' },
      { title: 'Corporate Sponsorship', path: 'support/corporate-sponsorship' },
      { title: 'Foundation Support', path: 'support/foundation-support' },
      { title: 'Government Partners', path: 'support/government-partners' },
      { title: 'Information for Donors', path: 'support/information-for-donors' },
    ],
  },
];

/**
 * The group a path belongs to.
 *
 * @param path - a path without the leading slash, such as `about/staff`.
 * @returns the group, or undefined when the path is outside both groups.
 */
export const groupForPath = (path: string) =>
  NAV_GROUPS.find((group) => path === group.path || path.startsWith(`${group.path}/`));

export const SITE_NAME = 'YVML';
