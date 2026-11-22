// apps/web/src/pages/exhibitions/index.tsx
import { EventList } from '@/components/event';
import { eventListLoader, type EventListProps } from '@/lib/event-loaders';
import { EXHIBITIONS } from '@/lib/navigation';

export const getStaticProps = eventListLoader(EXHIBITIONS);

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
