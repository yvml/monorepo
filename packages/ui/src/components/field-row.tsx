import { fieldRow } from '../../styled-system/recipes';

export function FieldRow({
  label,
  children,
  labelWidth,
}: {
  label: string;
  children: React.ReactNode;
  labelWidth?: 'sm' | 'md';
}) {
  return (
    <div className={fieldRow({ labelWidth })}>
      <span>{label}</span>
      {children}
    </div>
  );
}
