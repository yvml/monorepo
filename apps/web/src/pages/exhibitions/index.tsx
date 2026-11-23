// apps/web/src/pages/exhibitions/index.tsx
import { EventList } from '@/components/event';
import { type EventListProps, eventListLoader } from '@/lib/loaders';
import { EXHIBITIONS } from '@/constants';

export const getStaticProps = eventListLoader(EXHIBITIONS);

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
