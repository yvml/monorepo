// apps/web/src/pages/about/contact.tsx
import { KeelaSignup } from '@/components/keela';
import { Page } from '@/components/layout';
import { NEWSLETTER_URL } from '@/lib/keela';
import { type PageProps, pageLoader } from '@/lib/page-loader';
import { t } from '@/i18n';

/** The Contact page: the page from the studio, then the newsletter signup. */
export const getStaticProps = pageLoader('about/contact');

export default function ContactPage({ page, draftMode }: PageProps) {
  return (
    <Page page={page} draftMode={draftMode}>
      <KeelaSignup url={NEWSLETTER_URL} title={t('newsletterSignup')} />
    </Page>
  );
}
