// apps/web/src/pages/index.tsx
import { PageColumn, Title } from '@hmidmismi/ui';
import { Site } from '@/components/layout';
import { withDraft } from '@/lib/loaders';

export const getStaticProps = withDraft();

export default function Home() {
  return (
    <Site>
      <PageColumn>
        <Title level="h1">YVML</Title>
      </PageColumn>
    </Site>
  );
}
