/**
 * Helpers for the localized arrays that `sanity-plugin-internationalized-array` stores.
 *
 * Current versions of the plugin store the language in a `language` property and give each item a random `_key`.
 * Older documents (and the custom `localizedSlug` type) may carry the language in `_key` instead. These helpers read
 * both, compare case-insensitively (`ja-Latn` and `ja-latn` are the same language), and also accept a plain string
 * so a field that was once a string and is now localized still reads.
 */

export type LocalizedItem<T = unknown> = {
  _key?: string | null;
  language?: string | null;
  value?: T | null;
};

export type LocalizedField<T = unknown> = LocalizedItem<T>[] | string | null | undefined;

/**
 * Finds the item for a language.
 *
 * @param field - a localized array.
 * @param language - the language code, such as `en` or `ja-Latn`.
 * @returns the item, or undefined.
 */
export function findLocalized<T = unknown>(field: LocalizedField<T>, language: string) {
  if (!Array.isArray(field)) return undefined;
  const wanted = language.toLowerCase();
  return (
    field.find((item) => item.language?.toLowerCase() === wanted) ??
    field.find((item) => !item.language && item._key?.toLowerCase() === wanted)
  );
}

/**
 * Reads a language's value, falling back to another language (English by default).
 *
 * @param field - a localized array, or a plain value.
 * @param language - the preferred language code.
 * @param fallback - the language to use when the preferred one is empty.
 * @returns the value, or undefined.
 */
export function localizedValue<T = unknown>(
  field: LocalizedField<T>,
  language = 'en',
  fallback: string | null = 'en'
): T | undefined {
  if (typeof field === 'string') return field as T;
  const preferred = findLocalized<T>(field, language)?.value;
  if (preferred !== undefined && preferred !== null && preferred !== ('' as unknown))
    return preferred;
  return fallback ? (findLocalized<T>(field, fallback)?.value ?? undefined) : undefined;
}

/**
 * Reads a language's string value, or an empty string.
 *
 * @param field - a localized string array, or a plain string.
 * @param language - the preferred language code.
 * @returns the string.
 */
export function localizedText(field: LocalizedField<string>, language = 'en') {
  return localizedValue<string>(field, language) ?? '';
}
