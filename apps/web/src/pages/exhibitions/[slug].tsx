import { EventPage } from '@/components/EventPage';
import { EXHIBITIONS } from '@/lib/navigation';
import { type EventDetail, getEvent } from '@/lib/sanity';
import { withPreviewGate } from '@/lib/gate';

type Props = { entry: EventDetail; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const entry = await getEvent(EXHIBITIONS, slug, draft);
  return entry ? { props: { entry } } : { notFound: true };
});

export default function Page({ entry, draftMode }: Props) {
  return <EventPage section={EXHIBITIONS} entry={entry} draftMode={draftMode} />;
}
