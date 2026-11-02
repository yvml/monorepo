import { tooltipAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const tooltip = defineSlotRecipe({
  className: 'tooltip',
  slots: tooltipAnatomy.keys(),
  base: {
    content: {
      '--tooltip-bg': 'colors.gray.12',
      background: 'var(--tooltip-bg)',
      color: 'gray.1',
      borderRadius: 'l2',
      px: '3',
      py: '1',
      textStyle: 'sm',
      maxW: 'xs',
      zIndex: 'tooltip',
      _open: { animationStyle: 'scale-fade-in', animationDuration: 'fast' },
      _closed: { animationStyle: 'scale-fade-out', animationDuration: 'faster' },
    },
    arrow: {
      '--arrow-size': 'sizes.2',
      '--arrow-background': 'var(--tooltip-bg)',
    },
    arrowTip: {},
  },
});
