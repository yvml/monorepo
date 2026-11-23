// apps/web/src/components/layout/Site.tsx
import { SiteFooter, SiteHeader, ThemeToggle } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { LanguageSwitcher, mainMenu, nextLink, socialMenu, SubNav } from '@/components/navigation';
import { SITE_NAME } from '@/constants';
import { t } from '@/i18n';

/**
 * The page frame: the sticky header with the section tabs, the page, and the footer.
 *
 * @param props - the page content and the page's title, shown in the tab before the site name (the home page has none). A title from Sanity may carry the markers click-to-edit adds, so it is cleaned here.
 * @returns the frame.
 */
export function Site({ title, children }: { title?: string; children: ReactNode }) {
  const tabs = mainMenu();
  return (
    <>
      <Head>
        <title>{title ? `${stegaClean(title)} · ${SITE_NAME}` : SITE_NAME}</title>
      </Head>
      <SiteHeader
        utility={socialMenu}
        wordmark={{ text: SITE_NAME, link: nextLink('/') }}
        tabs={tabs}
        actions={
          <>
            <LanguageSwitcher />
            <ThemeToggle />
          </>
        }
      />
      <SubNav />
      {/* The page's one main landmark, so screen-reader users can jump to the content. */}
      <main>{children}</main>
      <SiteFooter
        links={[...tabs, ...socialMenu]}
        copyright={`© ${new Date().getFullYear()} ${SITE_NAME}`}
        status={{ label: t('upcomingEvents'), link: nextLink('/events') }}
        note={t('footerNote')}
      />
    </>
  );
}
