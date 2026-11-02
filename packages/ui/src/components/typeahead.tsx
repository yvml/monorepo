import { type ReactNode, useId, useMemo, useRef, useState } from 'react';
import { tokenize } from '../text/normalize';
import {
  announceCount,
  chosenOption,
  filterOptions,
  moveActive,
  type Noun,
  type TypeaheadKey,
  type TypeaheadOption,
} from '../text/typeahead';
import { Highlight } from './highlight';
import { typeaheadSlots } from './slots';

/** Props for {@link Typeahead}. */
type TypeaheadProps = {
  /** Every option, with the number that ranks it. */
  options: TypeaheadOption[];
  /** Called with the chosen option's ID. */
  onChoose: (id: number) => void;
  /** The input's accessible name. */
  label: string;
  /** What the options are called, for the announcement a screen reader hears when the list changes. */
  noun: Noun;
  /** The input's placeholder. */
  placeholder: string;
  /** The accessible name of the list. */
  listLabel: string;
  /** What the list says when nothing matches. */
  emptyText: string;
  /** What the end of an option shows, such as its count. */
  meta: (option: TypeaheadOption) => ReactNode;
};

/**
 * A type-ahead: the list filters as you type, shows what is behind each option, and an option is chosen with the mouse or
 * with the arrow keys and Enter. It follows the ARIA combobox pattern: the input keeps focus and names the active option
 * with `aria-activedescendant`. Slot recipe `typeahead`.
 *
 * @param props - the options, the choice handler and the wording.
 * @returns the combobox.
 */
export function Typeahead({
  options,
  onChoose,
  label,
  noun,
  placeholder,
  listLabel,
  emptyText,
  meta,
}: TypeaheadProps) {
  const id = useId();
  const listId = `${id}-list`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const input = useRef<HTMLInputElement>(null);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const listed = useMemo(() => filterOptions(options, text), [options, text]);
  const tokens = tokenize(text);
  const classes = typeaheadSlots();

  const choose = (option: TypeaheadOption | undefined) => {
    if (!option) return;
    onChoose(option.id);
    setText('');
    setOpen(false);
    setActive(-1);
    input.current?.blur();
  };

  return (
    <div className={classes.root}>
      <input
        ref={input}
        className={classes.input}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        aria-label={label}
        placeholder={placeholder}
        value={text}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(event) => {
          setText(event.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false);
          } else if (event.key === 'Enter') {
            event.preventDefault();
            choose(chosenOption(listed, active));
          } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            setActive((current) => moveActive(current, listed.length, event.key as TypeaheadKey));
          }
        }}
      />
      <p role="status" aria-live="polite" hidden>
        {open ? announceCount(listed.length, noun) : ''}
      </p>
      <ul id={listId} role="listbox" aria-label={listLabel} className={classes.list} hidden={!open}>
        {listed.length === 0 ? (
          <li role="presentation" className={classes.empty}>
            {emptyText}
          </li>
        ) : (
          listed.map((option, index) => (
            <li
              key={option.id}
              id={optionId(index)}
              className={classes.option}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => {
                event.preventDefault();
                choose(option);
              }}
            >
              <span>
                <Highlight text={option.name} tokens={tokens} />
              </span>
              <span className={classes.count}>{meta(option)}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
