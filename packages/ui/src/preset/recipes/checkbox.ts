import { checkboxAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const checkbox = defineSlotRecipe({
  slots: checkboxAnatomy.keys(),
  className: 'checkbox',
  base: {
    root: {
      display: 'inline-flex',
      gap: '2',
      alignItems: 'center',
      verticalAlign: 'top',
      position: 'relative',
      _disabled: {
        layerStyle: 'disabled',
      },
    },
    control: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      borderWidth: 'hairline',
      borderColor: 'transparent',
      borderRadius: 'l1',
      cursor: 'pointer',
      focusVisibleRing: 'outside',

      _icon: {
        boxSize: 'full',
      },
    },
    label: {
      fontWeight: 'medium',
      userSelect: 'none',
    },
  },

  variants: {
    size: {
      sm: {
        root: { gap: '2' },
        label: { textStyle: 'sm' },
        control: { boxSize: 'controlIcon.xs', _icon: { boxSize: 'controlIcon.2xs' } },
      },
      md: {
        root: { gap: '3' },
        label: { textStyle: 'md' },
        control: { boxSize: 'controlIcon.md', _icon: { boxSize: 'controlIcon.xs' } },
      },
      lg: {
        root: { gap: '3' },
        label: { textStyle: 'lg' },
        control: { boxSize: 'controlIcon.xl', _icon: { boxSize: 'controlIcon.sm' } },
      },
    },

    variant: {
      solid: {
        control: {
          control: {
            borderColor: 'border',
            _checked: {
              bg: 'colorPalette.solid.bg',
              borderColor: 'colorPalette.solid.bg',
              color: 'colorPalette.solid.fg',
            },
            _invalid: {
              background: 'error',
            },
          },
        },
      },
      surface: {
        control: {
          bg: 'colorPalette.surface.bg',
          borderWidth: 'hairline',
          borderColor: 'colorPalette.surface.border',
          color: 'colorPalette.surface.fg',
        },
      },
      subtle: {
        control: {
          bg: 'colorPalette.subtle.bg',
          color: 'colorPalette.subtle.fg',
        },
      },
      outline: {
        control: {
          borderWidth: 'hairline',
          borderColor: 'colorPalette.outline.border',
          color: 'colorPalette.outline.fg',
          _checked: {
            borderColor: 'colorPalette.solid.bg',
          },
        },
      },
      plain: {
        control: {
          color: 'colorPalette.plain.fg',
        },
      },
    },
  },

  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
});
