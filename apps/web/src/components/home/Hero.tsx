// apps/web/src/components/home/Hero.tsx
import { Cover, ItemList, Picture, SiteMasthead, ThemeToggle, Wrap } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { MASTHEAD_ID } from '@/components/layout';
import { LanguageSwitcher, nextLink } from '@/components/navigation';
import { Weather } from '@/components/weather';
import { MAIN_NAV, ORG_NAME, SITE_SHORT_NAME } from '@/constants';
import { t } from '@/i18n';

/** The utility links at the start of the masthead's utility row. */
function UtilityLinks() {
  return (
    <>
      <Weather />
      <NextLink href="#">{t('navShop')}</NextLink>
      <NextLink href="/about/contact">{t('navContact')}</NextLink>
    </>
  );
}

/**
 * The first screen: the masthead (the utility row, the wordmark centered and the tabs under it) over the hero media, which
 * is a placeholder photograph until there is a video montage.
 *
 * @returns the hero.
 */
export function Hero() {
  const tabs = MAIN_NAV.map((item) => ({ key: item.key, label: t(item.key), link: nextLink(item.href) }));
  return (
    <Cover as="section" min="screen" scrim="top" label={ORG_NAME} media={<Picture shape="fill" src="/images/home/pink.jpg" alt="" width={1600} height={900} priority />}>
      <SiteMasthead
        id={MASTHEAD_ID}
        start={<UtilityLinks />}
        end={
          <>
            <Wrap>
              <LanguageSwitcher />
            </Wrap>
            <ThemeToggle />
          </>
        }
        wordmark={{ text: ORG_NAME, short: SITE_SHORT_NAME, link: nextLink('/') }}
        tabs={tabs}
        menu={{
          label: t('navMenu'),
          control: <LanguageSwitcher />,
          panel: (
            <>
              <ItemList gap="2">
                {MAIN_NAV.map((item) => (
                  <li key={item.key}>
                    <NextLink href={item.href}>{t(item.key)}</NextLink>
                  </li>
                ))}
              </ItemList>
              <Wrap gap="4" align="center">
                <UtilityLinks />
                <ThemeToggle />
              </Wrap>
            </>
          ),
        }}
      />
    </Cover>
  );
}
