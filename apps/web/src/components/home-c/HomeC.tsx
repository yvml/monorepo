// apps/web/src/components/home-c/HomeC.tsx
import {
  Button,
  Card,
  Cell,
  Grid,
  Input,
  ItemList,
  Link,
  Measure,
  Picture,
  Row,
  Section,
  SplitGrid,
  Stack,
  Surface,
  Text,
  Title,
  VisuallyHidden,
  Wrap,
} from '@hmidmismi/ui';
import NextLink from 'next/link';
import { useRef } from 'react';
import { HOME_NAV, HomeNotice, LocaleLink, materialHue, shared, ThemeButton, workshopView } from '@/components/home';
import { PageFooter } from '@/components/layout';
import { RememberedLink } from '@/components/navigation';
import { Weather } from '@/components/weather';
import { ORG_NAME, SITE_SHORT_NAME } from '@/constants';
import { useHeadroom } from '@/hooks';
import type { WorkshopSummary } from '@/lib/sanity';
import styles from './HomeC.module.css';
import { ImpactStats } from './ImpactStats';
import { PinnedLazyEye } from './PinnedLazyEye';

const IMAGES = '/images/home';

/** The links at the left of the utility row. */
function UtilityLinks() {
  return (
    <>
      <Weather />
      <a href="#">Shop</a>
      <NextLink href="/about/contact">Contact</NextLink>
    </>
  );
}

/**
 * Home C: the notice, then one full-screen block with a utility row, the wordmark and the menu over the media, then the
 * cards and blocks in SITEMAP.md's order. The workshops are the real upcoming ones; the residencies, the testimonial and
 * the promos are placeholders until there is content for them.
 *
 * @param props - the open workshops still to come, soonest first.
 * @returns the page.
 */
