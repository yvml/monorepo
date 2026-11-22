// apps/web/src/pages/events/[slug].tsx
import { onDemandPaths } from '@/lib/static-props';
import { EventPage } from '@/components/event';
import { eventLoader, type EventProps } from '@/lib/event-loaders';
import { EVENTS } from '@/lib/navigation';

export const getStaticPaths = onDemandPaths;

export const getStaticProps = eventLoader(EVENTS);

export default function Page({ entry, draftMode }: EventProps) {
  return <EventPage section={EVENTS} entry={entry} draftMode={draftMode} />;
}
