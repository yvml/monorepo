import { type ReactNode, useEffect, useRef } from 'react';
import {
  browseNav,
  letterBar,
  rangeColumns,
  rangeNav,
  rangeSections,
} from '../../styled-system/recipes';
import { useActiveSection } from '../hooks/use-active-section';
import { useMeasuredHeight } from '../hooks/use-measured-height';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import { Count } from './text';

/**
 * A row of links that choose a group of a browse list. Recipe `browseNav`.
 *
 * @param props - the links, whose class names come from {@link browseLinkClass}.
 * @returns the navigation.
 */
export function BrowseNav({ label, children }: { label: string; children: ReactNode }) {
  return (
    <nav aria-label={label} className={browseNav().root}>
      {children}
    </nav>
  );
}

/**
 * The class name for a link inside a {@link BrowseNav}.
 *
 * @param current - whether the link is for the group being shown.
 * @returns the class name.
 */
export function browseLinkClass(current: boolean) {
  return browseNav({ current }).link;
}

/**
 * The grid that holds the columns of a browse list: one column on phones, two from 640px, three from 960px and five
 * from 1200px. Slot recipe `rangeColumns`.
 *
 * @param props - the columns.
 * @returns the grid.
 */
export function RangeColumns({ children }: { children: ReactNode }) {
  return <div className={rangeColumns().root}>{children}</div>;
}

/** Props for {@link RangeColumn}. */
type RangeColumnProps = {
  /** The range label, such as `Ad–At`, or `null` for a single column. */
  label: string | null;
  /** How many names the column holds, shown in the warm color at the end of the heading. */
  count: number;
  /** The rows, from {@link RangeItem}. */
  children: ReactNode;
};

/**
 * One column of a browse list: the range label and the number of names over a foreground rule, then the names.
 *
 * @param props - the label, the count and the rows.
 * @returns the column.
 */
export function RangeColumn({ label, count, children }: RangeColumnProps) {
  const classes = rangeColumns();

  return (
    <section className={classes.column} aria-label={label ?? undefined}>
      {label && (
        <h2 className={classes.heading}>
          <span className={classes.label}>{label}</span>
          <span className={classes.count}>{count.toLocaleString('en-US')}</span>
        </h2>
      )}
      <ul className={classes.list}>{children}</ul>
    </section>
  );
}

/** Props for {@link RangeItem}. */
type RangeItemProps = {
  /** The small muted note at the end, such as a lifespan. */
  note?: ReactNode;
  /** Builds the row's link from the slot class and the row content. */
  link: (className: string, content: ReactNode) => ReactNode;
  /** The name. */
  children: ReactNode;
};

/**
 * One name in a {@link RangeColumn}, as a link with its note at the end.
 *
 * @param props - the note, the link builder and the name.
 * @returns the row.
 */
export function RangeItem({ note, link, children }: RangeItemProps) {
  const classes = rangeColumns();

  return (
    <li>
      {link(
        classes.link,
        <>
          <span className={classes.name}>{children}</span>
          {note && <small className={classes.note}>{note}</small>}
        </>
      )}
    </li>
  );
}

/** Props for {@link LetterBar}. */
type LetterBarProps = {
  /** The accessible name of the navigation. */
  label: string;
  /** The keys, from {@link LetterKey}. */
  children: ReactNode;
};

/**
 * The sticky strip of letter keys above a letter list. Slot recipe `letterBar`.
 *
 * @param props - the name and the keys.
 * @returns the navigation.
 */
export function LetterBar({ label, children }: LetterBarProps) {
  const classes = letterBar();
  const root = useRef<HTMLElement>(null);
  useMeasuredHeight(root, '--lh');

  return (
    <nav ref={root} aria-label={label} className={classes.root}>
      <div className={classes.list}>{children}</div>
    </nav>
  );
}

/** Props for {@link LetterKeyLink}. */
type LetterKeyProps = {
  /** The letter shown. */
  letter: string;
  /** The accessible name, such as `E, 142 entries`. */
  label: string;
  /** Whether this is the letter being shown. */
  current: boolean;
  /** Whether the letter has no entries; it is then not a link. */
  disabled: boolean;
  /** Builds the key's link from the props it must carry and its content. */
  link: (props: LetterLinkProps, content: ReactNode) => ReactNode;
};

/** The props a letter key's link must carry. */
export type LetterLinkProps = {
  className: string;
  'aria-label': string;
  'aria-current'?: 'page' | undefined;
};

/**
 * One key of a {@link LetterBar}: a link, or a dimmed dashed block when the letter is empty.
 *
 * @param props - the letter, its name, its state and the link builder.
 * @returns the key.
 */
export function LetterKeyLink({ letter, label, current, disabled, link }: LetterKeyProps) {
  const className = letterBar().key;

  if (disabled) {
    return (
      <span className={className} aria-disabled="true" aria-label={label}>
        {letter}
      </span>
    );
  }
  return link(
    { className, 'aria-label': label, 'aria-current': current ? 'page' : undefined },
    letter
  );
}

