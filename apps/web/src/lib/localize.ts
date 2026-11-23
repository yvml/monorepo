import { activeLocale } from './locale';
import type { Localized, LocalizedBlocks } from './sanity/types';

/**
 * Reads one language of a localized field, falling back to English.
 *
 * @param field - the localized array, or a plain string.
 * @param language - the preferred language code.
 * @returns the value, or an empty string.
 */
export function localize(field: Localized<string>, language = activeLocale()) {
  if (typeof field === 'string') return field;
  if (!field) return '';
  return (
    field.find((entry) => (entry.language ?? entry._key) === language)?.value ||
    field.find((entry) => (entry.language ?? entry._key) === 'en')?.value ||
    ''
  );
}

/**
 * Picks one language of localized Portable Text, falling back to English.
 *
 * @param field - bare blocks or the per-language array.
 * @param language - the preferred language code.
 * @returns the blocks, or an empty array.
 */
export function localizedBlocks(field: LocalizedBlocks | null | undefined, language = activeLocale()) {
  const first = field?.[0] as { _key?: string; language?: string; value?: unknown } | undefined;
  if (!first) return [];
  if (!Array.isArray(first.value)) return field as unknown[];
  const entries = field as { _key: string; language?: string; value?: unknown[] }[];
  const lang = (entry: { _key: string; language?: string }) => entry.language ?? entry._key;
  return (entries.find((entry) => lang(entry) === language) ?? entries.find((entry) => lang(entry) === 'en') ?? first)
    .value ?? [];
}
