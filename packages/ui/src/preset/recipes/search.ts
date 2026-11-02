import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { boxed, hideScrollbar } from '../fragments';
import type { TypeSystem } from '../type-scale';
import { responsive } from '../type-scale';

/**
 * The big search field: one line with a 2px foreground rule under it (accent while the field has focus), the magnifier
 * at the start, a Clear button when there is text, and a `/` keycap hint at the end that phones hide. The input is set
 * in the display face at 35/40, and 24/32 on phones.
 */
export const searchField = (t: TypeSystem) => {
  const { textSize, lineCentered } = t;
  return defineSlotRecipe({
    className: 'search-field',
    slots: ['root', 'icon', 'input', 'clear', 'hint'],
    base: {
      root: {
        display: 'flex',
        alignItems: 'center',
        gap: '4',
        marginBlockStart: '8',
        paddingBlockEnd: '2',
        // The rule is a shadow, so it takes no height.
        boxShadow: 'inset 0 calc(-1 * token(borderWidths.rail)) 0 0 token(colors.fg.default)',
        transitionProperty: 'box-shadow',
        transitionDuration: 'fast',
        '&:focus-within': {
          boxShadow: 'inset 0 calc(-1 * token(borderWidths.rail)) 0 0 token(colors.accent)',
        },
      },
      icon: {
        flexShrink: 0,
        color: 'fg.muted',
        width: { base: 'searchIconCompact', sm: 'searchIcon' },
        height: { base: 'searchIconCompact', sm: 'searchIcon' },
      },
      input: {
        flex: '1',
        minWidth: '0',
        paddingBlock: '2',
        // An input's height is not its line height in every browser, so it is set: the line plus the padding.
        boxSizing: 'border-box',
        height: {
          base: 'calc(token(lineHeights.2xl) + token(spacing.4))',
          sm: 'calc(token(lineHeights.4xl) + token(spacing.4))',
        },
        background: 'transparent',
        border: '0',
        outline: 'none',
        color: 'fg.default',
        fontFamily: 'display',
        ...responsive(textSize('display', '2xl'), textSize('display', '4xl'), 'sm'),
        '&::placeholder': { color: 'fg.muted', opacity: 1 },
        '&::-webkit-search-cancel-button': { display: 'none' },
      },
      clear: {
        ...boxed,
        display: 'inline-flex',
        flexShrink: 0,
        height: 'control.2xs',
        paddingInline: '3',
        ...lineCentered('body', 'sm', {
          height: 'token(sizes.control.2xs)',
          top: 'token(borderWidths.hairline)',
          bottom: 'token(borderWidths.hairline)',
        }),
        background: 'transparent',
        color: 'fg.muted',
        cursor: 'pointer',
        ...textSize('body', 'sm'),
        transitionProperty: 'border-color, color',
        transitionDuration: 'fast',
        _hover: { borderColor: 'fg.default', color: 'fg.default' },
      },
      hint: {
        ...boxed,
        // A keycap element is monospace by default; it is set in the body face so its baseline is the body's.
        fontFamily: 'body',
        display: { base: 'none', sm: 'flex' },
        flexShrink: 0,
        height: 'control.2xs',
        paddingInline: '2',
        ...lineCentered('body', 'sm', {
          height: 'token(sizes.control.2xs)',
          top: 'token(borderWidths.hairline)',
          bottom: 'token(borderWidths.hairline)',
        }),
        color: 'fg.muted',
        ...textSize('body', 'sm'),
      },
    },
  });
};

/**
 * The row of filters under the search field. A group is a label and its controls; on phones the decade group is one row
 * that scrolls sideways (`scroll`).
 */
export const filterRow = (t: TypeSystem) => {
  const microLabelLine = t.microLabelLine;
  return defineSlotRecipe({
    className: 'filter-row',
    slots: ['root', 'group', 'label'],
    base: {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: '8',
        rowGap: '4',
        marginBlockStart: '4',
        marginBlockEnd: { base: '4', sm: '6' },
      },
      group: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2' },
      label: { ...microLabelLine },
    },
    variants: {
      scroll: {
        true: {
          group: {
            flexWrap: { base: 'nowrap', sm: 'wrap' },
            width: { base: 'full', sm: 'auto' },
            minWidth: '0',
            overflowX: { base: 'auto', sm: 'visible' },
            ...hideScrollbar,
            '& > *': { flexShrink: 0 },
          },
        },
      },
    },
    staticCss: ['*'],
  });
};

/** A pill button: a decade, or the selected label with its ×. Pressed (`aria-pressed`) is inverted. */
export const chip = (t: TypeSystem) => {
  const { textSize, lineCentered } = t;
  return defineRecipe({
    className: 'chip',
    base: {
      ...boxed,
      display: 'inline-flex',
      alignItems: 'center',
      height: 'control.2xs',
      borderRadius: 'full',
      paddingInline: '3',
      background: 'transparent',
      color: 'fg.muted',
      cursor: 'pointer',
      ...textSize('body', 'sm'),
      ...lineCentered('body', 'sm', {
        height: 'token(sizes.control.2xs)',
        top: 'token(borderWidths.hairline)',
        bottom: 'token(borderWidths.hairline)',
      }),
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: 'fast',
      _hover: { borderColor: 'fg.default', color: 'fg.default' },
      '&[aria-pressed="true"], &[data-on]': {
        background: 'fg.default',
        borderColor: 'fg.default',
        color: 'canvas',
      },
      '&[data-removable]::after': { content: '" ×"' },
    },
  });
};

/**
 * The label type-ahead: an input with a list under it. The input is 220px wide (full width on phones) and takes the
 * accent border on focus. The list is 320px wide (full width on phones), at most 224px tall, with a foreground border.
 * An option is the name at the start and its count at the end; hover and the active option take the hover ground.
 */
export const typeahead = (t: TypeSystem) => {
  const textSize = t.textSize;
  return defineSlotRecipe({
    className: 'typeahead',
    slots: ['root', 'input', 'list', 'option', 'count', 'empty'],
    base: {
      root: { position: 'relative', width: { base: 'full', sm: 'combo' } },
      input: {
        ...boxed,
        display: 'block',
        width: 'full',
        height: 'control.2xs',
        paddingInline: '3',
        background: 'transparent',
        outline: 'none',
        color: 'fg.default',
        ...textSize('body', 'sm'),
        '&::placeholder': { color: 'fg.muted' },
        transitionProperty: 'border-color',
        transitionDuration: 'fast',
        _focus: { borderColor: 'accent' },
      },
      list: {
        ...boxed,
        position: 'absolute',
        top: '100%',
        insetInlineStart: '0',
        zIndex: 'dropdown',
        width: { base: 'full', sm: 'comboList' },
        maxHeight: 'scrollList',
        marginBlockStart: '1',
        overflowY: 'auto',
        background: 'canvas',
        borderColor: 'fg.default',
      },
      option: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '3',
        paddingBlock: '2',
        paddingInline: '3',
        cursor: 'pointer',
        ...textSize('body', 'md'),
        _hover: { background: 'gray.surface.bg.hover' },
        '&[aria-selected="true"]': { background: 'gray.surface.bg.hover' },
      },
      count: { color: 'fg.muted' },
      empty: {
        paddingBlock: '2',
        paddingInline: '3',
        color: 'fg.muted',
        ...textSize('body', 'md'),
      },
    },
  });
};
