// apps/web/src/pages/exhibitions/[slug].tsx
import { EventPage } from '@/components/EventPage';
import { eventLoader, type EventProps } from '@/lib/event-loaders';
import { EXHIBITIONS } from '@/lib/navigation';

export const getServerSideProps = eventLoader(EXHIBITIONS);

export default function Page({ entry, draftMode }: EventProps) {
  return <EventPage section={EXHIBITIONS} entry={entry} draftMode={draftMode} />;
}
