import { EventPage } from '@/components/EventPage';
import { type Entry, getEntry } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { EXHIBITIONS } from '@/lib/site';

type Props = { entry: Entry; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const entry = await getEntry(EXHIBITIONS, slug, draft);
  return entry ? { props: { entry } } : { notFound: true };
});

export default function Page({ entry, draftMode }: Props) {
  return <EventPage section={EXHIBITIONS} entry={entry} draftMode={draftMode} />;
}
