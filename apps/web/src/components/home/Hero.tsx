// apps/web/src/components/home/Hero.tsx
import { Cover, ItemList, SiteMasthead, ThemeToggle, Wrap } from '@hmidmismi/ui';
import NextLink from 'next/link';
import { LanguageSwitcher, nextLink } from '@/components/navigation';
import { Weather } from '@/components/weather';
import { ORG_NAME, SITE_SHORT_NAME } from '@/constants';
import { HOME_NAV } from './nav';

const tabs = HOME_NAV.map((item) => ({ key: item.label, label: item.label, link: nextLink(item.href) }));

/** The utility links at the start of the masthead's utility row. */
function UtilityLinks() {
  return (
    <>
      <Weather />
      <NextLink href="#">Shop</NextLink>
      <NextLink href="/about/contact">Contact</NextLink>
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
  return (
    <Cover as="section" min="screen" scrim="top" label={ORG_NAME} media={<img src="/images/home/pink.jpg" alt="" />}>
      <SiteMasthead
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
          label: 'Menu',
          control: <LanguageSwitcher />,
          panel: (
            <>
              <ItemList gap="2">
                {HOME_NAV.map((item) => (
                  <li key={item.label}>
                    <NextLink href={item.href}>{item.label}</NextLink>
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
