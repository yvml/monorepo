'use client';
import { useListCollection } from '@ark-ui/react/combobox';
import { useFilter } from '@ark-ui/react/locale';
import * as Combobox from './combobox';
import { fill, useUiText } from './ui-text';

export function EditableMultiSelect<T extends string>({
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
      onInputValueChange={(details) => filter(details.inputValue)}
      onValueChange={(details) => onChange(details.value as T[])}
    >
      <Combobox.Label>{label}</Combobox.Label>
      <Combobox.Control>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center', flex: 1 }}
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
          <Combobox.Input placeholder={t.addPlaceholder} />
        </div>
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
