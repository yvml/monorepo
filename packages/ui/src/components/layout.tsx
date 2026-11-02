import type { VariantOf } from '@hmidmismi/ui';
import type { ComponentProps, ReactNode } from 'react';
import {
  nameList,
  columnCell,
  columnGrid,
  fullRow,
  inset,
  itemList,
  layout,
  layoutStack,
  layoutWrap,
  measure,
  mediaRow,
  ruled,
} from '../../styled-system/recipes';

/** The spacing names a {@link ItemList} may use. Read from the `itemList` recipe. */
export type StackGap = VariantOf<typeof itemList, 'gap'>;

/** Props for {@link ItemList}. */
type ListProps = {
  /** An unordered or ordered list. */
  as?: 'ul' | 'ol';
  /** The space between items. Defaults to `tight`. */
  gap?: StackGap;
  /** Shows the list markers, indented. */
  marker?: boolean;
  /** Draws a rule between items instead of a gap. */
  ruled?: boolean;
  /** Lays the items out in a row that wraps. */
  inline?: boolean;
  /** The `li` items. */
  children: ReactNode;
};

/**
 * A list without markers. Markers, rules between items and a wrapping row layout are opt-in. Recipe `list`.
 *
 * @param props - the element, gap, marker, rule and inline options, and the items.
 * @returns the list.
 */
export function ItemList({
  as: Tag = 'ul',
  gap = '2',
  marker = false,
  ruled: rules = false,
  inline = false,
  children,
}: ListProps) {
  return <Tag className={itemList({ gap, marker, ruled: rules, inline })}>{children}</Tag>;
}

/** Props for {@link Measure}. */
type MeasureProps = {
  /** The `prose` or `narrow` line length. Defaults to `prose`. */
  size?: VariantOf<typeof measure, 'size'>;
  /** The content. */
  children: ReactNode;
};

/**
 * Limits running text to a readable line length. Recipe `measure`.
 *
 * @param props - the size and the content.
 * @returns the wrapper.
 */
export function Measure({ size = 'prose', children }: MeasureProps) {
  return <div className={measure({ size })}>{children}</div>;
}

/**
 * A block set off by a hairline rule above it, with `block_lg` of space under the rule. Like a section, it has no space
 * below itself beyond `block_md`. Recipe `ruled`.
 *
 * @param props - the content.
 * @returns the block.
 */
export function Ruled({ children }: { children: ReactNode }) {
  return <div className={ruled()}>{children}</div>;
}

/** Props for {@link MediaRow}. */
type MediaRowProps = {
  /** The picture. */
  media: ReactNode;
  /** The text beside or under the picture. */
  children: ReactNode;
};

/**
 * A picture with text beside it, stacked on narrow screens. Recipe `mediaRow`.
 *
 * @param props - the picture and the text.
 * @returns the row.
 */
export function MediaRow({ media, children }: MediaRowProps) {
  return (
    <div className={mediaRow()}>
      {media}
      {children}
    </div>
  );
}

/**
 * Holds a block to the `inset` width and centers it, so it has margins at the left and right on wide screens and fills the width
 * on narrow ones. Recipe `inset`.
 *
 * @param props - the content.
 * @returns the wrapper.
 */
export function Inset({ children }: { children: ReactNode }) {
  return <div className={inset()}>{children}</div>;
}

/** The named grid layouts. Read from the `layout` recipe. */
export type LayoutKind = VariantOf<typeof layout, 'kind'>;

/** Props for {@link Layout}. */
type LayoutProps = {
  /** The named layout. */
  kind: LayoutKind;
  /** A `div`, or a `ul` whose children are `li`. */
  as?: 'div' | 'ul';
  /** The grid items. */
  children: ReactNode;
};

/**
 * A grid with one of the named responsive layouts. The layouts are defined in the `layout` recipe, not in the
 * components that use them.
 *
 * @param props - the layout, the element and the items.
 * @returns the grid.
 */
export function Layout({ kind, as: Tag = 'div', children }: LayoutProps) {
  return <Tag className={layout({ kind })}>{children}</Tag>;
}

/**
 * A layout item that spans the full width from the `md` breakpoint up. Recipe `fullRow`.
 *
 * @param props - the content.
 * @returns the item.
 */
export function FullRow({ children }: { children: ReactNode }) {
  return <div className={fullRow()}>{children}</div>;
}

/** The HTML attributes a layout box passes through: everything but the styling, which only the variants set. */
type BoxProps = Omit<ComponentProps<'div'>, 'className' | 'style' | 'children'>;

/** Props for {@link Stack}. */
export type StackProps = BoxProps & {
  /** The element. */
  as?: 'div' | 'header' | 'article' | 'section';
  /** The gap between the children. */
  gap?: StackGap;
  /** The padding above and below. */
  padBlock?: VariantOf<typeof layoutStack, 'padBlock'>;
  /** The padding at the sides. */
  padInline?: VariantOf<typeof layoutStack, 'padInline'>;
  children?: ReactNode;
};

/**
 * Lays children out in a column with a gap, and optionally pads it. Recipe `stack`.
 *
 * @param props - the element, gap, padding, attributes and children.
 * @returns the column.
 */
export function Stack({
  as: Tag = 'div',
  gap,
  padBlock,
  padInline,
  children,
  ...rest
}: StackProps) {
  return (
    <Tag {...rest} className={layoutStack({ gap, padBlock, padInline })}>
      {children}
    </Tag>
  );
}

/** Props for {@link Wrap}. */
export type WrapProps = BoxProps & {
  /** The gap between the children. */
  gap?: StackGap;
  /** Centers the children across the row. */
  align?: VariantOf<typeof layoutWrap, 'align'>;
  children?: ReactNode;
};

/**
 * Lays children out in a row that wraps, with a gap. Recipe `wrap`.
 *
 * @param props - the gap, alignment, attributes and children.
 * @returns the row.
 */
export function Wrap({ gap, align, children, ...rest }: WrapProps) {
  return (
    <div {...rest} className={layoutWrap({ gap, align })}>
      {children}
    </div>
  );
}

/**
 * The page's column grid: twelve equal columns with the `item` gap between them and between rows. Place content with
 * {@link Cell}. Below `md` every cell is the full width. Recipe `columnGrid`.
 *
 * @param props - the cells.
 * @returns the grid.
 */
export function Grid({ children }: { children: ReactNode }) {
  return <div className={columnGrid()}>{children}</div>;
}

/** The number of columns a {@link Cell} may span. */
export type CellSpan = VariantOf<typeof columnCell, 'span'>;

/**
 * A cell of the {@link Grid}: it spans `span` of the twelve columns from `md` up, and is the full width below. Cells in
 * one row should add up to twelve. Recipe `columnCell`.
 *
 * @param props - the number of columns and the content.
 * @returns the cell.
 */
export function Cell({ span, children }: { span: CellSpan; children: ReactNode }) {
  return <div className={columnCell({ span })}>{children}</div>;
}

/**
 * A list of names, one per line, in a single column; `flow` lets a long list run into columns. Use it for the people
 * credited on something. Recipe `nameList`.
 *
 * @param props - whether to flow into columns, and the `li` items.
 * @returns the list.
 */
export function NameList({ flow = false, children }: { flow?: boolean; children: ReactNode }) {
  return <ul className={nameList({ flow })}>{children}</ul>;
}
