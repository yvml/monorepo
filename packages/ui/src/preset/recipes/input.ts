import type { RecipeConfig } from '@pandacss/dev';

export const input = {
  className: 'input',
  jsx: ['Input', 'Field.Input'],
  base: {
    appearance: 'none',
    borderRadius: 'l2',
    height: 'var(--input-height)',
    minHeight: 'var(--input-height)',
    minW: 'var(--input-height)',
    outline: '0',
    position: 'relative',
    textAlign: 'start',
    transition: 'colors',
    width: '100%',
    _disabled: {
      layerStyle: 'disabled',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
  variants: {
    variant: {
      outline: {
        borderWidth: 'hairline',
        borderColor: 'gray.outline.border',
        focusVisibleRing: 'inside',
        _invalid: {
          focusRingColor: 'error',
          borderColor: 'error',
        },
      },
      surface: {
        bg: 'gray.surface.bg',
        borderWidth: 'hairline',
        borderColor: 'gray.surface.border',
        focusVisibleRing: 'inside',

        _invalid: {
          focusRingColor: 'error',
          borderColor: 'error',
        },
      },
      subtle: {
        borderWidth: 'hairline',
        borderColor: 'transparent',
        bg: 'gray.subtle.bg',
        color: 'gray.subtle.fg',
        focusVisibleRing: 'inside',

        _invalid: {
          focusRingColor: 'error',
          borderColor: 'error',
        },
      },
      flushed: {
        borderBottomWidth: 'hairline',
        borderBottomColor: 'gray.outline.border',
        borderRadius: '0',
        color: 'fg.default',
        px: '0',
        _invalid: {
          borderColor: 'error',
        },
        _focus: {
          borderColor: 'colorPalette.solid.bg',
          boxShadowColor: 'colorPalette.solid.bg',
          boxShadow: '0 1px 0 0 var(--shadow-color)',
          _invalid: {
            borderColor: 'error',
            boxShadowColor: 'error',
          },
        },
      },
    },
    size: {
      '2xs': { textStyle: 'xs', px: 'controlPad.2xs', '--input-height': 'sizes.control.2xs' },
      xs: { textStyle: 'sm', px: 'controlPad.xs', '--input-height': 'sizes.control.xs' },
      sm: { textStyle: 'sm', px: 'controlPad.sm', '--input-height': 'sizes.control.sm' },
      md: { textStyle: 'md', px: 'controlPad.md', '--input-height': 'sizes.control.md' },
      lg: { textStyle: 'md', px: 'controlPad.lg', '--input-height': 'sizes.control.lg' },
      xl: { textStyle: 'lg', px: 'controlPad.xl', '--input-height': 'sizes.control.xl' },
      '2xl': { textStyle: '3xl', px: 'controlPad.2xl', '--input-height': 'sizes.control.2xl' },
    },
  },
} satisfies RecipeConfig;
