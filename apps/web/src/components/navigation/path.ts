// apps/web/src/components/navigation/path.ts
import { NAV_GROUPS } from '@/constants';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n';

/**
 * The group a path belongs to.
 *
 * @param path - a path without the leading slash, such as `about/staff`.
 * @returns the group, or undefined when the path is outside both groups.
 */
export const groupForPath = (path: string) =>
  NAV_GROUPS.find((group) => path === group.path || path.startsWith(`${group.path}/`));

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.filter(({ code }) => code !== DEFAULT_LOCALE).map(({ code }) => code).join('|')})(?=/|$)`);

/**
 * The site path of an address, as `groupForPath` and the navigation read it.
 *
 * @param asPath - the router's address, such as `/es/about/staff?x=1`.
 * @returns the path without the language, query or outer slashes: `about/staff`.
 */
export const routePath = (asPath: string) => (asPath.split(/[?#]/)[0] ?? '').replace(LOCALE_PREFIX, '').replace(/^\/+|\/+$/g, '');
