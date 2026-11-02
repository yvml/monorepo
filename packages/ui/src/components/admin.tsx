import type { ReactNode } from 'react';
import {
  adminBar,
  fieldStatus,
  pageBar,
  signInForm,
  viewSwitch,
} from '../../styled-system/recipes';

/** Props for {@link FieldStatus}. */
type FieldStatusProps = {
  /** Whether the value can be used. When it cannot, the line is in the error color. */
  available?: boolean;
  /** The message. */
  children: ReactNode;
};

/**
 * A line under a field that says whether its value is usable, such as a slug that already exists. Recipe `fieldStatus`.
 *
 * @param props - whether the value is available, and the message.
 * @returns the line.
 */
export function FieldStatus({ available = true, children }: FieldStatusProps) {
  return <p className={fieldStatus({ available })}>{children}</p>;
}

/** Props for {@link ViewSwitch}. */
type ViewSwitchProps = {
  /** The links, built with {@link viewLinkClass}. */
  children: ReactNode;
};

/**
 * A row of links that switch between views of one list. Recipe `viewSwitch`.
 *
 * @param props - the links.
 * @returns the row.
 */
export function ViewSwitch({ children }: ViewSwitchProps) {
  return <nav className={viewSwitch().root}>{children}</nav>;
}

/**
 * The class for a link inside a {@link ViewSwitch}.
 *
 * @param current - whether the link is for the view being shown.
 * @returns the class name.
 */
export function viewLinkClass(current: boolean) {
  return viewSwitch({ current }).link;
}

/**
 * The class for the sign-in form. Recipe `signInForm`.
 *
 * @param align - `center` (default) or `start`, under the page's heading.
 * @returns the class name.
 */
export function signInFormClass(align?: 'center' | 'start') {
  return signInForm({ align });
}

/**
 * A page title with its actions beside it. Recipe `pageBar`.
 *
 * @param props - the title and the actions.
 * @returns the bar.
 */
export function PageBar({ children }: { children: ReactNode }) {
  return <div className={pageBar()}>{children}</div>;
}

/**
 * The strip across the top of an admin page that holds the account links. Recipe `adminBar`.
 *
 * @param props - the links.
 * @returns the strip.
 */
export function AdminBar({ children }: { children: ReactNode }) {
  return <nav className={adminBar()}>{children}</nav>;
}
