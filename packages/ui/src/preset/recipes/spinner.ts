import { defineRecipe } from '@pandacss/dev';

export const spinner = defineRecipe({
  className: 'spinner',
  base: {
    '--spinner-track-color': 'transparent',
    animation: 'spin',
    animationDuration: 'slowest',
    borderBottomColor: 'var(--spinner-track-color)',
    borderColor: 'currentColor',
    borderInlineStartColor: 'var(--spinner-track-color)',
    borderRadius: 'full',
    borderStyle: 'solid',
    borderWidth: 'rail',
    display: 'inline-block',
    height: 'var(--spinner-size)',
    width: 'var(--spinner-size)',
  },
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      inherit: { '--spinner-size': '1em' },
      xs: { '--spinner-size': 'sizes.controlIcon.xs' },
      sm: { '--spinner-size': 'sizes.controlIcon.sm' },
      md: { '--spinner-size': 'sizes.controlIcon.md' },
      lg: { '--spinner-size': 'sizes.controlIcon.lg' },
      xl: { '--spinner-size': 'sizes.controlIcon.xl' },
      '2xl': { '--spinner-size': 'sizes.controlIcon.2xl' },
    },
  },
});
