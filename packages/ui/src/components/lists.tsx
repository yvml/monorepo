import type { ReactNode } from 'react';
import { countedList, datedList, expandableRow, rowDrawer } from '../../styled-system/recipes';

/** Props for {@link CountedList}. */
type CountedListProps = {
  /** The rows, from {@link CountedItem}. */
  children: ReactNode;
};

/**
 * A list of names with their counts, one hairline between rows. Slot recipe `countedList`.
 *
 * @param props - the rows.
 * @returns the list.
 */
export function CountedList({ children }: CountedListProps) {
  return <ul className={countedList().root}>{children}</ul>;
}

/** Props for {@link CountedItem}. */
type CountedItemProps = {
  /** The formatted count. */
  count: ReactNode;
  /** Builds the row's link from the slot class and the row content. */
  link: (className: string, content: ReactNode) => ReactNode;
  /** The name. */
  children: ReactNode;
};

/**
 * One row of a {@link CountedList}: the name at the start, its count at the end, as a link.
 *
 * @param props - the count, the link builder and the name.
 * @returns the row.
 */
export function CountedItem({ count, link, children }: CountedItemProps) {
  const classes = countedList();

  return (
    <li className={classes.item}>
      {link(
        classes.link,
        <>
          <span className={classes.name}>{children}</span>
          <span className={classes.count}>{count}</span>
        </>
      )}
    </li>
  );
}

/** Props for {@link ExpandableRow}. */
type ExpandableRowProps = {
  /** `plated` (the default) has a cover plate at the start; `numbered` has a small number, for the tracks of a release. */
  layout?: 'plated' | 'numbered';
  /** The cover plate, or the number in a `numbered` row. */
  plate: ReactNode;
  /** The title. */
  title: ReactNode;
  /** The line under the title, such as `Author · Publisher · Code`. */
  meta?: ReactNode;
  /** The text at the end, such as `1993 · 12 items`. Phones hide it. */
  aside: ReactNode;
  /** Whether the drawer is open. */
  open: boolean;
  /** The id of the drawer this row controls. */
  controls: string;
  /** Called when the row is pressed. */
  onToggle: () => void;
};

/**
 * An expandable row: a button with the plate, the title over its meta line, an aside, and a chevron that
 * turns when it is open. Slot recipe `expandableRow`.
 *
 * @param props - the parts, the open state and the toggle.
 * @returns the row button.
 */
export function ExpandableRow({
  layout = 'plated',
  plate,
  title,
  meta,
  aside,
  open,
  controls,
  onToggle,
}: ExpandableRowProps) {
  const classes = expandableRow({ layout });

  return (
    <button
      type="button"
      className={classes.root}
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
    >
      {plate}
      <span className={classes.text}>
        <span className={classes.title}>{title}</span>
        <span className={classes.meta}>{meta}</span>
      </span>
      <span className={classes.aside}>{aside}</span>
      <span className={classes.chevron} aria-hidden />
    </button>
  );
}

/** Props for {@link LinkRow}. */
type LinkRowProps = {
  /** The title. */
  title: ReactNode;
  /** The line under the title. */
  meta?: ReactNode;
  /** The text at the end. */
  aside?: ReactNode;
  /** Builds the row's link from the slot class and the row content. */
  link: (className: string, content: ReactNode) => ReactNode;
};

/**
 * A plain row for a search result that is a link: the title over its meta line and a note at the end. Slot recipe
 * `expandableRow`, `plain`.
 *
 * @param props - the parts and the link builder.
 * @returns the row.
 */
export function LinkRow({ title, meta, aside, link }: LinkRowProps) {
  const classes = expandableRow({ layout: 'plain' });

  return (
    <li>
      {link(
        classes.root,
        <>
          <span>
            <span className={classes.title}>{title}</span>
            {meta && <span className={classes.meta}>{meta}</span>}
          </span>
          {aside && <span className={classes.aside}>{aside}</span>}
        </>
      )}
    </li>
  );
}

