// apps/web/src/pages/workshops/[[...path]].tsx
import { PageColumn } from '@hmidmismi/ui';
import { Site, TitleRow } from '@/components/layout';
import { WorkshopList, WorkshopPage } from '@/components/workshop';
import { WORKSHOPS } from '@/constants';
import { t } from '@/i18n';
import { onDemandPaths, type WorkshopRouteProps, workshopLoader } from '@/lib/loaders';

/** Any address under `/workshops` is generated the first time it is asked for. */
export const getStaticPaths = onDemandPaths;

export const getStaticProps = workshopLoader;

export default function WorkshopRoute(props: WorkshopRouteProps) {
  if (props.view === 'detail') return <WorkshopPage entry={props.entry} draftMode={props.draftMode} />;
  return (
    <Site title={t(WORKSHOPS.title)}>
      <PageColumn>
        <TitleRow title={t(WORKSHOPS.title)} />
        <WorkshopList workshops={props.workshops} today={props.today} />
      </PageColumn>
    </Site>
  );
}
