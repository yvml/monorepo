import { defineSlotRecipe } from '@pandacss/dev';
import { column, ringed } from '../fragments';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * The editorial hero: a full-width block of art with a kicker, a headline, one paragraph and one link. The art is a
 * set of concentric accent rings on the hover ground until stories carry images.
 *
 * `landscape` is 21:9 with the text anchored to the bottom over the art (taller and auto-aspect on phones).
 * `portrait` is two columns, the art at 4:5 and then the text centered, one column on phones.
 */
export const hero = (t: TypeSystem) => {
  const { textLine, textRole, labelCapsLine } = t;
  return defineSlotRecipe({
    className: 'hero',
    slots: ['frame', 'root', 'art', 'text', 'kicker', 'headline', 'summary', 'link'],
    staticCss: [{ orientation: ['*'] }],
    base: {
      // The frame is the container the landscape height is measured against.
      frame: { containerType: 'inline-size' },
      root: {
        position: 'relative',
        overflow: 'hidden',
        background: 'gray.surface.bg.hover',
        // The outline is drawn over the art as a shadow, so it takes no height and the text sits on whole baselines.
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          ...ringed,
        },
      },
      art: {
        backgroundImage:
          'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent token(spacing.8), color-mix(in srgb, token(colors.accent) 35%, transparent) token(spacing.8), color-mix(in srgb, token(colors.accent) 35%, transparent) calc(token(spacing.8) + token(borderWidths.hairline)))',
      },
      text: { ...column, gap: '4', padding: { base: '4', md: '8' } },
      kicker: { ...labelCapsLine, color: 'accent' },
      headline: {
        marginBlockEnd: '2',
        fontFamily: 'display',
        fontWeight: 'medium',
        color: 'fg.default',
        ...responsive(textRole('display', '2xl'), textRole('display', '4xl')),
      },
      summary: {
        maxWidth: 'narrow',
        color: 'fg.default',
        fontFamily: 'body',
        ...textLine('body', 'md'),
      },
      link: {
        alignSelf: 'flex-start',
        color: 'accent',
        fontFamily: 'body',
        fontWeight: 'medium',
        ...textLine('body', 'md'),
        textDecoration: 'underline',
        textDecorationThickness: 'token(borderWidths.hairline)',
        textUnderlineOffset: 'token(spacing.1)',
        textDecorationColor: 'color-mix(in srgb, currentColor 45%, transparent)',
        transitionProperty: 'color, text-decoration-color, text-underline-offset',
        transitionDuration: 'fast',
        _hover: {
          color: 'fg.default',
          textDecorationColor: 'currentColor',
          textUnderlineOffset: 'token(spacing.2)',
        },
        _active: { color: 'accent' },
      },
    },
    variants: {
      orientation: {
        landscape: {
          root: {
            display: 'grid',
            alignItems: 'end',
            minHeight: { base: 'heroTall', md: 'hero' },
            // 21:9 of the frame's width, rounded up to a whole number of baselines.
            height: { md: 'round(up, calc(100cqw * 9 / 21), token(spacing.1))' },
          },
          art: { position: 'absolute', inset: '0' },
          text: {
            position: 'relative',
            paddingBlockStart: '16',
            backgroundImage:
              'linear-gradient(to bottom, transparent, color-mix(in srgb, token(colors.canvas) 90%, transparent) token(spacing.16))',
          },
        },
        portrait: {
          root: {
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'token(sizes.heroArt) 1fr' },
          },
          art: {
            aspectRatio: '4 / 5',
            borderInlineEndWidth: { md: 'hairline' },
            borderColor: 'border',
          },
          text: { justifyContent: 'center' },
        },
      },
    },
    defaultVariants: { orientation: 'landscape' },
  });
};
