import { defineRecipe } from '@pandacss/dev';
import { responsive, type TypeSystem } from '../type-scale';

/**
 * Text roles: one recipe per kind of text a page sets. Each holds the whole look of its role (face, step, weight,
 * case, tracking, color). Size, line height and the trim come from `type-scale.ts`, so every role sits on the
 * same scale and baseline.
 *
 * The `trim` variant removes the space above the capitals and below the baseline. It is on by default and turned off
 * when a role renders an inline element, because the trim needs a block box.
 */

/** The heading levels, in order. */
const LEVELS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * The text-role recipes for a type system.
 *
 * @param t - the type system (a design's sizes, trim and headings).
 * @returns `title`, `text`, `label` and `numeral`.
 */
export function createRoles({
  lineMargins,
  textRole,
  textSize,
  textTrim,
  labelCaps,
  headings,
}: TypeSystem) {
  /**
   * A heading in the display face. `level` picks one of the design's heading styles: its size (and the larger size
   * from `md` up), weight, tracking, case and color. Titles are block elements, so the trim is always on.
   */
  const title = defineRecipe({
    className: 'title',
    jsx: ['Title'],
    staticCss: ['*'],
    base: { fontFamily: 'display', textWrap: 'balance', color: 'fg.default' },
    defaultVariants: { level: 'h1' },
    variants: {
      level: Object.fromEntries(
        LEVELS.map((level) => {
          const { step, wide, weight, tracking, uppercase, color } = headings[level];
          const to = wide ?? step;
          return [
            level,
            {
              ...responsive(textRole('display', step), textRole('display', to)),
              fontWeight: weight ?? 'normal',
              ...(tracking ? { letterSpacing: tracking } : {}),
              ...(uppercase ? { textTransform: 'uppercase' } : {}),
              ...(color ? { color } : {}),
            },
          ];
        })
      ),
    },
  });

  /**
   * Running text and interface copy in the body face. Each size comes trimmed (a block of its own) or, as `...Inline`,
   * with its baseline moved by margins (a span in a flex row, where a trim cannot apply). They are separate variants, not a
   * trim flag, because Panda does not generate the style of a compound variant that is never used literally.
   */
  const text = defineRecipe({
    className: 'text',
    staticCss: ['*'],
    base: { fontFamily: 'body', color: 'fg.default' },
    defaultVariants: { variant: 'body' },
    variants: {
      variant: {
        body: { ...textSize('body', 'md'), ...textTrim('body', 'md') },
        small: { ...textSize('body', 'sm'), ...textTrim('body', 'sm') },
        caption: { ...textSize('body', 'xs'), color: 'fg.muted', ...textTrim('body', 'xs') },
        bodyInline: { ...textSize('body', 'md'), ...lineMargins('body', 'md') },
        smallInline: { ...textSize('body', 'sm'), ...lineMargins('body', 'sm') },
        captionInline: {
          ...textSize('body', 'xs'),
          color: 'fg.muted',
          ...lineMargins('body', 'xs'),
        },
      },
    } as never,
  });

  /** The small uppercase tracked label that opens a section or names a field. */
  const label = defineRecipe({
    className: 'label',
    staticCss: ['*'],
    base: { color: 'fg.muted', ...labelCaps },
    defaultVariants: { trim: true },
    variants: { trim: { true: textTrim('body', 'xs'), false: lineMargins('body', 'xs') } },
  });

  /** An index numeral, such as a Roman numeral: display face, tracked, muted. */
  const numeral = defineRecipe({
    className: 'numeral',
    staticCss: ['*'],
    base: {
      color: 'fg.muted',
      fontFamily: 'display',
      fontWeight: 'normal',
      letterSpacing: 'numeral',
      ...textSize('display', 'sm'),
    },
    defaultVariants: { trim: true },
    variants: { trim: { true: textTrim('display', 'sm'), false: lineMargins('display', 'sm') } },
  });

  return { title, text, label, numeral };
}
