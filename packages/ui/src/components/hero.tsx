import type { ReactNode } from 'react';
import { hero } from '../../styled-system/recipes';
import type { VariantOf } from './variants';

/** Props for {@link Hero}. */
type HeroProps = {
  /** `landscape` anchors the text over the art; `portrait` sets the art beside the text. */
  orientation: VariantOf<typeof hero, 'orientation'>;
  /** The small line above the headline. */
  kicker: ReactNode;
  /** The headline. */
  headline: ReactNode;
  /** The one paragraph. */
  summary: ReactNode;
  /** The one link, as a ready element; it receives the hero's link class through {@link heroLinkClass}. */
  link: (className: string) => ReactNode;
};

/**
 * The editorial hero: art with a kicker, a headline, one paragraph and one link. The art is a decorative stand-in
 * until stories carry images. Slot recipe `hero`.
 *
 * @param props - the orientation and the four text slots.
 * @returns the hero.
 */
export function Hero({ orientation, kicker, headline, summary, link }: HeroProps) {
  const classes = hero({ orientation });

  return (
    <div className={classes.frame}>
      <article className={classes.root} data-orientation={orientation}>
        <div className={classes.art} aria-hidden />
        <div className={classes.text}>
          <p className={classes.kicker}>{kicker}</p>
          <h2 className={classes.headline}>{headline}</h2>
          <p className={classes.summary}>{summary}</p>
          {link(classes.link)}
        </div>
      </article>
    </div>
  );
}
