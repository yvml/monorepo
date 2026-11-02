import { Search } from 'lucide-react';
import { type ReactNode, type Ref, useId } from 'react';
import { visuallyHidden } from '../../styled-system/patterns';
import { chip, filterRow, listFilter, searchField } from '../../styled-system/recipes';
import { useUiText } from './ui-text';

/** Props for {@link SearchField}. */
type SearchFieldProps = {
  /** The text in the field. */
  value: string;
  /** Called with the new text. */
  onChange: (value: string) => void;
  /** The hint shown while the field is empty. */
  placeholder: string;
  /** The input element, so a key such as `/` can focus it. */
  inputRef?: Ref<HTMLInputElement>;
};

/**
 * The big search field: the magnifier, an input, a Clear button while there is text and a `/` keycap hint (phones hide
 * it). It is a `search` landmark with a visually hidden label. Escape clears it. Slot recipe `searchField`.
 *
 * @param props - the text, the change handler, the placeholder and the input ref.
 * @returns the search form.
 */
export function SearchField({ value, onChange, placeholder, inputRef }: SearchFieldProps) {
  const t = useUiText();
  const id = useId();
  const classes = searchField();

  return (
    <form
      role="search"
      className={classes.root}
      autoComplete="off"
      onSubmit={(event) => event.preventDefault()}
    >
      <label htmlFor={id} className={visuallyHidden()}>
        {t.search}
      </label>
      <Search className={classes.icon} aria-hidden />
      <input
        id={id}
        ref={inputRef}
        className={classes.input}
        type="search"
        enterKeyHint="search"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onChange('');
        }}
      />
      {value !== '' && (
        <button type="button" className={classes.clear} onClick={() => onChange('')}>
          {t.clear}
        </button>
      )}
      <kbd className={classes.hint} aria-hidden>
        /
      </kbd>
    </form>
  );
}

/**
 * The row of filters under the search field. Slot recipe `filterRow`.
 *
 * @param props - the filter groups.
 * @returns the row.
 */
export function FilterRow({ children }: { children: ReactNode }) {
  return <div className={filterRow().root}>{children}</div>;
}

/** Props for {@link FilterSet}. */
type FilterSetProps = {
  /** The group's label, such as `Recorded`. */
  label: string;
  /** Makes the group one row that scrolls sideways on phones. */
  scroll?: boolean;
  /** The controls. */
  children: ReactNode;
};

/**
 * A filter group: a small label and its controls.
 *
 * @param props - the label, whether it scrolls and the controls.
 * @returns the group.
 */
export function FilterSet({ label, scroll = false, children }: FilterSetProps) {
  const classes = filterRow({ scroll });

  return (
    <div className={classes.group}>
      <span className={classes.label}>{label}</span>
      {children}
    </div>
  );
}

/** Props for {@link Chip}. */
type ChipProps = {
  /** Whether the chip is on (`aria-pressed`). For a removable chip it is always on. */
  pressed?: boolean;
  /** Shows a trailing × and treats the chip as a filter that is on. Needs `label`. */
  removable?: boolean;
  /** The accessible name, for a removable chip. */
  label?: string;
  /** Called when the chip is pressed. */
  onClick: () => void;
  /** The text. */
  children: ReactNode;
};

/**
 * A pill button: a decade to switch on and off, or the chosen label with a × that removes it. Recipe `chip`.
 *
 * @param props - the state, the press handler and the text.
 * @returns the chip.
 */
export function Chip({ pressed, removable = false, label, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      className={chip()}
      aria-pressed={removable ? undefined : pressed}
      aria-label={label}
      data-on={removable ? '' : undefined}
      data-removable={removable ? '' : undefined}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

/** Props for {@link ListFilter}. */
type ListFilterProps = {
  /** The text in the filter. */
  value: string;
  /** Called with the new text. */
  onChange: (value: string) => void;
  /** The hint, such as `Find an item (22)`. */
  placeholder: string;
  /** The accessible name. */
  label: string;
};

/**
 * A text filter over a list: a boxed input with an accent border on focus. Recipe `listFilter`.
 *
 * @param props - the text, the change handler, the placeholder and the name.
 * @returns the input.
 */
export function ListFilter({ value, onChange, placeholder, label }: ListFilterProps) {
  return (
    <input
      type="search"
      className={listFilter()}
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
