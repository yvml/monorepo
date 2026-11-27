// apps/web/src/components/layout/PageFooter.tsx
import { SiteFooter } from '@hmidmismi/ui';
import { mainMenu, socialMenu } from '@/components/navigation';
import { EIN, ORG_NAME, SITE_BUILDER } from '@/constants';
import { t } from '@/i18n';

/**
 * The footer of every page: the site's links, the copyright, the nonprofit status and the site credit.
 *
 * @returns the footer.
 */
export function PageFooter() {
  return (
    <SiteFooter
      links={[...mainMenu(), ...socialMenu]}
      copyright={t('copyright', { year: new Date().getFullYear(), name: ORG_NAME })}
      notes={[t('nonprofitStatus', { name: ORG_NAME, ein: EIN }), t('siteBy', { name: SITE_BUILDER })]}
    />
  );
}
