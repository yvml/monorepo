// apps/web/src/components/notice/NoticeBar.tsx
import { inheritLinkClass, Surface, Text } from '@hmidmismi/ui';
import { menuLinks } from '@/components/navigation';
import { localize, t } from '@/i18n';
import { useBanner } from './BannerProvider';

/**
 * The notice above the header: an editor's notice, or what is happening now, as a plain band across the page, in the
 * page's own colors. It comes with the page's data, so it is in the first paint; when there is none, nothing is drawn.
 *
 * @returns the band, or nothing.
 */
export function NoticeBar() {
  const banner = useBanner();
  if (!banner) return null;
  const text = localize(banner.text);
  if (!text) return null;
  const [item] = banner.href ? menuLinks([{ key: 'notice', label: text, href: banner.href }]) : [];
  return (
    <Surface pad="tight">
      <Text tone="inherit">
        {banner.kind === 'happening' && <strong>{t('happeningNow')} </strong>}
        {item ? item.link(inheritLinkClass(), text) : text}
      </Text>
    </Surface>
  );
}
