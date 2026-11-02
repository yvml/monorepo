import { defineRecipe, type SystemStyleObject } from '@pandacss/dev';
import { hoverAccentUnderline, linkStyles } from '../interaction';
import type { TypeSystem } from '../type-scale';

/**
 * A text link. `tone` picks the resting color: `accent` for links in content, `muted` for quiet links such as
 * breadcrumbs. Apply it with `className={link()}` on a router `Link` or an anchor. States come from `interaction.ts`.
 */
export const link = (t: TypeSystem) =>
  defineRecipe({
    className: 'link',
    staticCss: ['*'],
    // Inline, the vertical margins do nothing; as a block or a flex item the link's baseline moves onto the grid.
    base: { ...linkStyles, ...t.lineMargins('body', 'md') } as SystemStyleObject,
    defaultVariants: { tone: 'accent' },
    variants: {
      tone: {
        accent: {},
        muted: { color: 'fg.muted', ...hoverAccentUnderline },
      },
    },
  });
