// apps/web/src/components/filters/FilterBar.tsx
import {
  Chip,
  ComboboxMultiSelect,
  ComboboxSelect,
  Field,
  FilterRow,
  FilterSet,
  Input,
  ListFilter,
} from '@hmidmismi/ui';
import { type FilterState, type ListSpec, num, optionsWithCounts, type Range, withValue } from '@/lib/filters';
import { t } from '@/i18n';

/** A multi or select filter with more choices than this is a searchable list, not a row of chips. */
const CHIP_LIMIT = 12;

type Props<T, C> = {
  spec: ListSpec<T, C>;
  items: T[];
  context: C;
  state: FilterState;
  /** Called with a function from the old state to the new one; `replace` for typing, which should not fill the history. */
  onChange: (update: (old: FilterState) => FilterState, options?: { replace?: boolean }) => void;
};

/**
 * The controls of a listing, built from its spec: a text box for a search, chips for a few choices, a searchable list for
 * many, a number pair for a range, a chip for an on/off, then the sort and the view. Nothing in here knows what is being
 * listed, so any listing with a `ListSpec` gets the same bar.
 *
 * @param props - the spec, the items, the context the filters need, the state and the change handler.
 * @returns the filter row.
 */
export function FilterBar<T, C>({ spec, items, context, state, onChange }: Props<T, C>) {
  return (
    <FilterRow>
      {spec.filters.map((filter) => {
        const value = state.values[filter.key];
        const name = t(filter.label);
        switch (filter.kind) {
          case 'search':
            return (
              <ListFilter
                key={filter.key}
                label={name}
                placeholder={name}
                value={String(value ?? '')}
                onChange={(text) => onChange((old) => withValue(old, filter.key, text), { replace: true })}
              />
            );
          case 'toggle':
            return (
              <Chip key={filter.key} pressed={Boolean(value)} onClick={() => onChange((old) => withValue(old, filter.key, !old.values[filter.key]))}>
                {name}
              </Chip>
            );
          case 'range': {
            const { min, max } = (value as Range) ?? { min: null, max: null };
            const edit = (end: 'min' | 'max') => (text: string) =>
              onChange((old) => withValue(old, filter.key, { ...(old.values[filter.key] as Range), [end]: num(text) }), { replace: true });
            return (
              <FilterSet key={filter.key} label={name}>
                <Field.Root>
                  <Field.Label>{t('priceMin')}</Field.Label>
                  <Input type="number" inputMode="numeric" min={0} value={min ?? ''} onChange={(event) => edit('min')(event.target.value)} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>{t('priceMax')}</Field.Label>
                  <Input type="number" inputMode="numeric" min={0} value={max ?? ''} onChange={(event) => edit('max')(event.target.value)} />
                </Field.Root>
              </FilterSet>
            );
          }
          case 'select': {
            const options = optionsWithCounts(spec, items, state, context, filter.key);
            return (
              <FilterSet key={filter.key} label={name}>
                <Chip pressed={value === ''} onClick={() => onChange((old) => withValue(old, filter.key, ''))}>
                  {t('availabilityAll')}
                </Chip>
                {options.map((option) => (
                  <Chip key={option.value} pressed={value === option.value} onClick={() => onChange((old) => withValue(old, filter.key, option.value))}>
                    {`${option.label} (${option.count})`}
                  </Chip>
                ))}
              </FilterSet>
            );
          }
          case 'multi': {
            const options = optionsWithCounts(spec, items, state, context, filter.key);
            const chosen = (value as string[]) ?? [];
            if (options.length > CHIP_LIMIT) {
              return (
                <ComboboxMultiSelect
                  key={filter.key}
                  label={name}
                  values={chosen}
                  options={options.map((option) => ({ id: option.value, name: option.label }))}
                  onChange={(next) => onChange((old) => withValue(old, filter.key, next))}
                />
              );
            }
            return (
              <FilterSet key={filter.key} label={name} scroll>
                {options.map((option) => (
                  <Chip
                    key={option.value}
                    pressed={chosen.includes(option.value)}
                    onClick={() =>
                      onChange((old) => {
                        const current = (old.values[filter.key] as string[]) ?? [];
                        return withValue(old, filter.key, current.includes(option.value) ? current.filter((v) => v !== option.value) : [...current, option.value]);
                      })
                    }
                  >
                    {`${option.label} (${option.count})`}
                  </Chip>
                ))}
              </FilterSet>
            );
          }
        }
      })}
      <ComboboxSelect
        label={t('sortBy')}
        value={state.sort}
        options={spec.sorts.map((sort) => ({ id: sort.value, name: t(sort.label) }))}
        onChange={(next) => onChange((old) => ({ ...old, sort: next ?? spec.defaultSort }))}
      />
      {spec.views && (
        <FilterSet label={t('viewLabel')}>
          {spec.views.map((view) => (
            <Chip key={view.value} pressed={state.view === view.value} onClick={() => onChange((old) => ({ ...old, view: view.value }))}>
              {t(view.label)}
            </Chip>
          ))}
        </FilterSet>
      )}
    </FilterRow>
  );
}
