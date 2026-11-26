// apps/web/src/components/home/nav.ts
import type { TextKey } from '@/i18n';

/** The header navigation from SITEMAP.md, as the key of each label (read with `t` at render time) and where it goes. A destination without a page yet links to '#'. */
export const HOME_NAV: readonly { key: TextKey; href: string }[] = [
  { key: 'navAbout', href: '/about' },
  { key: 'navWorkshops', href: '/workshops' },
  { key: 'navResidencies', href: '#' },
  { key: 'navPeople', href: '/people' },
  { key: 'navEvents', href: '/events' },
  { key: 'navSupport', href: '#' },
];
