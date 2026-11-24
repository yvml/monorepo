// apps/web/src/pages/events/[slug].tsx
import { type EventProps, eventLoader, onDemandPaths } from '@/lib/loaders';
import { EventPage } from '@/components/event';
import { EVENTS } from '@/constants';

export const getStaticPaths = onDemandPaths;

export const getStaticProps = eventLoader(EVENTS);

export default function Page({ entry, draftMode }: EventProps) {
  return <EventPage section={EVENTS} entry={entry} draftMode={draftMode} />;
}
