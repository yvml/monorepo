import type { ReactNode } from 'react';
import { hue, pageLayout, pageText } from '../../styled-system/recipes';
import type { Hue } from './tile';
import { declared } from './variants';
import { useUiText } from './ui-text';

/**
 * The article of a page of text: at most 72 characters wide, holding a title and the body. Slot recipe `pageText`.
 *
 * @param props - the blocks.
 * @returns the article.
 */
export function PageArticle({ children }: { children: ReactNode }) {
  return <article className={pageText().root}>{children}</article>;
}

/** The page title, the serif `h1`. */
export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={pageText().title}>{children}</h1>;
}

/** The large paragraph under the title. */
export function PageLede({ children }: { children: ReactNode }) {
  return <p className={pageText().lede}>{children}</p>;
}

/** A section head. */
export function PageH2({ children }: { children: ReactNode }) {
  return <h2 className={pageText().h2}>{children}</h2>;
}

/** A minor head, set as a small uppercase label. */
export function PageH3({ children }: { children: ReactNode }) {
  return <h3 className={pageText().h3}>{children}</h3>;
}

/** A paragraph of body text. */
export function PageP({ children }: { children: ReactNode }) {
  return <p className={pageText().p}>{children}</p>;
}

/** Props for {@link PageList}. */
type PageListProps = {
  /** Numbers the items. */
  ordered?: boolean;
  /** Sets the list in two columns without markers. */
  columns?: boolean;
  /** Sets the items in the display face with a rule under each, in two columns. */
  board?: boolean;
  /** The items, as `li` elements. */
  children: ReactNode;
};

/**
 * A bulleted or numbered list, or a two-column list of names.
 *
 * @param props - the kind of list and its items.
 * @returns the list.
 */
export function PageList({
  ordered = false,
  columns = false,
  board = false,
  children,
}: PageListProps) {
  const className = pageText({ columns: columns || board, board }).list;

  return ordered ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  );
}

/** A definition list: the term at the start, its detail beside it. */
export function PageKv({ children }: { children: ReactNode }) {
  return <dl className={pageText().kv}>{children}</dl>;
}

/** One term and detail of a {@link PageKv}. */
export function PageKvRow({ term, children }: { term: ReactNode; children: ReactNode }) {
  const classes = pageText();

  return (
    <>
      <dt className={classes.term}>{term}</dt>
      <dd className={classes.detail}>{children}</dd>
    </>
  );
}

/** A data table; give it {@link PageTh} cells in the head and {@link PageTd} cells in the rows. */
export function PageTable({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <table className={pageText().table}>
      <thead>
        <tr>{head}</tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
}

/** A column head; `num` right-aligns it. */
export function PageTh({ num = false, children }: { num?: boolean; children: ReactNode }) {
  return (
    <th className={pageText().th} data-num={num ? '' : undefined} scope="col">
      {children}
    </th>
  );
}

/** A cell; `num` right-aligns it with tabular figures. */
export function PageTd({ num = false, children }: { num?: boolean; children: ReactNode }) {
  return (
    <td className={pageText().td} data-num={num ? '' : undefined}>
      {children}
    </td>
  );
}

/** A block of preformatted text. */
export function PageCode({ children }: { children: string }) {
  return <pre className={pageText().code}>{children}</pre>;
}

/** The grid of record label tiles. */
export function CountTileGrid({ children }: { children: ReactNode }) {
  return <ul className={pageText().tileGrid}>{children}</ul>;
}

/** Props for {@link CountTile}. */
type CountTileProps = {
  /** The tile's hue. */
  hue: Hue;
  /** The name. */
  name: ReactNode;
  /** The count shown at the end, formatted. */
  count: ReactNode;
  /** The small word under the count that says what it counts, such as `releases`. */
  unit?: ReactNode;
  /** Builds the tile's link from the slot class and its content. */
  link: (className: string, content: ReactNode) => ReactNode;
};

/**
 * One tile: the name at the start and a count over its unit at the end, in the hue's color. The whole tile lights up on hover.
 *
 * @param props - the hue, name, count and link builder.
 * @returns the list item.
 */
export function CountTile({ hue: color, name, count, unit, link }: CountTileProps) {
  const classes = pageText();

  return (
    <li className={hue({ hue: declared(color) })}>
      {link(
        classes.tile,
        <>
          <span className={classes.tileName}>{name}</span>
          <span className={classes.tileFigure}>
            <span className={classes.tileCount}>{count}</span>
            {unit && <span className={classes.tileUnit}>{unit}</span>}
          </span>
        </>
      )}
    </li>
  );
}

/** Props for {@link PageLayout}. */
type PageLayoutProps = {
  /** The name of the section, for the disclosure. */
  currentTitle: string;
  /** The sidebar groups, from {@link PageSideGroup}; it renders twice, so it must be cheap and stateless. */
  side: ReactNode;
  /** The sidebar's accessible name; `In this section` from the wording map when absent. */
  navLabel?: string;
  /** The words before the current title in the disclosure; `In this section:` from the wording map when absent. */
  navLead?: string;
  /** The article. */
  children: ReactNode;
};

/**
 * The page layout: a sticky sidebar of the section's pages beside the article from 960px, and a "In this section"
 * disclosure above the article below that. Slot recipe `pageLayout`.
 *
 * @param props - the current page's title, the sidebar groups and the article.
 * @returns the layout.
 */
export function PageLayout({ currentTitle, side, navLabel, navLead, children }: PageLayoutProps) {
  const t = useUiText();
  const classes = pageLayout();

  return (
    <div className={classes.root}>
      <aside className={classes.side} aria-label={navLabel ?? t.sectionNav}>
        {side}
      </aside>
      <details className={classes.disclosure}>
        <summary className={classes.summary}>
          {navLead ?? t.sectionNavLead} <span className={classes.current}>{currentTitle}</span>
        </summary>
        <nav className={classes.nav} aria-label={navLabel ?? t.sectionNav}>
          {side}
        </nav>
      </details>
      {children}
    </div>
  );
}

/** One group of the sidebar: a label over its links, built by the caller. */
export function PageSideGroup({ title, children }: { title: string; children: ReactNode }) {
  const classes = pageLayout();

  return (
    <div className={classes.sideGroup}>
      <h2 className={classes.sideLabel}>{title}</h2>
      {children}
    </div>
  );
}

/** The class for a link in the sidebar. */
export function pageSideLinkClass() {
  return pageLayout().sideLink;
}
