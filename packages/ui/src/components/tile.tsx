import type { ReactNode } from 'react';
import {
  featureCard,
  hue,
  plate,
  scrollList,
  splitGrid,
  tile,
  tileGrid,
} from '../../styled-system/recipes';
import { declared } from './variants';

/** A hue: a name from the theme's `categorical` colors. */
export type Hue = string;

/** Props for {@link Tile}. */
type TileProps = {
  /** The tile's hue. */
  hue: Hue;
  /** The large figure at the bottom right, such as a count. */
  figure: ReactNode;
  /** The small word under the figure that says what it counts, such as `releases`. */
  unit?: ReactNode;
  /** Called when the tile is pressed. */
  onClick: () => void;
  /** The name at the top left. */
  children: ReactNode;
};

/**
 * A pressable tile in a hue: a tinted block with the name at the top left and a large figure over its unit at the bottom
 * right. The whole tile lights up on hover. Recipes `hue` and `tile`.
 *
 * @param props - the hue, the figure, the unit, the press handler and the name.
 * @returns the tile button.
 */
export function Tile({ hue: color, figure, unit, onClick, children }: TileProps) {
  const classes = tile();

  return (
    <button
      type="button"
      className={`${hue({ hue: declared(color) })} ${classes.root}`}
      onClick={onClick}
    >
      <span className={classes.name}>{children}</span>
      <span className={classes.figure}>
        <span className={classes.count}>{figure}</span>
        {unit && <span className={classes.unit}>{unit}</span>}
      </span>
    </button>
  );
}

/**
 * The grid of label tiles: two across below 960px, four from 960px. Recipe `tileGrid`.
 *
 * @param props - the tiles, each in a list item.
 * @returns the grid list.
 */
export function TileGrid({ children }: { children: ReactNode }) {
  return <ul className={tileGrid()}>{children}</ul>;
}

/** Props for {@link SplitGrid}. */
type SplitGridProps = {
  /** The space between the columns: `md` is 32px, `lg` is 48px. Defaults to `md`. */
  gap?: 'md' | 'lg';
  /** The two columns. */
  children: ReactNode;
};

/**
 * Two equal columns from 960px, one below. Recipe `splitGrid`.
 *
 * @param props - the gap and the two columns.
 * @returns the grid.
 */
export function SplitGrid({ gap = 'md', children }: SplitGridProps) {
  return <div className={splitGrid({ gap })}>{children}</div>;
}

/** Props for {@link Plate}. */
type PlateProps = {
  /** The plate's hue. */
  hue: Hue;
  /** The short name, at the upper left. */
  name: string;
  /** The code, at the lower right. */
  number: string;
};

/**
 * A square plate in a hue: a short name at the upper left and a code at the lower right, both in
 * the body face. It is decorative. Recipes `hue` and `plate`.
 *
 * @param props - the hue, the name and the number.
 * @returns the plate.
 */
export function Plate({ hue: color, name, number }: PlateProps) {
  const classes = plate();

  return (
    <span aria-hidden="true" className={`${hue({ hue: declared(color) })} ${classes.root}`}>
      <span className={classes.name}>{name}</span>
      <span className={classes.number}>{number}</span>
    </span>
  );
}

/** Props for {@link FeatureCard}. */
type FeatureCardProps = {
  /** The card's hue, or omitted for a neutral card. */
  hue?: Hue;
  /** The small label, such as `Category`. */
  label: string;
  /** The title. */
  title: ReactNode;
  /** The blurb. */
  text: ReactNode;
  /** The counts line. */
  meta: ReactNode;
  /** The link at the bottom, built from the slot class. */
  link: (className: string) => ReactNode;
};

/**
 * A feature card: label, display title, blurb, counts line and a link at the bottom. With a hue its border, tint and
 * label take that color. Recipes `hue` and `featureCard`.
 *
 * @param props - the hue, the parts and the link builder.
 * @returns the card.
 */
export function FeatureCard({ hue: color, label, title, text, meta, link }: FeatureCardProps) {
  const classes = featureCard({ tinted: color !== undefined });

  return (
    <article className={color ? `${hue({ hue: declared(color) })} ${classes.root}` : classes.root}>
      <p className={classes.label}>{label}</p>
      <h3 className={classes.title}>{title}</h3>
      <p className={classes.text}>{text}</p>
      <p className={classes.meta}>{meta}</p>
      {link(classes.link)}
    </article>
  );
}

/** Props for {@link ScrollList}. */
type ScrollListProps = {
  /** The element. Defaults to `div`. */
  as?: 'div' | 'ol' | 'ul';
  /** The accessible name, which says the area scrolls. */
  label: string;
  /** The content. */
  children: ReactNode;
};

/**
 * A list or block with a fixed maximum height that scrolls. It takes focus so a keyboard user can scroll it with the
 * arrow keys. Recipe `scrollList`.
 *
 * @param props - the element, the name and the content.
 * @returns the scrolling area.
 */
export function ScrollList({ as: Tag = 'div', label, children }: ScrollListProps) {
  return (
    <Tag className={scrollList()} tabIndex={0} aria-label={label}>
      {children}
    </Tag>
  );
}
