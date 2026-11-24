// apps/web/src/lib/sorts/person.ts

/** What a person's name is read from: the studio's full name, and the family and given names when it has them. */
export type PersonName = { title?: string | null; familyName?: string | null; nameGiven?: string | null };

/** The last name a person is ordered by: their family name, or the last word of their name. */
export const lastName = (person: PersonName) => person.familyName || person.title?.split(' ').at(-1) || '';

/** Last name, then first name, in lower case. */
const personKey = (person: PersonName) => `${lastName(person)} ${person.nameGiven ?? ''}`.toLowerCase();

/** The key of an item with no person: after every name. */
const LAST = '￿';

/**
 * Orders items by their first person, by last name then first name. Items with no person sort last.
 *
 * @param pick - the people an item has.
 * @returns a comparator.
 */
export const byFirstPerson = <T>(pick: (item: T) => PersonName[] | null | undefined) => {
  const key = (item: T) => {
    const first = pick(item)?.[0];
    return first ? personKey(first) : LAST;
  };
  return (a: T, b: T) => key(a).localeCompare(key(b));
};
