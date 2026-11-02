'use client';
import { useListCollection } from '@ark-ui/react/combobox';
import { useFilter } from '@ark-ui/react/locale';
import * as Combobox from './combobox';
import { fill, useUiText } from './ui-text';

export function ComboboxSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value: T | '';
  options: { id: T; name: string }[];
  onChange: (value: T | undefined) => void;
  disabled?: boolean;
}) {
  const t = useUiText();
  const { contains } = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: options,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
    filter: contains,
  });

  return (
    <Combobox.Root
      collection={collection}
      value={value ? [value] : []}
      disabled={disabled}
      onInputValueChange={(details) => filter(details.inputValue)}
      onValueChange={(details) => onChange(details.value[0] as T | undefined)}
    >
      <Combobox.Label>{label}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.Empty>{t.noMatches}</Combobox.Empty>
          {collection.items.map((item) => (
            <Combobox.Item key={item.id} item={item}>
              <Combobox.ItemText>{item.name}</Combobox.ItemText>
              <Combobox.ItemIndicator />
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  );
}

export function ComboboxMultiSelect<T extends string>({
  label,
  values,
  options,
  onChange,
  disabled,
}: {
  label: string;
  values: T[];
  options: { id: T; name: string }[];
  onChange: (values: T[]) => void;
  disabled?: boolean;
}) {
  const t = useUiText();
  const { contains } = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: options,
    itemToString: (item) => item.name,
    itemToValue: (item) => item.id,
    filter: contains,
  });

  function removeOne(id: T, e: React.MouseEvent) {
    e.stopPropagation();
    onChange(values.filter((v) => v !== id));
  }

  return (
    <Combobox.Root
      multiple
      collection={collection}
      value={values}
      disabled={disabled}
      positioning={{ sameWidth: true }}
      onInputValueChange={(details) => filter(details.inputValue)}
      onValueChange={(details) => onChange(details.value as T[])}
    >
      <Combobox.Label>{label}</Combobox.Label>
      <Combobox.Control
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          border: '1px solid var(--colors-gray-6, #ccc)',
          borderRadius: '6px',
          padding: '4px 8px',
          minHeight: '36px',
        }}
      >
        {values.map((id) => {
          const opt = options.find((o) => o.id === id);
          return (
            <span
              key={id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '999px',
                background: 'var(--colors-gray-3, #eee)',
              }}
            >
              {opt?.name ?? id}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => removeOne(id, e)}
                  aria-label={fill(t.remove, { name: opt?.name ?? id })}
                >
                  ×
                </button>
              )}
            </span>
          );
        })}
        <Combobox.Input
          style={{
            flex: '1 1 60px',
            minWidth: '60px',
            border: 'none',
            outline: 'none',
            height: '24px',
          }}
        />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.Empty>{t.noMatches}</Combobox.Empty>
          {collection.items.map((item) => (
            <Combobox.Item key={item.id} item={item}>
              <Combobox.ItemText>{item.name}</Combobox.ItemText>
              <Combobox.ItemIndicator />
            </Combobox.Item>
          ))}
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  );
}
