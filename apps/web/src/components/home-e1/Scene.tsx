// apps/web/src/components/home-e1/Scene.tsx
import { cubicBezier, motion, useTransform } from 'framer-motion';
import type { ReactNode } from 'react';
import { shared } from '@/components/home';
import { DuotoneImage } from './DuotoneImage';
import styles from './HomeE1.module.css';
import { CHAIN, ENTER, PALETTES, type Placed, type SceneSpec } from './timeline';
import { useTimeline } from './TimelineContext';

const SLIDE = cubicBezier(0.16, 1, 0.3, 1);

/**
 * Everything that moves on a scene, as values derived from the one timeline:
 * - `slide` carries the scene up over the one before it;
 * - `covered` is how far the next scene has slid over it, and the photograph, then the text, go out with it, the text sooner;
 * - the title, then the button, arrive one after the other once the scene has settled.
 *
 * @param scene - the scene and its place on the timeline.
 * @param nextStart - when the next scene starts to slide in, if there is one.
 * @returns the motion values.
 */
export function useSceneMotion(scene: Placed<SceneSpec>, nextStart: number | undefined) {
  const { t } = useTimeline();
  const first = scene.index === 0;
  const slide = useTransform(t, [scene.start, scene.settled + (first ? 1 : 0)], first ? ['0%', '0%'] : ['100%', '0%'], { ease: SLIDE });
  const covered = useTransform(t, [nextStart ?? 1e6, (nextStart ?? 1e6) + ENTER], [0, 1]);
  const photoOpacity = useTransform(covered, [0, 0.62], [1, 0]);
  const photoY = useTransform(covered, [0, 1], ['0%', '-9%']);
  const fade = useTransform(covered, [0, 0.29], [1, 0]);
  const visibility = useTransform(covered, (c) => (c >= 1 ? 'hidden' : 'visible'));
  const titleIn = useTransform(t, [scene.settled + CHAIN.title[0], scene.settled + CHAIN.title[1]], [0, 1]);
  const buttonIn = useTransform(t, [scene.settled + CHAIN.button[0], scene.settled + CHAIN.button[1]], [0, 1]);
  const titleOpacity = useTransform([titleIn, fade], ([a, b]) => (a as number) * (b as number));
  const buttonOpacity = useTransform([buttonIn, fade], ([a, b]) => (a as number) * (b as number));
  const titleY = useTransform(titleIn, [0, 1], ['28px', '0px']);
  const buttonY = useTransform(buttonIn, [0, 1], ['20px', '0px']);
  return { slide, covered, photoOpacity, photoY, fade, visibility, titleOpacity, titleY, buttonOpacity, buttonY };
}

/** The motion a scene gives its parts. */
export type SceneMotion = ReturnType<typeof useSceneMotion>;

/** The scene's own wrapper: full screen, its solid colour, sliding up. */
export function SceneShell({
  scene,
  motion: m,
  label,
  children,
}: {
  scene: Placed<SceneSpec>;
  motion: SceneMotion;
  label?: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      className={`${styles.scene} ${styles[scene.palette]}`}
      style={{ y: m.slide, visibility: m.visibility, zIndex: scene.index }}
      aria-label={label}
    >
      {children}
    </motion.section>
  );
}

/** A photograph as a duotone on the right, fading into the solid colour on the left, drifting up as it is covered. */
function Photograph({ scene, src, motion: m, full }: { scene: Placed<SceneSpec>; src: string; motion: SceneMotion; full?: boolean }) {
  const { markReady } = useTimeline();
  const { shadow, highlight } = PALETTES[scene.palette];
  return (
    <motion.div className={`${styles.ph} ${full ? styles.phFull : ''}`} style={{ y: m.photoY, opacity: m.photoOpacity }}>
      <DuotoneImage src={src} shadow={shadow} highlight={highlight} onReady={() => markReady(scene.index)} />
    </motion.div>
  );
}

/** The first screen: a photograph (a video later). */
export function HeroScene({ scene, nextStart, image }: { scene: Placed<SceneSpec>; nextStart?: number; image: string }) {
  const m = useSceneMotion(scene, nextStart);
  return (
    <SceneShell scene={scene} motion={m}>
      <Photograph scene={scene} src={image} motion={m} full />
    </SceneShell>
  );
}

/** A card with a photograph, a bold title or a lede, and one button. */
export function PhotoScene({
  scene,
  nextStart,
  image,
  title,
  lede,
  action,
}: {
  scene: Placed<SceneSpec>;
  nextStart?: number;
  image: string;
  title?: string;
  lede?: string;
  action?: ReactNode;
}) {
  const m = useSceneMotion(scene, nextStart);
  return (
    <SceneShell scene={scene} motion={m}>
      <Photograph scene={scene} src={image} motion={m} />
      <p className={shared.sr}>{scene.label}</p>
      <div className={styles.b}>
        {lede ? (
          <motion.p className={styles.lede} style={{ opacity: m.titleOpacity, y: m.titleY }}>
            {lede}
          </motion.p>
        ) : (
          <motion.h2 className={styles.t} style={{ opacity: m.titleOpacity, y: m.titleY }}>
            {title}
          </motion.h2>
        )}
        {action && (
          <motion.div className={styles.a} style={{ opacity: m.buttonOpacity, y: m.buttonY }}>
            {action}
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}

/** A card that is only colour and type: the testimonial and the newsletter. */
export function BandScene({
  scene,
  nextStart,
  title,
  form,
  label,
}: {
  scene: Placed<SceneSpec>;
  nextStart?: number;
  title: string;
  form?: ReactNode;
  label: string;
}) {
  const m = useSceneMotion(scene, nextStart);
  return (
    <SceneShell scene={scene} motion={m} label={label}>
      <div className={styles.band}>
        <motion.h2 className={styles.t} style={{ opacity: m.titleOpacity, y: m.titleY }}>
          {title}
        </motion.h2>
        {form && (
          <motion.div style={{ opacity: m.buttonOpacity, y: m.buttonY }}>
            {form}
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
