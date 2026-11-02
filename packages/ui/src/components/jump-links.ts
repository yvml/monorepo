/** One jump link: the section's anchor id and its label. */
export type JumpLink = { id: string; label: string };

/** A jump link that can be switched off, for sections that only render when they have content. */
export type JumpLinkSpec = JumpLink & {
  /** Whether the section renders. Defaults to `true`. */
  show?: boolean;
};

/**
 * Builds the list of jump links for the sections that render, in the order given.
 *
 * @param specs - every possible link, each with an optional `show` flag.
 * @returns the links whose section renders.
 */
export function jumpLinks(specs: JumpLinkSpec[]): JumpLink[] {
  return specs.filter((spec) => spec.show ?? true).map(({ id, label }) => ({ id, label }));
}
