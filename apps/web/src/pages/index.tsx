// apps/web/src/pages/index.tsx
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
import { Hero } from '@/components/home/Hero';
import { ImpactStats } from '@/components/home/ImpactStats';
import { LazyEyeSection } from '@/components/home/LazyEyeSection';
import { materialHue } from '@/components/home/materials';
import { Site } from '@/components/layout';
import { ORG_NAME } from '@/constants';
import { t } from '@/i18n';
import { type HomeProps, homeLoader } from '@/lib/loaders';
import { workshopView } from '@/lib/workshop';

export const getStaticProps = homeLoader;

const IMAGES = '/images/home';

/**
 * The home page, in the order of SITEMAP.md: the notice, the hero with its masthead, the statement, the workshops, the
 * figures, the residencies, the donate band, Yucca Alta, the testimonial, the current Lazy Eye exhibition and the
 * newsletter. The workshops are the real upcoming ones; the residencies, the testimonial and the promos are placeholders
 * until there is content for them.
 *
 * @param props - the open workshops still to come, soonest first.
 * @returns the page.
 */
export default function HomePage({ workshops }: HomeProps) {
  const [feature, ...rest] = workshops.map(workshopView);
  return (
    <Site hero={<Hero />} subNav={false}>
        <VisuallyHidden as="h1">{ORG_NAME}</VisuallyHidden>
        <Surface tone="teal" pad="loose">
          <Measure>
            <Text face="display" size="3xl" tone="inherit">
              {t('homeStatement', { name: ORG_NAME })} <em>{t('homeStatementEmphasis')}</em>.
            </Text>
          </Measure>
        </Surface>

        {feature && (
          <Surface as="section" pad="none" label={t('navWorkshops')}>
            <Section
              id="workshops"
              label={t('navWorkshops')}
              display
              pinned
              action={(className) => (
                <NextLink className={className} href="/workshops">
                  {t('homeMoreWorkshops')}
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
                        <span aria-hidden>{t('register')}</span>
                        <VisuallyHidden>{t('registerFor', { title: feature.title })}</VisuallyHidden>
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

        <Surface as="section" pad="none" label={t('navResidencies')}>
          <Section
            id="residencies"
            label={t('navResidencies')}
            display
            action={(className) => (
              <a className={className} href="#">
                {t('homeViewResidencies')}
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
                        {t('homeResidency')}
                      </Text>
                      <Text variant="caption">{t('colDates')}</Text>
                    </Stack>
                  </Link>
                </Cell>
              ))}
            </Grid>
          </Section>
        </Surface>

        <Surface as="section" tone="fiber-arts" pad="loose" label={t('navDonate')}>
          <Stack gap="6">
            <Text face="display" size="6xl" tone="inherit">
              {t('homeDonateHeading')}
            </Text>
            <Wrap>
              <Button asChild>
                <a href="#">{t('navDonate')}</a>
              </Button>
            </Wrap>
          </Stack>
        </Surface>

        <SplitGrid gap="none">
          <Surface as="aside" tone="earth-building" pad="loose" min="third">
            <Stack gap="8">
              <Title level="h3" tone="inherit">
                <a href="#">{t('homeYuccaAlta')}</a>
              </Title>
              <Wrap>
                <Button asChild>
                  <a href="#">{t('homeVisit')}</a>
                </Button>
              </Wrap>
            </Stack>
          </Surface>
          <Picture shape="fill" src={`${IMAGES}/quonset.jpg`} alt="" width={1200} height={800} />
        </SplitGrid>

        <Surface as="section" tone="teal" min="third" place="center" label={t('homeTestimonial')}>
          <Text face="display" size="3xl" tone="inherit">
            {t('homeTestimonial')}
          </Text>
        </Surface>

        <LazyEyeSection />

        <Surface as="section" tone="earth-building" min="third" place="center" label={t('homeNewsletter')}>
          <Stack gap="4">
            <Title level="h2" tone="inherit">
              {t('homeNewsletter')}
            </Title>
            <form onSubmit={(event) => event.preventDefault()}>
              <Wrap gap="3" nowrap>
                <Input type="email" autoComplete="email" placeholder={t('homeEmail')} aria-label={t('homeEmail')} />
                <Button type="submit">{t('homeSubscribe')}</Button>
              </Wrap>
            </form>
          </Stack>
        </Surface>
    </Site>
  );
}
