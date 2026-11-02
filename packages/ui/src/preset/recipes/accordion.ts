import { ruleBelow, ruleBoth } from '../fragments';
import { accordionAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const accordion = defineSlotRecipe({
  className: 'accordion',
  slots: accordionAnatomy.extendWith('itemBody').keys(),
  base: {
    root: { display: 'flex', flexDirection: 'column', width: 'full' },
    item: {
      ...ruleBelow,
      _first: { ...ruleBoth },
    },
    itemTrigger: {
      alignItems: 'center',
      cursor: 'pointer',
      display: 'flex',
      gap: '3',
      justifyContent: 'space-between',
      py: '4',
      textAlign: 'start',
      textStyle: 'md',
      width: 'full',
      focusVisibleRing: 'inside',
      _disabled: { layerStyle: 'disabled' },
    },
    itemContent: {
      overflow: 'hidden',
      _open: { animationName: 'expand-height', animationDuration: 'normal' },
      _closed: { animationName: 'collapse-height', animationDuration: 'fast' },
    },
    itemBody: { pb: '4', color: 'fg.muted', textStyle: 'sm' },
    itemIndicator: {
      color: 'fg.muted',
      transitionProperty: 'transform',
      transitionDuration: 'normal',
      _open: { transform: 'rotate(180deg)' },
    },
  },
});
