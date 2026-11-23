// apps/web/src/components/filters/RangeControl.tsx
import { Field, FilterSet, Input } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { t } from '@/i18n';
import { num, type Range, withValue } from '@/lib/filters';

/**
 * A pair of number boxes for a range filter. Typing replaces the history entry instead of adding one.
 *
 * @param props - the filter's key, its label, its current range, and the change handler.
 * @returns the pair.
 */
export function RangeControl({ filterKey, label, range, onChange }: { filterKey: string; label: string; range: Range; onChange: OnChange }) {
  const edit = (end: 'min' | 'max') => (text: string) =>
    onChange((old) => withValue(old, filterKey, { ...(old.values[filterKey] as Range), [end]: num(text) }), { replace: true });
  return (
    <FilterSet label={label}>
      <Field.Root>
        <Field.Label>{t('priceMin')}</Field.Label>
        <Input type="number" inputMode="numeric" min={0} value={range.min ?? ''} onChange={(event) => edit('min')(event.target.value)} />
      </Field.Root>
      <Field.Root>
        <Field.Label>{t('priceMax')}</Field.Label>
        <Input type="number" inputMode="numeric" min={0} value={range.max ?? ''} onChange={(event) => edit('max')(event.target.value)} />
      </Field.Root>
    </FilterSet>
  );
}
