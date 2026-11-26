// apps/studio/src/components/InstructorsInput.tsx
import { CloseIcon } from '@sanity/icons/Close';
import { Button, Flex, Stack } from '@sanity/ui';
import { Autocomplete } from '@sanity/ui/autocomplete';
import { useEffect, useMemo, useState } from 'react';
import { type ArrayOfObjectsInputProps, set, useClient } from 'sanity';

type Reference = { _key: string; _type: 'reference'; _ref: string };
type Person = { _id: string; title?: string };

const key = () => Math.random().toString(36).slice(2, 12);

/**
 * Picks the people who teach a workshop. Clicking a name turns it into a search box right there, so you pick someone
 * else without leaving the form (a normal reference opens that person's document instead). The ✕ removes an
 * instructor and the last box adds another. The last box also takes the studio's focus (`elementProps`), which is how
 * Presentation scrolls to this field when an instructor is clicked on the page.
 *
 * @param props - the array input props.
 * @returns the picker.
 */
export function InstructorsInput({ value, onChange, readOnly, elementProps }: ArrayOfObjectsInputProps) {
  const client = useClient({ apiVersion: '2025-01-01' });
  const [people, setPeople] = useState<Person[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const items = (value ?? []) as unknown as Reference[];

  useEffect(() => {
    client
      .fetch<Person[]>(
        `*[_type == "person" && !(_id in path("drafts.**")) && defined(title)] | order(familyName asc, nameGiven asc){_id, title}`
      )
      .then(setPeople);
  }, [client]);

  const nameOf = useMemo(() => new Map(people.map((person) => [person._id, person.title ?? 'Unnamed'])), [people]);
  const idOf = useMemo(() => new Map(people.map((person) => [person.title ?? '', person._id])), [people]);
  const optionsFor = (keep?: string) => {
    const taken = new Set(items.map((item) => item._ref));
    return people
      .filter((person) => person._id === keep || !taken.has(person._id))
      .map((person) => ({ value: person.title ?? '' }));
  };

  const write = (next: Reference[]) => onChange(set(next));

  return (
    <Stack gap={2}>
      {items.map((item) => (
        <Flex key={item._key} gap={2} align="center">
          {editing === item._key ? (
            <>
              <div style={{ flex: 1 }}>
                <Autocomplete
                  id={`instructor-${item._key}`}
                  placeholder="Search people"
                  options={optionsFor(item._ref)}
                  autoFocus
                  openButton
                  value=""
                  onSelect={(title) => {
                    const id = idOf.get(title);
                    if (id) write(items.map((other) => (other._key === item._key ? { ...other, _ref: id } : other)));
                    setEditing(null);
                  }}
                />
              </div>
              <Button text="Cancel" mode="ghost" onClick={() => setEditing(null)} />
            </>
          ) : (
            <>
              <Button
                style={{ flex: 1, justifyContent: 'flex-start' }}
                mode="ghost"
                text={nameOf.get(item._ref) ?? 'Loading…'}
                disabled={readOnly}
                title="Click to change"
                onClick={() => setEditing(item._key)}
              />
              <Button
                icon={CloseIcon}
                mode="bleed"
                tone="critical"
                title="Remove"
                disabled={readOnly}
                onClick={() => write(items.filter((other) => other._key !== item._key))}
              />
            </>
          )}
        </Flex>
      ))}
      <Autocomplete
        {...elementProps}
        placeholder={items.length ? 'Add another instructor' : 'Choose an instructor'}
        options={optionsFor()}
        disabled={readOnly}
        openButton
        value=""
        onSelect={(title) => {
          const id = idOf.get(title);
          if (id) write([...items, { _key: key(), _type: 'reference', _ref: id }]);
        }}
      />
    </Stack>
  );
}
