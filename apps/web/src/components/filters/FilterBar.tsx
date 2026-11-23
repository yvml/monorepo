// apps/web/src/components/filters/FilterBar.tsx
import { FilterRow } from '@hmidmismi/ui';
import { MultiControl } from './MultiControl';
import { RangeControl } from './RangeControl';
import { SearchControl } from './SearchControl';
import { SelectControl } from './SelectControl';
import { SortControl } from './SortControl';
import { ToggleControl } from './ToggleControl';
import type { OnChange } from './types';
import { ViewControl } from './ViewControl';
import { t } from '@/i18n';
import { type FilterState, type ListSpec, optionsWithCounts, type Range } from '@/lib/filters';

/**
 * The controls of a listing, built from its spec: one control for each filter, then the sort and the view. Nothing in
 * here knows what is being listed, so any listing with a `ListSpec` gets the same bar.
 *
 * @param props - the spec, the items, the context the filters need, the state and the change handler.
 * @returns the filter row.
 */
export function FilterBar<T, C>({ spec, items, context, state, onChange }: { spec: ListSpec<T, C>; items: T[]; context: C; state: FilterState; onChange: OnChange }) {
  return (
    <FilterRow>
      {spec.filters.map((filter) => {
        const value = state.values[filter.key];
        const label = t(filter.label);
        switch (filter.kind) {
          case 'search':
            return <SearchControl key={filter.key} filterKey={filter.key} label={label} value={String(value ?? '')} onChange={onChange} />;
          case 'toggle':
            return <ToggleControl key={filter.key} filterKey={filter.key} label={label} on={Boolean(value)} onChange={onChange} />;
          case 'range':
            return <RangeControl key={filter.key} filterKey={filter.key} label={label} range={(value as Range) ?? { min: null, max: null }} onChange={onChange} />;
          case 'select':
            return <SelectControl key={filter.key} filterKey={filter.key} label={label} options={optionsWithCounts(spec, items, state, context, filter.key)} value={String(value ?? '')} onChange={onChange} />;
          case 'multi':
            return <MultiControl key={filter.key} filterKey={filter.key} label={label} options={optionsWithCounts(spec, items, state, context, filter.key)} chosen={(value as string[]) ?? []} onChange={onChange} />;
        }
      })}
      {spec.sorts.length > 1 && <SortControl spec={spec} value={state.sort} onChange={onChange} />}
      {spec.views && <ViewControl views={spec.views} value={state.view} onChange={onChange} />}
    </FilterRow>
  );
}
