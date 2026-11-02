import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { column, ringed } from '../fragments';
import { hoverAccentSurface } from '../interaction';

/**
 * The height of a box that is `ratio` times as tall as it is wide, rounded up to a whole baseline. Measured against the
 * frame's width (`cqw`), so an image or a video keeps the grid however wide it is drawn.
 */
const rowsHigh = (ratio: string) => `round(up, calc(100cqw * ${ratio}), token(spacing.1))`;

/**
 * An image in one of the named shapes. The frame is the container its height is measured against; the image fills it. A
 * shape with a ratio is a whole number of baselines tall, cropped by less than one baseline. `score` keeps its own height.
 */
export const picture = defineSlotRecipe({
  className: 'picture',
  staticCss: ['*'],
  slots: ['frame', 'image'],
  base: {
    frame: { display: 'block', width: 'full', containerType: 'inline-size' },
    image: { display: 'block', width: 'full', background: 'gray.3' },
  },
  variants: {
    shape: {
      cover: {
        frame: { maxWidth: 'cover' },
        image: { height: rowsHigh('1'), objectFit: 'cover' },
      },
      thumb: { image: { height: rowsHigh('1'), objectFit: 'cover', borderRadius: 'l1' } },
      portrait: {
        frame: { flex: '0 0 auto', width: { base: 'avatar.sm', md: 'avatar.md' } },
        image: {
          height: { base: 'avatar.sm', md: 'avatar.md' },
          objectFit: 'cover',
          borderRadius: 'full',
        },
      },
      portraitLg: {
        frame: { width: 'avatar.lg' },
        image: { height: 'avatar.lg', objectFit: 'cover', borderRadius: 'full', boxShadow: 'lg' },
      },
      photo: { image: { height: rowsHigh('2 / 3'), objectFit: 'cover' } },
      map: { image: { height: rowsHigh('1 / 3'), objectFit: 'cover', borderRadius: 'l2' } },
      score: {
        image: {
          borderRadius: 'l2',
          ...ringed,
          background: 'white',
        },
      },
    },
  },
});

/** A picture with a caption. */
export const figure = defineRecipe({
  className: 'figure',
  base: { ...column, gap: '2' },
});

/** A 16:9 frame that fills with an `iframe` or a play `button`, a whole number of baselines tall. */
export const videoFrame = defineSlotRecipe({
  className: 'video-frame',
  slots: ['frame', 'root'],
  base: {
    frame: { display: 'block', width: 'full', containerType: 'inline-size' },
    root: {
      position: 'relative',
      width: 'full',
      height: rowsHigh('9 / 16'),
      borderRadius: 'l2',
      overflow: 'hidden',
      background: 'gray.3',
      '& iframe, & button': { position: 'absolute', inset: '0', width: 'full', height: 'full' },
      '& button': {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: 'transparent',
        color: 'accent',
        ...hoverAccentSurface,
      },
    },
  },
});
