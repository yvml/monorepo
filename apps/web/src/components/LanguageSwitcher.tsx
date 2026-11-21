// apps/web/src/components/LanguageSwitcher.tsx
import { ToggleGroup } from '@hmidmismi/ui';
import { useRouter } from 'next/router';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/locale';
import { t } from '@/lib/text';

/**
 * Switches the page between languages: one toggle with the current language selected, English by default. Pages keep
 * their English slugs in every language, so the path is the same and only the language prefix changes. The toggle always
 * has one side selected, so pressing the selected side does nothing.
 *
 * @returns the toggle.
 */
export function LanguageSwitcher() {
  const router = useRouter();
  const current = router.locale ?? DEFAULT_LOCALE;
  return (
    <ToggleGroup.Root
      aria-label={t('language')}
      value={[current]}
      deselectable={false}
      onValueChange={({ value: [code] }) => {
        if (code && code !== current) void router.push(router.asPath, undefined, { locale: code });
      }}
    >
      {LOCALES.map(({ code, label }) => (
        <ToggleGroup.Item key={code} value={code} aria-label={label}>
          {code.toUpperCase()}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}
