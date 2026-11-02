import { defineTextStyles } from '@pandacss/dev';
import { scaleTextStyles } from './type-scale';

/**
 * The text styles for a set of per-step styles.
 *
 * @param scale - the per-step styles from a type system.
 * @returns the text styles.
 */
export const textStylesFor = (scale: typeof scaleTextStyles) =>
  defineTextStyles({
    ...scale,
    label: { value: { fontSize: 'sm', lineHeight: 'sm', fontWeight: 'medium' } },
  });

export const textStyles = textStylesFor(scaleTextStyles);
