// apps/web/src/pages/exhibitions/[slug].tsx
import { type EventProps, eventLoader, onDemandPaths } from '@/lib/loaders';
import { EventPage } from '@/components/event';
import { EXHIBITIONS } from '@/constants';

export const getStaticPaths = onDemandPaths;

export const getStaticProps = eventLoader(EXHIBITIONS);

export default function Page({ entry, draftMode }: EventProps) {
  return <EventPage section={EXHIBITIONS} entry={entry} draftMode={draftMode} />;
}
