import { EventEntry } from '@/components/EventEntry';
import { type EventDetail, getEntry } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { EVENTS } from '@/lib/site';

type Props = { entry: EventDetail; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const entry = await getEntry(EVENTS, slug, draft);
  return entry ? { props: { entry } } : { notFound: true };
});

export default function EventPage({ entry, draftMode }: Props) {
  return <EventEntry section={EVENTS} entry={entry} draftMode={draftMode} />;
}
