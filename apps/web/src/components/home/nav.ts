// apps/web/src/components/home/nav.ts

/** The header navigation from SITEMAP.md. A destination without a page yet links to '#'. */
export const HOME_NAV = [
  { label: 'About', href: '/about' },
  { label: 'Workshops', href: '/workshops' },
  { label: 'Residencies', href: '#' },
  { label: 'People', href: '/people' },
  { label: 'Events', href: '/events' },
  { label: 'Support', href: '#' },
] as const;
