import { useEffect } from 'react';
import type { StringInputProps } from 'sanity';
import { set, unset, useFormValue } from 'sanity';
import { localizedText } from '../i18n';

type Props = StringInputProps & {
  /** The sibling fields to join. Each may be a plain string or a localized array (its English value is used). */
  fields: string[];
  separator?: string;
};

/**
 * A read-only string that is computed from other fields on the same document and written back when they change, such
 * as a person's display name from their given, middle and family names.
 */
export function ComputedStringInput({ fields, separator = ' ', ...props }: Props) {
  const document = (useFormValue([]) ?? {}) as Record<string, unknown>;
  const computed = fields
    .map((name) => localizedText(document[name] as never))
    .filter(Boolean)
    .join(separator);
  const { value, onChange, renderDefault } = props;

  useEffect(() => {
    if (computed !== (value ?? '')) onChange(computed ? set(computed) : unset());
  }, [computed, value, onChange]);

  return renderDefault({ ...props, readOnly: true });
}

/**
 * Builds an input component for a schema's `components.input` that computes its value from the given fields.
 *
 * @param fields - the sibling field names to join.
 * @returns the input component.
 */
export function computedStringInput(fields: string[]) {
  return function ComputedInput(props: StringInputProps) {
    return <ComputedStringInput {...props} fields={fields} />;
  };
}
