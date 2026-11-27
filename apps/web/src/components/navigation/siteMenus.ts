// apps/web/src/components/navigation/siteMenus.ts
import { menuLinks } from './menuLinks';
import { MAIN_NAV, SOCIAL } from '@/constants';
import { t } from '@/i18n';

/**
 * The header navigation from `MAIN_NAV`. Built per render: the labels follow the page's language.
 *
 * @returns the navigation links.
 */
export const mainMenu = () =>
  menuLinks(MAIN_NAV.map((item) => ({ key: item.key, label: t(item.key), href: item.href })));

/** The social media links, at the end of the footer's links. */
export const socialMenu = menuLinks(SOCIAL);
