// packages/ui/src/components/fields/EditableField.tsx
'use client';
import { useRef } from 'react';
import * as Field from './field';
import { Input } from './input';

export function EditableField({
  label,
  value,
  onSave,
  onClear,
  disabled,
}: {
  label: string;
  value: string;
  onSave: (value: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);

  function handleBlur() {
    const next = ref.current?.value.trim();
    if (next === undefined || next === value) return;
    onSave(next || '');
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      ref.current?.blur();
    }
    if (e.key === 'Escape') {
      if (ref.current) ref.current.value = value;
      ref.current?.blur();
    }
  }

  return (
    <Field.Root disabled={disabled}>
      <Field.Label>{label}</Field.Label>
      <Input
        ref={ref}
        type="text"
        defaultValue={value}
        onBlur={disabled ? undefined : handleBlur}
        onKeyDown={disabled ? undefined : handleKeyDown}
        style={{ cursor: disabled ? 'default' : 'text', minWidth: 120 }}
      />
      {!disabled && onClear && value && (
        <button type="button" onClick={onClear}>
          ×
        </button>
      )}
    </Field.Root>
  );
}
