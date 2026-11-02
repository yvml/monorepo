import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { anchorOffset, column, ruleAbove, ruleNone } from '../fragments';
import type { TypeSystem } from '../type-scale';

/** The fill, text color and heading color of a toned section, from one tint. */
const toned = (tone: string) => ({
  root: {
    paddingInline: '8',
    paddingBlockEnd: '8',
    ...ruleNone,
    background: `wash.${tone}.bg`,
    color: `wash.${tone}.fg`,
  },
  label: { color: `wash.${tone}.label` },
});

/**
 * A page section: a hairline above, 32px of padding, and 48px of space before it. Its header row holds the label (small,
 * uppercase, muted) with an optional count in the warm color, and an optional action link at the end. A tone fills the
 * section with a tint and drops the rule. `space="loose"` pads 64px; `full` runs it past the page gutters; `nested` is a
 * subsection inside a group, with no rule, a heading row like a top-level section's, and 32px before each one after the first; `compact` is a results group, with 32px before it instead of 48px.
 */
export const section = (t: TypeSystem, tones: readonly string[]) => {
  const { microLabelLine, textLine } = t;
  return defineSlotRecipe({
    className: 'section',
    staticCss: ['*'],
    slots: ['root', 'header', 'label', 'action'],
    base: {
      root: {
        ...column,
        paddingBlockStart: '8',
        paddingBlockEnd: '0',
        marginBlockStart: '12',
        ...ruleAbove,
        ...anchorOffset,
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '4',
        marginBlockEnd: '4',
      },
      label: {
        ...microLabelLine,
        fontWeight: 'semibold',
        '& > * + *': { marginInlineStart: '2' },
      },
      action: {
        color: 'fg.default',
        ...textLine('body', 'md'),
        textDecoration: 'underline',
        textUnderlineOffset: 'token(borderWidths.bar)',
        transitionProperty: 'color',
        transitionDuration: 'fast',
        _hover: { color: 'accent' },
      },
    },
    variants: {
      tone: {
        plain: {},
        ...Object.fromEntries(tones.map((tone) => [tone, toned(tone)])),
      },
      space: {
        normal: {},
        loose: { root: { paddingBlock: '16' } },
      },
      full: {
        true: { root: { marginInline: '-4' } },
      },
      nested: {
        true: {
          root: {
            ...ruleNone,
            marginBlockStart: '0',
            scrollMarginBlockStart: '0',
            '& + &': { marginBlockStart: '8' },
          },
          header: { marginBlockEnd: 'rhythm.item' },
        },
      },
      pinned: {
        true: {
          header: {
            position: 'sticky',
            top: 'calc(var(--bh, token(sizes.bar)) + var(--ut, 0px) + var(--jh, 0px))',
            zIndex: 'base',
            background: 'canvas',
            paddingBlock: '2',
            transitionProperty: 'top',
            transitionDuration: 'slower',
            transitionTimingFunction: 'in-out',
          },
        },
      },
      lead: {
        true: {
          root: {
            ...ruleNone,
            marginBlockStart: '2',
            paddingBlockStart: '0',
          },
        },
      },
      compact: {
        true: { root: { marginBlockStart: { base: '6', sm: '8' } } },
      },
    },
    defaultVariants: { tone: 'plain', space: 'normal' },
  });
};

/** A group of subsections under one ruled heading, such as Media and Research. */
export const sectionGroup = defineRecipe({
  className: 'section-group',
  base: { ...column, paddingBlockStart: '8', ...ruleAbove, ...anchorOffset },
});
