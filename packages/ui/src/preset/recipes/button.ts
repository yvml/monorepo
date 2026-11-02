import { defineRecipe } from '@pandacss/dev';
import type { TypeSystem } from '../type-scale';

/**
 * The button. Each size is a fixed height with its text on a grid line; the icon moves with the text.
 *
 * @param t - the type system.
 * @returns the recipe.
 */
export const button = (t: TypeSystem) =>
  defineRecipe({
    className: 'button',
    jsx: ['Button', 'IconButton', 'CloseButton', 'ButtonGroup'],
    base: {
      alignItems: 'center',
      appearance: 'none',
      borderRadius: 'l2',
      cursor: 'pointer',
      display: 'inline-flex',
      flexShrink: '0',
      fontWeight: 'semibold',
      gap: '2',
      isolation: 'isolate',
      justifyContent: 'center',
      outline: '0',
      position: 'relative',
      transition: 'colors',
      transitionProperty: 'background-color, border-color, color, box-shadow',
      userSelect: 'none',
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      _icon: {
        flexShrink: '0',
      },
      _disabled: {
        layerStyle: 'disabled',
      },
      focusVisibleRing: 'outside',
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
    variants: {
      variant: {
        solid: {
          bg: 'colorPalette.solid.bg',
          color: 'colorPalette.solid.fg',
          _hover: {
            bg: 'colorPalette.solid.bg.hover',
          },
        },
        surface: {
          bg: 'colorPalette.surface.bg',
          borderWidth: 'hairline',
          borderColor: 'colorPalette.surface.border',
          color: 'colorPalette.surface.fg',
          _hover: {
            borderColor: 'colorPalette.surface.border.hover',
          },
          _active: {
            bg: 'colorPalette.surface.bg.active',
          },
          _on: {
            bg: 'colorPalette.surface.bg.active',
          },
        },
        subtle: {
          bg: 'colorPalette.subtle.bg',
          color: 'colorPalette.subtle.fg',
          _hover: {
            bg: 'colorPalette.subtle.bg.hover',
          },
          _active: {
            bg: 'colorPalette.subtle.bg.active',
          },
          _on: {
            bg: 'colorPalette.subtle.bg.active',
          },
        },
        outline: {
          borderWidth: 'hairline',
          borderColor: 'colorPalette.outline.border',
          color: 'colorPalette.outline.fg',
          _hover: {
            bg: 'colorPalette.outline.bg.hover',
          },
          _active: {
            bg: 'colorPalette.outline.bg.active',
          },
          _on: {
            bg: 'colorPalette.outline.bg.active',
          },
        },
        plain: {
          color: 'colorPalette.plain.fg',
          _hover: {
            bg: 'colorPalette.plain.bg.hover',
          },
          _active: {
            bg: 'colorPalette.plain.bg.active',
          },
          _on: {
            bg: 'colorPalette.plain.bg.active',
          },
        },
      },
      size: {
        '2xs': {
          h: 'control.2xs',
          ...t.lineCentered('body', 'xs', { height: 'token(sizes.control.2xs)', items: true }),
          minW: 'control.2xs',
          textStyle: 'xs',
          px: 'controlPad.2xs',
          _icon: { boxSize: 'controlIcon.2xs' },
        },
        xs: {
          h: 'control.xs',
          ...t.lineCentered('body', 'sm', { height: 'token(sizes.control.xs)', items: true }),
          minW: 'control.xs',
          textStyle: 'sm',
          px: 'controlPad.xs',
          _icon: { boxSize: 'controlIcon.xs' },
        },
        sm: {
          h: 'control.sm',
          ...t.lineCentered('body', 'sm', { height: 'token(sizes.control.sm)', items: true }),
          minW: 'control.sm',
          textStyle: 'sm',
          px: 'controlPad.sm',
          _icon: { boxSize: 'controlIcon.sm' },
        },
        md: {
          h: 'control.md',
          ...t.lineCentered('body', 'sm', { height: 'token(sizes.control.md)', items: true }),
          minW: 'control.md',
          textStyle: 'sm',
          px: 'controlPad.md',
          _icon: { boxSize: 'controlIcon.md' },
        },
        lg: {
          h: 'control.lg',
          ...t.lineCentered('body', 'md', { height: 'token(sizes.control.lg)', items: true }),
          minW: 'control.lg',
          textStyle: 'md',
          px: 'controlPad.lg',
          _icon: { boxSize: 'controlIcon.lg' },
        },
        xl: {
          h: 'control.xl',
          ...t.lineCentered('body', 'md', { height: 'token(sizes.control.xl)', items: true }),
          minW: 'control.xl',
          textStyle: 'md',
          px: 'controlPad.xl',
          _icon: { boxSize: 'controlIcon.xl' },
        },
        '2xl': {
          h: 'control.2xl',
          ...t.lineCentered('body', 'xl', { height: 'token(sizes.control.2xl)', items: true }),
          minW: 'control.2xl',
          textStyle: 'xl',
          px: 'controlPad.2xl',
          _icon: { boxSize: 'controlIcon.2xl' },
        },
      },
    },
  });
