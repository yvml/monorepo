// apps/web/src/pages/events/index.tsx
import { EventList } from '@/components/EventList';
import { eventListLoader, type EventListProps } from '@/lib/event-loaders';
import { EVENTS } from '@/lib/navigation';

export const getServerSideProps = eventListLoader(EVENTS);

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
