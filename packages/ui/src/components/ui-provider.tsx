import type { ReactNode } from 'react';
import { useGridOverlay } from '../hooks/use-grid-overlay';
import { type UiText, UiTextProvider } from './ui-text';

/**
 * The one wrapper an app puts at its root. It sets the wording and, in development, the `Shift+G` grid overlay, so an app
 * wires up nothing else.
 *
 * @param props - the wording to change, whether `Shift+G` toggles the grid overlay (development only), and the children.
 * @returns the provider.
 */
export function UiProvider({
  text,
  gridOverlay = false,
  children,
}: {
  text?: Partial<UiText>;
  gridOverlay?: boolean;
  children: ReactNode;
}) {
  useGridOverlay(gridOverlay);
  return <UiTextProvider text={text}>{children}</UiTextProvider>;
}
