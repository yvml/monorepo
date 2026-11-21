// apps/web/src/components/SiteLayout.tsx
import { SiteFooter, SiteHeader, ThemeToggle, type LinkRender } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { menuLinks } from '@/lib/menu';
import { SITE_NAME } from '@/lib/brand';
import { NAV_GROUPS, type NavGroup, SECTIONS } from '@/lib/navigation';
import { SOCIAL } from '@/lib/social';
import { t } from '@/lib/text';

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

const groupItem = (group: NavGroup) => ({ key: group.path, label: t(group.title), href: `/${group.path}` });

/**
 * About YVML first, then the listings, then Support Us. Built per render: the labels follow the page's language.
 *
 * @returns the navigation links.
 */
const navigationTabs = () =>
  menuLinks([
    ...NAV_GROUPS.filter((group) => group.path === 'about').map(groupItem),
    ...SECTIONS.map((section) => ({ key: section.type, label: t(section.title), href: `/${section.path}` })),
    ...NAV_GROUPS.filter((group) => group.path === 'support').map(groupItem),
  ]);

/** The social media links, in the header's utility row and at the end of the footer's links. */
const social = menuLinks(SOCIAL);

/**
 * The page frame: the sticky header with the section tabs, the page, and the footer.
 *
 * @param props - the page content and the page's title, shown in the tab before the site name (the home page has none). A title from Sanity may carry the markers click-to-edit adds, so it is cleaned here.
 * @returns the frame.
 */
export function SiteLayout({ title, children }: { title?: string; children: ReactNode }) {
  const tabs = navigationTabs();
  return (
    <>
      <Head>
        <title>{title ? `${stegaClean(title)} · ${SITE_NAME}` : SITE_NAME}</title>
      </Head>
      <SiteHeader
        utility={social}
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
        links={[...tabs, ...social]}
        copyright={`© ${new Date().getFullYear()} ${SITE_NAME}`}
        status={{ label: t('upcomingEvents'), link: nextLink('/events') }}
        note={t('footerNote')}
      />
    </>
  );
}
