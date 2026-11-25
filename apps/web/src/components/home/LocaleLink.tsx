// apps/web/src/components/home/LocaleLink.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';

/**
 * The link to this page in the other language.
 *
 * @param props - the class the bar gives its links.
 * @returns the link.
 */
export function LocaleLink({ className }: { className?: string }) {
  const { asPath, locale } = useRouter();
  const other = locale === 'es' ? 'en' : 'es';
  return (
    <Link href={asPath} locale={other} lang={other} className={className}>
      {other === 'es' ? 'Español' : 'English'}
    </Link>
  );
}
