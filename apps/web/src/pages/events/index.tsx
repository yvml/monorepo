// apps/web/src/pages/events/index.tsx
import { EventList } from '@/components/event';
import { eventListLoader, type EventListProps } from '@/lib/event-loaders';
import { EVENTS } from '@/lib/navigation';

export const getStaticProps = eventListLoader(EVENTS);

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
