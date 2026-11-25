// apps/web/src/components/home-c/HomeC.tsx
import Link from 'next/link';
import { useRef } from 'react';
import { useHeadroom } from '@/hooks';
import { HOME_NAV, HomeFooter, HomeNotice, LocaleLink, materialStyle, shared, ThemeButton, workshopView } from '@/components/home';
import { Weather } from '@/components/weather';
import { ORG_NAME, SITE_SHORT_NAME } from '@/constants';
import type { WorkshopSummary } from '@/lib/sanity';
import styles from './HomeC.module.css';

const IMAGES = '/images/home';

/** The links at the left of the utility row. */
function UtilityLinks() {
  return (
    <>
      <Weather />
      <a href="#">Shop</a>
      <Link href="/about/contact">Contact</Link>
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
        <Link className={styles.barWm} href="/">
          <span className={styles.full}>{ORG_NAME}</span>
          <span className={styles.short} aria-hidden>
            {SITE_SHORT_NAME}
          </span>
          <span className={shared.sr}>{SITE_SHORT_NAME}</span>
        </Link>
        <nav className={styles.barNav} aria-label="Main">
          <ul>
            {HOME_NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href}>{item.label}</Link>
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
                        <Link href={item.href}>{item.label}</Link>
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
            <Link className={styles.wm} href="/">
              <span className={styles.full}>{ORG_NAME}</span>
              <span className={styles.short} aria-hidden>
                {SITE_SHORT_NAME}
              </span>
              <span className={shared.sr}>{SITE_SHORT_NAME}</span>
            </Link>
            <LocaleLink className={styles.mlang} />
            <div className={styles.ur}>
              <LocaleLink />
              <ThemeButton />
            </div>
            <nav className={styles.nav} aria-label="Main">
              <ul>
                {HOME_NAV.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href}>{item.label}</Link>
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
        {feature && (
          <section aria-labelledby="workshops">
            <h2 className={styles.h} id="workshops">
              Workshops
              <Link href="/workshops">
                All<span aria-hidden> →</span>
              </Link>
            </h2>
            <div className={styles.ho}>
              <div className={styles.ho2}>
                <article className={styles.fc} data-m style={materialStyle(feature.material)}>
                  <div className={styles.fp}>{feature.imageUrl && <img src={feature.imageUrl} alt="" />}</div>
                  <div className={styles.fk}>
                    <p className={styles.fd}>{feature.dates}</p>
                    <h3>
                      <Link href={feature.href}>{feature.title}</Link>
                    </h3>
                    <p className={styles.fm}>
                      <span>{feature.material}</span>
                      <span>{feature.instructor}</span>
                      <span>{feature.price}</span>
                    </p>
                    <Link className={styles.btn} href={feature.href}>
                      Register<span className={shared.sr}> for {feature.title}</span>
                    </Link>
                  </div>
                </article>
                <div className={styles.oc}>
                  <div className={styles.os} role="region" aria-label="Open workshops" tabIndex={0}>
                    <ul>
                      {rest.map((workshop) => (
                        <li key={workshop.id} data-m style={materialStyle(workshop.material)}>
                          <Link href={workshop.href}>
                            {workshop.imageUrl ? <img src={workshop.imageUrl} alt="" loading="lazy" /> : <span />}
                            <span className={styles.ot}>
                              <span className={styles.od}>{workshop.dates}</span>
                              <b>{workshop.title}</b>
                              <span className={styles.om}>
                                <span className={styles.mat}>{workshop.material}</span>
                                <span>{workshop.price}</span>
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className={styles.statement}>
          <p>
            {ORG_NAME} champions a decentralized, inclusive, and affordable model for art education grounded in{' '}
            <em>direct material exploration</em>.
          </p>
        </section>

        <article className={styles.pn} data-m style={materialStyle('Earth building')}>
          <div className={styles.pt}>
            <h3>
              <a href="#">Yucca Alta</a>
            </h3>
            <a className={styles.act} href="#">
              Visit<span aria-hidden> →</span>
            </a>
          </div>
          <img src={`${IMAGES}/quonset.jpg`} alt="" loading="lazy" />
        </article>

        <section className={styles.band} data-m style={materialStyle('Fiber arts')} aria-label="Donate">
          <p className={styles.big}>Giving isn’t passive</p>
          <a className={styles.btn} href="#">
            Donate
          </a>
        </section>

        <section aria-labelledby="residencies">
          <h2 className={styles.h} id="residencies">
            Residencies
            <a href="#">
              All<span aria-hidden> →</span>
            </a>
          </h2>
          <ul className={styles.cards}>
            {['yard', 'youth-3', 'quonset'].map((image) => (
              <li key={image}>
                <a href="#">
                  <img src={`${IMAGES}/${image}.jpg`} alt="" loading="lazy" />
                  <b>Residency</b>
                  <span>Dates</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={`${styles.band} ${styles.quote}`} aria-label="Testimonial">
          <blockquote>Testimonial</blockquote>
        </section>

        <article className={`${styles.pn} ${styles.flip}`} data-m style={materialStyle('Glass')}>
          <div className={styles.pt}>
            <h3>
              <Link href="/lazy-eye">Lazy Eye Gallery</Link>
            </h3>
            <Link className={styles.act} href="/lazy-eye">
              Visit<span aria-hidden> →</span>
            </Link>
          </div>
          <img src="/images/lazy-eye/kento-saisho.webp" alt="" loading="lazy" />
        </article>

        <section className={styles.band} data-m style={materialStyle('Earth building')} aria-labelledby="newsletter">
          <h2 className={styles.big} id="newsletter">
            Newsletter
          </h2>
          <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
            <label className={shared.sr} htmlFor="newsletter-email">
              Email address
            </label>
            <input id="newsletter-email" type="email" autoComplete="email" placeholder="Email address" />
            <button className={styles.btn} type="submit">
              Subscribe
            </button>
          </form>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
