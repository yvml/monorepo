import { EventEntry } from '@/components/EventEntry';
import { type EventDetail, getEntry } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { EXHIBITIONS } from '@/lib/site';

type Props = { entry: EventDetail; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const entry = await getEntry(EXHIBITIONS, slug, draft);
  return entry ? { props: { entry } } : { notFound: true };
});

export default function ExhibitionPage({ entry, draftMode }: Props) {
  return <EventEntry section={EXHIBITIONS} entry={entry} draftMode={draftMode} />;
}
