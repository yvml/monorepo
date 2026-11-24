// apps/web/src/pages/events/index.tsx
import { EventList } from '@/components/event';
import { type EventListProps, eventListLoader } from '@/lib/loaders';
import { EVENTS } from '@/constants';

export const getStaticProps = eventListLoader(EVENTS);

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
