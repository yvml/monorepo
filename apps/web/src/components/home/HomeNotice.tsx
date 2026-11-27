// apps/web/src/components/home/HomeNotice.tsx
import { useApi } from '@/hooks';
import { localize } from '@/i18n';
import type { Banner } from '@/lib/loaders';
import styles from './home.module.css';

/**
 * The notice bar above the home page's first screen: an editor's notice or what is happening now, read in the browser.
 * Nothing is drawn until it arrives, or when there is none.
 *
 * @returns the bar, or nothing.
 */
export function HomeNotice() {
  const banner = useApi<Banner>('/api/notice');
  const text = banner ? localize(banner.text) : '';
  if (!banner || !text) return null;
  const content = (
    <>
      {banner.kind === 'happening' && <b>Happening now</b>}
      {text}
    </>
  );
  return (
    <aside className={styles.notice} aria-label="Notice" data-notice>
      {banner.href ? <a href={banner.href}>{content}</a> : content}
    </aside>
  );
}
