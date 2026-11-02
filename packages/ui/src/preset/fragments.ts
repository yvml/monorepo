import type { SystemStyleObject } from '@pandacss/dev';
import { createRules } from '../grid';

/**
 * Style fragments used by more than one recipe. A fragment is spread into a recipe (`...ruleBelow`), so a repeated look
 * is defined once. Browser defaults (margin, padding, list markers, border style, link color) are removed by Panda's
 * preflight, so recipes never reset them. Text fragments are on the type system (`type-scale.ts`), state fragments are
 * in `interaction.ts`.
 */

/** A column of children: the base of most block recipes. Set `gap` beside it. */
export const column: SystemStyleObject = { display: 'flex', flexDirection: 'column' };

const rules = createRules({
  hairline: 'token(borderWidths.hairline)',
  border: 'token(colors.border)',
  edge: 'token(borderWidths.edge)',
});

/** Hairline rules and outlines drawn as inset shadows, so they take no height (see `../grid`). */
export const ruleAbove = rules.ruleAbove as SystemStyleObject;
export const ruleBelow = rules.ruleBelow as SystemStyleObject;
export const ruleBoth = rules.ruleBoth as SystemStyleObject;
export const ringed = rules.ringed as SystemStyleObject;
export const ruleNone = rules.ruleNone as SystemStyleObject;
export const ruleBelowOf = (color: string) =>
  rules.ruleBelowOf(`token(colors.${color})`) as SystemStyleObject;
export const toneRing = (percent: number, edge?: 'top' | 'left') =>
  rules.toneRing(percent, edge) as SystemStyleObject;

/** A hairline box: the border of a field, a chip, a button or a card. Set the color where it differs. */
export const boxed: SystemStyleObject = {
  borderWidth: 'hairline',
  borderStyle: 'solid',
  borderColor: 'border',
};

/** Hides the scrollbar of a scrolling row or list. */
export const hideScrollbar: SystemStyleObject = {
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
};

/**
 * The mask of a scrolling row's clipped edge: one inset of the row fades out. Two one-hairline strips at the top and
 * bottom stay fully visible, so a rule drawn on the row's own edge is never faded.
 */
const edgeMask = (from: string, to: string): SystemStyleObject => {
  const solid = 'linear-gradient(black, black)';
  const fade = `linear-gradient(to right, ${from}, black token(spacing.8), black calc(100% - token(spacing.8)), ${to})`;
  const image = `${solid}, ${solid}, ${fade}`;
  return {
    maskImage: image,
    WebkitMaskImage: image,
    maskSize: '100% token(borderWidths.hairline), 100% token(borderWidths.hairline), 100% 100%',
    WebkitMaskSize:
      '100% token(borderWidths.hairline), 100% token(borderWidths.hairline), 100% 100%',
    maskPosition: 'top, bottom, center',
    WebkitMaskPosition: 'top, bottom, center',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    maskComposite: 'add',
    WebkitMaskComposite: 'source-over',
  };
};

/**
 * A row that scrolls sideways instead of wrapping, with the scrollbar hidden, and a fade at each edge that has more
 * content beyond it (`data-edges`, set by `useScrollEdges`). The fade is a mask, so the row must not be what gives its
 * surroundings their background: put an opaque background on a parent. Children set `flexShrink: 0`.
 */
export const scrollRow: SystemStyleObject = {
  '&[data-edges~="start"]': edgeMask('transparent', 'black'),
  '&[data-edges~="end"]': edgeMask('black', 'transparent'),
  '&[data-edges~="start"][data-edges~="end"]': edgeMask('transparent', 'transparent'),
  display: 'flex',
  flexWrap: 'nowrap',
  minWidth: '0',
  overflowX: 'auto',
  overscrollBehaviorX: 'contain',
  touchAction: 'pan-x',
  ...hideScrollbar,
};

/**
 * Where a sticky element under the header sticks: below the bar (`--bh`, measured at runtime) and below the utility row
 * while it is shown (`--ut`, set on `<html>` by the header when the reader scrolls up).
 */
export const belowHeader = 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px))';

/** Sticks an element under the header and moves it with the utility row as that row slides in and out. */
export const stickBelowHeader: SystemStyleObject = {
  position: 'sticky',
  top: belowHeader,
  transitionProperty: 'top',
  transitionDuration: 'slower',
  transitionTimingFunction: 'in-out',
};

/** Keeps a jump target clear of the sticky header and jump bar (`--bh` and `--jh` are measured at runtime). */
export const anchorOffset: SystemStyleObject = {
  scrollMarginBlockStart:
    'calc(var(--bh, token(sizes.bar)) + var(--jh, token(sizes.14)) + token(spacing.2))',
};

/**
 * The side inset of the content column: one gutter on phones, a wider one from 600px and from 1024px, and on wide
 * screens the extra space that centers a column as wide as `sizes.site`. Full-width bars (the utility row, the header)
 * use it so their content lines up with the page. It sets `--inset` for children that need the same measure.
 */
export const siteInset: SystemStyleObject = {
  '--inset': { base: 'token(spacing.4)', sm: 'token(spacing.6)', md: 'token(spacing.8)' },
  paddingInline: 'max(var(--inset), calc((100% - token(sizes.site)) / 2 + var(--inset)))',
};

/**
 * A link row whose hover fill reaches one inset past the column on each side, so the text still lines up with the
 * column's edge. The hairline under it is drawn at the column's own width, not the row's. Use with `hoverRow`; the row
 * must not set `ruleBelow`.
 */
export const bleedRow: SystemStyleObject = {
  position: 'relative',
  marginInline: 'calc(-1 * token(spacing.2))',
  paddingInline: 'token(spacing.2)',
  '&::after': {
    content: '""',
    position: 'absolute',
    insetInline: 'token(spacing.2)',
    insetBlockEnd: '0',
    height: 'token(borderWidths.hairline)',
    background: 'border',
  },
};
