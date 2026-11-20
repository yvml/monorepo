/** The languages the site is offered in. Add an entry here and in `next.config.ts` to add a language. */
export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
] as const;

export const DEFAULT_LOCALE = 'en';

let active: string = DEFAULT_LOCALE;

/**
 * Records the language of the page being rendered, so `localize` reads it without every call passing it along. Set
 * once at the top of `_app`; a page renders synchronously, so one request never sees another's language.
 *
 * @param locale - the locale Next resolved for the request.
 */
export function setActiveLocale(locale?: string) {
  active = LOCALES.some((item) => item.code === locale) ? (locale as string) : DEFAULT_LOCALE;
}

/** The language of the page being rendered. */
export const activeLocale = () => active;