/** Props for {@link RowDrawer}. */
type RowDrawerProps = {
  /** The id the row's `aria-controls` points at. */
  id: string;
  /** The line at the start, such as `12 items · 54 min`. */
  summary: ReactNode;
  /** The link to the row's page, built from the slot class. */
  link: (className: string) => ReactNode;
  /** The accessible name of the scrolling list, such as `Tracks, scrollable`. */
  listLabel: string;
  /** The items, as {@link DrawerItem} rows. */
  children: ReactNode;
};

/**
 * The drawer under an open expandable row: a header with the summary and the link, then the item list, which scrolls
 * and takes focus so the keyboard can scroll it. Slot recipe `rowDrawer`.
 *
 * @param props - the id, the summary, the link, the list's name and the items.
 * @returns the drawer.
 */
export function RowDrawer({ id, summary, link, listLabel, children }: RowDrawerProps) {
  const classes = rowDrawer();

  return (
    <div id={id} className={classes.root}>
      <div className={classes.head}>
        <span>{summary}</span>
        {link(classes.link)}
      </div>
      <ol className={classes.list} tabIndex={0} aria-label={listLabel}>
        {children}
      </ol>
    </div>
  );
}

/** Props for {@link DrawerItem}. */
type DrawerItemProps = {
  /** The item number. */
  number: ReactNode;
  /** The title. */
  title: ReactNode;
  /** The formatted length. */
  time: ReactNode;
};

/**
 * One item in a {@link RowDrawer}: the number, the title (accent on hover) and the length.
 *
 * @param props - the number, the title and the length.
 * @returns the row.
 */
export function DrawerItem({ number, title, time }: DrawerItemProps) {
  const classes = rowDrawer();

  return (
    <li className={classes.row}>
      <span className={classes.number}>{number}</span>
      <span className={classes.title} data-part="title">
        {title}
      </span>
      <span className={classes.time}>{time}</span>
    </li>
  );
}

/**
 * The upcoming events list. Slot recipe `datedList`.
 *
 * @param props - the rows.
 * @returns the list.
 */
export function DatedList({ children }: { children: ReactNode }) {
  return <ul className={datedList().root}>{children}</ul>;
}

/** Props for {@link DatedRow}. */
type DatedRowProps = {
  /** The month abbreviation, such as `Oct`. */
  month: string;
  /** The day, such as `14`. */
  day: string;
  /** The machine-readable date. */
  dateTime: string;
  /** The event title. */
  title: ReactNode;
  /** The line under the title. */
  subtitle: ReactNode;
  /** What is at the end of the row. */
  aside: ReactNode;
};

/**
 * One event: the date block (month over day), the title over its subtitle, and an aside at the end.
 *
 * @param props - the date, title, subtitle and aside.
 * @returns the row.
 */
export function DatedRow({ month, day, dateTime, title, subtitle, aside }: DatedRowProps) {
  const classes = datedList();

  return (
    <li className={classes.row}>
      <time dateTime={dateTime} className={classes.date}>
        <span className={classes.month}>{month}</span>
        <span className={classes.day}>{day}</span>
      </time>
      <div>
        <strong className={classes.title}>{title}</strong>
        <span className={classes.with}>{subtitle}</span>
      </div>
      <span className={classes.where}>{aside}</span>
    </li>
  );
}

/** Props for {@link RowPanel}. */
type RowPanelProps = {
  /** The id the row's `aria-controls` points at. */
  id: string;
  /** Lines the panel up under the number of a `numbered` row instead of under a plate's title. */
  numbered?: boolean;
  /** What opens under the row. */
  children: ReactNode;
};

/**
 * The panel under an open expandable row for content that is not a list of items: the hover ground, a rule above, and
 * the content lined up under the title. Slot recipe `rowDrawer`.
 *
 * @param props - the id, whether the row is numbered, and the content.
 * @returns the panel.
 */
export function RowPanel({ id, numbered = false, children }: RowPanelProps) {
  const classes = rowDrawer({ indent: numbered ? 'number' : 'plate' });

  return (
    <div id={id} className={classes.root}>
      <div className={classes.head}>{children}</div>
    </div>
  );
}
