// apps/web/src/components/home/ThemeButton.tsx
import { THEME_KEY } from '@hmidmismi/ui';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import styles from './home.module.css';

/**
 * Switches between light and dark: the icon is the mode it switches to. It sets the `dark` class on `<html>` and keeps
 * the choice, as the design system's own toggle does, but takes its colour from the bar it sits in.
 *
 * @returns the button.
 */
export function ThemeButton() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains('dark')), []);
  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
    } catch {
      /* storage unavailable: the choice lasts for this page view */
    }
    setDark(next);
  };
  return (
    <button
      type="button"
      className={styles.themeButton}
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={20} aria-hidden /> : <Moon size={20} aria-hidden />}
    </button>
  );
}
