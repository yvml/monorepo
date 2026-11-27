// apps/web/src/components/home-e1/Eyebrow.tsx
import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'motion/react';
import { useState } from 'react';
import styles from './HomeE1.module.css';
import { CHAIN, ENTER, PALETTES, ramp, ease, type Placed, type SceneSpec } from './timeline';
import { useTimeline } from './TimelineContext';

/**
 * The one label that stays in place while the cards come and go. It is the last thing in each card's chain: it comes in
 * after the card has settled, its photograph is in, and its title and button have arrived. When the next card starts to
 * slide over, it goes out with the scroll, unless the next card has the same label, in which case it stays and its
 * colour morphs into the next card's.
 *
 * @param props - the scenes with their times, and a counter that goes up whenever a scene's photographs become ready.
 * @returns the label.
 */
export function Eyebrow({
  scenes,
  readySet,
  readyVersion,
}: {
  scenes: Placed<SceneSpec>[];
  readySet: Set<number>;
  readyVersion: MotionValue<number>;
}) {
  const { t } = useTimeline();
  const [text, setText] = useState('');

  // Which scene's label is showing: it changes only after the old label has gone, so a new label never flashes in early.
  const switchAt = scenes.map((scene, i) => {
    const before = scenes[i - 1];
    return i === 0 || !before || before.label === scene.label ? scene.start : scene.start + ENTER * 0.3;
  });
  const shown = useTransform(t, (v) => {
    let k = 0;
    switchAt.forEach((at, i) => {
      if (v >= at) k = i;
    });
    return k;
  });
  useMotionValueEvent(shown, 'change', (i) => setText(scenes[i]?.label ?? ''));

  const opacity = useTransform([t, shown, readyVersion], ([v, i]) => {
    const scene = scenes[i as number];
    if (!scene?.label) return 0;
    const before = scenes[(i as number) - 1];
    const next = scenes[(i as number) + 1];
    const same = before?.label === scene.label;
    const photographs = scene.kind === 'photo' || scene.kind === 'hero';
    const arrived = same ? 1 : ease(scene.settled + CHAIN.label[0], scene.settled + CHAIN.label[1], v as number);
    const loaded = same || !photographs || readySet.has(scene.index) ? 1 : 0;
    const leaving = next && next.label !== scene.label ? 1 - ramp(next.start, next.start + ENTER * 0.3, v as number) : 1;
    return arrived * loaded * leaving;
  });

  // The colour morphs from each scene's highlight into the next one's while the next scene slides in.
  const input = [0];
  const output: string[] = [PALETTES[scenes[0]?.palette ?? 'p1'].highlight];
  scenes.forEach((scene, i) => {
    const before = scenes[i - 1];
    if (!before) return;
    input.push(scene.start, scene.settled);
    output.push(PALETTES[before.palette].highlight, PALETTES[scene.palette].highlight);
  });
  const color = useTransform(t, input, output);

  return (
    <motion.p className={styles.eb} style={{ opacity, color }} aria-hidden>
      {text}
    </motion.p>
  );
}
