import type { ReactNode } from 'react';
import { recordHeader } from '../../styled-system/recipes';

/** One fact in the row under the title: a small label over its value. */
export type RecordFact = {
  /** The label, such as `Label` or `Recorded`. */
  label: string;
  /** The value; names are links. */
  value: ReactNode;
};

/** Props for {@link RecordHeader}. */
type RecordHeaderProps = {
  /** The anchor the jump link to the top of the page targets. */
  id?: string;
  /** The small accent line above the title, such as `Release · NW 80638`. */
  kicker: ReactNode;
  /** The title. */
  title: ReactNode;
  /** The line under the title, usually the composer as a link. */
  byline?: ReactNode;
  /** The facts, in order; the row is four across on a wide screen. */
  facts: RecordFact[];
  /** The tags and actions under the facts. */
  children?: ReactNode;
};

/**
 * The head of a record page: the kicker, the title at the page-title size, the byline, a rule,
 * the facts and then the tags and actions. Slot recipe `recordHeader`.
 *
 * @param props - the kicker, title, byline, facts and extras.
 * @returns the header.
 */
export function RecordHeader({ id, kicker, title, byline, facts, children }: RecordHeaderProps) {
  const classes = recordHeader();

  return (
    <header id={id} className={classes.root}>
      <p className={classes.kicker}>{kicker}</p>
      <h1 className={classes.title}>{title}</h1>
      {byline && <p className={classes.byline}>{byline}</p>}
      {facts.length > 0 && (
        <dl className={classes.facts}>
          {facts.map((fact) => (
            <div key={fact.label} className={classes.fact}>
              <dt className={classes.factLabel}>{fact.label}</dt>
              <dd className={classes.factValue}>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {children && <div className={classes.extras}>{children}</div>}
    </header>
  );
}
