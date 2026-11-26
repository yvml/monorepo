// apps/web/src/components/home-c/PinnedLazyEye.tsx
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LazyEyeStage } from '@/components/home-e1/LazyEye';
import { LAZY_EYE_STORY, PALETTES } from '@/components/home-e1/timeline';
import styles from './HomeC.module.css';

/** Whether the story has played since the page was loaded; a reload plays it again. */
let playedThisVisit = false;
/** How long the stage takes to rise over the page, in screens of scroll. It rises at twice the speed of the page. */
const RISE = 0.5;

/**
 * The current Lazy Eye exhibition: a full-screen stage that rises over the end of the page like a curtain once the
 * region above it has ended, then stays pinned while the halftone tells its story, then lets the page go on. The story
 * only moves forward: scrolling back up leaves it where it got to. Once it has played and the visitor has scrolled past
 * it, it shrinks to a third of the screen showing its finished frame, so passing it again is short. A reload plays it
 * again.
 *
 * @returns the section.
 */
export function PinnedLazyEye() {
  const track = useRef<HTMLElement>(null);
  // Known only in the browser, so the first render matches the server's (an unplayed story).
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => setCollapsed(playedThisVisit), []);

  // Once the story has played and the section is wholly above the screen, shrink it. The content below moves up by what
  // the section lost, so the scroll is moved by the same amount and the visitor's place on the page does not change.
  const below = useRef<{ node: Element; top: number } | null>(null);
  useEffect(() => {
    const node = track.current;
    if (!node || collapsed) return;
    const watcher = new IntersectionObserver(([entry]) => {
      if (!entry || entry.isIntersecting || entry.boundingClientRect.bottom > 0 || !playedThisVisit) return;
      const next = node.nextElementSibling;
      if (next) below.current = { node: next, top: next.getBoundingClientRect().top };
      setCollapsed(true);
    });
    watcher.observe(node);
    return () => watcher.disconnect();
  }, [collapsed]);
  useLayoutEffect(() => {
    const anchor = below.current;
    below.current = null;
    if (!anchor || !collapsed) return;
    const shift = anchor.node.getBoundingClientRect().top - anchor.top;
    if (shift) scrollBy({ top: shift, behavior: 'instant' });
  }, [collapsed]);

  // The section's scroll, from the moment the stage starts to rise to the end of the story.
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const riseEnd = RISE / (RISE + LAZY_EYE_STORY);
  const rise = useTransform(scrollYProgress, [0, riseEnd], ['100%', '0%']);
  const story = useTransform(scrollYProgress, [riseEnd, 1], [0, 1]);

  const furthest = useMotionValue(0);
  useMotionValueEvent(story, 'change', (value) => {
    if (value > furthest.get()) furthest.set(value);
    if (value >= 0.995) playedThisVisit = true;
  });
  const spring = useSpring(furthest, { stiffness: 140, damping: 26, mass: 0.6 });
  const finished = useMotionValue(1);
  const covered = useMotionValue(0);
  const palette = PALETTES.p1;

  return (
    <section
      ref={track}
      className={styles.lazyEye}
      aria-label="Lazy Eye Gallery"
      data-collapsed={collapsed || undefined}
      style={{ ['--len' as string]: RISE + LAZY_EYE_STORY, ['--sh' as string]: palette.shadow, ['--hi' as string]: palette.highlight }}
    >
      <div className={styles.lazyEyeStage}>
        <motion.div className={styles.lazyEyeRise} style={{ y: collapsed ? 0 : rise }}>
          {/* Keyed so the halftone is measured again when the section changes size. */}
          <LazyEyeStage
            key={collapsed ? 'short' : 'tall'}
            progress={collapsed ? finished : spring}
            covered={covered}
            palette="p1"
            name="Lazy Eye Gallery"
            exhibition="Kento Saisho"
            dates="October 1 – November 15, 2026"
            image="/images/lazy-eye/kento-saisho.webp"
          />
        </motion.div>
      </div>
    </section>
  );
}
