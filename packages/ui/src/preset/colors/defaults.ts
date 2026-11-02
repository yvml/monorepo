import { defineSemanticTokens } from '@pandacss/dev';

/**
 * Eight colors for things told apart by color, such as record labels or chart series. Light values are deep enough for
 * text on paper; dark values are lighter. A theme with its own `colors` supplies its own set.
 */
export const categorical = defineSemanticTokens.colors({
  '1': { value: { base: '#2f4bff', _dark: '#7c90ff' } },
  '2': { value: { base: '#8f6200', _dark: '#e8b44a' } },
  '3': { value: { base: '#0e7c60', _dark: '#5cc8a8' } },
  '4': { value: { base: '#c23a3a', _dark: '#f07f7f' } },
  '5': { value: { base: '#7b3fc0', _dark: '#c28bf0' } },
  '6': { value: { base: '#0b6fa4', _dark: '#6fc3f0' } },
  '7': { value: { base: '#b25410', _dark: '#e89a5c' } },
  '8': { value: { base: '#4a7a10', _dark: '#a3d46a' } },
});

/**
 * Four soft block colors for filled sections of a page: the fill, the text on it and the small label on it. A theme
 * with its own `colors` supplies its own set.
 */
export const wash = defineSemanticTokens.colors({
  sand: {
    bg: { value: { base: '#f4f3e8', _dark: '#252523' } },
    fg: { value: { base: '#494746', _dark: '#e4e3dc' } },
    label: { value: { base: '#70706a', _dark: '#a3a299' } },
  },
  green: {
    bg: { value: { base: '#ddf3e5', _dark: '#1a2f26' } },
    fg: { value: { base: '#1b4333', _dark: '#cdeedd' } },
    label: { value: { base: '#2e7056', _dark: '#8fd3b5' } },
  },
  blue: {
    bg: { value: { base: '#e3f1f6', _dark: '#17303a' } },
    fg: { value: { base: '#0b3b4f', _dark: '#cfe8f1' } },
    label: { value: { base: '#0b5875', _dark: '#8cc3d8' } },
  },
  salmon: {
    bg: { value: { base: '#f6e8e0', _dark: '#33241d' } },
    fg: { value: { base: '#5a3220', _dark: '#f0d5c6' } },
    label: { value: { base: '#8a4b2c', _dark: '#e9b79a' } },
  },
});
