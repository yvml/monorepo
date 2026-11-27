// apps/web/src/components/layout/PageHeader.tsx
import { SiteHeader, ThemeToggle, Wrap } from '@hmidmismi/ui';
import { LanguageSwitcher, mainMenu, nextLink } from '@/components/navigation';
import { Weather } from '@/components/weather';
import { SITE_SHORT_NAME } from '@/constants';

/**
 * The header of every page: the wordmark and the section tabs in a sticky bar, with the weather, the language and the
 * theme in the utility row above it.
 *
 * @param props - `after`, the id of the cover the page opens with, when it has one: the header then appears once that has scrolled away.
 * @returns the header.
 */
export function PageHeader({ after }: { after?: string }) {
  return (
      <SiteHeader
        after={after}
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
        tabs={mainMenu()}
      />
  );
}
