import { EventList, type EventListProps } from '@/components/EventList';
import { listEntries, splitByDate, today } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { EXHIBITIONS } from '@/lib/site';

export const getServerSideProps = withPreviewGate<EventListProps>(async (_context, draft) => ({
  props: { section: EXHIBITIONS, ...splitByDate(await listEntries(EXHIBITIONS, draft), today()) },
}));

export default function Page(props: EventListProps) {
  return <EventList {...props} />;
}
