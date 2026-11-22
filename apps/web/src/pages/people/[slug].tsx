// apps/web/src/pages/people/[slug].tsx
import { PersonPage } from '@/components/person';
import { getPerson, type PersonDetail } from '@/lib/sanity';
import { onDemandPaths, withDraft } from '@/lib/static-props';

type Props = { person: PersonDetail };

export const getStaticPaths = onDemandPaths;

export const getStaticProps = withDraft<Props>(async (context, draft) => {
  const slug = context.params?.slug;
  if (typeof slug !== 'string') return { notFound: true };
  const person = await getPerson(slug, draft);
  return person ? { props: { person } } : { notFound: true };
});

export default function PersonRoute({ person }: Props) {
  return <PersonPage person={person} />;
}