export function HomeC({ workshops }: { workshops: WorkshopSummary[] }) {
  const [feature, ...rest] = workshops.map(workshopView);
  const bar = useRef<HTMLElement>(null);
  // The large masthead is the first screen; past it, a compact bar comes back whenever the visitor scrolls up.
  useHeadroom(bar, { atTop: 'hidden', threshold: () => innerHeight * 0.7 });
  return (
    <div className={shared.root}>
      <header ref={bar} className={styles.bar} data-state="hidden">
        <NextLink className={styles.barWm} href="/">
          <span className={styles.full}>{ORG_NAME}</span>
          <span className={styles.short} aria-hidden>
            {SITE_SHORT_NAME}
          </span>
          <span className={shared.sr}>{SITE_SHORT_NAME}</span>
        </NextLink>
        <nav className={styles.barNav} aria-label="Main">
          <ul>
            {HOME_NAV.map((item) => (
              <li key={item.label}>
                <RememberedLink href={item.href}>{item.label}</RememberedLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.barTools}>
          <LocaleLink />
          <ThemeButton />
        </div>
      </header>
      <div className={styles.first}>
        <HomeNotice />
        <div className={styles.hero}>
          <header className={styles.hd}>
            <div className={styles.ul}>
              <UtilityLinks />
            </div>
            <details className={styles.menu}>
              <summary>Menu</summary>
              <div className={styles.panel}>
                <nav aria-label="Main">
                  <ul>
                    {HOME_NAV.map((item) => (
                      <li key={item.label}>
                        <RememberedLink href={item.href}>{item.label}</RememberedLink>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className={styles.pu}>
                  <UtilityLinks />
                  <ThemeButton />
                </div>
              </div>
            </details>
            <NextLink className={styles.wm} href="/">
              <span className={styles.full}>{ORG_NAME}</span>
              <span className={styles.short} aria-hidden>
                {SITE_SHORT_NAME}
              </span>
              <span className={shared.sr}>{SITE_SHORT_NAME}</span>
            </NextLink>
            <LocaleLink className={styles.mlang} />
            <div className={styles.ur}>
              <LocaleLink />
              <ThemeButton />
            </div>
            <nav className={styles.nav} aria-label="Main">
              <ul>
                {HOME_NAV.map((item) => (
                  <li key={item.label}>
                    <RememberedLink href={item.href}>{item.label}</RememberedLink>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          {/* The hero media: a placeholder photograph until the video montage exists. */}
          <img src={`${IMAGES}/pink.jpg`} alt="" />
        </div>
      </div>

      <main id="main">
        <Surface tone="teal" pad="loose">
          <Measure>
            <Text face="display" size="3xl" tone="inherit">
              {ORG_NAME} champions a decentralized, inclusive, and affordable model for art education grounded in{' '}
              <em>direct material exploration</em>.
            </Text>
          </Measure>
        </Surface>

        {feature && (
          <Surface as="section" pad="none" label="Workshops">
            <Section
              id="workshops"
              label="Workshops"
              pinned
              action={(className) => (
                <NextLink className={className} href="/workshops">
                  More Workshops →
                </NextLink>
              )}
            >
              <SplitGrid ratio="wide" sticky gap="lg">
                <Card hue={materialHue(feature.material)} tint="soft">
                  {feature.imageUrl && <Picture shape="photo" src={feature.imageUrl} alt="" width={1200} height={800} />}
                  <Text face="display" size="4xl" figures>
                    {feature.dates}
                  </Text>
                  <Title level="h3">
                    <NextLink href={feature.href}>{feature.title}</NextLink>
                  </Title>
                  <Text variant="small">{[feature.material, feature.instructor, feature.price].filter(Boolean).join(' · ')}</Text>
                  <Wrap>
                    <Button asChild>
                      <NextLink href={feature.href}>
                        Register<VisuallyHidden> for {feature.title}</VisuallyHidden>
                      </NextLink>
                    </Button>
                  </Wrap>
                </Card>
                <ItemList gap="0" closed>
                  {rest.map((workshop) => (
                    <li key={workshop.id}>
                      <Row
                        layout="thumb"
                        lead={
                          workshop.imageUrl ? (
                            <Picture shape="thumb" src={workshop.imageUrl} alt="" width={400} height={400} />
                          ) : undefined
                        }
                        title={workshop.title}
                        meta={[workshop.dates, workshop.material, workshop.instructor, workshop.price].filter(Boolean).join(' · ')}
                        link={(className, content) => (
                          <NextLink className={className} href={workshop.href}>
                            {content}
                          </NextLink>
                        )}
                      />
                    </li>
                  ))}
                </ItemList>
              </SplitGrid>
            </Section>
          </Surface>
        )}

        <ImpactStats />

        <Surface as="section" pad="none" label="Residencies">
          <Section
            id="residencies"
            label="Residencies"
            action={(className) => (
              <a className={className} href="#">
                View Residencies →
              </a>
            )}
          >
            <Grid>
              {['yard', 'youth-3', 'quonset'].map((image) => (
                <Cell key={image} span="4">
                  <Link href="#">
                    <Stack gap="1">
                      <Picture shape="photo" src={`${IMAGES}/${image}.jpg`} alt="" width={1200} height={800} />
                      <Text face="display" size="2xl">
                        Residency
                      </Text>
                      <Text variant="caption">Dates</Text>
                    </Stack>
                  </Link>
                </Cell>
              ))}
            </Grid>
          </Section>
        </Surface>

        <Surface as="section" tone="fiber-arts" pad="loose" label="Donate">
          <Stack gap="6">
            <Text face="display" size="6xl" tone="inherit">
              Giving isn’t passive
            </Text>
            <Wrap>
              <Button asChild>
                <a href="#">Donate</a>
              </Button>
            </Wrap>
          </Stack>
        </Surface>

        <SplitGrid gap="none">
          <Surface as="aside" tone="earth-building" pad="loose" min="third">
            <Stack gap="8">
              <Title level="h3" tone="inherit">
                <a href="#">Yucca Alta</a>
              </Title>
              <Wrap>
                <Button asChild>
                  <a href="#">Visit</a>
                </Button>
              </Wrap>
            </Stack>
          </Surface>
          <Picture shape="fill" src={`${IMAGES}/quonset.jpg`} alt="" width={1200} height={800} />
        </SplitGrid>

        <Surface as="section" tone="teal" min="third" place="center" label="Testimonial">
          <Text face="display" size="3xl" tone="inherit">
            Testimonial
          </Text>
        </Surface>

        <PinnedLazyEye />

        <Surface as="section" tone="earth-building" min="third" place="center" label="Newsletter">
          <Stack gap="4">
            <Title level="h2" tone="inherit">
              Newsletter
            </Title>
            <form onSubmit={(event) => event.preventDefault()}>
              <Wrap gap="3">
                <Input type="email" autoComplete="email" placeholder="Email address" aria-label="Email address" />
                <Button type="submit">Subscribe</Button>
              </Wrap>
            </form>
          </Stack>
        </Surface>
      </main>

      <PageFooter />
    </div>
  );
}
