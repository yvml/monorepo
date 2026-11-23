// apps/web/src/pages/people/[slug].tsx
import { PersonPage } from '@/components/person';
import { onDemandPaths, type PersonProps, personLoader } from '@/lib/loaders';

export const getStaticPaths = onDemandPaths;

export const getStaticProps = personLoader;

export default function PersonRoute({ person }: PersonProps) {
  return <PersonPage person={person} />;
}
