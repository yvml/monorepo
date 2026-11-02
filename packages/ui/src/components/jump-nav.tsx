import { type ReactNode, useRef } from 'react';
import { jumpNav } from '../../styled-system/recipes';
import { useActiveSection } from '../hooks/use-active-section';
import { useMeasuredHeight } from '../hooks/use-measured-height';
import { useScrolledPast } from '../hooks/use-scrolled-past';
import type { JumpLink } from './jump-links';
import { useUiText } from './ui-text';

export type { JumpLink };

/**
 * A sticky bar of pills that jump to the page's sections. It sticks under the header, stays on one row and scrolls
 * sideways when the pills overflow, and inverts the pill of the section the reader is in. Its height is published as
 * `--jh` so section anchors clear it. Slot recipe `jumpNav`.
 *
 * @param props - the links to show, in order.
 * @returns the navigation element.
 */
export function JumpNav({
  links,
  compact,
  watch,
}: {
  links: JumpLink[];
  /** A line of context shown above the pills once the element named by `watch` has scrolled away. */
  compact?: { title: ReactNode; meta?: ReactNode };
  /** The id of the element whose scrolling away shows the compact line, such as the page's header. */
  watch?: string;
}) {
  const t = useUiText();
  const active = useActiveSection(links.map((link) => link.id));
  const classes = jumpNav();
  const past = useScrolledPast(compact ? watch : undefined);
  const root = useRef<HTMLDivElement>(null);
  useMeasuredHeight(root, '--jh');

  return (
    <div ref={root} className={classes.root} data-no-print>
      {compact && past && (
        <p className={classes.compact}>
          <span className={classes.compactTitle}>{compact.title}</span>
          {compact.meta && <span className={classes.compactMeta}>{compact.meta}</span>}
        </p>
      )}
      <nav className={classes.bar} aria-label={t.jumpNav}>
        {links.map((link) => (
          <a
            key={link.id}
            className={classes.link}
            href={`#${link.id}`}
            aria-current={active === link.id ? 'true' : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
