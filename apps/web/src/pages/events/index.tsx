import { EventList, type EventListProps } from '@/components/EventList';
import { listEntries, splitByDate, today } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { EVENTS } from '@/lib/site';

export const getServerSideProps = withPreviewGate<EventListProps>(async (_context, draft) => ({
  props: { section: EVENTS, ...splitByDate(await listEntries(EVENTS, draft), today()) },
}));

export default function Events(props: EventListProps) {
  return <EventList {...props} />;
}
