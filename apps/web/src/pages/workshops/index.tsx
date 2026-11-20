import { ListHeader, PageColumn } from '@hmidmismi/ui';
import Head from 'next/head';
import { SiteLayout } from '@/components/SiteLayout';
import { WorkshopList } from '@/components/WorkshopList';
import { today } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { SITE_NAME, WORKSHOPS } from '@/lib/site';
import { listWorkshops, type WorkshopSummary } from '@/lib/workshops';

type Props = { workshops: WorkshopSummary[]; today: string; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (_context, draft) => ({
  props: { workshops: await listWorkshops(draft), today: today() },
}));

export default function Page({ workshops, today: now, draftMode }: Props) {
  return (
    <SiteLayout>
      <Head>
        <title>{`${WORKSHOPS.title} · ${SITE_NAME}`}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <PageColumn>
        <ListHeader title={WORKSHOPS.title} />
        <WorkshopList workshops={workshops} today={now} draft={Boolean(draftMode)} />
      </PageColumn>
    </SiteLayout>
  );
}
