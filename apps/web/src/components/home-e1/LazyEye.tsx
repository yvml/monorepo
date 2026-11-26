// apps/web/src/components/home-e1/LazyEye.tsx
import { type MotionValue, motion, useSpring, useTransform } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import styles from './HomeE1.module.css';
import { SceneShell, useSceneMotion } from './Scene';
import { ease, LAZY_EYE_STORY, PALETTES, type Palette, type Placed, type SceneSpec } from './timeline';
import { useTimeline } from './TimelineContext';

const clamp = (x: number) => Math.min(1, Math.max(0, x));

/**
 * The Lazy Eye stage: a full-screen halftone that tells its story from one progress value (0 to 1). In order: the halftone
 * alone, the gallery's name, the artist's name as the dots become the exhibition's object, the dates, then the object
 * fades out. The dots, the names and the dates all read the same progress, so they cannot drift apart. The cleared band of
 * dots sits only behind the artist's name and dates. It fills whatever positioned box it is put in.
 *
 * @param props - the story's progress, how far a following card has covered it, its palette, the gallery's name, the exhibition's artist and dates, and the image the halftone is made from.
 * @returns the stage.
 */
export function LazyEyeStage({
  progress,
  covered,
  palette,
  name,
  exhibition,
  dates,
  image,
}: {
  progress: MotionValue<number>;
  covered: MotionValue<number>;
  palette: Palette;
  name: string;
  exhibition: string;
  dates: string;
  image: string;
}) {
  const textFade = useTransform(covered, [0, 0.29], [1, 0]);
  const nameOpacity = useTransform([progress, textFade], ([p, f]) => ease(0.08, 0.2, p as number) * (1 - ease(0.28, 0.36, p as number)) * (f as number));
  const nameY = useTransform(progress, (p) => `${(1 - ease(0.08, 0.2, p)) * 24 - ease(0.28, 0.36, p) * 24}px`);
  const artistOpacity = useTransform([progress, textFade], ([p, f]) => ease(0.38, 0.5, p as number) * (f as number));
  const artistY = useTransform(progress, (p) => `${(1 - ease(0.38, 0.5, p)) * 24}px`);
  const datesOpacity = useTransform(progress, (p) => ease(0.58, 0.7, p));
  const datesY = useTransform(progress, (p) => `${(1 - ease(0.58, 0.7, p)) * 16}px`);

  const stick = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const source = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const frame = stick.current;
    const cv = canvas.current;
    const img = source.current;
    const ctx = cv?.getContext('2d');
    if (!frame || !cv || !img || !ctx) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const highlight = PALETTES[palette].highlight;
    let width = 0;
    let height = 0;
    let cell = 12;
    let cols = 0;
    let rows = 0;
    let lum: Float32Array | null = null;
    let visible = false;
    let raf = 0;
    let drawn = 0;
    const start = performance.now();

    const sample = () => {
      lum = null;
      if (!img.complete || !img.naturalWidth) return;
      try {
        const off = document.createElement('canvas');
        off.width = cols;
        off.height = rows;
        const c = off.getContext('2d');
        if (!c) return;
        c.fillStyle = '#fff';
        c.fillRect(0, 0, cols, rows);
        const scale = Math.min(cols / img.naturalWidth, (rows * 0.86) / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        c.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h);
        const data = c.getImageData(0, 0, cols, rows).data;
        const out = new Float32Array(cols * rows);
        for (let i = 0; i < out.length; i++) {
          out[i] = (0.2126 * (data[i * 4] ?? 0) + 0.7152 * (data[i * 4 + 1] ?? 0) + 0.0722 * (data[i * 4 + 2] ?? 0)) / 255;
        }
        lum = out;
      } catch {
        lum = null;
      }
    };

    const size = () => {
      const box = frame.getBoundingClientRect();
      width = box.width;
      height = box.height;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(width * dpr);
      cv.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = Math.max(6, Math.min(11, width / 180));
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      sample();
    };

    const draw = (now: number) => {
      const time = reduce ? 0 : (now - start) / 1000;
      const p = progress.get();
      const artistIn = ease(0.38, 0.5, p);
      const objectIn = ease(0.3, 0.6, p);
      const objectOut = ease(0.8, 0.94, p);
      const coveredNow = covered.get();
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = highlight;
      ctx.beginPath();
      const maxR = cell * 0.46;
      const halfW = 0.4 - 0.12 * artistIn; // how wide the cleared band is
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c + 0.5) * cell;
          const y = (r + 0.5) * cell;
          const nx = Math.abs(x / width - 0.5);
          const ny = Math.abs(y / height - 0.5);
          const wave = ((Math.sin(c * 0.11 + time) + Math.sin(r * 0.14 - time * 0.8) + Math.sin((c + r) * 0.07 + time * 0.55)) / 3) * 0.5 + 0.5;
          const pattern = wave * wave * maxR * 0.55;
          const dark = lum ? 1 - (lum[r * cols + c] ?? 1) : wave;
          const art = clamp((dark - 0.12) / 0.8) * maxR * 0.95;
          const distance = Math.min(1, Math.hypot(nx, (ny * height) / width) / 0.6);
          let radius = pattern + (art - pattern) * ease(0, 1, objectIn * 1.8 - distance * 0.8);
          radius *= (1 - 0.85 * artistIn * (1 - ease(0.08, 0.14, ny)) * (1 - ease(halfW - 0.06, halfW, nx))) * (1 - objectOut);
          if (radius > 0.4) {
            ctx.moveTo(x + radius, y);
            ctx.arc(x, y, radius, 0, 6.2832);
          }
        }
      }
      ctx.fill();
      cv.style.opacity = String(clamp(1 - coveredNow * 1.6) * 0.85); // the dots are gone by 62% covered
    };

    const loop = (now: number) => {
      // About 40 frames a second is plenty for dots, and leaves the scroll its time.
      if (now - drawn >= 24) {
        drawn = now;
        draw(now);
      }
      raf = visible ? requestAnimationFrame(loop) : 0;
    };

    size();
    img.addEventListener('load', sample);
    const onResize = () => size();
    addEventListener('resize', onResize);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    observer.observe(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      img.removeEventListener('load', sample);
      removeEventListener('resize', onResize);
    };
  }, [progress, covered, palette]);

  return (
    <>
      <div ref={stick} className={styles.leStick}>
        <img ref={source} className={styles.leImg} src={image} alt="" decoding="async" />
        <canvas ref={canvas} className={styles.leCv} aria-hidden />
        <motion.div className={`${styles.leT} ${styles.leA}`} style={{ opacity: nameOpacity, y: nameY }}>
          <h2>
            <Link href="/lazy-eye">{name}</Link>
          </h2>
        </motion.div>
        <motion.div className={`${styles.leT} ${styles.leB}`} style={{ opacity: artistOpacity, y: artistY }}>
          <Link href="/lazy-eye">
            <strong>{exhibition}</strong>
            <motion.span style={{ opacity: datesOpacity, y: datesY }}>{dates}</motion.span>
          </Link>
        </motion.div>
      </div>
    </>
  );
}

