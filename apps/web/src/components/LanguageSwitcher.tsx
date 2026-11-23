import { Chip, Wrap } from '@hmidmismi/ui';
import { useRouter } from 'next/router';
import { LOCALES } from '@/lib/locale';
import { t } from '@/lib/text';

/**
 * Switches the page to another language. Pages keep their English slugs in every language, so the path is the same and
 * only the language prefix changes. The current language is the pressed chip.
 *
 * @returns the switcher.
 */
export function LanguageSwitcher() {
  const router = useRouter();
  return (
    <Wrap gap="1" role="group" aria-label={t('language')}>
      {LOCALES.map(({ code, label }) => (
        <Chip
          key={code}
          pressed={code === router.locale}
          onClick={() => {
            if (code !== router.locale) void router.push(router.asPath, undefined, { locale: code });
          }}
        >
          {label}
        </Chip>
      ))}
    </Wrap>
  );
}
