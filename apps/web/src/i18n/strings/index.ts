// apps/web/src/i18n/strings/index.ts
import { en, type TextKey } from './en';
import { es } from './es';

export { en, type TextKey };
export { UI_TEXT } from './ui';

/** The strings by language. */
export const TEXT: Record<string, Record<TextKey, string>> = { en, es };
