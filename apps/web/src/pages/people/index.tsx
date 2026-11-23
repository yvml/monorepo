// apps/web/src/pages/people/index.tsx
import { PersonList } from '@/components/person';
import { type PersonListProps, personListLoader } from '@/lib/loaders';

export const getStaticProps = personListLoader;

export default function PersonListRoute({ people }: PersonListProps) {
  return <PersonList people={people} />;
}
