import { createContext, type ReactNode, useContext } from 'react';
import { section, sectionGroup } from '../../styled-system/recipes';
import { Count } from './text';
import { Title } from './typography';
import { declared } from './variants';

/** The fill of a {@link Section}: `plain` has no fill, any other is a tint block named in the theme's `wash`. */
export type SectionTone = 'plain' | (string & {});

/** Whether the current section is inside a {@link SectionGroup}, which makes it a subsection. */
const GroupContext = createContext(false);

/** Props for {@link Section}. */
type SectionProps = {
  /** The anchor id that the jump links target. */
  id: string;
  /** The section's label. */
  label: string;
  /** The fill. Defaults to `plain`. */
  tone?: SectionTone;
  /** The vertical padding: `normal` is `block_md`, `loose` is `block_lg`. Applies to top-level sections. Defaults to `normal`. */
  space?: 'normal' | 'loose';
  /** Runs the section the full width of the page, past the side gutters. Defaults to `false`. */
  fullWidth?: boolean;
  /** Leaves out the visible label. The label still names the section for screen readers. */
  hideLabel?: boolean;
  /** A number shown after the label in the warm color. */
  count?: ReactNode;
  /** A link at the end of the header row, built from the slot class. */
  action?: (className: string) => ReactNode;
  /** Less space before the section, for the groups of search results. Defaults to `false`. */
  compact?: boolean;
  /** The block that opens the page under the jump bar: no rule and only a small gap before it. Defaults to `false`. */
  lead?: boolean;
  /** Keeps the label pinned under the jump bar while the section scrolls past. Plain sections only. Defaults to `false`. */
  pinned?: boolean;
  /** The section content. */
  children: ReactNode;
};

/**
 * A page section with an anchor id and a label. At the top level it is ruled, with an eyebrow label. Inside a
 * {@link SectionGroup} it is a subsection with a regular `h3` title. Toned sections are filled blocks that run with
 * the page's side gutters, or the full width of the page when `fullWidth` is set. A top-level section can hide its
 * label. Recipe `section`.
 *
 * @param props - the id, label, tone and content.
 * @returns the section element.
 */
export function Section({
  id,
  label,
  tone = 'plain',
  space = 'normal',
  fullWidth = false,
  hideLabel = false,
  count,
  action,
  compact = false,
  lead = false,
  pinned = false,
  children,
}: SectionProps) {
  const inGroup = useContext(GroupContext);

  if (inGroup) {
    const nested = section({ tone: declared(tone), nested: true });
    return (
      <section id={id} className={nested.root}>
        <div className={nested.header}>
          <Title level="h3">{label}</Title>
        </div>
        {children}
      </section>
    );
  }

  const classes = section({
    tone: declared(tone),
    space,
    full: fullWidth,
    compact,
    lead,
    pinned,
  });

  return (
    <section id={id} className={classes.root} aria-label={hideLabel ? label : undefined}>
      {!hideLabel && (
        <div className={classes.header}>
          <h2 className={classes.label}>
            <span>{label}</span>
            {count !== undefined && <Count>{count}</Count>}
          </h2>
          {action?.(classes.action)}
        </div>
      )}
      {children}
    </section>
  );
}

/** Props for {@link SectionGroup}. */
type SectionGroupProps = {
  /** The anchor id that the jump links target. */
  id: string;
  /** The group's label. */
  label: string;
  /** The subsections. */
  children: ReactNode;
};

/**
 * A group of subsections under one ruled heading, such as Media and Research. Recipe `sectionGroup`.
 *
 * @param props - the id, label and subsections.
 * @returns the group element.
 */
export function SectionGroup({ id, label, children }: SectionGroupProps) {
  return (
    <section id={id} className={sectionGroup()}>
      <h2 className={section().label}>{label}</h2>
      <GroupContext.Provider value>{children}</GroupContext.Provider>
    </section>
  );
}
