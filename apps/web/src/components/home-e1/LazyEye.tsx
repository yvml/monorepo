// apps/web/src/components/home-e1/LazyEye.tsx
import { useSpring, useTransform } from 'motion/react';
import { LazyEyeStage } from '@/components/home/LazyEyeStage';
import { SceneShell, useSceneMotion } from './Scene';
import { LAZY_EYE_STORY, type Placed, type SceneSpec } from './timeline';
import { useTimeline } from './TimelineContext';

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
      <LazyEyeStage progress={progress} covered={m.covered} name={name} exhibition={exhibition} dates={dates} image={image} />
    </SceneShell>
  );
}
