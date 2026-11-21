import { EventList, type EventListProps } from '@/components/EventList';
import { splitByDate, today } from '@/lib/dates';
import { EVENTS } from '@/lib/navigation';
import { listEvents } from '@/lib/sanity';
import { withPreviewGate } from '@/lib/gate';

export const getServerSideProps = withPreviewGate<EventListProps>(async (_context, draft) => ({
  props: { section: EVENTS, ...splitByDate(await listEvents(EVENTS, draft), today()) },
}));

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
