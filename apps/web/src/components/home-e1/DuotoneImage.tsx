// apps/web/src/components/home-e1/DuotoneImage.tsx
import { useEffect, useRef, useState } from 'react';
import styles from './HomeE1.module.css';

const channels = (hex: string) => [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16));
const MAX_WIDTH = 1400;

/**
 * A photograph as a duotone: its brightness mapped from the shadow colour to the highlight colour, pushed to a high
 * contrast. It is made once, in a canvas, when the photograph has loaded, so scrolling never re-runs a filter. If the
 * browser will not let the page read the photograph's pixels, the plain photograph is shown instead.
 *
 * @param props - the photograph, and the two colours as `#rrggbb`.
 * @returns the canvas, or the plain image when the pixels cannot be read.
 */
export function DuotoneImage({
  src,
  shadow,
  highlight,
  onReady,
}: {
  src: string;
  shadow: string;
  highlight: string;
  /** Called once the duotone is made, or once it is clear it cannot be (the plain photograph is shown). */
  onReady?: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const ready = useRef(onReady);
  ready.current = onReady;

  useEffect(() => {
    const target = canvas.current;
    if (!target) return;
    let current = true;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => {
      if (!current) return;
      try {
        const scale = Math.min(1, MAX_WIDTH / image.naturalWidth);
        const w = Math.max(1, Math.round(image.naturalWidth * scale));
        const h = Math.max(1, Math.round(image.naturalHeight * scale));
        target.width = w;
        target.height = h;
        const ctx = target.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('no 2d context');
        ctx.drawImage(image, 0, 0, w, h);
        const pixels = ctx.getImageData(0, 0, w, h);
        const data = pixels.data;
        const [sr = 0, sg = 0, sb = 0] = channels(shadow);
        const [hr = 255, hg = 255, hb = 255] = channels(highlight);
        for (let i = 0; i < data.length; i += 4) {
          const lum = (0.2126 * (data[i] ?? 0) + 0.7152 * (data[i + 1] ?? 0) + 0.0722 * (data[i + 2] ?? 0)) / 255;
          const v = Math.min(1, Math.max(0, (lum - 0.5) * 1.55 + 0.52));
          data[i] = sr + (hr - sr) * v;
          data[i + 1] = sg + (hg - sg) * v;
          data[i + 2] = sb + (hb - sb) * v;
          data[i + 3] = 255;
        }
        ctx.putImageData(pixels, 0, 0);
        target.dataset.ready = '';
        ready.current?.();
      } catch {
        setFailed(true);
        ready.current?.();
      }
    };
    image.onerror = () => {
      if (!current) return;
      setFailed(true);
      ready.current?.();
    };
    // A remote photograph comes through Next's own image route, so it is the page's own origin and its pixels can be read.
    image.src = src.startsWith('http') ? `/_next/image?url=${encodeURIComponent(src)}&w=1200&q=80` : src;
    return () => {
      current = false;
    };
  }, [src, shadow, highlight]);

  if (failed) return <img className={styles.plain} src={src} alt="" loading="lazy" />;
  return <canvas ref={canvas} className={styles.duo} data-duo aria-hidden />;
}
