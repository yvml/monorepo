import { WorkshopDetail } from '@/components/WorkshopDetail';
import { type EventDetail, getEntry } from '@/lib/events';
import { withPreviewGate } from '@/lib/gate';
import { WORKSHOPS } from '@/lib/site';

type Props = { entry: EventDetail; draftMode?: boolean };

export const getServerSideProps = withPreviewGate<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const entry = await getEntry(WORKSHOPS, slug, draft);
  return entry ? { props: { entry } } : { notFound: true };
});

export default function WorkshopPage({ entry, draftMode }: Props) {
  return <WorkshopDetail entry={entry} draftMode={draftMode} />;
}
