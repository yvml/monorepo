// apps/web/src/components/navigation/menus.ts
import { menuLinks } from './menuLinks';
import { NAV_GROUPS, type NavGroup, SECTIONS, SOCIAL } from '@/constants';
import { t } from '@/i18n';

const groupItem = (group: NavGroup) => ({ key: group.path, label: t(group.title), href: `/${group.path}` });

/**
 * About YVML first, then the listings, then Support Us. Built per render: the labels follow the page's language.
 *
 * @returns the navigation links.
 */
export const mainMenu = () =>
  menuLinks([
    ...NAV_GROUPS.filter((group) => group.path === 'about').map(groupItem),
    ...SECTIONS.map((section) => ({ key: section.type, label: t(section.title), href: `/${section.path}` })),
    ...NAV_GROUPS.filter((group) => group.path === 'support').map(groupItem),
  ]);

/** The social media links, in the header's utility row and at the end of the footer's links. */
export const socialMenu = menuLinks(SOCIAL);
