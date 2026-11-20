import { SiteFooter, SiteHeader, ThemeToggle, type LinkRender } from '@hmidmismi/ui';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { NAV_GROUPS, type NavGroup, SECTIONS, SITE_NAME } from '@/lib/site';

/**
 * Builds the link renderer the UI package expects from a Next route.
 *
 * @param href - the route.
 * @returns a renderer that gives the link the component's class.
 */
export const nextLink =
  (href: string): LinkRender =>
  (className, content) => (
    <NextLink href={href} className={className}>
      {content}
    </NextLink>
  );

const groupTab = (group: NavGroup) => ({
  key: group.path,
  label: group.title,
  link: nextLink(`/${group.path}`),
});

/** About YVML first, then the listings, then Support Us. */
const tabs = [
  ...NAV_GROUPS.filter((group) => group.path === 'about').map(groupTab),
  ...SECTIONS.map((section) => ({
    key: section.type,
    label: section.title,
    link: nextLink(`/${section.path}`),
  })),
  ...NAV_GROUPS.filter((group) => group.path === 'support').map(groupTab),
];

/**
 * The page frame: the sticky header with the section tabs, the page, and the footer.
 *
 * @param props - the page content.
 * @returns the frame.
 */
export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader
        utility={[]}
        wordmark={{ text: SITE_NAME, link: nextLink('/') }}
        tabs={tabs}
        actions={
          <>
            <LanguageSwitcher />
            <ThemeToggle />
          </>
        }
      />
      {children}
      <SiteFooter
        links={tabs}
        copyright={`© ${new Date().getFullYear()} ${SITE_NAME}`}
        status={{ label: 'Upcoming events', link: nextLink('/events') }}
        note="Dates and registration are on each entry's page."
      />
    </>
  );
}
