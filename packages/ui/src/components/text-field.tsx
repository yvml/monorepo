// packages/ui/src/components/fields/TextField.tsx
import * as Field from './field';
import { Input } from './input';
export function TextField({
  label,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <Field.Root disabled={disabled}>
      <Field.Label>{label}</Field.Label>
      <Input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </Field.Root>
  );
}