/**
 * The Lazy Eye scene: a full-screen halftone that tells its story on the timeline. In order: the halftone alone, the
 * gallery's name, the artist's name as the dots become the exhibition's object, the dates, then the object fades out.
 * Each step is a window of the scene's own progress, and the dots, the names and the dates all read the same spring of
 * that progress, so they cannot drift apart. The cleared band of dots sits only behind the artist's name and dates.
 *
 * @param props - the scene, when the next one starts, the gallery's name, the exhibition's artist and dates, and the image the halftone is made from.
 * @returns the scene.
 */
export function LazyEye({
  scene,
  nextStart,
  name,
  exhibition,
  dates,
  image,
}: {
  scene: Placed<SceneSpec>;
  nextStart?: number;
  name: string;
  exhibition: string;
  dates: string;
  image: string;
}) {
  const { t } = useTimeline();
  const m = useSceneMotion(scene, nextStart);
  const story = useTransform(t, [scene.settled, scene.settled + LAZY_EYE_STORY], [0, 1]);
  const progress = useSpring(story, { stiffness: 140, damping: 26, mass: 0.6 });
  return (
    <SceneShell scene={scene} motion={m} label={name}>
      <LazyEyeStage progress={progress} covered={m.covered} palette={scene.palette} name={name} exhibition={exhibition} dates={dates} image={image} />
    </SceneShell>
  );
}