/** The CSS variables whose heights sit above a range's section: the header, the letter strip and the range nav. */
const RANGE_OFFSETS = ['--bh', '--ut', '--lh', '--rh'] as const;

/** Props for {@link RangeNav}. */
type RangeNavProps = {
  /** The accessible name of the navigation. */
  label: string;
  /** The tabs, from {@link RangeTab}. */
  children: ReactNode;
};

/**
 * The sticky row of ranges of a letter, as tabs. It publishes its height as `--rh` so the sections clear it. Slot recipe
 * `rangeNav`.
 *
 * @param props - the name and the tabs.
 * @returns the navigation.
 */
export function RangeNav({ label, children }: RangeNavProps) {
  const root = useRef<HTMLElement>(null);
  const row = useRef<HTMLDivElement>(null);
  useMeasuredHeight(root, '--rh');
  useScrollEdges(row);
  const classes = rangeNav();
  return (
    <nav ref={root} aria-label={label} className={classes.root}>
      <div ref={row} className={classes.scroll}>
        {children}
      </div>
    </nav>
  );
}

/** The props a range tab's link must carry. */
export type RangeLinkProps = {
  className: string;
  /** Marks the range the reader is in. A link also gets the router's own `aria-current` for its page, so this is its own. */
  'data-current'?: 'true' | undefined;
};

/** Props for {@link RangeTab}. */
type RangeTabProps = {
  /** The range label, such as `Ai–Alk`. */
  label: string;
  /** How many names the range holds, shown after the label like the counts in the site header. */
  count: number;
  /** Whether this is the range being shown. */
  current: boolean;
  /** Builds the tab's link from the props it must carry and its content. */
  link: (props: RangeLinkProps, content: ReactNode) => ReactNode;
};

/**
 * One tab of a {@link RangeNav}: the label and its count.
 *
 * @param props - the label, the count, the state and the link builder.
 * @returns the tab.
 */
export function RangeTab({ label, count, current, link }: RangeTabProps) {
  return link(
    { className: rangeNav().tab, 'data-current': current ? 'true' : undefined },
    <>
      {label}
      <Count>{count.toLocaleString('en-US')}</Count>
    </>
  );
}

/** Props for {@link RangeSections}. */
type RangeSectionsProps = {
  /** The ids of the sections, in order. They name the ranges. */
  ids: string[];
  /** The id of the range the address asks for, if any: it is scrolled to when the address changes. */
  jump: string | undefined;
  /** The nav and the sections, given the id of the range the reader is in for the tabs to mark. */
  children: (current: string | null) => ReactNode;
};

/**
 * The nav and sections of a letter's ranges. It follows the scroll to say which range the reader is in, scrolls to the
 * range the address names, and returns to the top when the address drops back to the whole letter. Slot recipe
 * `rangeSections`.
 *
 * @param props - the ids, the requested range and the render function.
 * @returns the wrapper.
 */
export function RangeSections({ ids, jump, children }: RangeSectionsProps) {
  const current = useActiveSection(ids, RANGE_OFFSETS);
  const key = ids.join('|');
  const last = useRef<string | undefined>(undefined);
  useEffect(() => {
    const before = last.current;
    last.current = jump;
    // An instant jump: a letter is thousands of pixels long, and a smooth scroll through it is a blur.
    if (jump) {
      const target = document.getElementById(jump);
      if (target && target.offsetParent !== null) target.scrollIntoView({ block: 'start' });
    } else if (before) {
      // The address dropped back from a range to the whole letter.
      window.scrollTo({ top: 0 });
    }
  }, [jump, key]);
  return <div className={rangeSections().root}>{children(current)}</div>;
}

/** Props for {@link RangeSection}. */
type RangeSectionProps = {
  /** The section's id, the range's slug. */
  id: string;
  /** The range label; left out when the section is the whole letter and needs no heading. */
  label?: string;
  /** How many names the range holds. */
  count: number;
  /** Whether this is the range a phone shows: the one the address asks for, or the first. */
  active: boolean;
  /** The rows, from {@link RangeItem}. */
  children: ReactNode;
};

/**
 * One range of a letter: the label and the count over a rule, then the names in columns.
 *
 * @param props - the id, the label, the count, whether it is the requested range and the rows.
 * @returns the section.
 */
export function RangeSection({ id, label, count, active, children }: RangeSectionProps) {
  const classes = rangeSections();
  return (
    <section id={id} className={classes.section} data-active={active} aria-label={label}>
      {label && (
        <h2 className={classes.heading}>
          {label}
          <Count>{count.toLocaleString('en-US')}</Count>
        </h2>
      )}
      <ul className={classes.list}>{children}</ul>
    </section>
  );
}
