// apps/web/src/components/home-e1/Bar.tsx
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LocaleLink, shared, ThemeButton } from '@/components/home';
import { Weather } from '@/components/weather';
import { MAIN_NAV, ORG_NAME, SITE_SHORT_NAME } from '@/constants';
import { t as text } from '@/i18n';
import styles from './HomeE1.module.css';
import { ENTER, PALETTES, type Placed, type SceneSpec } from './timeline';
import { useTimeline } from './TimelineContext';

/** How far the page is scrolled before the bar stops being the transparent one at the top, in px. */
const TOP = 80;
/** How far the visitor must scroll up before the bar comes back, and down before it goes, in px. */
const SHOW_AFTER = 18;
const HIDE_AFTER = 36;

/**
 * The headroom bar: it is there at the top, goes as you scroll down and comes back as you scroll up. The direction is
 * judged over a distance, so a trackpad's glide cannot make it flicker. It takes the colours of the card behind it,
 * blending from one card's to the next's as that card reaches the bar, and it sits under the notice at the top of the
 * page until the notice has scrolled away.
 *
 * @param props - the scenes with their times.
 * @returns the bar.
 */
export function Bar({ scenes }: { scenes: Placed<SceneSpec>[] }) {
  const { t } = useTimeline();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const run = useRef(0);
  const noticeHeight = useMotionValue(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const delta = y - last.current;
    last.current = y;
    if (delta !== 0) run.current = Math.sign(delta) === Math.sign(run.current) ? run.current + delta : delta;
    if (y <= TOP) {
      run.current = 0;
      setHidden(false);
    } else if (run.current >= HIDE_AFTER) setHidden(true);
    else if (run.current <= -SHOW_AFTER) setHidden(false);
  });

  // The notice appears when its content arrives, so its height is read again whenever the page changes size.
  useEffect(() => {
    const measure = () => noticeHeight.set(document.querySelector<HTMLElement>('[data-notice]')?.offsetHeight ?? 0);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    return () => observer.disconnect();
  }, [noticeHeight]);
  const top = useTransform([scrollY, noticeHeight], ([y, h]) => Math.max(0, (h as number) - (y as number)));

  // The card behind the bar changes when the next card has slid most of the way up to it.
  const input = [0];
  const shadow: string[] = [PALETTES[scenes[0]?.palette ?? 'p1'].shadow];
  const highlight: string[] = [PALETTES[scenes[0]?.palette ?? 'p1'].highlight];
  scenes.forEach((scene, i) => {
    const before = scenes[i - 1];
    if (!before) return;
    const at = scene.start + ENTER * 0.6;
    input.push(at - 0.04, at + 0.04);
    shadow.push(PALETTES[before.palette].shadow, PALETTES[scene.palette].shadow);
    highlight.push(PALETTES[before.palette].highlight, PALETTES[scene.palette].highlight);
  });
  const barShadow = useTransform(t, input, shadow);
  const barHighlight = useTransform(t, input, highlight);
  const solid = useTransform(scrollY, [0, TOP], [0, 1]);
  const soft = useTransform(scrollY, [0, TOP], [1, 0]);

  return (
    <motion.header
      className={styles.hd}
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      style={{ top, color: barHighlight, ['--bar-sh' as string]: barShadow }}
    >
      <motion.div className={styles.hdSoft} style={{ opacity: soft }} />
      <motion.div className={styles.hdSolid} style={{ opacity: solid }} />
      <Link className={styles.wm} href="/">
        <span className={styles.full}>{ORG_NAME}</span>
        <span className={styles.short} aria-hidden>
          {SITE_SHORT_NAME}
        </span>
        <span className={shared.sr}>{SITE_SHORT_NAME}</span>
      </Link>
      <details className={styles.menu}>
        <summary>Menu</summary>
        <div className={styles.panel}>
          <nav aria-label="Main">
            <ul>
              {MAIN_NAV.map((item) => (
                <li key={item.key}>
                  <Link href={item.href}>{text(item.key)}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.pu}>
            <Weather />
            <a href="#">Shop</a>
            <Link href="/about/contact">Contact</Link>
            <LocaleLink />
            <ThemeButton />
          </div>
        </div>
      </details>
    </motion.header>
  );
}
