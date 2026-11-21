// apps/web/src/pages/index.tsx
import { PageColumn, Title } from '@hmidmismi/ui';
import { SiteLayout } from '@/components/SiteLayout';
import { withPreviewGate } from '@/lib/gate';

export const getServerSideProps = withPreviewGate();

export default function Home() {
  return (
    <SiteLayout>
      <PageColumn>
        <Title level="h1">YVML</Title>
      </PageColumn>
    </SiteLayout>
  );
}
