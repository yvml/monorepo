// apps/web/src/components/home-e1/HomeE1.tsx
import { useMotionValue, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { type ReactNode, useCallback, useMemo, useRef } from 'react';
import { HomeFooter, HomeNotice, shared, workshopView } from '@/components/home';
import { ORG_NAME } from '@/constants';
import type { WorkshopSummary } from '@/lib/sanity';
import { Bar } from './Bar';
import { Eyebrow } from './Eyebrow';
import styles from './HomeE1.module.css';
import { LazyEye } from './LazyEye';
import { BandScene, HeroScene, PhotoScene } from './Scene';
import { type Palette, place, type SceneSpec } from './timeline';
import { TimelineContext } from './TimelineContext';

const IMAGES = '/images/home';

/** A scene and what it shows. */
type Spec = SceneSpec & {
  image?: string;
  title?: string;
  lede?: string;
  action?: ReactNode;
};

const button = (href: string, label: string, hidden?: string) => (
  <Link className={styles.btn} href={href}>
    {label}
    {hidden && <span className={shared.sr}> {hidden}</span>}
  </Link>
);

const WORKSHOP_PALETTES: Palette[] = ['p2', 'p3', 'p4'];

/**
 * Home E.1: a headroom bar over one pinned stage, and the cards of SITEMAP.md's order as scenes on it. One scroll timeline
 * (timeline.ts) places every scene and every step in it; Framer Motion turns that into movement. A card slides up over
 * the one before; once it has settled its title arrives, then its button, then the fixed label. The workshop cards are
 * real; the residencies, the testimonial, the promos and the current exhibition are placeholders until there is content
 * for them.
 *
 * @param props - the open workshops still to come, soonest first.
 * @returns the page.
 */
export function HomeE1({ workshops }: { workshops: WorkshopSummary[] }) {
  const specs = useMemo<Spec[]>(() => {
    const shown = workshops.slice(0, 3).map(workshopView);
    return [
      { id: 'hero', kind: 'hero', palette: 'p1', label: '', image: `${IMAGES}/pink.jpg` },
      ...shown.map(
        (workshop, i): Spec => ({
          id: workshop.id,
          kind: 'photo',
          palette: WORKSHOP_PALETTES[i] ?? 'p2',
          label: 'Workshops',
          image: workshop.imageUrl ?? `${IMAGES}/yard.jpg`,
          title: workshop.title,
          action: button(workshop.href, 'Register', `for ${workshop.title}`),
        })
      ),
      {
        id: 'about',
        kind: 'photo',
        palette: 'p5',
        label: 'About',
        image: `${IMAGES}/youth-2.jpg`,
        lede: `${ORG_NAME} champions a decentralized, inclusive, and affordable model for art education grounded in direct material exploration.`,
      },
      { id: 'yucca-alta', kind: 'photo', palette: 'p1', label: 'Yucca Alta', image: `${IMAGES}/quonset.jpg`, title: 'Yucca Alta', action: button('#', 'Visit', 'Yucca Alta') },
      { id: 'support', kind: 'photo', palette: 'p2', label: 'Support', image: `${IMAGES}/youth-1.jpg`, title: 'Giving isn’t passive', action: button('#', 'Donate') },
      { id: 'residency-1', kind: 'photo', palette: 'p3', label: 'Residencies', image: `${IMAGES}/yard.jpg`, title: 'Residency', action: button('#', 'Read more', 'about the residency') },
      { id: 'residency-2', kind: 'photo', palette: 'p5', label: 'Residencies', image: `${IMAGES}/youth-3.jpg`, title: 'Residency', action: button('#', 'Read more', 'about the residency') },
      { id: 'testimonial', kind: 'band', palette: 'p4', label: '' },
      { id: 'lazy-eye', kind: 'lazy-eye', palette: 'p1', label: '' },
      { id: 'newsletter', kind: 'band', palette: 'p2', label: '', hold: 0.4 },
    ];
  }, [workshops]);
  const { scenes, length } = useMemo(() => place(specs), [specs]);

  // The one timeline: how far the stage has been scrolled, in screens.
  const track = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const t = useTransform(scrollYProgress, (v) => v * length);

  // A scene tells the label when its photographs are in.
  const readySet = useMemo(() => new Set<number>(), []);
  const readyVersion = useMotionValue(0);
  const markReady = useCallback(
    (index: number) => {
      readySet.add(index);
      readyVersion.set(readyVersion.get() + 1);
    },
    [readySet, readyVersion]
  );
  const timeline = useMemo(() => ({ t, markReady }), [t, markReady]);

  const nextStart = (i: number) => scenes[i + 1]?.start;

  return (
    <TimelineContext.Provider value={timeline}>
      <div className={`${shared.root} ${styles.root}`}>
        <HomeNotice />
        <Bar scenes={scenes} />
        <Eyebrow scenes={scenes} readySet={readySet} readyVersion={readyVersion} />

        <main id="main">
          <div ref={track} className={styles.track} style={{ ['--len' as string]: length }}>
            <div className={styles.stage}>
              {scenes.map((scene, i) => {
                const spec = specs[i];
                if (!spec) return null;
                if (scene.kind === 'hero') {
                  return <HeroScene key={scene.id} scene={scene} nextStart={nextStart(i)} image={spec.image ?? ''} />;
                }
                if (scene.kind === 'lazy-eye') {
                  return (
                    <LazyEye
                      key={scene.id}
                      scene={scene}
                      nextStart={nextStart(i)}
                      name="Lazy Eye Gallery"
                      exhibition="Kento Saisho"
                      dates="October 1 – November 15, 2026"
                      image="/images/lazy-eye/kento-saisho.webp"
                    />
                  );
                }
                if (scene.kind === 'band') {
                  return scene.id === 'testimonial' ? (
                    <BandScene key={scene.id} scene={scene} nextStart={nextStart(i)} title="Testimonial" label="Testimonial" />
                  ) : (
                    <BandScene
                      key={scene.id}
                      scene={scene}
                      nextStart={nextStart(i)}
                      title="Newsletter"
                      label="Newsletter"
                      form={
                        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
                          <label className={shared.sr} htmlFor="newsletter-email">
                            Email address
                          </label>
                          <input id="newsletter-email" type="email" autoComplete="email" placeholder="Email address" />
                          <button type="submit">Subscribe</button>
                        </form>
                      }
                    />
                  );
                }
                return (
                  <PhotoScene
                    key={scene.id}
                    scene={scene}
                    nextStart={nextStart(i)}
                    image={spec.image ?? ''}
                    title={spec.title}
                    lede={spec.lede}
                    action={spec.action}
                  />
                );
              })}
            </div>
          </div>
        </main>

        <div className={styles.after}>
          <HomeFooter />
        </div>
      </div>
    </TimelineContext.Provider>
  );
}
