// packages/ui/src/theme/recipes/field-row.ts
import { defineRecipe } from '@pandacss/dev';

export const fieldRow = defineRecipe({
  className: 'field-row',
  jsx: ['FieldRow'],
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '2',
    marginBottom: '2',
  },
  variants: {
    labelWidth: {
      sm: { '& > :first-child': { width: '32', flexShrink: 0 } },
      md: { '& > :first-child': { width: '48', flexShrink: 0 } },
    },
  },
  defaultVariants: {
    labelWidth: 'md',
  },
});
