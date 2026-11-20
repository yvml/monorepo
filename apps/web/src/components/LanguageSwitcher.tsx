import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { LOCALES } from '@/lib/locale';

/**
 * Links to the current page in each language. The current language is plain text. Pages keep their English slugs in
 * every language, so the path is the same and only the language prefix changes.
 *
 * @returns the switcher.
 */
export function LanguageSwitcher() {
  const router = useRouter();
  return (
    <nav aria-label="Language" style={{ display: 'flex', gap: '0.75rem' }}>
      {LOCALES.map(({ code, label }) =>
        code === router.locale ? (
          <span key={code} aria-current="true" lang={code} style={{ fontWeight: 700 }}>
            {label}
          </span>
        ) : (
          <NextLink key={code} href={router.asPath} locale={code} lang={code} hrefLang={code}>
            {label}
          </NextLink>
        )
      )}
    </nav>
  );
}
