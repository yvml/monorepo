// apps/web/src/components/filters/MultiControl.tsx
import { Chip, ComboboxMultiSelect, FilterSet } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { type CountedOption, withValue } from '@/lib/filters';

/** A filter with more choices than this is a searchable list, not a row of chips. */
const CHIP_LIMIT = 12;

/**
 * Chips for a filter with any number of choices, each with how many items it would leave; a searchable list when there are many.
 *
 * @param props - the filter's key, its label, its choices with counts, the chosen values, and the change handler.
 * @returns the chips or the list.
 */
export function MultiControl({ filterKey, label, options, chosen, onChange }: { filterKey: string; label: string; options: CountedOption[]; chosen: string[]; onChange: OnChange }) {
  if (options.length > CHIP_LIMIT) {
    return (
      <ComboboxMultiSelect
        label={label}
        values={chosen}
        options={options.map((option) => ({ id: option.value, name: option.label }))}
        onChange={(next) => onChange((old) => withValue(old, filterKey, next))}
      />
    );
  }
  return (
    <FilterSet label={label} scroll>
      {options.map((option) => (
        <Chip
          key={option.value}
          pressed={chosen.includes(option.value)}
          onClick={() =>
            onChange((old) => {
              const current = (old.values[filterKey] as string[]) ?? [];
              return withValue(old, filterKey, current.includes(option.value) ? current.filter((value) => value !== option.value) : [...current, option.value]);
            })
          }
        >
          {`${option.label} (${option.count})`}
        </Chip>
      ))}
    </FilterSet>
  );
}
