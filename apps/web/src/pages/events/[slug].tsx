// apps/web/src/pages/events/[slug].tsx
import { EventPage } from '@/components/EventPage';
import { eventLoader, type EventProps } from '@/lib/event-loaders';
import { EVENTS } from '@/lib/navigation';

export const getServerSideProps = eventLoader(EVENTS);

export default function Page({ entry, draftMode }: EventProps) {
  return <EventPage section={EVENTS} entry={entry} draftMode={draftMode} />;
}
