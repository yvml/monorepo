// apps/web/src/pages/exhibitions/[slug].tsx
import { onDemandPaths } from '@/lib/static-props';
import { EventPage } from '@/components/event';
import { eventLoader, type EventProps } from '@/lib/event-loaders';
import { EXHIBITIONS } from '@/lib/navigation';

export const getStaticPaths = onDemandPaths;

export const getStaticProps = eventLoader(EXHIBITIONS);

export default function Page({ entry, draftMode }: EventProps) {
  return <EventPage section={EXHIBITIONS} entry={entry} draftMode={draftMode} />;
}
