import type { ReactNode } from 'react';
import {
  cardItem,
  centeredLines,
  listHeader,
  pageColumn,
  pageHeader,
} from '../../styled-system/recipes';

/** Props for {@link PageColumn}. */
type PageColumnProps = {
  /** `article` for an entity page, `div` otherwise. */
  as?: 'article' | 'div';
  /** Removes the top padding, for a page whose first block sets its own, such as the home masthead. */
  flushTop?: boolean;
  /** The page blocks. */
  children: ReactNode;
};

/**
 * The page: full width with one gutter at each side. There is no gap between its blocks; each block spaces itself with
 * its own padding. Recipe `pageColumn`.
 *
 * @param props - the element and the blocks.
 * @returns the page column.
 */
export function PageColumn({ as: Tag = 'div', flushTop = false, children }: PageColumnProps) {
  return <Tag className={pageColumn({ flushTop })}>{children}</Tag>;
}

/**
 * The centered title block at the top of a page, closed by a hairline rule. Recipe `pageHeader`.
 *
 * @param props - the title and the lines under it.
 * @returns the header.
 */
export function PageHeader({ children }: { children: ReactNode }) {
  return <header className={pageHeader()}>{children}</header>;
}

/**
 * One item in a grid of cards: a picture over one or two lines of text. Recipe `cardItem`.
 *
 * @param props - the content.
 * @returns the item.
 */
export function CardItem({ children }: { children: ReactNode }) {
  return <div className={cardItem()}>{children}</div>;
}

/**
 * Lines of text centered under a title, one per line: dates and places. Recipe `centeredLines`.
 *
 * @param props - the lines.
 * @returns the block.
 */
export function CenteredLines({ children }: { children: ReactNode }) {
  return <div className={centeredLines()}>{children}</div>;
}

/** Props for {@link ListHeader}. */
type ListHeaderProps = {
  /** The page title. */
  title: ReactNode;
  /** How many entries the page lists, such as `142 entries`; left out when the page shows no count. */
  count?: ReactNode;
};

/**
 * The title row of a list page: the title at the start and the number of entries, muted, at the end. Slot recipe
 * `listHeader`.
 *
 * @param props - the title and the count.
 * @returns the header.
 */
export function ListHeader({ title, count }: ListHeaderProps) {
  const classes = listHeader();

  return (
    <header className={classes.root}>
      <h1 className={classes.title}>{title}</h1>
      {count !== undefined && <p className={classes.count}>{count}</p>}
    </header>
  );
}
