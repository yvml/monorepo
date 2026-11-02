import type { VariantOf } from '@hmidmismi/ui';
import type { ReactNode } from 'react';
import { visuallyHidden } from '../../styled-system/patterns';
import {
  caption,
  count,
  entry,
  eyebrow,
  fieldLabel,
  notice,
  name as nameText,
  prose,
  tagline,
  term,
  value,
} from '../../styled-system/recipes';

/** The inline elements, where the trim cannot apply. */
const INLINE_TAGS = new Set(['span', 'strong', 'small']);

/**
 * Whether a text role may be trimmed on this element. The trim uses block pseudo-elements, so it is turned off for
 * inline elements.
 *
 * @param tag - the element name.
 * @returns `true` for block-level elements.
 */
function isBlock(tag: string) {
  return !INLINE_TAGS.has(tag);
}

/** Props shared by every text primitive. */
type TextProps<Tag extends string> = {
  /** The element to render. Each primitive lists the elements that suit it. */
  as?: Tag;
  /** The text. */
  children: ReactNode;
};

/**
 * The label that opens a section: small, uppercase, tracked, accent colored. Recipe `eyebrow`.
 *
 * @param props - the element and the text.
 * @returns the label.
 */
export function Eyebrow({ as: Tag = 'h2', children }: TextProps<'h2' | 'h3' | 'span'>) {
  return <Tag className={eyebrow({ trim: isBlock(Tag) })}>{children}</Tag>;
}

/**
 * A name set as a heading, such as a person's or a group's: small, semibold, light tracking. Recipe `name`.
 *
 * @param props - the element and the name.
 * @returns the name.
 */
export function Name({ as: Tag = 'h3', children }: TextProps<'h3' | 'h2' | 'span'>) {
  return <Tag className={nameText({ trim: isBlock(Tag) })}>{children}</Tag>;
}

/**
 * A term: headings of a credit list, names of roles, metadata labels. Small, semibold,
 * muted. Recipe `term`.
 *
 * @param props - the element and the text.
 * @returns the term.
 */
export function Term({ as: Tag = 'h3', children }: TextProps<'h3' | 'dt' | 'span' | 'p'>) {
  return <Tag className={term({ trim: isBlock(Tag) })}>{children}</Tag>;
}

/** Props for {@link Entry}. */
type EntryProps = TextProps<'strong' | 'span' | 'h3'> & {
  /** Puts the entry on its own line. */
  block?: boolean;
};

/**
 * The title of an item in a list, such as an article or a timeline year. Serif. Recipe `entry`.
 *
 * @param props - the element, the text and whether it is on its own line.
 * @returns the entry title.
 */
export function Entry({ as: Tag = 'strong', block = false, children }: EntryProps) {
  return <Tag className={entry({ block, trim: block || isBlock(Tag) })}>{children}</Tag>;
}

/** Props for {@link Prose}. */
type ProseProps = TextProps<'p' | 'div'> & {
  /** The typeface: `serif` (default) or `sans`. */
  face?: VariantOf<typeof prose, 'face'>;
};

/**
 * Running text: biographies and descriptions. Serif by default, with a sans face at body size. Recipe `prose`.
 *
 * @param props - the element, the typeface and the text.
 * @returns the prose.
 */
export function Prose({ as: Tag = 'p', face = 'serif', children }: ProseProps) {
  const shape = isBlock(Tag) ? face : (`${face}Inline` as 'serif');
  return <Tag className={prose({ face: shape })}>{children}</Tag>;
}

/**
 * A content value in the interface face at body size. Recipe `value`.
 *
 * @param props - the element and the text.
 * @returns the value text.
 */
export function Value({ as: Tag = 'p', children }: TextProps<'p' | 'span' | 'div'>) {
  return <Tag className={value({ trim: isBlock(Tag) })}>{children}</Tag>;
}

/**
 * Secondary text: dates, captions, notes. Small and muted. Recipe `caption`.
 *
 * @param props - the element and the text.
 * @returns the caption.
 */
export function Caption({ as: Tag = 'p', children }: TextProps<'p' | 'span' | 'div'>) {
  return <Tag className={caption({ trim: isBlock(Tag) })}>{children}</Tag>;
}

/** Props for {@link VisuallyHidden}. */
type VisuallyHiddenProps = {
  /** The element. Defaults to `span`. */
  as?: 'span' | 'h1' | 'h2' | 'p';
  /** The text, read by assistive technology only. */
  children: ReactNode;
};

/**
 * Text that is not shown but is read by screen readers, such as a page's main heading when the design shows its own
 * display text instead. Pattern `visuallyHidden`.
 *
 * @param props - the element and the text.
 * @returns the hidden text.
 */
export function VisuallyHidden({ as: Tag = 'span', children }: VisuallyHiddenProps) {
  return <Tag className={visuallyHidden()}>{children}</Tag>;
}

/** Props for {@link Count}. */
type CountProps = {
  /** The formatted number, from `formatCount`. */
  children: ReactNode;
  /** The exact number, shown on hover when `children` is shortened. */
  title?: string;
};

/**
 * A count beside a label, such as the number on a header tab or a label tile: small tabular figures in the warm color.
 * Format the number with `formatCount` first. Recipe `count`.
 *
 * @param props - the formatted number and its exact form.
 * @returns the count.
 */
export function Count({ children, title }: CountProps) {
  return (
    <span className={count()} title={title}>
      {children}
    </span>
  );
}

/**
 * The masthead sentence on the home page: display face, 24/32, weight 500, at most 52 characters wide, with the
 * masthead's top padding (64px, 32px on phones). Recipe `tagline`.
 *
 * @param props - the sentence.
 * @returns the paragraph.
 */
export function Tagline({ children }: { children: ReactNode }) {
  return <p className={tagline()}>{children}</p>;
}

/**
 * The small muted label over a field, a filter group or a list column. `spaced` adds the gap before what it labels.
 * Recipe `fieldLabel`.
 *
 * @param props - the element, the spacing and the text.
 * @returns the label.
 */
export function FieldLabel({
  as: Tag = 'h3',
  spaced = true,
  children,
}: TextProps<'h2' | 'h3' | 'span' | 'p'> & { spaced?: boolean }) {
  return <Tag className={fieldLabel({ spaced })}>{children}</Tag>;
}

/**
 * A short message where content would be, such as "No matches". Recipe `notice`.
 *
 * @param props - the message.
 * @returns the paragraph.
 */
export function Notice({ children }: { children: ReactNode }) {
  return <p className={notice()}>{children}</p>;
}
