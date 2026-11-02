import { Building2, Moon, Sun } from 'lucide-react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useHeaderReveal } from '../hooks/use-header-reveal';
import { useMeasuredHeight } from '../hooks/use-measured-height';
import { breadcrumbSlots, footerSlots, navSlots } from './slots';
import { useScrollEdges } from '../hooks/use-scroll-edges';
import { useUiText } from './ui-text';

/**
 * Renders a link with the class a component gives it. The app passes its router's link, so the package needs no router:
 * `(className, content) => <Link to="/about" className={className}>{content}</Link>`.
 */
export type LinkRender = (className: string, content: ReactNode) => ReactNode;

/** One link of a navigation: what identifies it, what it says, how it links and an optional badge after the label. */
export type NavLink = {
  key: string;
  label: ReactNode;
  link: LinkRender;
  /** Shown after the label, such as a count. */
  badge?: ReactNode;
};

/** The localStorage key that remembers the visitor's chosen theme. */
export const THEME_KEY = 'theme';

/**
 * Inline script that runs in `<head>` before first paint. It adds the `dark` class to `<html>` when the visitor chose
 * dark mode, or has no saved choice and their system prefers dark, so the page never flashes the wrong theme.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

/** How long the theme change fades, in milliseconds: the `normal` duration token plus a margin. */
const SWITCH_MS = 260;

/**
 * The button that switches between light and dark theme. The icon shows the mode the button switches to: the sun in
 * dark mode, the moon in light mode. The choice is saved in localStorage and applied by adding or removing the `dark`
 * class on `<html>`; {@link THEME_INIT_SCRIPT} in the head applies it before first paint. Slot recipe `siteNav`.
 *
 * @returns the theme button.
 */
export function ThemeToggle() {
  const t = useUiText();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggle = () => {
    const next = !dark;
    const root = document.documentElement;
    root.setAttribute('data-theme-switching', '');
    window.setTimeout(() => root.removeAttribute('data-theme-switching'), SWITCH_MS);
    root.classList.toggle('dark', next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      /* storage unavailable: the choice lasts for this page view only */
    }
    setDark(next);
  };

  return (
    <button
      type="button"
      className={navSlots().themeButton}
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? t.switchToLight : t.switchToDark}
    >
      {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
    </button>
  );
}

/**
 * The height of the utility row, the first row of the header grid, in px.
 *
 * @param element - the header.
 * @returns the row height.
 */
const utilityHeight = (element: HTMLElement) =>
  Number.parseFloat(getComputedStyle(element).gridTemplateRows) || 0;

/**
 * How much of the sticky header slides away with the utility row: the row's height less the hairline that stays visible
 * as the bar's top border.
 *
 * @param element - the header.
 * @returns the hidden height in px.
 */
const scrolledAway = (element: HTMLElement) => utilityHeight(element) - 1;

/** The signed-in block of the header: who is signed in, and where the block links. */
export type SiteHeaderAccount = {
  name: string;
  link: LinkRender;
  /** What the block says above the name. Defaults to `Signed in`. */
  status?: string;
};

/** Props for {@link SiteHeader}. */
type SiteHeaderProps = {
  /** The utility links above the bar. */
  utility: NavLink[];
  /** The wordmark's text and how it links home. */
  wordmark: { text: ReactNode; link: LinkRender };
  /** The primary tabs. */
  tabs: NavLink[];
  /** The signed-in block, or nothing when there is none to show. */
  account?: SiteHeaderAccount | null;
  /** Controls at the end of the bar, such as {@link ThemeToggle}. */
  actions?: ReactNode;
};

/**
 * The site header, one grid: the utility links, the wordmark, the primary tabs (each may carry a badge), the signed-in
 * block and the controls. Each is a single element that the recipe places by grid area: the signed-in block sits in the
 * bar from 640px and at the start of the utility row below, and the tabs drop to their own row on phones. The whole
 * header is sticky and hides its utility row as it scrolls, so the bar stays; its bar height is published as `--bh` for
 * the sticky bars under it. Slot recipe `siteNav`.
 *
 * @param props - the links, wordmark, account and controls.
 * @returns the header.
 */
