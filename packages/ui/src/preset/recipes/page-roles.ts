import { defineRecipe, type RecipeConfig } from '@pandacss/dev';
import type { RoleName, RoleStyle } from '../../design';
import { responsive, type TypeSystem } from '../type-scale';

/**
 * Text roles: one recipe per kind of text a page sets. A role's look (face, size step, weight, tracking, case, color)
 * is the design's to say (`Design.type.roles`); the recipe turns it into styles, so it is defined in one place and
 * every role sits on the same scale and baseline.
 *
 * Most roles have a `trim` variant that removes the space above the capital letters and below the baseline. It is on
 * by default and turned off when the role renders an inline element (`span`, `strong`), because the trim needs a block
 * box. The variants are listed with `staticCss`, so components may pass them from props.
 */

/** The class name of each role. */
const CLASS_NAMES: Record<RoleName, string> = {
  eyebrow: 'eyebrow',
  name: 'name',
  term: 'term',
  entry: 'entry',
  prose: 'prose',
  value: 'value',
  caption: 'caption',
  count: 'count',
  tagline: 'tagline',
  fieldLabel: 'field-label',
  notice: 'notice',
};

/** The roles that can be turned off the trim, because they may render inline elements. */
const TRIMMABLE: readonly RoleName[] = [
  'eyebrow',
  'name',
  'term',
  'entry',
  'prose',
  'value',
  'caption',
];

/**
 * The text-role recipes for a type system.
 *
 * @param t - the type system (a design's sizes, trim and roles).
 * @returns one recipe per role.
 */
export function createPageRoles(t: TypeSystem) {
  const size = (s: RoleStyle) => {
    const face = s.face ?? 'body';
    return s.wide
      ? responsive(t.textSize(face, s.step), t.textSize(face, s.wide))
      : t.textSize(face, s.step);
  };
  const trim = (s: RoleStyle) => {
    const face = s.face ?? 'body';
    return s.wide
      ? responsive(t.textTrim(face, s.step), t.textTrim(face, s.wide))
      : t.textTrim(face, s.step);
  };
  /** The line moved onto the grid by margins, for the role when its element is not a block (a span in a flex row). */
  const margins = (s: RoleStyle) => {
    const face = s.face ?? 'body';
    return s.wide
      ? responsive(t.lineMargins(face, s.step), t.lineMargins(face, s.wide))
      : t.lineMargins(face, s.step);
  };
  const look = (s: RoleStyle) => ({
    fontFamily: s.family ?? s.face ?? 'body',
    ...(s.weight ? { fontWeight: s.weight } : {}),
    ...(s.tracking ? { letterSpacing: s.tracking } : {}),
    ...(s.uppercase ? { textTransform: 'uppercase' } : {}),
    ...(s.color ? { color: s.color } : {}),
    ...size(s),
    ...(s.trim ? trim(s) : {}),
    ...(s.extra ?? {}),
  });

  const recipe = (name: RoleName, variants: Record<string, unknown> = {}) => {
    const s = t.roles[name];
    const trimmable = TRIMMABLE.includes(name);
    const config: RecipeConfig = {
      className: CLASS_NAMES[name],
      base: look(s),
      variants: {
        ...(trimmable ? { trim: { true: trim(s), false: margins(s) } } : {}),
        ...variants,
      } as never,
    };
    if (trimmable) config.defaultVariants = { trim: true };
    if (trimmable || name === 'fieldLabel') config.staticCss = ['*'];
    return defineRecipe(config);
  };

  // Running text has two faces: the role's own (serif by default) and the interface face at the value size.
  const { color: _color, ...valueWithoutColor } = t.roles.value;
  const value = t.roles.value;
  const prose = defineRecipe({
    className: CLASS_NAMES.prose,
    staticCss: ['*'],
    base: {},
    defaultVariants: { face: 'serif' },
    variants: {
      // Trimmed for a block, or `...Inline` with its baseline moved by margins for a span in a flex row.
      face: {
        serif: { ...look({ ...t.roles.prose, trim: false }), ...trim(t.roles.prose) },
        sans: { ...look({ ...valueWithoutColor, trim: false }), ...trim(value) },
        serifInline: { ...look({ ...t.roles.prose, trim: false }), ...margins(t.roles.prose) },
        sansInline: { ...look({ ...valueWithoutColor, trim: false }), ...margins(value) },
      },
    },
  });

  return {
    eyebrow: recipe('eyebrow'),
    name: recipe('name'),
    term: recipe('term'),
    entry: recipe('entry', { block: { true: { display: 'block' } } }),
    prose,
    value: recipe('value'),
    caption: recipe('caption'),
    count: recipe('count'),
    tagline: recipe('tagline'),
    // Spaced, the label is a block: its line moves onto the grid by pseudo-element margins. Not spaced it may be a span in a
    // row, where margins on the element do the same.
    fieldLabel: recipe('fieldLabel', {
      spaced: {
        true: {
          display: 'block',
          marginBlockEnd: '4',
          ...t.lineShift(t.roles.fieldLabel.face ?? 'body', t.roles.fieldLabel.step),
        },
        false: t.lineMargins(t.roles.fieldLabel.face ?? 'body', t.roles.fieldLabel.step),
      },
    }),
    notice: recipe('notice'),
  };
}
