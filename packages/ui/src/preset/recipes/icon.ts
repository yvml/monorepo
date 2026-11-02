import { defineRecipe } from '@pandacss/dev';

export const icon = defineRecipe({
  className: 'icon',
  base: {
    color: 'currentcolor',
    display: 'inline-block',
    flexShrink: '0',
    verticalAlign: 'middle',
    lineHeight: '1em',
  },
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      '2xs': { boxSize: 'controlIcon.2xs' },
      xs: { boxSize: 'controlIcon.xs' },
      sm: { boxSize: 'controlIcon.sm' },
      md: { boxSize: 'controlIcon.md' },
      lg: { boxSize: 'controlIcon.lg' },
      xl: { boxSize: 'controlIcon.xl' },
    },
  },
});
