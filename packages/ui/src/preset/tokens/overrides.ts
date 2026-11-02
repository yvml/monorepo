/**
 * A design's own values for named tokens, on top of the defaults. A name the system does not declare is an error, so a
 * misspelled one cannot pass silently.
 *
 * @param kind - what the tokens are, for the error message (such as `radii`).
 * @param defaults - the system's tokens, by name.
 * @param own - the design's values, by name.
 * @param wrap - turns a value into a token.
 * @returns the tokens.
 * @throws when `own` names something `defaults` does not.
 */
export function withOverrides<T extends Record<string, unknown>, V>(
  kind: string,
  defaults: T,
  own: Record<string, V> | undefined,
  wrap: (value: V) => unknown = (value) => ({ value })
) {
  const tokens: Record<string, unknown> = { ...defaults };
  for (const [name, value] of Object.entries(own ?? {})) {
    if (!(name in defaults)) {
      throw new Error(
        `Design.${kind} has no name "${name}". The names are: ${Object.keys(defaults).join(', ')}.`
      );
    }
    tokens[name] = wrap(value);
  }
  return tokens as T;
}
