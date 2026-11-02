import { defineRecipe, defineSlotRecipe } from '@pandacss/dev';
import { hoverAccent } from '../interaction';

/** A page title with its actions beside it: the title at the start, the buttons at the end. */
export const pageBar = defineRecipe({
  className: 'page-bar',
  base: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4' },
});

/** The strip across the top of an admin page that holds the account links, aligned to the end. */
export const adminBar = defineRecipe({
  className: 'admin-bar',
  base: { display: 'flex', justifyContent: 'flex-end', padding: '2' },
});

/** A line under a form field that says whether the value is usable. `available: false` is an error. */
export const fieldStatus = defineRecipe({
  className: 'field-status',
  staticCss: ['*'],
  defaultVariants: { available: true },
  variants: {
    available: {
      true: {},
      false: { color: 'error' },
    },
  },
});

/** A row of links that switch between views of one list. The link for the current view is semibold. */
export const viewSwitch = defineSlotRecipe({
  className: 'view-switch',
  staticCss: ['*'],
  slots: ['root', 'link'],
  base: {
    root: { display: 'flex', gap: '4', marginBlock: '2' },
    link: { ...hoverAccent },
  },
  variants: {
    current: {
      true: { link: { fontWeight: 'semibold' } },
      false: {},
    },
  },
});

/**
 * The sign-in form: a narrow column of labelled fields, centered in the page (`center`, the admin look) or set at the
 * start of the page's column under its heading (`start`). Fields fill the column; buttons keep their own width.
 */
export const signInForm = defineRecipe({
  className: 'sign-in-form',
  base: {
    display: 'grid',
    gap: '4',
    maxWidth: 'form',
    '& input': { display: 'block', width: 'full' },
  },
  variants: {
    align: {
      center: { marginBlock: '16', marginInline: 'auto' },
      start: { marginBlockStart: '8', marginInline: '0', '& button': { justifySelf: 'start' } },
    },
  },
  defaultVariants: { align: 'center' },
  staticCss: ['*'],
});
