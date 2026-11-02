import { selectAnatomy } from '@ark-ui/react/anatomy';
import { defineSlotRecipe } from '@pandacss/dev';

export const select = defineSlotRecipe({
  className: 'select',
  slots: selectAnatomy.extendWith('indicatorGroup').keys(),
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5',
      width: 'full',
    },
    content: {
      background: 'gray.surface.bg',
      borderRadius: 'l2',
      boxShadow: 'md',
      display: 'flex',
      flexDirection: 'column',
      maxH: 'min(var(--available-height), {sizes.96})',
      minWidth: 'max(var(--reference-width), {sizes.40})',
      outline: 0,
      overflowY: 'auto',
      zIndex: 'dropdown',
      _open: {
        animationStyle: 'slide-fade-in',
        animationDuration: 'slow',
      },
      _closed: {
        animationStyle: 'slide-fade-out',
        animationDuration: 'fastest',
      },
    },
    item: {
      alignItems: 'center',
      borderRadius: 'l1',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      userSelect: 'none',
      _hover: {
        background: 'gray.surface.bg.hover',
      },
      _highlighted: {
        background: 'gray.surface.bg.hover',
      },
      _selected: {},
      _disabled: {
        layerStyle: 'disabled',
      },
    },
    indicatorGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '1',
      pointerEvents: 'none',
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: { base: 'fg.subtle' },
    },
    itemGroupLabel: {
      alignItems: 'flex-start',
      color: 'fg.subtle',
      display: 'flex',
      flexDirection: 'column',
      fontWeight: 'medium',
      gap: '1px',
      justifyContent: 'center',
      _after: {
        content: '""',
        width: '100%',
        height: '1px',
        bg: 'gray.4',
      },
    },
    itemIndicator: {
      color: 'colorPalette.plain.fg',
    },
    label: {
      fontWeight: 'medium',
      userSelect: 'none',
      textStyle: 'sm',
    },
    trigger: {
      alignItems: 'center',
      borderRadius: 'l2',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      minWidth: '0',
      outline: '0',
      textAlign: 'start',
      transition: 'common',
      userSelect: 'none',
      width: 'full',
      _placeholderShown: {
        color: 'fg.subtle',
      },
      _disabled: {
        layerStyle: 'disabled',
      },
    },
    valueText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'outline',
  },
  variants: {
    variant: {
      outline: {
        trigger: {
          borderWidth: 'hairline',
          borderColor: 'gray.outline.border',

          focusVisibleRing: 'inside',
        },
      },
      surface: {
        trigger: {
          bg: 'gray.surface.bg',
          borderWidth: 'hairline',
          borderColor: 'gray.surface.border',

          focusVisibleRing: 'inside',
        },
      },
    },
    size: {
      xs: {
        content: { p: '1', gap: '0.5', textStyle: 'sm' },
        item: {
          px: 'controlPad.xs',
          minH: 'control.xs',
          gap: '2',
          _icon: { boxSize: 'controlIcon.xs' },
        },
        itemGroup: { gap: '0.5' },
        itemGroupLabel: { px: 'controlPad.xs', height: 'control.xs' },
        trigger: {
          px: 'controlPad.xs',
          h: 'control.xs',
          textStyle: 'sm',
          gap: '2',
          _icon: { boxSize: 'controlIcon.xs' },
        },
      },
      sm: {
        content: { p: '1', gap: '0.5', textStyle: 'sm' },
        item: {
          px: 'controlPad.sm',
          minH: 'control.sm',
          gap: '2',
          _icon: { boxSize: 'controlIcon.sm' },
        },
        itemGroup: { gap: '0.5' },
        itemGroupLabel: { px: 'controlPad.sm', height: 'control.sm' },
        trigger: {
          px: 'controlPad.sm',
          h: 'control.sm',
          textStyle: 'sm',
          gap: '2',
          _icon: { boxSize: 'controlIcon.sm' },
        },
      },
      md: {
        content: { p: '1', gap: '0.5', textStyle: 'md' },
        item: {
          px: 'controlPad.md',
          minH: 'control.md',
          gap: '2',
          _icon: { boxSize: 'controlIcon.md' },
        },
        itemGroup: { gap: '0.5' },
        itemGroupLabel: { px: 'controlPad.md', height: 'control.md' },
        trigger: {
          px: 'controlPad.md',
          h: 'control.md',
          textStyle: 'md',
          gap: '2',
          _icon: { boxSize: 'controlIcon.md' },
        },
      },
      lg: {
        content: { p: '1', gap: '0.5', textStyle: 'md' },
        item: {
          px: 'controlPad.lg',
          minH: 'control.lg',
          gap: '2',
          _icon: { boxSize: 'controlIcon.lg' },
        },
        itemGroup: { gap: '0.5' },
        itemGroupLabel: { px: 'controlPad.lg', height: 'control.lg' },
        trigger: {
          px: 'controlPad.lg',
          h: 'control.lg',
          textStyle: 'md',
          gap: '2',
          _icon: { boxSize: 'controlIcon.lg' },
        },
      },
      xl: {
        content: { p: '1', gap: '1', textStyle: 'lg' },
        item: {
          px: 'controlPad.xl',
          minH: 'control.xl',
          gap: '3',
          _icon: { boxSize: 'controlIcon.xl' },
        },
        itemGroup: { gap: '1' },
        itemGroupLabel: { px: 'controlPad.xl', height: 'control.xl' },
        trigger: {
          px: 'controlPad.xl',
          h: 'control.xl',
          textStyle: 'lg',
          gap: '3',
          _icon: { boxSize: 'controlIcon.xl' },
        },
      },
    },
  },
});
