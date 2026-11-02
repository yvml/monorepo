/** Languages the studio offers for localized fields. Add an entry here to add a language everywhere. */
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
] as const;

/** The language a localized field falls back to. */
export const DEFAULT_LOCALE = 'en';
