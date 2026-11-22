// apps/web/src/pages/people/index.tsx
import { PersonList } from '@/components/person';
import { listPeople, type PersonSummary } from '@/lib/sanity';
import { withDraft } from '@/lib/static-props';

type Props = { people: PersonSummary[] };

export const getStaticProps = withDraft<Props>(async (_context, draft) => ({
  props: { people: await listPeople(draft) },
}));

export default function PeopleRoute({ people }: Props) {
  return <PersonList people={people} />;
}
