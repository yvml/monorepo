import type { ElementType, ReactNode } from 'react';
import { label, numeral, text, title } from '../../styled-system/recipes';

/**
 * Text roles as components. Each renders one element with its role recipe. Block elements are trimmed with Capsize
 * (the space above the capitals and below the baseline is removed); inline elements (`span`, `strong`, `small`) cannot
 * be, so the trim is turned off for them.
 */

const INLINE = new Set(['span', 'strong', 'em', 'small', 'a', 'code', 'b', 'i']);

const trims = (tag: string) => !INLINE.has(tag);

type Props<T extends ElementType> = { as?: T; children?: ReactNode; className?: string };

export type TitleLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type TitleProps = Props<ElementType> & { level?: TitleLevel };

/**
 * A page or section title. `level` picks the design's heading style and is also the rendered tag unless `as`
 * overrides it (when the outline and the visual size differ).
 */
export function Title({ level = 'h1', as, children }: TitleProps) {
  const Tag = as ?? level;
  return <Tag className={title({ level })}>{children}</Tag>;
}

export type TextProps = Props<ElementType> & { variant?: 'body' | 'small' | 'caption' };

export function Text({ as: Tag = 'p', variant = 'body', children }: TextProps) {
  const shape = trims(String(Tag)) ? variant : (`${variant}Inline` as 'body');
  return <Tag className={text({ variant: shape })}>{children}</Tag>;
}

export type LabelProps = Props<ElementType>;

export function Label({ as: Tag = 'span', children }: LabelProps) {
  return <Tag className={label({ trim: trims(String(Tag)) })}>{children}</Tag>;
}

export type NumeralProps = Props<ElementType>;

export function Numeral({ as: Tag = 'span', children }: NumeralProps) {
  return <Tag className={numeral({ trim: trims(String(Tag)) })}>{children}</Tag>;
}
