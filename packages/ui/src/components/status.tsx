import type { ReactNode } from 'react';
import { skipLink, statusBadge } from '../../styled-system/recipes';
import type { VariantOf } from './variants';

/** Props for {@link StatusBadge}. */
type StatusBadgeProps = {
  /** `ok` is green, `bad` is red. */
  state: VariantOf<typeof statusBadge, 'state'>;
  /** The text. */
  children: ReactNode;
};

/**
 * A one-line status strip, green when ok and red when not. Recipe `statusBadge`.
 *
 * @param props - the state and the text.
 * @returns the strip.
 */
export function StatusBadge({ state, children }: StatusBadgeProps) {
  return <div className={statusBadge({ state })}>{children}</div>;
}

/**
 * The link at the top of a page that jumps keyboard users past the header to the main content. It is hidden until it
 * receives focus. Recipe `skipLink`.
 *
 * @param props - the id of the element to jump to and the text.
 * @returns the link.
 */
export function SkipLink({ target, children }: { target: string; children: ReactNode }) {
  return (
    <a href={`#${target}`} className={skipLink()}>
      {children}
    </a>
  );
}
