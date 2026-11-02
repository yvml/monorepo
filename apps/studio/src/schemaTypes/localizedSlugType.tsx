import { localizedText } from '@hmidmismi/sanity-core';
import { AddIcon, RemoveCircleIcon } from '@sanity/icons';
import { Box, Button, Flex, Label, Stack, Text, TextInput } from '@sanity/ui';
import { useCallback } from 'react';
import type { ArrayOfObjectsInputProps } from 'sanity';
import { defineArrayMember, defineField, defineType, set, useFormValue } from 'sanity';
import { LOCALES } from '../lib/locales';

/** The languages that get their own slug. */
const SLUG_LANGS = LOCALES.map(({ code, label }) => ({ id: code, title: label }));

type Entry = { _key?: string; language?: string; value?: { current?: string } };

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s/-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function LocalizedSlugInput(props: ArrayOfObjectsInputProps) {
  const { onChange, readOnly } = props;
  const value = (props.value ?? []) as Entry[];
  const title = useFormValue(['title']) as never;

  const entry = (language: string) => value.find((item) => item.language === language);
  const write = useCallback((next: Entry[]) => onChange(set(next)), [onChange]);

  const add = (language: string) =>
    write([...value, { _key: language, language, value: { current: '' } } as Entry]);
  const remove = (language: string) => write(value.filter((item) => item.language !== language));
  const change = (language: string, current: string) =>
    write(
      value.map((item) => (item.language === language ? { ...item, value: { current } } : item))
    );
  const generate = (language: string) => {
    const slug = slugify(localizedText(title, language));
    if (slug) change(language, slug);
  };

  return (
    <Stack space={3}>
      {SLUG_LANGS.filter(({ id }) => entry(id)).map(({ id }) => (
        <Stack key={id} space={2}>
          <Label size={1}>{id.toUpperCase()}</Label>
          <Flex align="center" gap={2}>
            <Box flex={1}>
              <TextInput
                value={entry(id)?.value?.current ?? ''}
                readOnly={readOnly}
                onChange={(event) => change(id, event.currentTarget.value)}
              />
            </Box>
            <Button text="Generate" mode="ghost" disabled={readOnly} onClick={() => generate(id)} />
            <Button
              icon={RemoveCircleIcon}
              mode="bleed"
              tone="critical"
              disabled={readOnly}
              onClick={() => remove(id)}
            />
          </Flex>
        </Stack>
      ))}
      <Flex gap={2}>
        {SLUG_LANGS.filter(({ id }) => !entry(id)).map(({ id }) => (
          <Button
            key={id}
            icon={AddIcon}
            text={id.toUpperCase()}
            mode="ghost"
            disabled={readOnly}
            onClick={() => add(id)}
          />
        ))}
      </Flex>
      {value.length === 0 ? (
        <Text size={1}>Add a slug for each language the page exists in.</Text>
      ) : null}
    </Stack>
  );
}

/**
 * One slug per language. Each entry is `{ _key: <language>, language, value: <slug> }`. Slugs are validated as a set:
 * none may be empty, each language appears once, and no other document of the same type uses the same slug in the
 * same language.
 */
export const localizedSlugType = defineType({
  name: 'localizedSlug',
  type: 'array',
  components: { input: LocalizedSlugInput },
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'language', type: 'string', readOnly: true }),
        defineField({ name: 'value', type: 'slug' }),
      ],
      preview: { select: { title: 'language', subtitle: 'value.current' } },
    }),
  ],
  validation: (Rule) =>
    Rule.custom(async (value, context) => {
      const entries = (value ?? []) as Entry[];
      if (entries.length === 0) return 'Add at least one slug.';
      const seen = new Set<string>();
      for (const item of entries) {
        const language = item.language ?? item._key ?? '';
        if (!item.value?.current) return `The ${language} slug is empty.`;
        if (seen.has(language)) return `There are two ${language} slugs.`;
        seen.add(language);
      }
      const document = context.document;
      if (!document) return true;
      const id = document._id.replace(/^drafts\./, '');
      const client = context.getClient({ apiVersion: '2024-01-01' });
      for (const item of entries) {
        const language = item.language ?? item._key ?? '';
        const taken = await client.fetch<number>(
          'count(*[_type == $type && !(_id in [$id, "drafts." + $id]) && count(slug[(language == $language || _key == $language) && value.current == $slug]) > 0])',
          { type: document._type, id, language, slug: item.value?.current }
        );
        if (taken > 0) return `The ${language} slug "${item.value?.current}" is already used.`;
      }
      return true;
    }),
});
