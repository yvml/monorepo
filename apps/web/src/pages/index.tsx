// apps/web/src/pages/index.tsx
import { PageColumn, Title } from '@hmidmismi/ui';
import { SiteLayout } from '@/components/SiteLayout';
import { withDraft } from '@/lib/static-props';

export const getStaticProps = withDraft();

export default function Home() {
  return (
    <SiteLayout>
      <PageColumn>
        <Title level="h1">YVML</Title>
      </PageColumn>
    </SiteLayout>
  );
}
