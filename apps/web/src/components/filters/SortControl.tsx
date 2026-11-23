// apps/web/src/components/filters/SortControl.tsx
import { ComboboxSelect } from '@hmidmismi/ui';
import type { OnChange } from './types';
import { t } from '@/i18n';
import type { ListSpec } from '@/lib/filters';

/**
 * The list that picks how the listing is ordered.
 *
 * @param props - the listing's spec, the current order, and the change handler.
 * @returns the list.
 */
export function SortControl<T, C>({ spec, value, onChange }: { spec: ListSpec<T, C>; value: string; onChange: OnChange }) {
  return (
    <ComboboxSelect
      label={t('sortBy')}
      value={value}
      options={spec.sorts.map((sort) => ({ id: sort.value, name: t(sort.label) }))}
      onChange={(next) => onChange((old) => ({ ...old, sort: next ?? spec.defaultSort }))}
    />
  );
}
