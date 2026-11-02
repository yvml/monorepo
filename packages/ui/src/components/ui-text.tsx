import { createContext, type ReactNode, useContext } from 'react';

/**
 * The fixed wording the components show: accessible names, placeholders, empty states and the few visible words
 * (`Saved`, `Clear`). A project overrides any of them in its config; the rest stay as below. `{name}`-style holes are
 * filled by {@link fill}.
 */
export const defaultText = {
  close: 'Close',
  clear: 'Clear',
  search: 'Search',
  saved: 'Saved',
  noMatches: 'No matches',
  addPlaceholder: 'Add…',
  nonePlaceholder: '— none —',
  remove: 'Remove {name}',
  checkmark: 'Checkmark',
  home: 'Home',
  switchToLight: 'Switch to light theme',
  switchToDark: 'Switch to dark theme',
  utilityNav: 'Utility',
  browseNav: 'Browse',
  footerNav: 'Footer',
  breadcrumbNav: 'Breadcrumb',
  jumpNav: 'On this page',
  sectionNav: 'In this section',
  sectionNavLead: 'In this section:',
  queue: 'Queue ({count})',
  permalink: 'Permalink',
  permalinkError: 'Could not create a permalink',
  moveUp: 'Move up',
  moveDown: 'Move down',
  removeFromQueue: 'Remove from queue',
  previous: 'Previous track',
  next: 'Next track',
  play: 'Play',
  pause: 'Pause',
  seek: 'Seek',
  volume: 'Volume',
  playbackFailed: 'Playback failed: {error}',
} as const;

/** The wording a project may set: any of the keys of {@link defaultText}. */
export type UiText = { [Key in keyof typeof defaultText]: string };

const UiTextContext = createContext<UiText>(defaultText);

/**
 * Sets the wording for everything under it. Pass only the entries to change; the rest keep their defaults.
 *
 * @param props - the overrides and the children.
 * @returns the provider.
 */
export function UiTextProvider({
  text,
  children,
}: {
  text?: Partial<UiText>;
  children: ReactNode;
}) {
  return <UiTextContext value={{ ...defaultText, ...text }}>{children}</UiTextContext>;
}

/**
 * The current wording.
 *
 * @returns every text entry.
 */
export const useUiText = (): UiText => useContext(UiTextContext);

/**
 * Fills the `{holes}` of a text entry.
 *
 * @param template - the entry, such as `Remove {name}`.
 * @param values - what goes in each hole.
 * @returns the text.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (hole, key: string) => String(values[key] ?? hole));
}
