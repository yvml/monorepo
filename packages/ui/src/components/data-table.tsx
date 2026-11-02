import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styled-system/patterns';
import { playableRow, scrollX, tableCell } from '../../styled-system/recipes';
import * as Table from './table';

/**
 * Lets a wide table scroll sideways on narrow screens instead of overflowing the page.
 *
 * @param props - the table.
 * @returns the scroll wrapper.
 */
export function ScrollX({ children }: { children: ReactNode }) {
  return <div className={scrollX()}>{children}</div>;
}

/**
 * A table head that is hidden visually but still read by screen readers. Uses Panda's `visuallyHidden` pattern.
 *
 * @param props - the head rows.
 * @returns the head.
 */
export function HiddenHead({ children }: { children: ReactNode }) {
  return <Table.Head className={visuallyHidden()}>{children}</Table.Head>;
}

/**
 * A cell whose text may wrap onto several lines.
 *
 * @param props - the cell content.
 * @returns the cell.
 */
export function WrapCell({ children }: { children: ReactNode }) {
  return <Table.Cell className={tableCell({ kind: 'wrap' })}>{children}</Table.Cell>;
}

/**
 * A narrow, right-aligned cell for numbers and icon buttons.
 *
 * @param props - the cell content.
 * @returns the cell.
 */
export function NumberCell({ children }: { children: ReactNode }) {
  return <Table.Cell className={tableCell({ kind: 'number' })}>{children}</Table.Cell>;
}

/**
 * A monospace cell for codes and records. Mono is for coded data only.
 *
 * @param props - the cell content.
 * @returns the cell.
 */
export function MonoCell({ children }: { children: ReactNode }) {
  return <Table.Cell className={tableCell({ kind: 'mono' })}>{children}</Table.Cell>;
}

/** Props for {@link PlayableRow}. */
type PlayableRowProps = {
  /** Whether this row's track is the one loaded in the player. */
  playing: boolean;
  /** The cells. */
  children: ReactNode;
};

/**
 * A track row that is highlighted, with a bar on its left, while its track is loaded in the player.
 *
 * @param props - whether it is playing, and the cells.
 * @returns the row.
 */
export function PlayableRow({ playing, children }: PlayableRowProps) {
  return <Table.Row className={playableRow({ playing })}>{children}</Table.Row>;
}
