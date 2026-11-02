import { toggleGroupAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const toggleGroup = defineSlotRecipe({
  className: 'toggle-group',
  slots: toggleGroupAnatomy.keys(),
  base: {
    root: { display: 'flex', flexWrap: 'wrap', gap: '2' },
    item: {
      alignItems: 'center',
      borderRadius: 'l2',
      borderWidth: 'hairline',
      borderColor: 'border',
      color: 'fg.muted',
      cursor: 'pointer',
      display: 'inline-flex',
      textStyle: 'sm',
      minH: '7',
      px: '3',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: 'fast',
      focusVisibleRing: 'outside',
      _hover: { borderColor: 'accent.9', color: 'fg.default' },
      _on: { bg: 'accent.9', borderColor: 'accent.9', color: 'accent.solid.fg' },
      _disabled: { layerStyle: 'disabled' },
    },
  },
  variants: {
    variant: {
      outline: {
        root: {
          borderRadius: 'l3',
          borderWidth: 'hairline',
          borderColor: 'border',
          gap: '1',
          p: '1',
        },
      },
    },
  },
});