export function SiteHeader({ utility, wordmark, tabs, account, actions }: SiteHeaderProps) {
  const t = useUiText();
  const classes = navSlots({ signedIn: Boolean(account) });
  const root = useRef<HTMLElement>(null);
  useMeasuredHeight(root, '--bh', scrolledAway);
  useHeaderReveal(root, utilityHeight);
  const linkList = useRef<HTMLUListElement>(null);
  const tabRow = useRef<HTMLElement>(null);
  useScrollEdges(linkList);
  useScrollEdges(tabRow);

  return (
    <header ref={root} className={classes.root} data-no-print>
      <nav aria-label={t.utilityNav} className={classes.links}>
        <ul ref={linkList} className={classes.linkList}>
          {utility.map((item) => (
            <li key={item.key}>{item.link(classes.link, item.label)}</li>
          ))}
        </ul>
      </nav>
      {wordmark.link(classes.wordmark, wordmark.text)}
      <nav ref={tabRow} aria-label={t.browseNav} className={classes.tabs}>
        {tabs.map((item) => (
          <ChromeLink key={item.key} render={item.link} className={classes.tab}>
            {item.label}
            {item.badge}
          </ChromeLink>
        ))}
      </nav>
      {account &&
        account.link(
          classes.institution,
          <>
            <Building2 className={classes.institutionIcon} aria-hidden />
            <span>
              <span className={classes.signedIn}>{account.status ?? 'Signed in'}</span>
              <span className={classes.name} title={account.name}>
                {account.name}
              </span>
            </span>
          </>
        )}
      {actions}
    </header>
  );
}

/** A link rendered through the app's {@link LinkRender}, with children as its content. */
function ChromeLink({
  render,
  className,
  children,
}: {
  render: LinkRender;
  className: string;
  children: ReactNode;
}) {
  return <>{render(className, children)}</>;
}

/** Props for {@link SiteFooter}. */
type SiteFooterProps = {
  /** The links in the footer's nav. */
  links: NavLink[];
  /** The copyright line. */
  copyright: ReactNode;
  /** The status link, shown with a green dot. */
  status: { label: ReactNode; link: LinkRender };
  /** The line under the status link. */
  note: ReactNode;
};

/**
 * The site footer: the links over the copyright line at the start, and the status link with its green dot over a note at
 * the end (below the links on phones). Slot recipe `siteFooter`.
 *
 * @param props - the links, copyright, status and note.
 * @returns the footer.
 */
export function SiteFooter({ links, copyright, status, note }: SiteFooterProps) {
  const t = useUiText();
  const classes = footerSlots();

  return (
    <footer className={classes.root} data-no-print>
      <div className={classes.start}>
        <nav aria-label={t.footerNav} className={classes.links}>
          {links.map((item) => (
            <ChromeLink key={item.key} render={item.link} className={classes.link}>
              {item.label}
            </ChromeLink>
          ))}
        </nav>
        <p className={classes.note}>{copyright}</p>
      </div>
      <div className={classes.end}>
        {status.link(
          classes.status,
          <>
            <span className={classes.dot} aria-hidden />
            <span className={classes.statusText}>{status.label}</span>
          </>
        )}
        <p className={classes.note}>{note}</p>
      </div>
    </footer>
  );
}

/** One step of a {@link BreadcrumbTrail}. */
export type BreadcrumbStep = {
  key: string;
  label: ReactNode;
  /** How the step links; a step without one is plain text. */
  link?: LinkRender;
  /** Marks the current page, the last step. */
  current?: boolean;
};

/** Props for {@link BreadcrumbTrail}. */
type BreadcrumbTrailProps = {
  /** How the first step, Home, links. */
  home: LinkRender;
  /** The steps after Home, ending with the current page. */
  steps: BreadcrumbStep[];
};

/**
 * A breadcrumb trail: a home link, then each step separated by a slash, with the current page last as plain text. It is a
 * `nav` landmark labelled `Breadcrumb` holding an ordered list, with `aria-current="page"` on the last item. Slot recipe
 * `breadcrumbs`.
 *
 * @param props - the home link and the steps.
 * @returns the breadcrumb navigation.
 */
export function BreadcrumbTrail({ home, steps }: BreadcrumbTrailProps) {
  const t = useUiText();
  const classes = breadcrumbSlots();
  const trail = useRef<HTMLElement>(null);
  useScrollEdges(trail);

  return (
    <nav ref={trail} aria-label={t.breadcrumbNav} className={classes.root} data-no-print>
      <ol className={classes.list}>
        <li className={classes.item}>{home(classes.link, t.home)}</li>
        {steps.map((step) => (
          <li key={step.key} className={classes.item}>
            {step.current ? (
              <span className={classes.current} aria-current="page">
                {step.label}
              </span>
            ) : step.link ? (
              step.link(classes.link, step.label)
            ) : (
              <span className={classes.plain}>{step.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
