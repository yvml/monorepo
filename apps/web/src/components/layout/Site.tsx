// apps/web/src/components/layout/Site.tsx
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { GridOverlay } from '@hmidmismi/ui';
import { SubNav } from '@/components/navigation';
import { NoticeBar } from '@/components/notice';
import { SITE_SHORT_NAME } from '@/constants';
import { showDesignTools } from '@/lib/preview/flags';
import { PageFooter } from './PageFooter';
import { PageHeader } from './PageHeader';

/** The id of the masthead a page's hero carries: the header stays out of sight until that has scrolled away, then follows the scroll direction. */
export const MASTHEAD_ID = 'masthead';

/**
 * The page frame: the notice band, the sticky header with the section tabs, the page, and the footer. The header's
 * utility row holds the weather, the language and the theme.
 *
 * @param props - the page content; a `hero` shown above the header (the home page's); whether the section tabs show (`subNav`, on by default); and the page's title, shown in the tab before the site name (the home page has none). A title from Sanity may carry the markers click-to-edit adds, so it is cleaned here.
 * @returns the frame.
 */
export function Site({
  title,
  hero,
  subNav = true,
  children,
}: {
  title?: string;
  hero?: ReactNode;
  subNav?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <Head>
        <title>{title ? `${stegaClean(title)} · ${SITE_SHORT_NAME}` : SITE_SHORT_NAME}</title>
      </Head>
      <NoticeBar />
      {hero}
      <PageHeader after={hero ? MASTHEAD_ID : undefined} />
      {subNav && <SubNav />}
      {/* The page's one main landmark, so screen-reader users can jump to the content. */}
      <main id="main">{children}</main>
      <PageFooter />
      {showDesignTools && <GridOverlay />}
    </>
  );
}
