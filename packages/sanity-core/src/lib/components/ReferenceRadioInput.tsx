import { Button, Flex, Radio, Stack, Text } from '@sanity/ui';
import { useEffect, useState } from 'react';
import type { ReferenceInputProps } from 'sanity';
import { set, unset, useClient } from 'sanity';

type Option = { _id: string; name: string };

interface Props extends ReferenceInputProps {
  /** A GROQ query returning `{ _id, name }` for each option. */
  query: string;
}

/**
 * Shows the options of a reference field as radio buttons. Each option is a label, so clicking the text selects it,
 * and the radios share a name so they behave as one group.
 */
export function ReferenceRadioInput({ onChange, value, query, readOnly, path }: Props) {
  const client = useClient({ apiVersion: '2024-01-01' });
  const [options, setOptions] = useState<Option[]>([]);
  const [error, setError] = useState<string | null>(null);
  const group = path.join('.');

  useEffect(() => {
    let active = true;
    client
      .fetch<Option[]>(query)
      .then((result) => {
        if (active) setOptions(result);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message);
      });
    return () => {
      active = false;
    };
  }, [client, query]);

  if (error) return <Text size={1}>Could not load options: {error}</Text>;

  return (
    <Stack space={3}>
      {options.map((option) => (
        <Flex
          key={option._id}
          as="label"
          align="center"
          gap={3}
          style={{ cursor: readOnly ? 'default' : 'pointer' }}
        >
          <Radio
            name={group}
            checked={value?._ref === option._id}
            disabled={readOnly}
            onChange={() => onChange(set({ _type: 'reference', _ref: option._id }))}
          />
          <Text>{option.name}</Text>
        </Flex>
      ))}
      {value?._ref && !readOnly ? (
        <Button mode="bleed" tone="critical" text="Clear" onClick={() => onChange(unset())} />
      ) : null}
    </Stack>
  );
}
