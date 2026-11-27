// apps/web/src/components/home/HomeFooter.tsx
import Link from 'next/link';
import { EIN, ORG_NAME, SITE_BUILDER } from '@/constants';
import styles from './home.module.css';

/**
 * The footer from SITEMAP.md: the About column, the other sections, Lazy Eye and Yucca Alta each on their own, then the
 * utility line with social media, the legal details and the site credit.
 *
 * @returns the footer.
 */
export function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.footerWord}>{ORG_NAME}</p>
      <div className={styles.footerCols}>
        <div>
          <h2>About</h2>
          <ul>
            {['History', 'News & Articles', 'In the Press', 'Partners', 'Governance', 'Staff', 'Contact Us'].map((label) => (
              <li key={label}>
                <a href="#">{label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>
            <Link href="/workshops">Workshops</Link>
          </h2>
        </div>
        <div>
          <h2>
            <a href="#">Residencies</a>
          </h2>
        </div>
        <div>
          <h2>
            <Link href="/people">People</Link>
          </h2>
        </div>
        <div>
          <h2>
            <Link href="/lazy-eye">Lazy Eye</Link>
          </h2>
        </div>
        <div>
          <h2>
            <a href="#">Yucca Alta</a>
          </h2>
        </div>
      </div>
      <div className={styles.legal}>
        <a href="#">Instagram</a>
        <span>© {new Date().getFullYear()} {ORG_NAME}</span>
        <a href="#">Accessibility</a>
        <a href="#">Privacy &amp; Cookie policies</a>
        <span>
          {ORG_NAME} is a 501(c)(3) registered in the state of California. EIN {EIN}
        </span>
        <span>Site by {SITE_BUILDER}</span>
      </div>
    </footer>
  );
}
