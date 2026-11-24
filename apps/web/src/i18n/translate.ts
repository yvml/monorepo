// apps/web/src/i18n/translate.ts
import { activeLocale } from './locale';
import { en, TEXT, type TextKey } from './strings';

/**
 * One app string in the language of the page being rendered, falling back to English.
 *
 * @param key - which string.
 * @param values - what fills each `{hole}`.
 * @returns the text.
 */
export function t(key: TextKey, values?: Record<string, string | number>) {
  const template = (TEXT[activeLocale()] ?? en)[key] ?? en[key];
  return values ? template.replace(/\{(\w+)\}/g, (hole, name: string) => String(values[name] ?? hole)) : template;
}
