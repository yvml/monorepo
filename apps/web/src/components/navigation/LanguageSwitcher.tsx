// apps/web/src/components/navigation/LanguageSwitcher.tsx
import { EditableSelect } from '@hmidmismi/ui';
import { useRouter } from 'next/router';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/locale';
import { t } from '@/lib/text';

/**
 * Switches the page between languages with a select list that shows the language code, `EN` by default. Pages keep their
 * English slugs in every language, so the path is the same and only the language prefix changes.
 *
 * @returns the select.
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const current = router.locale ?? DEFAULT_LOCALE;
  return (
    <EditableSelect
      label={t('language')}
      hideLabel
      size="sm"
      value={current}
      options={LOCALES.map(({ code }) => ({ id: code, name: code.toUpperCase() }))}
      onChange={(code) => {
        if (code && code !== current) void router.push(router.asPath, undefined, { locale: code });
      }}
    />
  );
}
