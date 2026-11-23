import type { TextKey } from './text';

/**
 * The sections of the site that list dated entries, each with its own listing at `/<path>`. `docType` is the Sanity
 * document type; events and exhibitions share the `event` document and differ by its `type` field, and a workshop is
 * its own document type.
 */
export const SECTIONS = [
  { type: 'event', docType: 'event', path: 'events', title: 'navEvents', empty: 'emptyEvents' },
  { type: 'exhibition', docType: 'event', path: 'exhibitions', title: 'navExhibitions', empty: 'emptyExhibitions' },
  { type: 'workshop', docType: 'workshop', path: 'workshops', title: 'navWorkshops', empty: 'emptyWorkshops' },
] as const satisfies readonly { type: string; docType: string; path: string; title: TextKey; empty: TextKey }[];

export type Section = (typeof SECTIONS)[number];

export const EVENTS = SECTIONS[0];
export const EXHIBITIONS = SECTIONS[1];
export const WORKSHOPS = SECTIONS[2];

export type NavGroup = { title: TextKey; path: string; children: { title: TextKey; path: string }[] };

/** The two sections made of pages: each has a landing page at `path` and child pages beneath it. */
export const NAV_GROUPS: NavGroup[] = [
  {
    title: 'navAbout',
    path: 'about',
    children: [
      { title: 'navHistory', path: 'about/history' },
      { title: 'navNews', path: 'about/news' },
      { title: 'navPress', path: 'about/press' },
      { title: 'navStaff', path: 'about/staff' },
      { title: 'navGovernance', path: 'about/governance' },
      { title: 'navContact', path: 'about/contact' },
    ],
  },
  {
    title: 'navSupport',
    path: 'support',
    children: [
      { title: 'navDonate', path: 'support/donate' },
      { title: 'navPlannedGiving', path: 'support/planned-giving' },
      { title: 'navCorporateSponsorship', path: 'support/corporate-sponsorship' },
      { title: 'navFoundationSupport', path: 'support/foundation-support' },
      { title: 'navGovernmentPartners', path: 'support/government-partners' },
      { title: 'navDonorInformation', path: 'support/information-for-donors' },
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

/** The path of the Contact Us page, which carries the newsletter signup. */
export const CONTACT_PATH = 'about/contact';
