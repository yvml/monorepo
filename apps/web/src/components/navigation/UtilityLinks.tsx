// apps/web/src/components/navigation/UtilityLinks.tsx
import NextLink from 'next/link';
import { Weather } from '@/components/weather';
import { t } from '@/i18n';

/**
 * The links at the start of the masthead and of the bar that follows it: the weather and the shop.
 *
 * @returns the links.
 */
export function UtilityLinks() {
  return (
    <>
      <Weather />
      <NextLink href="#">{t('navShop')}</NextLink>
    </>
  );
}
