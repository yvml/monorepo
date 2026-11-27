// apps/web/src/constants/brand.ts
/** The name the site goes by in the header and in page titles. */
export const ORG_NAME = 'Yucca Valley Material Lab';
export const SITE_SHORT_NAME = 'YVML';

/** The organization's federal tax ID, shown in the footer. */
export const EIN = 'xx-xxxxx';

/** Who built the site, credited in the footer. */
export const SITE_BUILDER = 'Hemidemisemi';

/** Where the lab is: the weather in the header is for this place, and "happening now" is read in its time zone. */
export const PLACE = {
  name: 'Yucca Valley, CA',
  latitude: 34.1142,
  longitude: -116.4322,
  timeZone: 'America/Los_Angeles',
} as const;
