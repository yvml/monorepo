// apps/web/src/constants/menus.ts
import type { TextKey } from '@/i18n';

/** One entry of a menu. */
export type MenuItem = {
  /** Identifies the item in its menu. */
  key: string;
  /** The visible text. */
  label: string;
  /** A route (`/about`), a web address (`https://…`), or a `mailto:`, `tel:` or `#` link. */
  href: string;
  /** The accessible name when it should say more than the label, such as `YVML on Instagram`. */
  ariaLabel?: string;
  /** Forces a link to open in a new tab, or keeps one that would. Defaults to true for `http(s)` addresses. */
  external?: boolean;
};

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

/** YVML's social media accounts, as menu items for the header and footer. */
export const SOCIAL: MenuItem[] = [
  { key: 'instagram', label: 'Instagram', ariaLabel: 'YVML on Instagram', href: 'https://www.instagram.com/yuccavalleymaterial/' },
  { key: 'facebook', label: 'Facebook', ariaLabel: 'YVML on Facebook', href: 'https://www.facebook.com/yuccavalleymaterial/' },
  { key: 'youtube', label: 'YouTube', ariaLabel: 'YVML on YouTube', href: 'https://www.youtube.com/@YuccaValleyMaterial' },
];

/**
 * The header navigation, in the order of SITEMAP.md, as the key of each label (read with `t` at render time) and where
 * it goes. A destination without a page yet links to '#'. Every header, the home page's included, is built from this.
 */
export const MAIN_NAV: readonly { key: TextKey; href: string }[] = [
  { key: 'navAbout', href: '/about' },
  { key: 'navWorkshops', href: '/workshops' },
  { key: 'navResidencies', href: '#' },
  { key: 'navPeople', href: '/people' },
  { key: 'navEvents', href: '/events' },
  { key: 'navSupport', href: '/support' },
];
