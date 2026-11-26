// apps/web/src/pages/workshops/[[...path]].tsx
import { WorkshopList, WorkshopPage } from '@/components/workshop';
import { onDemandPaths, type WorkshopRouteProps, workshopLoader } from '@/lib/loaders';

/** Any address under `/workshops` is generated the first time it is asked for. */
export const getStaticPaths = onDemandPaths;

export const getStaticProps = workshopLoader;

export default function WorkshopRoute(props: WorkshopRouteProps) {
  if (props.view === 'detail') return <WorkshopPage entry={props.entry} draftMode={props.draftMode} />;
  return <WorkshopList workshops={props.workshops} today={props.today} />;
}
