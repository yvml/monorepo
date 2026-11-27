// apps/web/src/components/layout/PageHeader.tsx
import { SiteBar, SiteHeader, ThemeToggle, Wrap } from '@hmidmismi/ui';
import { LanguageSwitcher, mainMenu, nextLink, UtilityLinks } from '@/components/navigation';
import { Weather } from '@/components/weather';
import { SITE_SHORT_NAME } from '@/constants';

/**
 * The header of every page. A page that opens with a masthead (`after`) gets the compact bar once that has scrolled away:
 * the wordmark centered, the weather and the shop at the start, the language and the theme at the end. Every other page
 * gets the sticky header: the wordmark and the section tabs in a bar, with the weather, the language and the theme in the
 * utility row above it.
 *
 * @param props - `after`, the id of the masthead the page opens with, when it has one.
 * @returns the header.
 */
export function PageHeader({ after }: { after?: string }) {
  const wordmark = { text: SITE_SHORT_NAME, link: nextLink('/') };
  // A select fills its parent; in a wrapper that is only as wide as its content, it is as wide as a language code.
  const language = (
    <Wrap>
      <LanguageSwitcher />
    </Wrap>
  );

  if (after) {
    return (
      <SiteBar
        after={after}
        wordmark={wordmark}
        start={<UtilityLinks />}
        end={
          <>
            {language}
            <ThemeToggle inUtility />
          </>
        }
      />
    );
  }
  return (
    <SiteHeader
      headroom
      utility={
        <>
          <Weather />
          {language}
          <ThemeToggle inUtility />
        </>
      }
      wordmark={wordmark}
      tabs={mainMenu()}
    />
  );
}
