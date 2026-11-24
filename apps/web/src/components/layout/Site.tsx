// apps/web/src/components/layout/Site.tsx
import { SiteFooter, SiteHeader, ThemeToggle, Wrap } from '@hmidmismi/ui';
import { stegaClean } from '@sanity/client/stega';
import Head from 'next/head';
import type { ReactNode } from 'react';
import { LanguageSwitcher, mainMenu, nextLink, SubNav, socialMenu } from '@/components/navigation';
import { NoticeBar } from '@/components/notice';
import { Weather } from '@/components/weather';
import { EIN, ORG_NAME, SITE_BUILDER, SITE_SHORT_NAME } from '@/constants';
import { t } from '@/i18n';

/**
 * The page frame: the notice band, the sticky header with the section tabs, the page, and the footer. The header's
 * utility row holds the weather, the language and the theme.
 *
 * @param props - the page content and the page's title, shown in the tab before the site name (the home page has none). A title from Sanity may carry the markers click-to-edit adds, so it is cleaned here.
 * @returns the frame.
 */
export function Site({ title, children }: { title?: string; children: ReactNode }) {
  const tabs = mainMenu();
  return (
    <>
      <Head>
        <title>{title ? `${stegaClean(title)} · ${SITE_SHORT_NAME}` : SITE_SHORT_NAME}</title>
      </Head>
      <NoticeBar />
      <SiteHeader
        utility={
          <>
            <Weather />
            {/* A select fills its parent; in a wrapper that is only as wide as its content, it is as wide as a language code. */}
            <Wrap>
              <LanguageSwitcher />
            </Wrap>
            <ThemeToggle inUtility />
          </>
        }
        wordmark={{ text: SITE_SHORT_NAME, link: nextLink('/') }}
        tabs={tabs}
      />
      <SubNav />
      {/* The page's one main landmark, so screen-reader users can jump to the content. */}
      <main>{children}</main>
      <SiteFooter
        links={[...tabs, ...socialMenu]}
        copyright={t('copyright', { year: new Date().getFullYear(), name: ORG_NAME })}
        notes={[t('nonprofitStatus', { name: ORG_NAME, ein: EIN }), t('siteBy', { name: SITE_BUILDER })]}
      />
    </>
  );
}
